import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  actualMigrationHashes,
  discoverMigrationFiles,
  evaluateGuardExecution,
  evaluateMigrationPolicy,
  readMigrationManifest,
  taskStatus,
} from './migrations.mjs';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const manifest = readMigrationManifest(workspaceRoot);
const migrationPaths = discoverMigrationFiles(workspaceRoot);
const actualFiles = actualMigrationHashes(workspaceRoot, migrationPaths);
const manifestFiles = Object.fromEntries(
  (manifest.files ?? []).map((entry) => [entry.path, entry.sha256]),
);
const violations = evaluateMigrationPolicy({
  actualFiles,
  manifestFiles,
  rootMigrateScript: packageJson.scripts?.['db:migrate'] ?? '',
  rootSeedScript: packageJson.scripts?.['db:seed'] ?? '',
  state: manifest.state,
  taskStatus: taskStatus(workspaceRoot, manifest.ownerTask),
});

if (manifest.state === 'guarded') {
  for (const command of ['db:migrate', 'db:seed']) {
    const guard = spawnSync(
      process.execPath,
      ['tooling/task-guard.mjs', manifest.ownerTask, command],
      { cwd: workspaceRoot, encoding: 'utf8' },
    );
    violations.push(
      ...evaluateGuardExecution({
        command,
        status: guard.status,
        stderr: guard.stderr,
        stdout: guard.stdout,
        taskId: manifest.ownerTask,
      }),
    );
  }
}

if (violations.length > 0) {
  process.stderr.write(`Migration policy failed: ${violations.join(', ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Migration policy passed: state=${manifest.state}; files=${migrationPaths.length}.\n`,
  );
}
