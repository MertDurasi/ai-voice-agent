import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { formatStartupError, loadWorkerConfig } from '@voice-ai/config';
import { JsonLogger } from '@voice-ai/observability';
import { TcpDependencyProbe, tcpEndpointFromUrl } from '@voice-ai/runtime';

import { WorkerModule } from './worker.module';

async function bootstrap(): Promise<void> {
  const config = loadWorkerConfig(process.env);
  const logger = new JsonLogger({
    environment: config.environment,
    minimumLevel: config.logLevel,
    service: 'voice-ai-worker',
  });
  const probes = [
    new TcpDependencyProbe(
      'postgres',
      tcpEndpointFromUrl(config.databaseUrl.reveal(), 5432),
      config.dependencyProbeTimeoutMs,
    ),
    new TcpDependencyProbe(
      'redis',
      tcpEndpointFromUrl(config.redisUrl.reveal(), 6379),
      config.dependencyProbeTimeoutMs,
    ),
  ];
  const app = await NestFactory.createApplicationContext(
    WorkerModule.register({ config, logger, probes }),
    { abortOnError: false, logger },
  );
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatStartupError(error)}\n`);
  process.exitCode = 1;
});
