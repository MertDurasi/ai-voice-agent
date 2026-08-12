import { describe, expect, it } from 'vitest';

import { evaluateGuardExecution, evaluateMigrationPolicy } from './migrations.mjs';

const guarded = Object.freeze({
  actualFiles: {},
  manifestFiles: {},
  rootMigrateScript: 'node tooling/task-guard.mjs T-003 db:migrate',
  rootSeedScript: 'node tooling/task-guard.mjs T-003 db:seed',
  state: 'guarded',
  taskStatus: 'blocked',
});

describe('migration drift policy', () => {
  it('keeps the pre-T-003 baseline explicitly guarded', () => {
    expect(evaluateMigrationPolicy(guarded)).toEqual([]);
  });

  it('blocks a migration introduced while T-003 is guarded', () => {
    expect(
      evaluateMigrationPolicy({
        ...guarded,
        actualFiles: { 'packages/db/migrations/0001.sql': 'synthetic-hash' },
      }),
    ).toContain('migration_added_while_guarded');
  });

  it('blocks active file-set and content drift', () => {
    const violations = evaluateMigrationPolicy({
      actualFiles: { 'packages/db/migrations/0001.sql': 'changed-hash' },
      manifestFiles: {
        'packages/db/migrations/0001.sql': 'expected-hash',
        'packages/db/migrations/0002.sql': 'expected-hash-2',
      },
      rootMigrateScript: 'node tooling/db/migrate.mjs && pnpm db:migrate:ci',
      rootSeedScript: 'node tooling/db/seed.mjs',
      state: 'active',
      taskStatus: 'in_progress',
    });
    expect(violations).toContain('migration_file_set_drift');
    expect(violations).toContain('migration_hash_drift:packages/db/migrations/0001.sql');
  });

  it('requires the guarded commands to fail with the stable reason code', () => {
    expect(
      evaluateGuardExecution({
        command: 'db:migrate',
        status: 1,
        stderr: 'db:migrate is intentionally unavailable until T-003 is implemented.\n',
        stdout: '',
        taskId: 'T-003',
      }),
    ).toEqual([]);
    expect(
      evaluateGuardExecution({
        command: 'db:migrate',
        status: 0,
        stderr: '',
        stdout: 'unexpected execution',
        taskId: 'T-003',
      }),
    ).toEqual([
      'guard_exit_code_invalid:db:migrate',
      'guard_stdout_not_empty:db:migrate',
      'guard_reason_invalid:db:migrate',
    ]);
  });
});
