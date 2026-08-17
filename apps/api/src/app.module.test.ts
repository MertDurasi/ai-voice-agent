import type { INestApplication } from '@nestjs/common';
import type { AccessTokenVerifier } from '@voice-ai/auth';
import { SecretValue, type ApiConfig } from '@voice-ai/config';
import type {
  RuntimeEventLogger,
  RuntimeLogFields,
  RuntimeLogLevel,
} from '@voice-ai/observability';
import type { DependencyCheck, DependencyProbe } from '@voice-ai/runtime';
import {
  InMemoryMembershipDirectory,
  createMembership,
  createTenant,
  tenantRoles,
  type TenantRole,
} from '@voice-ai/tenancy';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createApiApplication } from './bootstrap.js';

interface CapturedEvent {
  readonly fields?: Readonly<RuntimeLogFields>;
  readonly level: RuntimeLogLevel;
  readonly message: string;
}

class CaptureLogger implements RuntimeEventLogger {
  public readonly events: CapturedEvent[] = [];

  public debug(...values: readonly unknown[]): void {
    void values;
  }
  public error(...values: readonly unknown[]): void {
    void values;
  }
  public fatal(...values: readonly unknown[]): void {
    void values;
  }
  public log(...values: readonly unknown[]): void {
    void values;
  }
  public verbose(...values: readonly unknown[]): void {
    void values;
  }
  public warn(...values: readonly unknown[]): void {
    void values;
  }

  public event(level: RuntimeLogLevel, message: string, fields?: Readonly<RuntimeLogFields>): void {
    this.events.push({ ...(fields === undefined ? {} : { fields }), level, message });
  }
}

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
  oidcIssuerUrl: new URL('http://127.0.0.1:8080/realms/synthetic'),
  port: 3001,
  redisUrl: SecretValue.from('redis://:synthetic@127.0.0.1:6379'),
});

const accessTokenVerifier: AccessTokenVerifier = Object.freeze({
  async verify(token: string) {
    const role = token.replace('synthetic-', '') as TenantRole | 'support_admin';
    if (![...tenantRoles, 'support_admin'].includes(role)) throw new Error('invalid token');
    return {
      roles: [role],
      subject: `synthetic-${role}`,
      tenantContext: null,
    };
  },
});

const tenantA = '0193f8d7-7f03-7f25-a4c0-f043f3d78a60';
const tenantB = '0193f8d7-7f03-7f25-a4c0-f043f3d78a61';
const memberships = tenantRoles.map((role, index) =>
  createMembership({
    id: `0193f8d7-7f03-7f25-a4c0-f043f3d78a${70 + index}`,
    role,
    status: 'active',
    subject: `synthetic-${role}`,
    tenantId: tenantA,
    version: index + 1,
  }),
);
const membershipDirectory = new InMemoryMembershipDirectory(
  [
    createTenant({ id: tenantA, status: 'active', version: 1 }),
    createTenant({ id: tenantB, status: 'active', version: 1 }),
  ],
  memberships,
);
const expectedPermissions = {
  agent: ['tenant:read', 'work:read', 'work:write'],
  tenant_admin: ['tenant:read', 'members:read', 'members:manage', 'work:read', 'work:write'],
  tenant_owner: [
    'tenant:read',
    'tenant:manage',
    'members:read',
    'members:manage',
    'work:read',
    'work:write',
  ],
  viewer: ['tenant:read', 'work:read'],
} as const satisfies Readonly<Record<TenantRole, readonly string[]>>;

describe('API baseline', () => {
  let app: INestApplication;
  let baseUrl: string;
  let logger: CaptureLogger;
  let postgres: MutableProbe;
  let redis: MutableProbe;

  beforeEach(async () => {
    postgres = new MutableProbe('postgres', 'up');
    redis = new MutableProbe('redis', 'up');
    logger = new CaptureLogger();
    const application = await createApiApplication(config, {
      enableShutdownHooks: false,
      logger,
      probes: [postgres, redis],
      accessTokenVerifier,
      membershipDirectory,
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
    expect(document.paths).toHaveProperty('/api/v1/tenants/{tenantId}/context');
    expect((await fetch(`${baseUrl}/api/v1/openapi`)).status).toBe(404);
  });

  it('protects identity and never derives a tenant context from authentication', async () => {
    const missing = await fetch(`${baseUrl}/api/v1/identity/me`);
    const invalid = await fetch(`${baseUrl}/api/v1/identity/me`, {
      headers: { authorization: 'Bearer invalid' },
    });
    const valid = await fetch(`${baseUrl}/api/v1/identity/me`, {
      headers: { authorization: 'Bearer synthetic-tenant_owner' },
    });

    expect(missing.status).toBe(401);
    expect(invalid.status).toBe(401);
    expect(valid.status).toBe(200);
    await expect(valid.json()).resolves.toEqual({
      roles: ['tenant_owner'],
      subject: 'synthetic-tenant_owner',
      tenantContext: null,
    });
  });

  it.each(tenantRoles)('resolves the authoritative %s membership role', async (role) => {
    const response = await fetch(`${baseUrl}/api/v1/tenants/${tenantA}/context`, {
      headers: { authorization: `Bearer synthetic-${role}` },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      permissions: expectedPermissions[role],
      role,
      tenantId: tenantA,
    });

    const completed = logger.events.find(
      (event) =>
        event.message === 'http.request.completed' && event.fields?.tenantRef !== undefined,
    );
    expect(completed?.fields).toMatchObject({
      actorRef: expect.stringMatching(/^act_[A-Za-z0-9_-]{22}$/u),
      tenantRef: expect.stringMatching(/^ten_[A-Za-z0-9_-]{22}$/u),
    });
    expect(JSON.stringify(completed)).not.toContain(`synthetic-${role}`);
    expect(JSON.stringify(completed)).not.toContain(tenantA);
  });

  it('returns one uniform 403 for missing membership, support access and tenant manipulation', async () => {
    const missing = await fetch(`${baseUrl}/api/v1/tenants/${tenantB}/context`, {
      headers: { authorization: 'Bearer synthetic-viewer' },
    });
    const support = await fetch(`${baseUrl}/api/v1/tenants/${tenantA}/context`, {
      headers: { authorization: 'Bearer synthetic-support_admin' },
    });
    const header = await fetch(`${baseUrl}/api/v1/tenants/${tenantA}/context`, {
      headers: {
        authorization: 'Bearer synthetic-viewer',
        'x-tenant-id': tenantB,
      },
    });
    const query = await fetch(`${baseUrl}/api/v1/tenants/${tenantA}/context?tenantId=${tenantB}`, {
      headers: { authorization: 'Bearer synthetic-viewer' },
    });

    for (const response of [missing, support, header, query]) {
      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toMatchObject({
        code: 'FORBIDDEN',
        message: 'Request is forbidden.',
        status: 403,
      });
    }
  });
});
