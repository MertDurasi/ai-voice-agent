import type { ApiConfig } from '@voice-ai/config';
import { SecretValue } from '@voice-ai/config';
import type { OpenAPIObject } from '@nestjs/swagger';

import { createApiApplication } from './bootstrap';

const documentationConfig: Readonly<ApiConfig> = Object.freeze({
  databaseUrl: SecretValue.from('postgresql://synthetic:synthetic@127.0.0.1:5432/synthetic'),
  dependencyProbeTimeoutMs: 100,
  environment: 'test',
  host: '127.0.0.1',
  logLevel: 'error',
  oidcClientId: 'synthetic-client',
  oidcClientSecret: SecretValue.from('synthetic-client-secret'),
  oidcIssuerUrl: new URL('http://127.0.0.1:8080/realms/synthetic'),
  port: 3001,
  redisUrl: SecretValue.from('redis://:synthetic@127.0.0.1:6379'),
  sessionSecret: SecretValue.from('synthetic-session-secret-value-0000'),
});

export async function generateOpenApiDocument(): Promise<OpenAPIObject> {
  const { app, document } = await createApiApplication(documentationConfig, {
    enableShutdownHooks: false,
    logger: false,
    probes: [],
  });
  await app.init();
  await app.close();
  return document;
}
