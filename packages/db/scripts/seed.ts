import { seedSyntheticTenancy } from '../src/admin.js';

if (process.env.APP_ENV !== 'development' && process.env.APP_ENV !== 'test') {
  throw new Error('Synthetic database seed is restricted to development and test.');
}
const connectionString = process.env.DATABASE_MIGRATION_URL;
if (connectionString === undefined) throw new Error('DATABASE_MIGRATION_URL is required.');

await seedSyntheticTenancy(connectionString);
process.stdout.write('Synthetic tenant seed applied.\n');
