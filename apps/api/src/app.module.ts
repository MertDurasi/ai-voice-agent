import { type DynamicModule, Module } from '@nestjs/common';
import type { AccessTokenVerifier } from '@voice-ai/auth';
import type { DependencyProbe } from '@voice-ai/runtime';

import { ApiController } from './http/api.controller.js';
import {
  ACCESS_TOKEN_VERIFIER,
  BearerAuthGuard,
} from './modules/identity/adapters/inbound/bearer-auth.guard.js';
import { IdentityController } from './modules/identity/adapters/inbound/identity.controller.js';
import { DEPENDENCY_PROBES, HealthController, HealthService } from './platform/health.js';

@Module({})
export class AppModule {
  public static register(
    probes: readonly DependencyProbe[],
    accessTokenVerifier: AccessTokenVerifier,
  ): DynamicModule {
    return {
      module: AppModule,
      controllers: [ApiController, HealthController, IdentityController],
      providers: [
        BearerAuthGuard,
        HealthService,
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
