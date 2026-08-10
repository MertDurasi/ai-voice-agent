import { type DynamicModule, Module, type LoggerService } from '@nestjs/common';
import type { WorkerConfig } from '@voice-ai/config';
import type { DependencyProbe } from '@voice-ai/runtime';

import {
  WORKER_CONFIG,
  WORKER_LOGGER,
  WORKER_PROBES,
  WorkerRuntimeService,
} from './worker.runtime';

export interface WorkerModuleOptions {
  readonly config: Readonly<WorkerConfig>;
  readonly logger: LoggerService;
  readonly probes: readonly DependencyProbe[];
}

@Module({})
export class WorkerModule {
  public static register(options: WorkerModuleOptions): DynamicModule {
    return {
      module: WorkerModule,
      providers: [
        WorkerRuntimeService,
        { provide: WORKER_CONFIG, useValue: options.config },
        { provide: WORKER_LOGGER, useValue: options.logger },
        { provide: WORKER_PROBES, useValue: Object.freeze([...options.probes]) },
      ],
      exports: [WorkerRuntimeService],
    };
  }
}
