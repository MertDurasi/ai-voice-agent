import type { LoggerService } from '@nestjs/common';
import { SecretValue, type WorkerConfig } from '@voice-ai/config';
import type { DependencyCheck, DependencyProbe } from '@voice-ai/runtime';
import { describe, expect, it, vi } from 'vitest';

import { WorkerNotReadyError, WorkerRuntimeService } from './worker.runtime';

class MutableProbe implements DependencyProbe {
  public constructor(
    public readonly name: string,
    public status: 'down' | 'up',
  ) {}

  public check(): Promise<DependencyCheck> {
    return Promise.resolve({ latencyMs: 0, name: this.name, status: this.status });
  }
}

const config: Readonly<WorkerConfig> = Object.freeze({
  databaseUrl: SecretValue.from('postgresql://synthetic:synthetic@127.0.0.1:5432/synthetic'),
  dependencyProbeTimeoutMs: 100,
  environment: 'test',
  logLevel: 'debug',
  readinessIntervalMs: 60_000,
  redisUrl: SecretValue.from('redis://:synthetic@127.0.0.1:6379'),
  shutdownGracePeriodMs: 1000,
});

function logger(): LoggerService {
  return {
    debug: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
    verbose: vi.fn(),
    warn: vi.fn(),
  };
}

describe('WorkerRuntimeService', () => {
  it('accepts work only while both dependencies are ready', async () => {
    const postgres = new MutableProbe('postgres', 'up');
    const redis = new MutableProbe('redis', 'down');
    const runtime = new WorkerRuntimeService(config, [postgres, redis], logger());

    await runtime.onApplicationBootstrap();
    expect(runtime.accepting).toBe(false);
    await expect(runtime.execute(async () => 'blocked')).rejects.toBeInstanceOf(
      WorkerNotReadyError,
    );

    redis.status = 'up';
    await runtime.refreshReadiness();
    expect(runtime.accepting).toBe(true);
    await expect(runtime.execute(async () => 'done')).resolves.toBe('done');
    await runtime.beforeApplicationShutdown();
  });

  it('closes admission before draining already accepted work on SIGTERM', async () => {
    const log = logger();
    const runtime = new WorkerRuntimeService(
      config,
      [new MutableProbe('postgres', 'up'), new MutableProbe('redis', 'up')],
      log,
    );
    await runtime.onApplicationBootstrap();

    let complete: (() => void) | undefined;
    const running = runtime.execute(
      async () =>
        new Promise<string>((resolve) => {
          complete = () => resolve('completed');
        }),
    );
    await vi.waitFor(() => expect(runtime.activeJobs).toBe(1));
    const shutdown = runtime.beforeApplicationShutdown();

    expect(runtime.accepting).toBe(false);
    await expect(runtime.execute(async () => 'late')).rejects.toBeInstanceOf(WorkerNotReadyError);
    complete?.();
    await expect(running).resolves.toBe('completed');
    await shutdown;
    expect(log.error).not.toHaveBeenCalled();
  });

  it('cannot reopen admission when an overlapping readiness check finishes during shutdown', async () => {
    let releaseRedis: ((check: DependencyCheck) => void) | undefined;
    const delayedRedis: DependencyProbe = {
      name: 'redis',
      check: vi
        .fn<() => Promise<DependencyCheck>>()
        .mockResolvedValueOnce({ latencyMs: 0, name: 'redis', status: 'up' })
        .mockImplementationOnce(
          async () =>
            new Promise<DependencyCheck>((resolve) => {
              releaseRedis = resolve;
            }),
        ),
    };
    const runtime = new WorkerRuntimeService(
      config,
      [new MutableProbe('postgres', 'up'), delayedRedis],
      logger(),
    );
    await runtime.onApplicationBootstrap();

    const refresh = runtime.refreshReadiness();
    await vi.waitFor(() => expect(releaseRedis).toBeTypeOf('function'));
    await runtime.beforeApplicationShutdown();
    releaseRedis?.({ latencyMs: 1, name: 'redis', status: 'up' });
    await refresh;

    expect(runtime.accepting).toBe(false);
    await expect(runtime.execute(async () => 'late')).rejects.toBeInstanceOf(WorkerNotReadyError);
  });
});
