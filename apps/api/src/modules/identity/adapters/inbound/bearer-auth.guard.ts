import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AccessTokenVerifier } from '@voice-ai/auth';

import type { AuthenticatedRequest } from './authenticated-user.decorator.js';

export const ACCESS_TOKEN_VERIFIER = Symbol('ACCESS_TOKEN_VERIFIER');

@Injectable()
export class BearerAuthGuard implements CanActivate {
  public constructor(
    @Inject(ACCESS_TOKEN_VERIFIER) private readonly verifier: AccessTokenVerifier,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer ([A-Za-z0-9._~-]+)$/u);
    if (match?.[1] === undefined) throw new UnauthorizedException();

    try {
      request.principal = await this.verifier.verify(match[1]);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
