import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { formatStartupError, loadWorkerConfig } from '@voice-ai/config';

import { WorkerModule } from './worker.module';

async function bootstrap(): Promise<void> {
  loadWorkerConfig(process.env);
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatStartupError(error)}\n`);
  process.exitCode = 1;
});
