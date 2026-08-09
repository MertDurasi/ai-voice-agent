import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { formatStartupError, loadApiConfig } from '@voice-ai/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const config = loadApiConfig(process.env);
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port, config.host);
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatStartupError(error)}\n`);
  process.exitCode = 1;
});
