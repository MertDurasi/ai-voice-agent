import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';

import {
  AUTH_SESSION_AUDIENCE,
  AuthenticationError,
  OidcClient,
  createLocalAccessTokenVerifier,
  openAuthSession,
  openLoginTransaction,
  sealAuthSession,
  sealLoginTransaction,
  type AuthSession,
} from './index.js';

const issuer = 'https://identity.invalid/realms/synthetic';
const audience = 'voice-ai-api-local';

async function fixture() {
  const signing = await generateKeyPair('RS256');
  const unrelated = await generateKeyPair('RS256');
  const publicJwk = await exportJWK(signing.publicKey);
  publicJwk.alg = 'RS256';
  publicJwk.kid = 'synthetic-signing-key';
  publicJwk.use = 'sig';
  const verifier = createLocalAccessTokenVerifier({
    audience,
    issuer,
    jwks: { keys: [publicJwk] },
  });
  const sign = async (
    overrides: Readonly<Record<string, unknown>> = {},
    key = signing.privateKey,
  ) =>
    new SignJWT({
      realm_access: {
        roles: ['tenant_owner', 'viewer', 'ignored-realm-role'],
      },
      tenant_id: 'client-controlled-tenant-must-be-ignored',
      ...overrides,
    })
      .setProtectedHeader({ alg: 'RS256', kid: 'synthetic-signing-key', typ: 'JWT' })
      .setSubject('synthetic-user')
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key);
  return { sign, unrelated, verifier };
}

describe('OIDC access-token trust boundary', () => {
  it('returns only the stable subject and allowlisted application roles', async () => {
    const { sign, verifier } = await fixture();
    const token = await sign();

    await expect(verifier.verify(token)).resolves.toEqual({
      roles: ['tenant_owner', 'viewer'],
      subject: 'synthetic-user',
      tenantContext: null,
    });
  });

  it('accepts a valid token while ignoring every tenant-like client claim', async () => {
    const signing = await generateKeyPair('RS256');
    const publicJwk = await exportJWK(signing.publicKey);
    publicJwk.alg = 'RS256';
    publicJwk.kid = 'positive';
    publicJwk.use = 'sig';
    const verifier = createLocalAccessTokenVerifier({
      audience,
      issuer,
      jwks: { keys: [publicJwk] },
    });
    const token = await new SignJWT({
      realm_access: { roles: ['tenant_admin', 'agent', 'unknown-role'] },
      tenant: 'attacker-selected',
      tenant_id: 'attacker-selected',
    })
      .setProtectedHeader({ alg: 'RS256', kid: 'positive' })
      .setSubject('synthetic-user')
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(signing.privateKey);

    await expect(verifier.verify(token)).resolves.toEqual({
      roles: ['agent', 'tenant_admin'],
      subject: 'synthetic-user',
      tenantContext: null,
    });
  });

  it.each(['expired', 'issuer', 'audience', 'signature', 'tampered'] as const)(
    'rejects a token with invalid %s',
    async (failure) => {
      const signing = await generateKeyPair('RS256');
      const unrelated = await generateKeyPair('RS256');
      const publicJwk = await exportJWK(signing.publicKey);
      publicJwk.alg = 'RS256';
      publicJwk.kid = 'validation';
      publicJwk.use = 'sig';
      const verifier = createLocalAccessTokenVerifier({
        audience,
        issuer,
        jwks: { keys: [publicJwk] },
      });
      const token = await new SignJWT({ realm_access: { roles: ['viewer'] } })
        .setProtectedHeader({ alg: 'RS256', kid: 'validation' })
        .setSubject('synthetic-user')
        .setIssuer(failure === 'issuer' ? `${issuer}-wrong` : issuer)
        .setAudience(failure === 'audience' ? `${audience}-wrong` : audience)
        .setIssuedAt()
        .setExpirationTime(failure === 'expired' ? '0s' : '5m')
        .sign(failure === 'signature' ? unrelated.privateKey : signing.privateKey);
      const candidate =
        failure === 'tampered'
          ? `${token.slice(0, Math.max(0, token.length - 2))}${token.endsWith('aa') ? 'bb' : 'aa'}`
          : token;

      await expect(verifier.verify(candidate)).rejects.toBeInstanceOf(AuthenticationError);
    },
  );
});

describe('OIDC protocol client', () => {
  it('binds code exchange to PKCE and nonce, then supports refresh and logout', async () => {
    const now = 1_800_000_000;
    const signing = await generateKeyPair('RS256');
    const publicJwk = await exportJWK(signing.publicKey);
    publicJwk.alg = 'RS256';
    publicJwk.kid = 'protocol-key';
    publicJwk.use = 'sig';
    const token = async (type: 'access' | 'id', nonce?: string) => {
      const jwt = new SignJWT(
        type === 'access' ? { realm_access: { roles: ['agent'] } } : { nonce },
      )
        .setProtectedHeader({ alg: 'RS256', kid: 'protocol-key' })
        .setSubject('synthetic-user')
        .setIssuer(issuer)
        .setAudience(audience)
        .setIssuedAt(now)
        .setExpirationTime(now + 300);
      return jwt.sign(signing.privateKey);
    };
    const requests: URLSearchParams[] = [];
    const syntheticFetch: typeof fetch = async (input, init) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      if (url.pathname.endsWith('/certs')) {
        return Response.json({ keys: [publicJwk] });
      }
      const body = new URLSearchParams(String(init?.body ?? ''));
      requests.push(body);
      if (url.pathname.endsWith('/logout')) return new Response(null, { status: 204 });
      return Response.json({
        access_token: await token('access'),
        id_token: await token('id', 'synthetic-nonce'),
        refresh_expires_in: 1_800,
        refresh_token: `synthetic-refresh-${requests.length}`,
      });
    };
    const client = new OidcClient({
      clientId: audience,
      clientSecret: 'synthetic-client-secret',
      clock: () => now,
      fetch: syntheticFetch,
      issuer,
    });

    const authorization = client.authorizationUrl({
      codeChallenge: 'synthetic-challenge',
      nonce: 'synthetic-nonce',
      redirectUri: 'https://app.invalid/auth/callback',
      state: 'synthetic-state',
    });
    expect(authorization.searchParams.get('code_challenge_method')).toBe('S256');
    expect(authorization.searchParams.get('nonce')).toBe('synthetic-nonce');

    const exchanged = await client.exchangeAuthorizationCode({
      code: 'synthetic-code',
      codeVerifier: 'synthetic-verifier',
      nonce: 'synthetic-nonce',
      redirectUri: 'https://app.invalid/auth/callback',
    });
    expect(exchanged).toMatchObject({
      refreshExpiresAt: now + 1_800,
      roles: ['agent'],
      subject: 'synthetic-user',
    });
    expect(requests[0]?.get('code_verifier')).toBe('synthetic-verifier');

    const refreshed = await client.refresh(exchanged.refreshToken);
    expect(refreshed.refreshToken).toBe('synthetic-refresh-2');
    expect(requests[1]?.get('grant_type')).toBe('refresh_token');
    await expect(client.logout(refreshed.refreshToken)).resolves.toBeUndefined();
    expect(requests[2]?.get('refresh_token')).toBe(refreshed.refreshToken);
  });

  it('rejects an ID token whose nonce does not match the browser transaction', async () => {
    const now = 1_800_000_000;
    const signing = await generateKeyPair('RS256');
    const publicJwk = await exportJWK(signing.publicKey);
    publicJwk.alg = 'RS256';
    publicJwk.kid = 'nonce-key';
    publicJwk.use = 'sig';
    const accessToken = await new SignJWT({ realm_access: { roles: ['viewer'] } })
      .setProtectedHeader({ alg: 'RS256', kid: 'nonce-key' })
      .setSubject('synthetic-user')
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt(now)
      .setExpirationTime(now + 300)
      .sign(signing.privateKey);
    const idToken = await new SignJWT({ nonce: 'wrong-nonce' })
      .setProtectedHeader({ alg: 'RS256', kid: 'nonce-key' })
      .setSubject('synthetic-user')
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt(now)
      .setExpirationTime(now + 300)
      .sign(signing.privateKey);
    const client = new OidcClient({
      clientId: audience,
      clientSecret: 'synthetic-client-secret',
      clock: () => now,
      fetch: async (input) =>
        new URL(input instanceof Request ? input.url : input.toString()).pathname.endsWith('/certs')
          ? Response.json({ keys: [publicJwk] })
          : Response.json({
              access_token: accessToken,
              id_token: idToken,
              refresh_expires_in: 1_800,
              refresh_token: 'synthetic-refresh-token',
            }),
      issuer,
    });

    await expect(
      client.exchangeAuthorizationCode({
        code: 'synthetic-code',
        codeVerifier: 'synthetic-verifier',
        nonce: 'expected-nonce',
        redirectUri: 'https://app.invalid/auth/callback',
      }),
    ).rejects.toMatchObject({ code: 'nonce_invalid' });
  });
});

describe('encrypted web session', () => {
  const secret = 'synthetic-session-key-material-at-least-32-bytes';
  const session: AuthSession = {
    accessExpiresAt: 1_900_000_000,
    accessToken: 'synthetic-access-token',
    refreshExpiresAt: 1_802_592_000,
    refreshToken: 'synthetic-refresh-token',
    roles: ['tenant_owner'],
    subject: 'synthetic-user',
  };

  it('round-trips session and login state without exposing plaintext', async () => {
    const sealedSession = await sealAuthSession(session, secret, 1_800_000_000);
    const transaction = {
      codeVerifier: 'a'.repeat(64),
      nonce: 'synthetic-nonce',
      returnTo: '/',
      state: 'synthetic-state',
    };
    const sealedTransaction = await sealLoginTransaction(transaction, secret, 1_800_000_000);

    expect(sealedSession).not.toContain(session.accessToken);
    expect(sealedSession).not.toContain(session.refreshToken);
    expect(sealedTransaction).not.toContain(transaction.codeVerifier);
    await expect(openAuthSession(sealedSession, secret, 1_800_000_000)).resolves.toEqual(session);
    await expect(openLoginTransaction(sealedTransaction, secret, 1_800_000_000)).resolves.toEqual(
      transaction,
    );
  });

  it('rejects tampering, wrong keys and expired login state', async () => {
    const sealed = await sealLoginTransaction(
      { codeVerifier: 'b'.repeat(64), nonce: 'nonce', returnTo: '/', state: 'state' },
      secret,
      1_800_000_000,
    );

    const [header = '', encryptedKey = '', iv = '', ciphertext = '', tag = ''] = sealed.split('.');
    const replacement = ciphertext.startsWith('A') ? 'B' : 'A';
    const tampered = [header, encryptedKey, iv, `${replacement}${ciphertext.slice(1)}`, tag].join(
      '.',
    );
    await expect(openLoginTransaction(tampered, secret, 1_800_000_000)).rejects.toBeInstanceOf(
      AuthenticationError,
    );
    await expect(
      openLoginTransaction(sealed, `${secret}-different`, 1_800_000_000),
    ).rejects.toBeInstanceOf(AuthenticationError);
    await expect(openLoginTransaction(sealed, secret, 1_800_000_601)).rejects.toBeInstanceOf(
      AuthenticationError,
    );
    expect(AUTH_SESSION_AUDIENCE).toBe('voice-ai-web-session');
  });

  it('never keeps a web session beyond the identity refresh lifetime', async () => {
    const sealed = await sealAuthSession(
      { ...session, refreshExpiresAt: 1_800_000_120 },
      secret,
      1_800_000_000,
    );

    await expect(openAuthSession(sealed, secret, 1_800_000_119)).resolves.toMatchObject({
      subject: session.subject,
    });
    await expect(openAuthSession(sealed, secret, 1_800_000_121)).rejects.toBeInstanceOf(
      AuthenticationError,
    );
    await expect(
      sealAuthSession({ ...session, refreshExpiresAt: 1_799_999_999 }, secret, 1_800_000_000),
    ).rejects.toMatchObject({ code: 'session_expired' });
  });
});
