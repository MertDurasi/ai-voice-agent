import {
  provisionDatabaseRoles,
  runMigrations,
  seedSyntheticTenancy,
} from '../packages/db/dist/admin.js';

import { loadLocalEnvironment } from './lib/local-infra.mjs';

const environment = loadLocalEnvironment();
const database = environment.POSTGRES_DB;
const adminUser = environment.POSTGRES_USER;
const adminPassword = environment.POSTGRES_PASSWORD;
const migrationPassword = environment.POSTGRES_MIGRATION_PASSWORD;
const runtimePassword = environment.POSTGRES_RUNTIME_PASSWORD;
const systemPassword = environment.POSTGRES_SYSTEM_PASSWORD;

for (const [name, value] of Object.entries({
  POSTGRES_DB: database,
  POSTGRES_MIGRATION_PASSWORD: migrationPassword,
  POSTGRES_PASSWORD: adminPassword,
  POSTGRES_RUNTIME_PASSWORD: runtimePassword,
  POSTGRES_SYSTEM_PASSWORD: systemPassword,
  POSTGRES_USER: adminUser,
})) {
  if (value === undefined) throw new Error(`${name} is required for local database setup.`);
}

function connectionString(user, password) {
  const url = new URL('postgresql://127.0.0.1:5432');
  url.username = user;
  url.password = password;
  url.pathname = `/${database}`;
  return url.href;
}

await provisionDatabaseRoles(connectionString(adminUser, adminPassword), {
  migration: migrationPassword,
  runtime: runtimePassword,
  system: systemPassword,
});
const migrationUrl = connectionString('voice_ai_migration_login', migrationPassword);
await runMigrations(migrationUrl);
await seedSyntheticTenancy(migrationUrl);

process.stdout.write('Local PostgreSQL roles, migrations and synthetic tenants are ready.\n');
