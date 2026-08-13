import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  containsTenantSelector,
  tenantLogCorrelation,
  TenantContextResolver,
  type MembershipDirectory,
} from '@voice-ai/tenancy';

import type { TenantRequest } from './tenant-context.decorator.js';

export const MEMBERSHIP_DIRECTORY = Symbol('MEMBERSHIP_DIRECTORY');

function hasTenantHeader(headers: TenantRequest['headers']): boolean {
  return Object.keys(headers).some((name) => {
    const normalized = name.replaceAll(/[_-]/gu, '').toLowerCase();
    return normalized === 'xtenantcontext' || normalized === 'xtenantid';
  });
}

@Injectable()
export class TenantContextGuard implements CanActivate {
  readonly #resolver: TenantContextResolver;

  public constructor(@Inject(MEMBERSHIP_DIRECTORY) membershipDirectory: MembershipDirectory) {
    this.#resolver = new TenantContextResolver(membershipDirectory);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const tenantId = request.params.tenantId;
    if (
      request.principal === undefined ||
      request.principal.roles.includes('support_admin') ||
      tenantId === undefined ||
      hasTenantHeader(request.headers) ||
      containsTenantSelector(request.query) ||
      containsTenantSelector(request.body)
    ) {
      throw new ForbiddenException();
    }
    try {
      const tenantContext = await this.#resolver.resolve(request.principal, tenantId);
      request.tenantContext = tenantContext;
      request.tenantCorrelation = tenantLogCorrelation(tenantContext);
      return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
