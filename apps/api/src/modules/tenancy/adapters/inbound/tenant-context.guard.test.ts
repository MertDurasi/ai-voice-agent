import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InMemoryMembershipDirectory, createMembership, createTenant } from '@voice-ai/tenancy';
import { describe, expect, it } from 'vitest';

import type { TenantRequest } from './tenant-context.decorator.js';
import { TenantContextGuard } from './tenant-context.guard.js';

const tenantA = '0193f8d7-7f03-7f25-a4c0-f043f3d78a80';
const tenantB = '0193f8d7-7f03-7f25-a4c0-f043f3d78a81';

function executionContext(request: TenantRequest): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function tenantRequest(overrides: Partial<TenantRequest> = {}): TenantRequest {
  return {
    headers: {},
    params: { tenantId: tenantA },
    principal: {
      roles: ['tenant_owner'],
      subject: 'synthetic-subject-a',
      tenantContext: null,
    },
    query: {},
    ...overrides,
  };
}

describe('TenantContextGuard', () => {
  const directory = new InMemoryMembershipDirectory(
    [
      createTenant({ id: tenantA, status: 'active', version: 1 }),
      createTenant({ id: tenantB, status: 'active', version: 1 }),
    ],
    [
      createMembership({
        id: '0193f8d7-7f03-7f25-a4c0-f043f3d78a82',
        role: 'viewer',
        status: 'active',
        subject: 'synthetic-subject-a',
        tenantId: tenantA,
        version: 2,
      }),
    ],
  );
  const guard = new TenantContextGuard(directory);

  it('attaches only the authoritative membership context and pseudonymous log correlation', async () => {
    const request = tenantRequest();

    await expect(guard.canActivate(executionContext(request))).resolves.toBe(true);

    expect(request.tenantContext).toMatchObject({
      membershipVersion: 2,
      role: 'viewer',
      tenantId: tenantA,
    });
    expect(request.tenantCorrelation).toMatchObject({
      actorRef: expect.stringMatching(/^act_[A-Za-z0-9_-]{22}$/u),
      tenantRef: expect.stringMatching(/^ten_[A-Za-z0-9_-]{22}$/u),
    });
  });

  it.each([
    ['header', { headers: { 'x-tenant-id': tenantB } }],
    ['query', { query: { tenant_id: tenantB } }],
    ['body', { body: { nested: { tenantContext: { tenantId: tenantB } } } }],
    ['path', { params: { tenantId: tenantB } }],
  ] satisfies readonly [string, Partial<TenantRequest>][])(
    'rejects %s tenant manipulation',
    async (_source, overrides) => {
      await expect(
        guard.canActivate(executionContext(tenantRequest(overrides))),
      ).rejects.toBeInstanceOf(ForbiddenException);
    },
  );
});
