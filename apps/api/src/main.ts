import 'reflect-metadata';

import { formatStartupError, loadApiConfig } from '@voice-ai/config';

import { createApiApplication } from './bootstrap.js';

async function bootstrap(): Promise<void> {
  const config = loadApiConfig(process.env);
  const { app } = await createApiApplication(config);
  await app.listen(config.port, config.host);
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatStartupError(error)}\n`);
  process.exitCode = 1;
});
