import { createServer, type Server } from 'node:net';

import { afterEach, describe, expect, it } from 'vitest';

import { TcpDependencyProbe, checkDependencies, tcpEndpointFromUrl } from './index';

const servers: Server[] = [];

async function openTcpServer(): Promise<{ readonly port: number; readonly server: Server }> {
  const server = createServer((socket) => socket.end());
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('Missing TCP address.');
  return { port: address.port, server };
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)));
  });
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map(async (server) => closeServer(server)));
});

describe('TCP dependency readiness', () => {
  it('reports an accepting local dependency as up without exposing its URL', async () => {
    const { port } = await openTcpServer();
    const endpoint = tcpEndpointFromUrl(`postgresql://synthetic:secret@127.0.0.1:${port}/db`, 5432);
    const result = await new TcpDependencyProbe('postgres', endpoint, 250).check();

    expect(result).toMatchObject({ name: 'postgres', status: 'up' });
    expect(JSON.stringify(result)).not.toContain('synthetic');
    expect(JSON.stringify(result)).not.toContain('secret');
  });

  it('reports a closed dependency as down while preserving sibling results', async () => {
    const postgres = await openTcpServer();
    const redis = await openTcpServer();
    await closeServer(redis.server);
    servers.splice(servers.indexOf(redis.server), 1);

    const results = await checkDependencies([
      new TcpDependencyProbe('postgres', { host: '127.0.0.1', port: postgres.port }, 250),
      new TcpDependencyProbe('redis', { host: '127.0.0.1', port: redis.port }, 250),
    ]);

    expect(results).toEqual([
      expect.objectContaining({ name: 'postgres', status: 'up' }),
      expect.objectContaining({ name: 'redis', status: 'down' }),
    ]);
  });
});
