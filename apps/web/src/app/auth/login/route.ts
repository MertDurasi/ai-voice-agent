import { sealLoginTransaction } from '@voice-ai/auth';
import { NextResponse, type NextRequest } from 'next/server';

import {
  callbackUrl,
  cookieOptions,
  isSafeReturnTarget,
  loadAuthRuntime,
  loginTransactionCookie,
  pkceChallenge,
  randomBase64Url,
} from '../../../lib/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { client, config } = loadAuthRuntime();
  const codeVerifier = randomBase64Url(64);
  const nonce = randomBase64Url();
  const state = randomBase64Url();
  const requestedReturnTo = request.nextUrl.searchParams.get('returnTo');
  const returnTo = isSafeReturnTarget(requestedReturnTo) ? requestedReturnTo : '/';
  const transaction = await sealLoginTransaction(
    { codeVerifier, nonce, returnTo, state },
    config.sessionSecret.reveal(),
  );
  const destination = client.authorizationUrl({
    codeChallenge: pkceChallenge(codeVerifier),
    nonce,
    redirectUri: callbackUrl(config.origin),
    state,
  });
  const response = NextResponse.redirect(destination, 303);
  response.headers.set('cache-control', 'no-store');
  response.cookies.set(
    loginTransactionCookie(config.origin.protocol === 'https:'),
    transaction,
    cookieOptions(config.origin.protocol === 'https:', 600),
  );
  return response;
}
