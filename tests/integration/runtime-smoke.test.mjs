import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const children = [];
const servers = [];

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function openTcpServer() {
  const server = createServer((socket) => socket.end());
  servers.push(server);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('Missing TCP address.');
  return { port: address.port, server };
}

async function freePort() {
  const { port, server } = await openTcpServer();
  await closeServer(server);
  return port;
}

async function closeServer(server) {
  if (!server.listening) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)));
  });
  const index = servers.indexOf(server);
  if (index >= 0) servers.splice(index, 1);
}

function startNode(relativeEntry, arguments_, environment) {
  const child = spawn(process.execPath, [path.join(workspaceRoot, relativeEntry), ...arguments_], {
    cwd: workspaceRoot,
    env: { PATH: process.env.PATH ?? '', ...environment },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  children.push(child);
  let stdout = '';
  let stderr = '';
  child.stdout?.on('data', (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr?.on('data', (chunk) => {
    stderr += chunk.toString();
  });
  return { child, stderr: () => stderr, stdout: () => stdout };
}

async function waitFor(check, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const result = await check();
      if (result) return result;
    } catch {
      // The process or socket can still be starting.
    }
    await delay(50);
  }
  throw new Error('Timed out waiting for runtime condition.');
}

async function stopChild(child, signal = 'SIGTERM') {
  if (child.exitCode !== null || child.signalCode !== null) {
    return { code: child.exitCode, signal: child.signalCode };
  }
  const exited = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Child process did not stop in time.'));
    }, 5_000);
    child.once('exit', (code, exitSignal) => {
      clearTimeout(timer);
      resolve({ code, signal: exitSignal });
    });
  });
  child.kill(signal);
  return exited;
}

const sharedRuntimeEnvironment = {
  APP_ENV: 'test',
  DEPENDENCY_PROBE_TIMEOUT_MS: '250',
  NODE_ENV: 'test',
  SHUTDOWN_GRACE_PERIOD_MS: '2000',
};

function syntheticDependencyEnvironment(postgresPort, redisPort) {
  return {
    DATABASE_URL: `postgresql://synthetic:synthetic@127.0.0.1:${postgresPort}/synthetic`,
    REDIS_URL: `redis://:synthetic@127.0.0.1:${redisPort}`,
  };
}

afterEach(async () => {
  await Promise.all(children.splice(0).map(async (child) => stopChild(child)));
  await Promise.all(servers.splice(0).map(async (server) => closeServer(server)));
});

describe('runtime startup and smoke contracts', () => {
  it.each([
    ['api', 'apps/api/dist/main.js', [], ['APP_ENV', 'DATABASE_URL', 'SESSION_SECRET']],
    ['worker', 'apps/worker/dist/main.js', [], ['APP_ENV', 'DATABASE_URL', 'REDIS_URL']],
    ['web', 'apps/web/scripts/run-next.mjs', ['start'], ['APP_ENV', 'NEXT_PUBLIC_API_BASE_URL']],
  ])(
    'stops %s before startup when required configuration is absent',
    (_, entry, args, variables) => {
      const result = spawnSync(process.execPath, [path.join(workspaceRoot, entry), ...args], {
        cwd: workspaceRoot,
        encoding: 'utf8',
        env: { PATH: process.env.PATH ?? '' },
        timeout: 5_000,
      });

      expect(result.status).toBe(1);
      expect(result.signal).toBeNull();
      expect(result.stderr).toContain('Invalid');
      for (const variable of variables) expect(result.stderr).toContain(variable);
      expect(result.stdout).not.toContain('Ready');
      expect(result.stdout).not.toContain('Listening');
    },
  );

  it('runs the API and keeps liveness healthy when Redis becomes unavailable', async () => {
    const postgres = await openTcpServer();
    const redis = await openTcpServer();
    const apiPort = await freePort();
    const runtime = startNode('apps/api/dist/main.js', [], {
      ...sharedRuntimeEnvironment,
      ...syntheticDependencyEnvironment(postgres.port, redis.port),
      API_HOST: '127.0.0.1',
      API_LOG_LEVEL: 'error',
      API_PORT: String(apiPort),
      OIDC_CLIENT_ID: 'synthetic-client',
      OIDC_CLIENT_SECRET: 'synthetic-client-secret',
      OIDC_ISSUER_URL: 'http://127.0.0.1:8080/realms/synthetic',
      SESSION_SECRET: 'synthetic-session-secret-value-0000',
    });
    const baseUrl = `http://127.0.0.1:${apiPort}`;

    const live = await waitFor(async () => {
      const response = await fetch(`${baseUrl}/health/live`);
      return response.status === 200 ? response : false;
    });
    expect(await live.json()).toMatchObject({ status: 'ok' });
    expect((await fetch(`${baseUrl}/health/ready`)).status).toBe(200);

    await closeServer(redis.server);
    const notReady = await fetch(`${baseUrl}/health/ready`);
    expect(notReady.status).toBe(503);
    expect(await notReady.json()).toMatchObject({
      dependencies: { postgres: { status: 'up' }, redis: { status: 'down' } },
      status: 'not_ready',
    });
    expect((await fetch(`${baseUrl}/health/live`)).status).toBe(200);

    const errorResponse = await fetch(`${baseUrl}/api/v1/missing`);
    expect(errorResponse.status).toBe(404);
    expect(JSON.stringify(await errorResponse.json())).not.toContain('stack');
    expect(await stopChild(runtime.child)).toEqual({ code: null, signal: 'SIGTERM' });
    expect(runtime.stderr()).not.toContain('synthetic-session-secret');
  }, 15_000);

  it('starts a ready worker and drains it cleanly on SIGTERM', async () => {
    const postgres = await openTcpServer();
    const redis = await openTcpServer();
    const runtime = startNode('apps/worker/dist/main.js', [], {
      ...sharedRuntimeEnvironment,
      ...syntheticDependencyEnvironment(postgres.port, redis.port),
      WORKER_LOG_LEVEL: 'debug',
      WORKER_READINESS_INTERVAL_MS: '500',
    });

    await waitFor(() => runtime.stdout().includes('"message":"worker.ready"'));
    expect(await stopChild(runtime.child)).toEqual({ code: null, signal: 'SIGTERM' });
    expect(runtime.stdout()).toContain('"message":"worker.draining"');
    expect(runtime.stdout()).toContain('"message":"worker.stopped"');
    expect(runtime.stdout()).not.toContain('synthetic@127.0.0.1');
  }, 15_000);

  it('serves the built web shell and forwards SIGTERM to Next.js', async () => {
    const webPort = await freePort();
    const runtime = startNode(
      'apps/web/scripts/run-next.mjs',
      ['start', '-H', '127.0.0.1', '-p', String(webPort)],
      {
        APP_ENV: 'test',
        NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:3001',
        NODE_ENV: 'production',
      },
    );

    const response = await waitFor(async () => {
      const candidate = await fetch(`http://127.0.0.1:${webPort}`);
      return candidate.status === 200 ? candidate : false;
    });
    expect(await response.text()).toContain('Die technische Basis ist bereit');
    expect(await stopChild(runtime.child)).toEqual({ code: 0, signal: null });
  }, 20_000);
});
