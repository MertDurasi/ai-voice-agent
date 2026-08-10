import { type DynamicModule, Module } from '@nestjs/common';
import type { DependencyProbe } from '@voice-ai/runtime';

import { ApiController } from './http/api.controller';
import { DEPENDENCY_PROBES, HealthController, HealthService } from './platform/health';

@Module({})
export class AppModule {
  public static register(probes: readonly DependencyProbe[]): DynamicModule {
    return {
      module: AppModule,
      controllers: [ApiController, HealthController],
      providers: [
        HealthService,
        {
          provide: DEPENDENCY_PROBES,
          useValue: Object.freeze([...probes]),
        },
      ],
    };
  }
}
