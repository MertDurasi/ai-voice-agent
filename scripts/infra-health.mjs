import { compose, run } from './lib/local-infra.mjs';

const services = ['postgres', 'redis', 'keycloak', 'minio', 'mailpit'];

for (const service of services) {
  const containerId = compose(['ps', '--quiet', service]);
  if (!containerId) throw new Error(`${service}: container is not running`);

  const state = run('docker', [
    'inspect',
    '--format',
    '{{.State.Status}}/{{.State.Health.Status}}',
    containerId,
  ]);
  if (state !== 'running/healthy')
    throw new Error(`${service}: expected running/healthy, got ${state}`);
  console.log(`${service}: ${state}`);
}

for (const url of [
  'http://keycloak:9000/health/ready',
  'http://minio:9000/minio/health/ready',
  'http://mailpit:8025/readyz',
]) {
  compose(['run', '--rm', '--no-deps', 'health-client', 'wget', '--spider', '--quiet', url]);
  console.log(`${url}: reachable`);
}

console.log('Local infrastructure health: OK');
