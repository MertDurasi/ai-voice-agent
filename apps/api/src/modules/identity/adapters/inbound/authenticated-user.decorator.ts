import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AccessPrincipal } from '@voice-ai/auth';

export interface AuthenticatedRequest {
  readonly headers: Readonly<{ authorization?: string }>;
  principal?: AccessPrincipal;
}

export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccessPrincipal | undefined =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().principal,
);
