import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { TenantPermission } from '@voice-ai/tenancy';
import { roleAllows } from '@voice-ai/tenancy';

import type { TenantRequest } from './tenant-context.decorator.js';

const TENANT_PERMISSION = Symbol('TENANT_PERMISSION');

export const RequireTenantPermission = (permission: TenantPermission) =>
  SetMetadata(TENANT_PERMISSION, permission);

@Injectable()
export class TenantPermissionGuard implements CanActivate {
  public constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<TenantPermission>(TENANT_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    const tenantContext = context.switchToHttp().getRequest<TenantRequest>().tenantContext;
    if (
      required === undefined ||
      tenantContext === undefined ||
      !roleAllows(tenantContext.role, required)
    ) {
      throw new ForbiddenException();
    }
    return true;
  }
}
