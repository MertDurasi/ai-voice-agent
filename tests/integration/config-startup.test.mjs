import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const minimalEnvironment = Object.freeze({
  PATH: process.env.PATH ?? '',
});

function runWithoutConfiguration(relativeEntry, arguments_) {
  return spawnSync(process.execPath, [path.join(workspaceRoot, relativeEntry), ...arguments_], {
    cwd: workspaceRoot,
    encoding: 'utf8',
    env: minimalEnvironment,
    timeout: 5_000,
  });
}

describe('application startup configuration guards', () => {
  it.each([
    ['api', 'apps/api/dist/main.js', [], ['APP_ENV', 'DATABASE_URL', 'SESSION_SECRET']],
    ['worker', 'apps/worker/dist/main.js', [], ['APP_ENV', 'DATABASE_URL', 'REDIS_URL']],
    ['web', 'apps/web/scripts/run-next.mjs', ['start'], ['APP_ENV', 'NEXT_PUBLIC_API_BASE_URL']],
  ])(
    'stops %s before startup when required configuration is absent',
    (_, entry, arguments_, variables) => {
      const result = runWithoutConfiguration(entry, arguments_);

      expect(result.status).toBe(1);
      expect(result.signal).toBeNull();
      expect(result.stderr).toContain('Invalid');
      for (const variable of variables) expect(result.stderr).toContain(variable);
      expect(result.stderr).not.toContain('unexpected_error');
      expect(result.stdout).not.toContain('Ready');
      expect(result.stdout).not.toContain('Listening');
    },
  );
});
