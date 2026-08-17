import { describe, expect, it } from 'vitest';

import {
  InMemoryMembershipDirectory,
  TenantAccessDeniedError,
  TenantContextResolver,
  TenantJobConsumer,
  createMembership,
  createTenant,
  createTenantJobEnvelope,
  roleAllows,
  tenantLogCorrelation,
  tenantPermissions,
  tenantRoles,
  type TenantContext,
} from './index.js';

const tenantA = '0193f8d7-7f03-7f25-a4c0-f043f3d78a50';
const tenantB = '0193f8d7-7f03-7f25-a4c0-f043f3d78a51';
const membershipId = '0193f8d7-7f03-7f25-a4c0-f043f3d78a52';
const jobId = '0193f8d7-7f03-7f25-a4c0-f043f3d78a53';

function membership(role: (typeof tenantRoles)[number] = 'viewer') {
  return createMembership({
    id: membershipId,
    role,
    status: 'active',
    subject: 'synthetic-subject-a',
    tenantId: tenantA,
    version: 4,
  });
}

describe('tenant membership authority', () => {
  it('models tenants and resolves a deeply immutable context only from active membership', async () => {
    const tenant = createTenant({ id: tenantA, status: 'active', version: 1 });
    const directory = new InMemoryMembershipDirectory([tenant], [membership('viewer')]);
    const resolver = new TenantContextResolver(directory);
    const principalWithUntrustedRoleClaim = {
      roles: ['tenant_owner'],
      subject: 'synthetic-subject-a',
      tenantContext: null,
    };

    const context = await resolver.resolve(principalWithUntrustedRoleClaim, tenantA);

    expect(context).toEqual({
      actorSubject: 'synthetic-subject-a',
      membershipId,
      membershipVersion: 4,
      role: 'viewer',
      tenantId: tenantA,
    });
    expect(Object.isFrozen(context)).toBe(true);
    expect(context.role).not.toBe('tenant_owner');
    const correlation = tenantLogCorrelation(context);
    expect(correlation.actorRef).toMatch(/^act_[A-Za-z0-9_-]{22}$/u);
    expect(correlation.tenantRef).toMatch(/^ten_[A-Za-z0-9_-]{22}$/u);
    expect(JSON.stringify(correlation)).not.toContain(context.actorSubject);
    expect(JSON.stringify(correlation)).not.toContain(context.tenantId);
  });

  it('denies missing, disabled, suspended and path-manipulated memberships uniformly', async () => {
    const activeTenant = createTenant({ id: tenantA, status: 'active', version: 1 });
    const suspendedTenant = createTenant({ id: tenantB, status: 'suspended', version: 1 });
    const disabled = createMembership({
      ...membership(),
      id: '0193f8d7-7f03-7f25-a4c0-f043f3d78a54',
      status: 'disabled',
      subject: 'synthetic-disabled',
    });
    const directory = new InMemoryMembershipDirectory(
      [activeTenant, suspendedTenant],
      [membership(), disabled],
    );
    const resolver = new TenantContextResolver(directory);

    await expect(
      resolver.resolve({ subject: 'synthetic-subject-a' }, tenantB),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
    await expect(
      resolver.resolve({ subject: 'synthetic-missing' }, tenantA),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
    await expect(
      resolver.resolve({ subject: 'synthetic-disabled' }, tenantA),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
    await expect(
      resolver.resolve({ subject: 'synthetic-subject-a' }, 'attacker-selected'),
    ).rejects.toMatchObject({ code: 'tenant_access_denied' });
  });

  it('rejects a directory response that does not match the selected tenant', async () => {
    const resolver = new TenantContextResolver({
      findBySubjectAndTenant: async () => ({
        membership: createMembership({
          ...membership(),
          id: '0193f8d7-7f03-7f25-a4c0-f043f3d78a55',
          tenantId: tenantB,
        }),
        tenant: createTenant({ id: tenantB, status: 'active', version: 1 }),
      }),
    });

    await expect(
      resolver.resolve({ subject: 'synthetic-subject-a' }, tenantA),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it('rejects duplicate tenant and membership identities in the directory contract', () => {
    const tenant = createTenant({ id: tenantA, status: 'active', version: 1 });
    const first = membership('viewer');

    expect(() => new InMemoryMembershipDirectory([tenant, tenant], [first])).toThrowError(
      /tenant IDs must be unique/iu,
    );
    expect(
      () =>
        new InMemoryMembershipDirectory(
          [tenant, createTenant({ id: tenantB, status: 'active', version: 1 })],
          [
            first,
            createMembership({
              ...first,
              subject: 'synthetic-subject-b',
              tenantId: tenantB,
            }),
          ],
        ),
    ).toThrowError(/membership IDs must be unique/iu);
  });

  it('implements the complete tenant role matrix while excluding support_admin', () => {
    expect(tenantRoles).toEqual(['tenant_owner', 'tenant_admin', 'agent', 'viewer']);
    expect(tenantPermissions).toEqual([
      'tenant:read',
      'tenant:manage',
      'members:read',
      'members:manage',
      'work:read',
      'work:write',
    ]);

    expect(roleAllows('tenant_owner', 'members:manage')).toBe(true);
    expect(roleAllows('tenant_admin', 'members:manage')).toBe(true);
    expect(roleAllows('tenant_admin', 'tenant:manage')).toBe(false);
    expect(roleAllows('agent', 'work:write')).toBe(true);
    expect(roleAllows('agent', 'members:read')).toBe(false);
    expect(roleAllows('viewer', 'work:read')).toBe(true);
    expect(roleAllows('viewer', 'work:write')).toBe(false);
  });
});

describe('tenant job context', () => {
  const context: TenantContext = Object.freeze({
    actorSubject: 'synthetic-subject-a',
    membershipId,
    membershipVersion: 4,
    role: 'agent',
    tenantId: tenantA,
  });

  it('creates a context-bound envelope and consumes it only after membership revalidation', async () => {
    const directory = new InMemoryMembershipDirectory(
      [createTenant({ id: tenantA, status: 'active', version: 1 })],
      [membership('agent')],
    );
    const consumer = new TenantJobConsumer(directory);
    const envelope = createTenantJobEnvelope(context, {
      jobId,
      jobType: 'synthetic_work_v1',
      payload: { operation: 'synthetic' },
    });

    const result = await consumer.consume(envelope, async (resolved, payload, correlation) => ({
      correlation,
      payload,
      resolved,
    }));

    expect(result).toMatchObject({ payload: { operation: 'synthetic' }, resolved: context });
    expect(result.correlation.actorRef).toMatch(/^act_[A-Za-z0-9_-]{22}$/u);
    expect(result.correlation.tenantRef).toMatch(/^ten_[A-Za-z0-9_-]{22}$/u);
    expect(JSON.stringify(result.correlation)).not.toContain(context.actorSubject);
    expect(JSON.stringify(result.correlation)).not.toContain(context.tenantId);
    expect(Object.isFrozen(envelope)).toBe(true);
    expect(Object.isFrozen(envelope.context)).toBe(true);
    expect(Object.isFrozen(envelope.payload)).toBe(true);
  });

  it('rejects tenant selectors in payloads and every tampered or stale context', async () => {
    expect(() =>
      createTenantJobEnvelope(context, {
        jobId,
        jobType: 'synthetic_work_v1',
        payload: { nested: { tenantId: tenantB } },
      }),
    ).toThrowError(/tenant selector/iu);
    expect(() =>
      createTenantJobEnvelope(context, {
        jobId,
        jobType: 'synthetic_work_v1',
        payload: JSON.parse('{"__proto__":{"operation":"synthetic"}}') as {
          operation: string;
        },
      }),
    ).toThrowError(/forbidden object key/iu);

    const directory = new InMemoryMembershipDirectory(
      [createTenant({ id: tenantA, status: 'active', version: 1 })],
      [membership('agent')],
    );
    const consumer = new TenantJobConsumer(directory);
    const envelope = createTenantJobEnvelope(context, {
      jobId,
      jobType: 'synthetic_work_v1',
      payload: { operation: 'synthetic' },
    });
    const tampered = structuredClone(envelope) as {
      context: { tenantId: string };
    } & typeof envelope;
    tampered.context.tenantId = tenantB;

    await expect(consumer.consume(tampered, async () => 'unreachable')).rejects.toBeInstanceOf(
      TenantAccessDeniedError,
    );
    await expect(
      consumer.consume(
        { ...structuredClone(envelope), context: { ...envelope.context, membershipVersion: 3 } },
        async () => 'unreachable',
      ),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });
});
