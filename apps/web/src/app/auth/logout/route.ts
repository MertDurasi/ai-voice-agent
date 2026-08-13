import { openAuthSession } from '@voice-ai/auth';
import { NextResponse, type NextRequest } from 'next/server';

import {
  authSessionCookie,
  loadAuthRuntime,
  loginTransactionCookie,
  requestHasSameOrigin,
} from '../../../lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { client, config } = loadAuthRuntime();
  const secure = config.origin.protocol === 'https:';
  const sessionCookieName = authSessionCookie(secure);
  if (!requestHasSameOrigin(request, config.origin)) return new NextResponse(null, { status: 403 });
  const sealed = request.cookies.get(sessionCookieName)?.value;
  if (sealed !== undefined) {
    try {
      const session = await openAuthSession(sealed, config.sessionSecret.reveal());
      await client.logout(session.refreshToken);
    } catch {
      // Local deletion remains deterministic even when the IdP is unavailable.
    }
  }
  const response = NextResponse.redirect(new URL('/', config.origin), 303);
  response.cookies.delete(sessionCookieName);
  response.cookies.delete(loginTransactionCookie(secure));
  response.headers.set('cache-control', 'no-store');
  return response;
}
