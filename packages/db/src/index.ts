import { randomUUID } from 'node:crypto';

import {
  createMembership,
  createTenant,
  tenantRoles,
  type MembershipDirectory,
  type MembershipResolution,
  type TenantContext,
} from '@voice-ai/tenancy';
import { Pool, type PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg';

export { provisionDatabaseRoles, runMigrations, seedSyntheticTenancy } from './admin.js';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const subjectPattern = /^[^\u0000-\u001f\u007f]{1,255}$/u;
const systemActorPattern = /^sys_[A-Za-z0-9_-]{8,64}$/u;
const reasonPattern = /^[a-z][a-z0-9_.:-]{2,63}$/u;
const operationPattern = /^[a-z][a-z0-9_.:-]{2,127}$/u;
const tenantRoleSet = new Set<string>(tenantRoles);

export interface DatabaseQuery {
  query<TRow extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<QueryResult<TRow>>;
}

export interface SystemAccessRequest {
  readonly actorRef: string;
  readonly operation: string;
  readonly reasonCode: string;
}

export interface RlsLintViolation {
  readonly code:
    | 'missing_command_policy'
    | 'missing_force_rls'
    | 'missing_rls'
    | 'missing_tenant_id'
    | 'policy_missing_check'
    | 'policy_missing_using';
  readonly detail: string;
  readonly table: string;
}

export interface ManagedDatabaseOptions {
  readonly applicationName: string;
  readonly connectionString: string;
  readonly maxConnections?: number;
}

export class RlsSchemaViolationError extends Error {
  public readonly violations: readonly RlsLintViolation[];

  public constructor(violations: readonly RlsLintViolation[]) {
    super('Tenant RLS schema contract failed.');
    this.name = 'RlsSchemaViolationError';
    this.violations = Object.freeze([...violations]);
  }
}

export class DatabaseContextLeakError extends Error {
  public constructor() {
    super('Database connection retained tenant context outside its transaction.');
    this.name = 'DatabaseContextLeakError';
  }
}

function poolConfig(options: ManagedDatabaseOptions): PoolConfig {
  if (options.applicationName.length === 0 || options.applicationName.length > 63) {
    throw new Error('Invalid database application name.');
  }
  return {
    application_name: options.applicationName,
    connectionString: options.connectionString,
    max: options.maxConnections ?? 10,
  };
}

function assertUuid(value: string, name: string): void {
  if (!uuidPattern.test(value)) throw new Error(`Invalid ${name}.`);
}

function assertSubject(value: string): void {
  if (!subjectPattern.test(value)) throw new Error('Invalid identity subject.');
}

async function rollbackQuietly(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } catch {
    // Preserve the original transaction error.
  }
}

async function setLocal(client: PoolClient, key: string, value: string): Promise<void> {
  await client.query('SELECT set_config($1, $2, true)', [key, value]);
}

export class PostgresMembershipDirectory implements MembershipDirectory {
  readonly #pool: Pool;

  public constructor(options: ManagedDatabaseOptions) {
    this.#pool = new Pool(poolConfig(options));
  }

  public async findBySubjectAndTenant(
    subject: string,
    tenantId: string,
  ): Promise<MembershipResolution | undefined> {
    assertSubject(subject);
    assertUuid(tenantId, 'tenant ID');
    const client = await this.#pool.connect();
    try {
      await client.query('BEGIN READ ONLY');
      await setLocal(client, 'app.tenant_id', tenantId);
      await setLocal(client, 'app.actor_subject', subject);
      const result = await client.query<{
        membership_id: string;
        membership_role: string;
        membership_status: string;
        membership_version: number;
        subject: string;
        tenant_id: string;
        tenant_status: string;
        tenant_version: number;
      }>(
        `SELECT
           m.id::text AS membership_id,
           m.role AS membership_role,
           m.status AS membership_status,
           m.version AS membership_version,
           m.subject,
           t.id::text AS tenant_id,
           t.status AS tenant_status,
           t.version AS tenant_version
         FROM app.memberships AS m
         JOIN app.tenants AS t ON t.id = m.tenant_id
         WHERE m.subject = $1 AND m.tenant_id = $2::uuid`,
        [subject, tenantId],
      );
      await client.query('COMMIT');
      const row = result.rows[0];
      if (row === undefined) return undefined;
      return Object.freeze({
        membership: createMembership({
          id: row.membership_id,
          role: row.membership_role as Parameters<typeof createMembership>[0]['role'],
          status: row.membership_status as Parameters<typeof createMembership>[0]['status'],
          subject: row.subject,
          tenantId: row.tenant_id,
          version: row.membership_version,
        }),
        tenant: createTenant({
          id: row.tenant_id,
          status: row.tenant_status as Parameters<typeof createTenant>[0]['status'],
          version: row.tenant_version,
        }),
      });
    } catch (error) {
      await rollbackQuietly(client);
      throw error;
    } finally {
      client.release();
    }
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.#pool.end();
  }
}

export class TenantDatabase {
  readonly #pool: Pool;

  public constructor(options: ManagedDatabaseOptions) {
    this.#pool = new Pool(poolConfig(options));
  }

  public async withTenantTransaction<TResult>(
    context: TenantContext,
    work: (database: DatabaseQuery) => Promise<TResult>,
  ): Promise<TResult> {
    assertSubject(context.actorSubject);
    assertUuid(context.tenantId, 'tenant ID');
    assertUuid(context.membershipId, 'membership ID');
    if (!Number.isSafeInteger(context.membershipVersion) || context.membershipVersion < 1) {
      throw new Error('Invalid membership version.');
    }
    if (!tenantRoleSet.has(context.role)) throw new Error('Invalid tenant role.');
    const client = await this.#pool.connect();
    try {
      await client.query('BEGIN');
      await setLocal(client, 'app.tenant_id', context.tenantId);
      await setLocal(client, 'app.actor_subject', context.actorSubject);
      await setLocal(client, 'app.membership_id', context.membershipId);
      await setLocal(client, 'app.membership_version', String(context.membershipVersion));
      await setLocal(client, 'app.membership_role', context.role);
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await rollbackQuietly(client);
      throw error;
    } finally {
      client.release();
    }
  }

  public async assertNoLeakedTenantContext(): Promise<void> {
    const result = await this.#pool.query<{ leaked: boolean }>(
      `SELECT EXISTS (
         SELECT 1
         FROM unnest(ARRAY[
           current_setting('app.tenant_id', true),
           current_setting('app.actor_subject', true),
           current_setting('app.membership_id', true),
           current_setting('app.membership_version', true),
           current_setting('app.membership_role', true)
         ]) AS setting(value)
         WHERE NULLIF(value, '') IS NOT NULL
       ) AS leaked`,
    );
    if (result.rows[0]?.leaked !== false) throw new DatabaseContextLeakError();
  }

  public async close(): Promise<void> {
    await this.#pool.end();
  }
}

export class SystemDatabase {
  readonly #pool: Pool;

  public constructor(options: ManagedDatabaseOptions) {
    this.#pool = new Pool(poolConfig(options));
  }

  public async withAuditedRead<TResult>(
    request: SystemAccessRequest,
    work: (database: DatabaseQuery) => Promise<TResult>,
  ): Promise<TResult> {
    if (!systemActorPattern.test(request.actorRef)) throw new Error('Invalid system actor ref.');
    if (!reasonPattern.test(request.reasonCode)) throw new Error('Invalid system reason code.');
    if (!operationPattern.test(request.operation)) throw new Error('Invalid system operation.');
    const client = await this.#pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET LOCAL ROLE voice_ai_system');
      const accessId = randomUUID();
      await client.query(
        `INSERT INTO app.system_access_log (id, actor_ref, reason_code, operation)
         VALUES ($1::uuid, $2, $3, $4)`,
        [accessId, request.actorRef, request.reasonCode, request.operation],
      );
      await client.query('COMMIT');
      await client.query('BEGIN READ ONLY');
      await client.query('SET LOCAL ROLE voice_ai_system');
      await setLocal(client, 'app.system_access_id', accessId);
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await rollbackQuietly(client);
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.#pool.end();
  }
}

export async function lintTenantRls(database: DatabaseQuery): Promise<readonly RlsLintViolation[]> {
  const tables = await database.query<{
    force_rls: boolean;
    has_tenant_id: boolean;
    rls_enabled: boolean;
    table_name: string;
  }>(
    `SELECT
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS force_rls,
       EXISTS (
         SELECT 1 FROM pg_attribute AS a
         WHERE a.attrelid = c.oid AND a.attname = 'tenant_id' AND NOT a.attisdropped
       ) AS has_tenant_id
     FROM pg_class AS c
     JOIN pg_namespace AS n ON n.oid = c.relnamespace
     WHERE n.nspname = 'app'
       AND c.relkind = 'r'
       AND c.relname <> 'system_access_log'
     ORDER BY c.relname`,
  );
  const policies = await database.query<{
    command: string;
    has_check: boolean;
    has_using: boolean;
    table_name: string;
  }>(
    `SELECT
       c.relname AS table_name,
       p.polcmd AS command,
       p.polqual IS NOT NULL AS has_using,
       p.polwithcheck IS NOT NULL AS has_check
     FROM pg_policy AS p
     JOIN pg_class AS c ON c.oid = p.polrelid
     JOIN pg_namespace AS n ON n.oid = c.relnamespace
     WHERE n.nspname = 'app'`,
  );
  const policiesByTable = new Map<string, typeof policies.rows>();
  for (const policy of policies.rows) {
    const entries = policiesByTable.get(policy.table_name) ?? [];
    entries.push(policy);
    policiesByTable.set(policy.table_name, entries);
  }
  const violations: RlsLintViolation[] = [];
  for (const table of tables.rows) {
    if (!table.has_tenant_id) {
      violations.push({
        code: 'missing_tenant_id',
        detail: 'tenant_id column required',
        table: table.table_name,
      });
    }
    if (!table.rls_enabled) {
      violations.push({
        code: 'missing_rls',
        detail: 'ENABLE ROW LEVEL SECURITY required',
        table: table.table_name,
      });
    }
    if (!table.force_rls) {
      violations.push({
        code: 'missing_force_rls',
        detail: 'FORCE ROW LEVEL SECURITY required',
        table: table.table_name,
      });
    }
    const tablePolicies = policiesByTable.get(table.table_name) ?? [];
    for (const command of ['r', 'a', 'w', 'd'] as const) {
      const matching = tablePolicies.filter((policy) => policy.command === command);
      if (matching.length === 0) {
        violations.push({
          code: 'missing_command_policy',
          detail: `policy command ${command} required`,
          table: table.table_name,
        });
        continue;
      }
      if (command !== 'a' && !matching.some((policy) => policy.has_using)) {
        violations.push({
          code: 'policy_missing_using',
          detail: `USING required for command ${command}`,
          table: table.table_name,
        });
      }
      if ((command === 'a' || command === 'w') && !matching.some((policy) => policy.has_check)) {
        violations.push({
          code: 'policy_missing_check',
          detail: `WITH CHECK required for command ${command}`,
          table: table.table_name,
        });
      }
    }
  }
  return Object.freeze(violations.map((violation) => Object.freeze(violation)));
}

export async function assertTenantRls(database: DatabaseQuery): Promise<void> {
  const violations = await lintTenantRls(database);
  if (violations.length > 0) throw new RlsSchemaViolationError(violations);
}
