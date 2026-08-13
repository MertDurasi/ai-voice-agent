import { openAuthSession, sealAuthSession } from '@voice-ai/auth';
import { NextResponse, type NextRequest } from 'next/server';

import {
  authSessionCookie,
  cookieOptions,
  loadAuthRuntime,
  requestHasSameOrigin,
  sessionCookieMaxAge,
} from '../../../lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { client, config } = loadAuthRuntime();
  const secure = config.origin.protocol === 'https:';
  const cookieName = authSessionCookie(secure);
  if (!requestHasSameOrigin(request, config.origin)) return new NextResponse(null, { status: 403 });
  const sealed = request.cookies.get(cookieName)?.value;
  if (sealed === undefined) return new NextResponse(null, { status: 401 });
  try {
    const previous = await openAuthSession(sealed, config.sessionSecret.reveal());
    const refreshed = await client.refresh(previous.refreshToken);
    const response = new NextResponse(null, { status: 204 });
    response.cookies.set(
      cookieName,
      await sealAuthSession(refreshed, config.sessionSecret.reveal()),
      cookieOptions(secure, sessionCookieMaxAge(refreshed.refreshExpiresAt)),
    );
    response.headers.set('cache-control', 'no-store');
    return response;
  } catch {
    const response = new NextResponse(null, { status: 401 });
    response.cookies.delete(cookieName);
    return response;
  }
}
