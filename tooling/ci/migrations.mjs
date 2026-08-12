import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const migrationDirectoryNames = new Set(['drizzle', 'migration', 'migrations']);
const migrationExtensions = new Set(['.js', '.json', '.mjs', '.sql', '.ts']);

export function evaluateMigrationPolicy({
  actualFiles,
  manifestFiles,
  rootMigrateScript,
  rootSeedScript,
  state,
  taskStatus,
}) {
  const violations = [];
  const actualPaths = Object.keys(actualFiles).sort();
  const manifestPaths = Object.keys(manifestFiles).sort();

  if (!['active', 'guarded'].includes(state)) violations.push('unknown_manifest_state');

  if (state === 'guarded') {
    if (!['blocked', 'ready'].includes(taskStatus)) violations.push('guarded_task_status_invalid');
    if (actualPaths.length > 0) violations.push('migration_added_while_guarded');
    if (manifestPaths.length > 0) violations.push('guarded_manifest_not_empty');
    if (rootMigrateScript !== 'node tooling/task-guard.mjs T-003 db:migrate') {
      violations.push('migration_guard_command_changed');
    }
    if (rootSeedScript !== 'node tooling/task-guard.mjs T-003 db:seed') {
      violations.push('seed_guard_command_changed');
    }
  }

  if (state === 'active') {
    if (!['in_progress', 'review', 'done'].includes(taskStatus)) {
      violations.push('active_task_status_invalid');
    }
    if (!rootMigrateScript.includes('db:migrate:ci')) violations.push('active_ci_runner_missing');
    if (actualPaths.join('\n') !== manifestPaths.join('\n'))
      violations.push('migration_file_set_drift');
    for (const filePath of actualPaths) {
      if (manifestFiles[filePath] !== actualFiles[filePath]) {
        violations.push(`migration_hash_drift:${filePath}`);
      }
    }
  }

  return [...new Set(violations)];
}

export function evaluateGuardExecution({ command, status, stderr, stdout, taskId }) {
  const expectedError = `${command} is intentionally unavailable until ${taskId} is implemented.\n`;
  const violations = [];

  if (status !== 1) violations.push(`guard_exit_code_invalid:${command}`);
  if (stdout !== '') violations.push(`guard_stdout_not_empty:${command}`);
  if (stderr !== expectedError) violations.push(`guard_reason_invalid:${command}`);

  return violations;
}

function repositoryFiles(workspaceRoot) {
  return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .sort();
}

export function discoverMigrationFiles(workspaceRoot) {
  return repositoryFiles(workspaceRoot).filter((relativePath) => {
    if (relativePath.startsWith('docs/') || relativePath.startsWith('tooling/ci/fixtures/')) {
      return false;
    }
    const segments = relativePath.split('/');
    return (
      segments.some((segment) => migrationDirectoryNames.has(segment)) &&
      migrationExtensions.has(path.extname(relativePath))
    );
  });
}

export function sha256File(absolutePath) {
  return createHash('sha256').update(readFileSync(absolutePath)).digest('hex');
}

export function taskStatus(workspaceRoot, taskId) {
  const taskPath = path.join(workspaceRoot, 'docs/tasks/tenancy/T-003-rls-db-roles.md');
  const content = readFileSync(taskPath, 'utf8');
  const id = content.match(/^id:\s*(.+)$/mu)?.[1]?.trim();
  const status = content.match(/^status:\s*(.+)$/mu)?.[1]?.trim();
  if (id !== taskId || !status) throw new Error(`Task status unavailable for ${taskId}.`);
  return status;
}

export function actualMigrationHashes(workspaceRoot, relativePaths) {
  return Object.fromEntries(
    relativePaths.map((relativePath) => [
      relativePath,
      sha256File(path.join(workspaceRoot, relativePath)),
    ]),
  );
}

export function readMigrationManifest(workspaceRoot) {
  const manifestPath = path.join(workspaceRoot, 'tooling/ci/migrations.manifest.json');
  if (!existsSync(manifestPath)) throw new Error('Migration manifest is missing.');
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}
