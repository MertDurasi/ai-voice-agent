import {
  type BeforeApplicationShutdown,
  Inject,
  Injectable,
  type LoggerService,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import type { WorkerConfig } from '@voice-ai/config';
import { checkDependencies, type DependencyProbe } from '@voice-ai/runtime';

export const WORKER_CONFIG = Symbol('WORKER_CONFIG');
export const WORKER_LOGGER = Symbol('WORKER_LOGGER');
export const WORKER_PROBES = Symbol('WORKER_PROBES');

export class WorkerNotReadyError extends Error {
  public constructor() {
    super('Worker is not accepting work.');
    this.name = 'WorkerNotReadyError';
  }
}

@Injectable()
export class WorkerRuntimeService
  implements OnApplicationBootstrap, BeforeApplicationShutdown, OnApplicationShutdown
{
  #accepting = false;
  #activeJobs = 0;
  #draining = false;
  #drainResolvers: (() => void)[] = [];
  #readinessTimer: NodeJS.Timeout | undefined;
  #refreshing: Promise<void> | undefined;

  public constructor(
    @Inject(WORKER_CONFIG) private readonly config: Readonly<WorkerConfig>,
    @Inject(WORKER_PROBES) private readonly probes: readonly DependencyProbe[],
    @Inject(WORKER_LOGGER) private readonly logger: LoggerService,
  ) {}

  public get accepting(): boolean {
    return this.#accepting;
  }

  public get activeJobs(): number {
    return this.#activeJobs;
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.refreshReadiness();
    this.#readinessTimer = setInterval(() => {
      void this.refreshReadiness();
    }, this.config.readinessIntervalMs);
  }

  public async refreshReadiness(): Promise<void> {
    if (this.#draining) return;
    if (this.#refreshing !== undefined) return this.#refreshing;
    this.#refreshing = this.#performReadinessCheck().finally(() => {
      this.#refreshing = undefined;
    });
    return this.#refreshing;
  }

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    if (!this.#accepting) throw new WorkerNotReadyError();
    this.#activeJobs += 1;
    try {
      return await work();
    } finally {
      this.#activeJobs -= 1;
      if (this.#activeJobs === 0) {
        for (const resolve of this.#drainResolvers.splice(0)) resolve();
      }
    }
  }

  public async beforeApplicationShutdown(): Promise<void> {
    if (this.#draining) return;
    this.#draining = true;
    this.#accepting = false;
    if (this.#readinessTimer !== undefined) clearInterval(this.#readinessTimer);
    this.#readinessTimer = undefined;
    this.logger.log('worker.draining', WorkerRuntimeService.name);
    if (this.#activeJobs === 0) return;

    let timer: NodeJS.Timeout | undefined;
    await Promise.race([
      new Promise<void>((resolve) => this.#drainResolvers.push(resolve)),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, this.config.shutdownGracePeriodMs);
      }),
    ]);
    if (timer !== undefined) clearTimeout(timer);
    if (this.#activeJobs > 0) this.logger.error('worker.drain_timeout', WorkerRuntimeService.name);
  }

  public onApplicationShutdown(): void {
    this.logger.log('worker.stopped', WorkerRuntimeService.name);
  }

  async #performReadinessCheck(): Promise<void> {
    const checks = await checkDependencies(this.probes);
    const ready = checks.length === 2 && checks.every(({ status }) => status === 'up');
    this.#accepting = !this.#draining && ready;
    this.logger.log(
      this.#accepting ? 'worker.ready' : 'worker.not_ready',
      WorkerRuntimeService.name,
    );
  }
}
