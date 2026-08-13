import { openLoginTransaction, sealAuthSession } from '@voice-ai/auth';
import { NextResponse, type NextRequest } from 'next/server';

import {
  authSessionCookie,
  callbackUrl,
  cookieOptions,
  loadAuthRuntime,
  loginTransactionCookie,
  sessionCookieMaxAge,
} from '../../../lib/auth';

function failed(request: NextRequest, secure: boolean): NextResponse {
  const response = NextResponse.redirect(new URL('/?auth=failed', request.nextUrl), 303);
  response.cookies.delete(loginTransactionCookie(secure));
  response.headers.set('cache-control', 'no-store');
  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { client, config } = loadAuthRuntime();
  const secure = config.origin.protocol === 'https:';
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const sealedTransaction = request.cookies.get(loginTransactionCookie(secure))?.value;
  if (code === null || state === null || sealedTransaction === undefined) {
    return failed(request, secure);
  }

  try {
    const transaction = await openLoginTransaction(
      sealedTransaction,
      config.sessionSecret.reveal(),
    );
    if (transaction.state !== state) return failed(request, secure);
    const tokens = await client.exchangeAuthorizationCode({
      code,
      codeVerifier: transaction.codeVerifier,
      nonce: transaction.nonce,
      redirectUri: callbackUrl(config.origin),
    });
    const session = await sealAuthSession(tokens, config.sessionSecret.reveal());
    const response = NextResponse.redirect(new URL(transaction.returnTo, config.origin), 303);
    response.cookies.delete(loginTransactionCookie(secure));
    response.cookies.set(
      authSessionCookie(secure),
      session,
      cookieOptions(secure, sessionCookieMaxAge(tokens.refreshExpiresAt)),
    );
    response.headers.set('cache-control', 'no-store');
    return response;
  } catch {
    return failed(request, secure);
  }
}
