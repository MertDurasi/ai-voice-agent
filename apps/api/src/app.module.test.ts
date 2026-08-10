import type { INestApplication } from '@nestjs/common';
import { SecretValue, type ApiConfig } from '@voice-ai/config';
import type { DependencyCheck, DependencyProbe } from '@voice-ai/runtime';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createApiApplication } from './bootstrap';

class MutableProbe implements DependencyProbe {
  public constructor(
    public readonly name: string,
    public status: 'down' | 'up',
  ) {}

  public check(): Promise<DependencyCheck> {
    return Promise.resolve({ latencyMs: 1, name: this.name, status: this.status });
  }
}

const config: Readonly<ApiConfig> = Object.freeze({
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

describe('API baseline', () => {
  let app: INestApplication;
  let baseUrl: string;
  let postgres: MutableProbe;
  let redis: MutableProbe;

  beforeEach(async () => {
    postgres = new MutableProbe('postgres', 'up');
    redis = new MutableProbe('redis', 'up');
    const application = await createApiApplication(config, {
      enableShutdownHooks: false,
      logger: false,
      probes: [postgres, redis],
    });
    app = application.app;
    await app.listen(0, '127.0.0.1');
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves the versioned root plus independent liveness and readiness', async () => {
    const requestId = '0193f8d7-7f03-7f25-a4c0-f043f3d78a50';
    const root = await fetch(`${baseUrl}/api/v1`, { headers: { 'x-request-id': requestId } });
    const live = await fetch(`${baseUrl}/health/live`);
    const ready = await fetch(`${baseUrl}/health/ready`);

    expect(root.status).toBe(200);
    expect(root.headers.get('x-request-id')).toBe(requestId);
    await expect(root.json()).resolves.toEqual({
      service: 'voice-ai-api',
      status: 'ok',
      version: 'v1',
    });
    expect(live.status).toBe(200);
    expect(await live.json()).toMatchObject({ service: 'voice-ai-api', status: 'ok' });
    expect(ready.status).toBe(200);
    expect(await ready.json()).toMatchObject({
      dependencies: { postgres: { status: 'up' }, redis: { status: 'up' } },
      status: 'ready',
    });
  });

  it('keeps liveness up while a dependency makes readiness fail closed', async () => {
    redis.status = 'down';

    const ready = await fetch(`${baseUrl}/health/ready`);
    const live = await fetch(`${baseUrl}/health/live`);

    expect(ready.status).toBe(503);
    expect(await ready.json()).toMatchObject({
      dependencies: { postgres: { status: 'up' }, redis: { status: 'down' } },
      status: 'not_ready',
    });
    expect(live.status).toBe(200);
  });

  it('uses safe request IDs and a stack-free stable client error contract', async () => {
    const response = await fetch(`${baseUrl}/api/v1/does-not-exist`, {
      headers: { 'x-request-id': 'invalid/request/id' },
    });
    const body = (await response.json()) as Record<string, unknown>;
    const responseRequestId = response.headers.get('x-request-id');

    expect(response.status).toBe(404);
    expect(responseRequestId).toMatch(/^[0-9a-f-]{36}$/u);
    expect(body).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found.',
      requestId: responseRequestId,
      status: 404,
    });
    expect(JSON.stringify(body)).not.toContain('stack');
    expect(JSON.stringify(body)).not.toContain('does-not-exist');
  });

  it('serves the machine-readable OpenAPI contract without a UI route', async () => {
    const response = await fetch(`${baseUrl}/api/v1/openapi.json`);
    const document = (await response.json()) as { readonly paths?: Record<string, unknown> };

    expect(response.status).toBe(200);
    expect(document.paths).toHaveProperty('/api/v1');
    expect(document.paths).toHaveProperty('/health/live');
    expect(document.paths).toHaveProperty('/health/ready');
    expect((await fetch(`${baseUrl}/api/v1/openapi`)).status).toBe(404);
  });
});
