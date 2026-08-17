import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AccessPrincipal } from '@voice-ai/auth';
import type { TenantContext, TenantLogCorrelation } from '@voice-ai/tenancy';

export interface TenantRequest {
  readonly body?: unknown;
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
  readonly params: Readonly<Record<string, string | undefined>>;
  principal?: AccessPrincipal;
  readonly query?: unknown;
  tenantContext?: TenantContext;
  tenantCorrelation?: TenantLogCorrelation;
}

export const CurrentTenant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TenantContext | undefined =>
    context.switchToHttp().getRequest<TenantRequest>().tenantContext,
);
