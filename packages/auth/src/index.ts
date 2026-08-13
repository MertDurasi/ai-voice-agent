import { createHash } from 'node:crypto';

import {
  createLocalJWKSet,
  createRemoteJWKSet,
  customFetch,
  EncryptJWT,
  errors,
  jwtDecrypt,
  jwtVerify,
  type JSONWebKeySet,
  type JWTPayload,
} from 'jose';

export const AUTH_SESSION_AUDIENCE = 'voice-ai-web-session';
const AUTH_SESSION_ISSUER = 'voice-ai-web';
const LOGIN_TRANSACTION_AUDIENCE = 'voice-ai-login-transaction';
const loginTransactionLifetimeSeconds = 600;

export const applicationRoles = Object.freeze([
  'agent',
  'support_admin',
  'tenant_admin',
  'tenant_owner',
  'viewer',
] as const);

export type ApplicationRole = (typeof applicationRoles)[number];

export interface AccessPrincipal {
  readonly roles: readonly ApplicationRole[];
  readonly subject: string;
  readonly tenantContext: null;
}

export interface AccessTokenVerifier {
  verify(token: string): Promise<AccessPrincipal>;
}

export interface AuthSession {
  readonly accessExpiresAt: number;
  readonly accessToken: string;
  readonly refreshExpiresAt: number;
  readonly refreshToken: string;
  readonly roles: readonly ApplicationRole[];
  readonly subject: string;
}

export interface LoginTransaction {
  readonly codeVerifier: string;
  readonly nonce: string;
  readonly returnTo: string;
  readonly state: string;
}

export interface OidcTokens {
  readonly accessExpiresAt: number;
  readonly accessToken: string;
  readonly refreshExpiresAt: number;
  readonly refreshToken: string;
  readonly roles: readonly ApplicationRole[];
  readonly subject: string;
}

export interface OidcClientOptions {
  readonly clock?: () => number;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly fetch?: typeof fetch;
  readonly issuer: string;
}

export class AuthenticationError extends Error {
  public readonly code: string;

  public constructor(code: string, options?: ErrorOptions) {
    super(`Authentication failed (${code}).`, options);
    this.name = 'AuthenticationError';
    this.code = code;
  }
}

interface VerifierOptions {
  readonly audience: string;
  readonly issuer: string;
}

interface LocalVerifierOptions extends VerifierOptions {
  readonly jwks: JSONWebKeySet;
}

const allowedRoles = new Set<string>(applicationRoles);

function principalFrom(payload: JWTPayload): AccessPrincipal {
  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new AuthenticationError('subject_missing');
  }
  const realmAccess = payload.realm_access;
  const candidateRoles =
    typeof realmAccess === 'object' &&
    realmAccess !== null &&
    'roles' in realmAccess &&
    Array.isArray(realmAccess.roles)
      ? realmAccess.roles
      : [];
  const roles = candidateRoles
    .filter((role): role is ApplicationRole => typeof role === 'string' && allowedRoles.has(role))
    .sort();

  return Object.freeze({
    roles: Object.freeze([...new Set(roles)]),
    subject: payload.sub,
    // Tenant authorization starts only after T-002 resolves Membership in the
    // application database. No token or client input is trusted for it.
    tenantContext: null,
  });
}

function verifier(
  keySet: Parameters<typeof jwtVerify>[1],
  options: VerifierOptions,
): AccessTokenVerifier {
  return Object.freeze({
    async verify(token: string): Promise<AccessPrincipal> {
      try {
        const { payload } = await jwtVerify(token, keySet, {
          algorithms: ['RS256'],
          audience: options.audience,
          issuer: options.issuer,
          requiredClaims: ['aud', 'exp', 'iat', 'iss', 'sub'],
        });
        return principalFrom(payload);
      } catch (cause) {
        if (cause instanceof AuthenticationError) throw cause;
        throw new AuthenticationError(
          cause instanceof errors.JOSEError ? 'token_invalid' : 'verification_failed',
          { cause },
        );
      }
    },
  });
}

export function createLocalAccessTokenVerifier(options: LocalVerifierOptions): AccessTokenVerifier {
  return verifier(createLocalJWKSet(options.jwks), options);
}

export function createRemoteAccessTokenVerifier(options: VerifierOptions): AccessTokenVerifier {
  const issuer = new URL(options.issuer);
  const jwksUrl = new URL(
    `${issuer.pathname.replace(/\/$/u, '')}/protocol/openid-connect/certs`,
    issuer,
  );
  return verifier(createRemoteJWKSet(jwksUrl), options);
}

function oidcEndpoint(issuer: URL, name: string): URL {
  return new URL(`${issuer.pathname.replace(/\/$/u, '')}/protocol/openid-connect/${name}`, issuer);
}

function requiredTokenField(payload: unknown, field: string): string {
  if (typeof payload !== 'object' || payload === null || !(field in payload)) {
    throw new AuthenticationError('token_response_invalid');
  }
  const value = (payload as Record<string, unknown>)[field];
  if (typeof value !== 'string' || value.length === 0) {
    throw new AuthenticationError('token_response_invalid');
  }
  return value;
}

function requiredPositiveNumber(payload: unknown, field: string): number {
  if (typeof payload !== 'object' || payload === null || !(field in payload)) {
    throw new AuthenticationError('token_response_invalid');
  }
  const value = (payload as Record<string, unknown>)[field];
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new AuthenticationError('token_response_invalid');
  }
  return value;
}

export class OidcClient {
  readonly #clientId: string;
  readonly #clientSecret: string;
  readonly #clock: () => number;
  readonly #fetch: typeof fetch;
  readonly #issuer: URL;
  readonly #keySet: ReturnType<typeof createRemoteJWKSet>;
  readonly #accessVerifier: AccessTokenVerifier;

  public constructor(options: OidcClientOptions) {
    this.#clientId = options.clientId;
    this.#clientSecret = options.clientSecret;
    this.#clock = options.clock ?? (() => Math.floor(Date.now() / 1_000));
    this.#fetch = options.fetch ?? globalThis.fetch;
    this.#issuer = new URL(options.issuer);
    this.#keySet = createRemoteJWKSet(oidcEndpoint(this.#issuer, 'certs'), {
      [customFetch]: this.#fetch,
    });
    this.#accessVerifier = verifier(this.#keySet, {
      audience: this.#clientId,
      issuer: this.#issuer.href.replace(/\/$/u, ''),
    });
    Object.freeze(this);
  }

  public authorizationUrl(
    input: Readonly<{
      codeChallenge: string;
      nonce: string;
      redirectUri: string;
      state: string;
    }>,
  ): URL {
    const url = oidcEndpoint(this.#issuer, 'auth');
    url.search = new URLSearchParams({
      client_id: this.#clientId,
      code_challenge: input.codeChallenge,
      code_challenge_method: 'S256',
      nonce: input.nonce,
      redirect_uri: input.redirectUri,
      response_type: 'code',
      scope: 'openid',
      state: input.state,
    }).toString();
    return url;
  }

  public async exchangeAuthorizationCode(
    input: Readonly<{
      code: string;
      codeVerifier: string;
      nonce: string;
      redirectUri: string;
    }>,
  ): Promise<OidcTokens> {
    const payload = await this.#tokenRequest(
      new URLSearchParams({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        code: input.code,
        code_verifier: input.codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: input.redirectUri,
      }),
    );
    const idToken = requiredTokenField(payload, 'id_token');
    try {
      await jwtVerify(idToken, this.#keySet, {
        algorithms: ['RS256'],
        audience: this.#clientId,
        issuer: this.#issuer.href.replace(/\/$/u, ''),
        requiredClaims: ['aud', 'exp', 'iat', 'iss', 'nonce', 'sub'],
      }).then(({ payload: idPayload }) => {
        if (idPayload.nonce !== input.nonce) throw new AuthenticationError('nonce_invalid');
      });
    } catch (cause) {
      if (cause instanceof AuthenticationError) throw cause;
      throw new AuthenticationError('id_token_invalid', { cause });
    }
    return this.#verifiedTokens(payload);
  }

  public async refresh(refreshToken: string): Promise<OidcTokens> {
    const payload = await this.#tokenRequest(
      new URLSearchParams({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    );
    return this.#verifiedTokens(payload);
  }

  public async logout(refreshToken: string): Promise<void> {
    const response = await this.#fetch(oidcEndpoint(this.#issuer, 'logout'), {
      body: new URLSearchParams({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        refresh_token: refreshToken,
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      redirect: 'manual',
    });
    if (!response.ok && response.status !== 204) {
      throw new AuthenticationError('logout_failed');
    }
  }

  async #tokenRequest(body: URLSearchParams): Promise<unknown> {
    let response: Response;
    try {
      response = await this.#fetch(oidcEndpoint(this.#issuer, 'token'), {
        body,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        redirect: 'manual',
      });
    } catch (cause) {
      throw new AuthenticationError('identity_unavailable', { cause });
    }
    if (!response.ok) throw new AuthenticationError('token_exchange_failed');
    try {
      return await response.json();
    } catch (cause) {
      throw new AuthenticationError('token_response_invalid', { cause });
    }
  }

  async #verifiedTokens(payload: unknown): Promise<OidcTokens> {
    const accessToken = requiredTokenField(payload, 'access_token');
    const refreshToken = requiredTokenField(payload, 'refresh_token');
    const principal = await this.#accessVerifier.verify(accessToken);
    const decoded = await jwtVerify(accessToken, this.#keySet, {
      algorithms: ['RS256'],
      audience: this.#clientId,
      issuer: this.#issuer.href.replace(/\/$/u, ''),
      requiredClaims: ['aud', 'exp', 'iat', 'iss', 'sub'],
    });
    if (typeof decoded.payload.exp !== 'number') {
      throw new AuthenticationError('token_expiry_missing');
    }
    return Object.freeze({
      accessExpiresAt: decoded.payload.exp,
      accessToken,
      refreshExpiresAt: this.#clock() + requiredPositiveNumber(payload, 'refresh_expires_in'),
      refreshToken,
      roles: principal.roles,
      subject: principal.subject,
    });
  }
}

function encryptionKey(secret: string): Uint8Array {
  if (secret.length < 32) throw new AuthenticationError('session_key_too_short');
  return createHash('sha256').update(secret, 'utf8').digest();
}

async function seal(
  payload: Readonly<Record<string, unknown>>,
  audience: string,
  secret: string,
  nowSeconds: number,
  lifetimeSeconds: number,
): Promise<string> {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'JWT' })
    .setAudience(audience)
    .setIssuer(AUTH_SESSION_ISSUER)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(nowSeconds + lifetimeSeconds)
    .encrypt(encryptionKey(secret));
}

async function open(
  token: string,
  audience: string,
  secret: string,
  nowSeconds: number,
): Promise<JWTPayload> {
  try {
    const { payload } = await jwtDecrypt(token, encryptionKey(secret), {
      audience,
      clockTolerance: 0,
      currentDate: new Date(nowSeconds * 1_000),
      issuer: AUTH_SESSION_ISSUER,
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256GCM'],
    });
    return payload;
  } catch (cause) {
    throw new AuthenticationError('session_invalid', { cause });
  }
}

function requiredString(payload: JWTPayload, name: string): string {
  const value = payload[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new AuthenticationError('session_payload_invalid');
  }
  return value;
}

export async function sealAuthSession(
  session: AuthSession,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<string> {
  const lifetimeSeconds = Math.min(30 * 24 * 60 * 60, session.refreshExpiresAt - nowSeconds);
  if (!Number.isSafeInteger(session.refreshExpiresAt) || lifetimeSeconds <= 0) {
    throw new AuthenticationError('session_expired');
  }
  return seal(
    {
      accessExpiresAt: session.accessExpiresAt,
      accessToken: session.accessToken,
      refreshExpiresAt: session.refreshExpiresAt,
      refreshToken: session.refreshToken,
      roles: session.roles,
      subject: session.subject,
    },
    AUTH_SESSION_AUDIENCE,
    secret,
    nowSeconds,
    lifetimeSeconds,
  );
}

export async function openAuthSession(
  token: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<AuthSession> {
  const payload = await open(token, AUTH_SESSION_AUDIENCE, secret, nowSeconds);
  const accessExpiresAt = payload.accessExpiresAt;
  const refreshExpiresAt = payload.refreshExpiresAt;
  const roles = payload.roles;
  if (
    typeof accessExpiresAt !== 'number' ||
    !Number.isSafeInteger(accessExpiresAt) ||
    typeof refreshExpiresAt !== 'number' ||
    !Number.isSafeInteger(refreshExpiresAt) ||
    !Array.isArray(roles) ||
    roles.some((role) => typeof role !== 'string' || !allowedRoles.has(role))
  ) {
    throw new AuthenticationError('session_payload_invalid');
  }
  return Object.freeze({
    accessExpiresAt,
    accessToken: requiredString(payload, 'accessToken'),
    refreshExpiresAt,
    refreshToken: requiredString(payload, 'refreshToken'),
    roles: Object.freeze([...new Set(roles as ApplicationRole[])].sort()),
    subject: requiredString(payload, 'subject'),
  });
}

export async function sealLoginTransaction(
  transaction: LoginTransaction,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<string> {
  return seal(
    { ...transaction },
    LOGIN_TRANSACTION_AUDIENCE,
    secret,
    nowSeconds,
    loginTransactionLifetimeSeconds,
  );
}

export async function openLoginTransaction(
  token: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<LoginTransaction> {
  const payload = await open(token, LOGIN_TRANSACTION_AUDIENCE, secret, nowSeconds);
  const returnTo = requiredString(payload, 'returnTo');
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
    throw new AuthenticationError('return_target_invalid');
  }
  return Object.freeze({
    codeVerifier: requiredString(payload, 'codeVerifier'),
    nonce: requiredString(payload, 'nonce'),
    returnTo,
    state: requiredString(payload, 'state'),
  });
}
