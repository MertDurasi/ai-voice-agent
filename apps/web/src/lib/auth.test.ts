import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  authSessionCookie,
  cookieOptions,
  isSafeReturnTarget,
  pkceChallenge,
  requestHasSameOrigin,
  sessionCookieMaxAge,
} from './auth';

describe('web authentication security policy', () => {
  it('creates RFC 7636 S256 challenges', () => {
    expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });

  it('allows only same-origin path return targets', () => {
    expect(isSafeReturnTarget('/settings')).toBe(true);
    expect(isSafeReturnTarget('//evil.invalid')).toBe(false);
    expect(isSafeReturnTarget('https://evil.invalid')).toBe(false);
    expect(isSafeReturnTarget(null)).toBe(false);
  });

  it('keeps auth cookies HttpOnly, SameSite and production-Secure', () => {
    expect(cookieOptions(true, 600)).toEqual({
      httpOnly: true,
      maxAge: 600,
      path: '/',
      sameSite: 'lax',
      secure: true,
    });
    expect(authSessionCookie(true)).toBe('__Host-voice-ai-session');
    expect(authSessionCookie(false)).toBe('voice-ai-session-local');
  });

  it('bounds the browser cookie by the refresh-token lifetime', () => {
    expect(sessionCookieMaxAge(1_800_000_120, 1_800_000_000)).toBe(120);
    expect(sessionCookieMaxAge(1_900_000_000, 1_800_000_000)).toBe(30 * 24 * 60 * 60);
  });

  it('does not expose identity tokens through browser storage APIs', () => {
    const sources = ['auth.ts', '../app/auth/login/route.ts', '../app/auth/callback/route.ts']
      .map((relative) => readFileSync(new URL(relative, import.meta.url), 'utf8'))
      .join('\n');

    expect(sources).not.toMatch(/localStorage|sessionStorage/u);
  });

  it('rejects missing and cross-origin mutation requests', () => {
    const origin = new URL('https://app.product.invalid');
    expect(requestHasSameOrigin(new Request(origin), origin)).toBe(false);
    expect(
      requestHasSameOrigin(new Request(origin, { headers: { origin: origin.origin } }), origin),
    ).toBe(true);
    expect(
      requestHasSameOrigin(
        new Request(origin, { headers: { origin: 'https://attacker.invalid' } }),
        origin,
      ),
    ).toBe(false);
  });
});
