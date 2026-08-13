import { createHash, randomBytes } from 'node:crypto';

import { OidcClient } from '@voice-ai/auth';
import { loadWebConfig } from '@voice-ai/config';

export function authSessionCookie(secure: boolean): string {
  return secure ? '__Host-voice-ai-session' : 'voice-ai-session-local';
}

export function loginTransactionCookie(secure: boolean): string {
  return secure ? '__Host-voice-ai-login' : 'voice-ai-login-local';
}

export function loadAuthRuntime() {
  const config = loadWebConfig(process.env);
  return {
    client: new OidcClient({
      clientId: config.oidcClientId,
      clientSecret: config.oidcClientSecret.reveal(),
      issuer: config.oidcIssuerUrl.href.replace(/\/$/u, ''),
    }),
    config,
  };
}

export function callbackUrl(origin: URL): string {
  return new URL('/auth/callback', origin).href;
}

export function randomBase64Url(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function pkceChallenge(verifier: string): string {
  return createHash('sha256').update(verifier, 'ascii').digest('base64url');
}

export function isSafeReturnTarget(value: string | null): value is string {
  return value !== null && value.startsWith('/') && !value.startsWith('//');
}

export function cookieOptions(secure: boolean, maxAge: number) {
  return Object.freeze({
    httpOnly: true as const,
    maxAge,
    path: '/',
    sameSite: 'lax' as const,
    secure,
  });
}

export function sessionCookieMaxAge(
  refreshExpiresAt: number,
  nowSeconds = Math.floor(Date.now() / 1_000),
): number {
  return Math.max(1, Math.min(30 * 24 * 60 * 60, refreshExpiresAt - nowSeconds));
}

export function requestHasSameOrigin(request: Request, origin: URL): boolean {
  const requestOrigin = request.headers.get('origin');
  return requestOrigin !== null && requestOrigin === origin.origin;
}
