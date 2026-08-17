import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Pool, type PoolClient } from 'pg';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePackageRoot = path.resolve(
  packageRoot,
  packageRoot.endsWith(`${path.sep}dist`) ? '..' : '.',
);
const roleNames = Object.freeze([
  'voice_ai_migration_login',
  'voice_ai_runtime_login',
  'voice_ai_system_login',
] as const);

export interface DatabaseLoginPasswords {
  readonly migration: string;
  readonly runtime: string;
  readonly system: string;
}

interface MigrationFile {
  readonly content: string;
  readonly hash: string;
  readonly name: string;
}

function assertPassword(value: string): void {
  if (value.length < 20 || value.length > 256 || /[\u0000\r\n]/u.test(value)) {
    throw new Error('Database login password does not meet the provisioning contract.');
  }
}

async function passwordStatement(
  client: PoolClient,
  role: string,
  password: string,
): Promise<string> {
  const result = await client.query<{ statement: string }>(
    "SELECT format('ALTER ROLE %I PASSWORD %L', $1::text, $2::text) AS statement",
    [role, password],
  );
  const statement = result.rows[0]?.statement;
  if (statement === undefined) throw new Error('Database role provisioning failed.');
  return statement;
}

export async function provisionDatabaseRoles(
  adminConnectionString: string,
  passwords: DatabaseLoginPasswords,
): Promise<void> {
  for (const password of [passwords.migration, passwords.runtime, passwords.system]) {
    assertPassword(password);
  }
  const pool = new Pool({
    application_name: 'voice-ai-role-provisioner',
    connectionString: adminConnectionString,
    max: 1,
  });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(path.join(sourcePackageRoot, 'sql/roles.sql'), 'utf8'));
    const values = [passwords.migration, passwords.runtime, passwords.system] as const;
    for (const [index, role] of roleNames.entries()) {
      const password = values[index];
      if (password === undefined) throw new Error('Database role password mapping failed.');
      await client.query(await passwordStatement(client, role, password));
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function migrationFiles(): Promise<readonly MigrationFile[]> {
  const directory = path.join(sourcePackageRoot, 'migrations');
  const names = (await readdir(directory))
    .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/u.test(name))
    .sort();
  const files = await Promise.all(
    names.map(async (name) => {
      const content = await readFile(path.join(directory, name), 'utf8');
      return Object.freeze({
        content,
        hash: createHash('sha256').update(content).digest('hex'),
        name,
      });
    }),
  );
  if (files.length === 0) throw new Error('No database migrations found.');
  return Object.freeze(files);
}

export async function runMigrations(connectionString: string): Promise<void> {
  const pool = new Pool({ application_name: 'voice-ai-migrator', connectionString, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL ROLE voice_ai_migrator');
    const identity = await client.query<{
      bypass_rls: boolean;
      role_name: string;
      superuser: boolean;
    }>(
      `SELECT current_user AS role_name, rolbypassrls AS bypass_rls, rolsuper AS superuser
       FROM pg_roles WHERE rolname = current_user`,
    );
    if (
      identity.rows[0]?.role_name !== 'voice_ai_migrator' ||
      identity.rows[0].bypass_rls ||
      identity.rows[0].superuser
    ) {
      throw new Error('Migration role contract is not satisfied.');
    }
    await client.query('SELECT pg_advisory_xact_lock(76382194012255231)');
    await client.query(
      'CREATE SCHEMA IF NOT EXISTS voice_ai_internal AUTHORIZATION voice_ai_migrator',
    );
    await client.query('REVOKE ALL ON SCHEMA voice_ai_internal FROM PUBLIC');
    await client.query(`CREATE TABLE IF NOT EXISTS voice_ai_internal.schema_migrations (
      name text PRIMARY KEY,
      sha256 text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
      applied_at timestamptz NOT NULL DEFAULT transaction_timestamp()
    )`);
    const files = await migrationFiles();
    const applied = await client.query<{ name: string; sha256: string }>(
      'SELECT name, sha256 FROM voice_ai_internal.schema_migrations ORDER BY name',
    );
    const expectedNames = new Set(files.map((file) => file.name));
    for (const migration of applied.rows) {
      if (!expectedNames.has(migration.name))
        throw new Error(`Unknown applied migration: ${migration.name}.`);
    }
    const appliedByName = new Map(
      applied.rows.map((migration) => [migration.name, migration.sha256]),
    );
    for (const file of files) {
      const existingHash = appliedByName.get(file.name);
      if (existingHash !== undefined && existingHash !== file.hash) {
        throw new Error(`Applied migration hash changed: ${file.name}.`);
      }
      if (existingHash !== undefined) continue;
      await client.query(file.content);
      await client.query(
        'INSERT INTO voice_ai_internal.schema_migrations (name, sha256) VALUES ($1, $2)',
        [file.name, file.hash],
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export async function seedSyntheticTenancy(connectionString: string): Promise<void> {
  const pool = new Pool({ application_name: 'voice-ai-synthetic-seed', connectionString, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL ROLE voice_ai_migrator');
    await client.query(
      `INSERT INTO app.tenants (id, status, version)
       VALUES
         ('0193f8d7-7f03-7f25-a4c0-f043f3d78a60', 'active', 1),
         ('0193f8d7-7f03-7f25-a4c0-f043f3d78a61', 'active', 1)
       ON CONFLICT (id) DO NOTHING`,
    );
    await client.query(
      `INSERT INTO app.memberships (id, tenant_id, subject, role, status, version)
       VALUES
         ('0193f8d7-7f03-7f25-a4c0-f043f3d78a70', '0193f8d7-7f03-7f25-a4c0-f043f3d78a60', 'synthetic-owner-a', 'tenant_owner', 'active', 1),
         ('0193f8d7-7f03-7f25-a4c0-f043f3d78a71', '0193f8d7-7f03-7f25-a4c0-f043f3d78a61', 'synthetic-owner-b', 'tenant_owner', 'active', 1)
       ON CONFLICT (id) DO NOTHING`,
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
