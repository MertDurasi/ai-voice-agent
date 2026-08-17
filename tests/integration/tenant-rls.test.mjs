import { randomBytes } from 'node:crypto';

import { PostgreSqlContainer } from '@testcontainers/postgresql';
import {
  PostgresMembershipDirectory,
  RlsSchemaViolationError,
  SystemDatabase,
  TenantDatabase,
  assertTenantRls,
  lintTenantRls,
  provisionDatabaseRoles,
  runMigrations,
  seedSyntheticTenancy,
} from '../../packages/db/dist/index.js';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const postgresImage =
  'postgres:18.4-alpine3.23@sha256:996d0920e4ff9df1fc19dacb904492f3c1ec0ec1cc338f0ad7123be7731c5f5e';
const tenantA = '0193f8d7-7f03-7f25-a4c0-f043f3d78a60';
const tenantB = '0193f8d7-7f03-7f25-a4c0-f043f3d78a61';
const contextA = Object.freeze({
  actorSubject: 'synthetic-owner-a',
  membershipId: '0193f8d7-7f03-7f25-a4c0-f043f3d78a70',
  membershipVersion: 1,
  role: 'tenant_owner',
  tenantId: tenantA,
});
const contextB = Object.freeze({
  actorSubject: 'synthetic-owner-b',
  membershipId: '0193f8d7-7f03-7f25-a4c0-f043f3d78a71',
  membershipVersion: 1,
  role: 'tenant_owner',
  tenantId: tenantB,
});

function password() {
  return randomBytes(24).toString('base64url');
}

function connectionString(base, username, credential) {
  const url = new URL(base);
  url.username = username;
  url.password = credential;
  return url.href;
}

describe.sequential('PostgreSQL tenant isolation', () => {
  let adminDatabase;
  let container;
  let directory;
  let runtimeDatabase;
  let runtimeUrl;
  let systemDatabase;
  let systemProbe;

  beforeAll(async () => {
    container = await new PostgreSqlContainer(postgresImage)
      .withDatabase('voice_ai_rls_test')
      .withUsername('voice_ai_test_admin')
      .withPassword(password())
      .start();
    const adminUrl = container.getConnectionUri();
    const passwords = { migration: password(), runtime: password(), system: password() };
    await provisionDatabaseRoles(adminUrl, passwords);
    const migrationUrl = connectionString(
      adminUrl,
      'voice_ai_migration_login',
      passwords.migration,
    );
    runtimeUrl = connectionString(adminUrl, 'voice_ai_runtime_login', passwords.runtime);
    const systemUrl = connectionString(adminUrl, 'voice_ai_system_login', passwords.system);
    await runMigrations(migrationUrl);
    await runMigrations(migrationUrl);
    await seedSyntheticTenancy(migrationUrl);
    adminDatabase = new Pool({
      application_name: 'rls-admin-test',
      connectionString: adminUrl,
      max: 1,
    });
    runtimeDatabase = new TenantDatabase({
      applicationName: 'rls-runtime-test',
      connectionString: runtimeUrl,
      maxConnections: 1,
    });
    directory = new PostgresMembershipDirectory({
      applicationName: 'rls-directory-test',
      connectionString: runtimeUrl,
      maxConnections: 1,
    });
    systemDatabase = new SystemDatabase({
      applicationName: 'rls-system-test',
      connectionString: systemUrl,
      maxConnections: 1,
    });
    systemProbe = new Pool({
      application_name: 'rls-system-negative-test',
      connectionString: systemUrl,
      max: 1,
    });
  }, 120_000);

  afterAll(async () => {
    await Promise.all([
      adminDatabase?.end(),
      directory?.onApplicationShutdown(),
      runtimeDatabase?.close(),
      systemDatabase?.close(),
      systemProbe?.end(),
    ]);
    await container?.stop();
  }, 30_000);

  it('resolves only the authoritative subject and tenant membership', async () => {
    await expect(directory.findBySubjectAndTenant(contextA.actorSubject, tenantA)).resolves.toEqual(
      {
        membership: {
          id: contextA.membershipId,
          role: contextA.role,
          status: 'active',
          subject: contextA.actorSubject,
          tenantId: tenantA,
          version: 1,
        },
        tenant: { id: tenantA, status: 'active', version: 1 },
      },
    );
    await expect(
      directory.findBySubjectAndTenant(contextA.actorSubject, tenantB),
    ).resolves.toBeUndefined();
  });

  it('hides tenant B even when tenant A knows exact IDs', async () => {
    await runtimeDatabase.withTenantTransaction(contextA, async (database) => {
      const visible = await database.query('SELECT id::text FROM app.tenants ORDER BY id');
      const knownForeignTenant = await database.query(
        'SELECT id::text FROM app.tenants WHERE id = $1::uuid',
        [tenantB],
      );
      const knownForeignMembership = await database.query(
        'SELECT id::text FROM app.memberships WHERE id = $1::uuid',
        [contextB.membershipId],
      );
      expect(visible.rows).toEqual([{ id: tenantA }]);
      expect(knownForeignTenant.rows).toEqual([]);
      expect(knownForeignMembership.rows).toEqual([]);
    });
  });

  it('rejects foreign inserts and makes foreign updates and deletes no-ops', async () => {
    await expect(
      runtimeDatabase.withTenantTransaction(contextA, async (database) =>
        database.query(
          `INSERT INTO app.memberships
             (id, tenant_id, subject, role, status, version)
           VALUES ($1::uuid, $2::uuid, $3, 'viewer', 'active', 1)`,
          ['0193f8d7-7f03-7f25-a4c0-f043f3d78a72', tenantB, 'synthetic-foreign-insert'],
        ),
      ),
    ).rejects.toMatchObject({ code: '42501' });

    await runtimeDatabase.withTenantTransaction(contextA, async (database) => {
      const update = await database.query(
        'UPDATE app.memberships SET version = version + 1 WHERE id = $1::uuid',
        [contextB.membershipId],
      );
      const deletion = await database.query('DELETE FROM app.memberships WHERE id = $1::uuid', [
        contextB.membershipId,
      ]);
      expect(update.rowCount).toBe(0);
      expect(deletion.rowCount).toBe(0);
    });
  });

  it('rejects stale or role-manipulated membership context at the database boundary', async () => {
    const insert = (context, id) =>
      runtimeDatabase.withTenantTransaction(context, async (database) =>
        database.query(
          `INSERT INTO app.memberships
             (id, tenant_id, subject, role, status, version)
           VALUES ($1::uuid, $2::uuid, $3, 'viewer', 'active', 1)`,
          [id, tenantA, 'synthetic-rejected-context'],
        ),
      );

    await expect(
      insert(
        { ...contextA, membershipVersion: contextA.membershipVersion + 1 },
        '0193f8d7-7f03-7f25-a4c0-f043f3d78a73',
      ),
    ).rejects.toMatchObject({ code: '42501' });
    await expect(
      insert({ ...contextA, role: 'tenant_admin' }, '0193f8d7-7f03-7f25-a4c0-f043f3d78a74'),
    ).rejects.toMatchObject({ code: '42501' });
  });

  it('clears SET LOCAL state before the pooled connection is reused', async () => {
    await runtimeDatabase.withTenantTransaction(contextA, async (database) => {
      const result = await database.query('SELECT id::text FROM app.tenants');
      expect(result.rows).toEqual([{ id: tenantA }]);
    });
    await expect(runtimeDatabase.assertNoLeakedTenantContext()).resolves.toBeUndefined();
    await expect(
      runtimeDatabase.withTenantTransaction(contextA, async () => {
        throw new Error('synthetic-rollback');
      }),
    ).rejects.toThrow('synthetic-rollback');
    await expect(runtimeDatabase.assertNoLeakedTenantContext()).resolves.toBeUndefined();
    await runtimeDatabase.withTenantTransaction(contextB, async (database) => {
      const result = await database.query('SELECT id::text FROM app.tenants');
      expect(result.rows).toEqual([{ id: tenantB }]);
    });
  });

  it('keeps runtime and system roles non-owner and without BYPASSRLS', async () => {
    const roles = await adminDatabase.query(
      `SELECT rolname, rolsuper, rolbypassrls
       FROM pg_roles
       WHERE rolname IN ('voice_ai_migrator', 'voice_ai_runtime', 'voice_ai_system')
       ORDER BY rolname`,
    );
    expect(roles.rows).toEqual([
      { rolbypassrls: false, rolname: 'voice_ai_migrator', rolsuper: false },
      { rolbypassrls: false, rolname: 'voice_ai_runtime', rolsuper: false },
      { rolbypassrls: false, rolname: 'voice_ai_system', rolsuper: false },
    ]);
    const owners = await adminDatabase.query(
      `SELECT c.relname, pg_get_userbyid(c.relowner) AS owner
       FROM pg_class AS c
       JOIN pg_namespace AS n ON n.oid = c.relnamespace
       WHERE n.nspname = 'app' AND c.relname IN ('memberships', 'tenants')
       ORDER BY c.relname`,
    );
    expect(owners.rows).toEqual([
      { owner: 'voice_ai_migrator', relname: 'memberships' },
      { owner: 'voice_ai_migrator', relname: 'tenants' },
    ]);
    const roleGraph = await adminDatabase.query(
      `SELECT
         pg_has_role('voice_ai_runtime_login', 'voice_ai_migrator', 'member') AS runtime_is_migrator,
         pg_has_role('voice_ai_runtime_login', 'voice_ai_system', 'member') AS runtime_is_system,
         pg_has_role('voice_ai_system_login', 'voice_ai_runtime', 'member') AS system_is_runtime`,
    );
    expect(roleGraph.rows).toEqual([
      { runtime_is_migrator: false, runtime_is_system: false, system_is_runtime: false },
    ]);
  });

  it('requires an immutable audit receipt for the narrow read-only system path', async () => {
    const unaudited = await systemProbe.query('SELECT id::text FROM app.tenants');
    expect(unaudited.rows).toEqual([]);

    const visible = await systemDatabase.withAuditedRead(
      {
        actorRef: 'sys_synthetic_worker',
        operation: 'tenant_isolation_reconciliation',
        reasonCode: 'scheduled_reconciliation',
      },
      async (database) => database.query('SELECT id::text FROM app.tenants ORDER BY id'),
    );
    expect(visible.rows).toEqual([{ id: tenantA }, { id: tenantB }]);
    const audit = await adminDatabase.query(
      `SELECT actor_ref, operation, reason_code, session_role::text
       FROM app.system_access_log`,
    );
    expect(audit.rows).toEqual([
      {
        actor_ref: 'sys_synthetic_worker',
        operation: 'tenant_isolation_reconciliation',
        reason_code: 'scheduled_reconciliation',
        session_role: 'voice_ai_system_login',
      },
    ]);
    await expect(
      systemProbe.query("UPDATE app.tenants SET status = 'suspended'"),
    ).rejects.toMatchObject({ code: '42501' });
  });

  it('fails the schema contract when a new tenant table lacks complete RLS', async () => {
    await adminDatabase.query(
      `CREATE TABLE app.unprotected_tenant_fixture (
         id uuid PRIMARY KEY,
         tenant_id uuid NOT NULL
       )`,
    );
    try {
      const violations = await lintTenantRls(adminDatabase);
      expect(violations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'missing_rls', table: 'unprotected_tenant_fixture' }),
          expect.objectContaining({
            code: 'missing_force_rls',
            table: 'unprotected_tenant_fixture',
          }),
          expect.objectContaining({
            code: 'missing_command_policy',
            table: 'unprotected_tenant_fixture',
          }),
        ]),
      );
      await expect(assertTenantRls(adminDatabase)).rejects.toBeInstanceOf(RlsSchemaViolationError);
    } finally {
      await adminDatabase.query('DROP TABLE app.unprotected_tenant_fixture');
    }
    await expect(assertTenantRls(adminDatabase)).resolves.toBeUndefined();
  });
});
