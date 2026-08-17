import { type DynamicModule, Module } from '@nestjs/common';
import type { AccessTokenVerifier } from '@voice-ai/auth';
import type { DependencyProbe } from '@voice-ai/runtime';
import type { MembershipDirectory } from '@voice-ai/tenancy';

import { ApiController } from './http/api.controller.js';
import { IdentityController } from './modules/identity/adapters/inbound/identity.controller.js';
import { TenantContextController } from './modules/tenancy/adapters/inbound/tenant-context.controller.js';
import {
  MEMBERSHIP_DIRECTORY,
  TenantContextGuard,
} from './modules/tenancy/adapters/inbound/tenant-context.guard.js';
import { TenantPermissionGuard } from './modules/tenancy/adapters/inbound/tenant-permission.guard.js';
import { ACCESS_TOKEN_VERIFIER, BearerAuthGuard } from './platform/auth/bearer-auth.guard.js';
import { DEPENDENCY_PROBES, HealthController, HealthService } from './platform/health.js';

@Module({})
export class AppModule {
  public static register(
    probes: readonly DependencyProbe[],
    accessTokenVerifier: AccessTokenVerifier,
    membershipDirectory: MembershipDirectory,
  ): DynamicModule {
    return {
      module: AppModule,
      controllers: [ApiController, HealthController, IdentityController, TenantContextController],
      providers: [
        BearerAuthGuard,
        HealthService,
        TenantContextGuard,
        TenantPermissionGuard,
        {
          provide: MEMBERSHIP_DIRECTORY,
          useValue: membershipDirectory,
        },
        {
          provide: ACCESS_TOKEN_VERIFIER,
          useValue: accessTokenVerifier,
        },
        {
          provide: DEPENDENCY_PROBES,
          useValue: Object.freeze([...probes]),
        },
      ],
    };
  }
}
