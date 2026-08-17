import { runMigrations } from '../src/admin.js';

const connectionString = process.env.DATABASE_MIGRATION_URL;
if (connectionString === undefined) throw new Error('DATABASE_MIGRATION_URL is required.');

await runMigrations(connectionString);
process.stdout.write('Database migrations applied with the dedicated migration role.\n');
