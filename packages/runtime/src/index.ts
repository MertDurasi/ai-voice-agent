import { connect } from 'node:net';
import { performance } from 'node:perf_hooks';

export type DependencyStatus = 'down' | 'up';

export interface DependencyCheck {
  readonly latencyMs: number;
  readonly name: string;
  readonly status: DependencyStatus;
}

export interface DependencyProbe {
  readonly name: string;
  check(): Promise<DependencyCheck>;
}

export interface TcpEndpoint {
  readonly host: string;
  readonly port: number;
}

export function tcpEndpointFromUrl(connectionUrl: string, defaultPort: number): TcpEndpoint {
  const url = new URL(connectionUrl);
  const port = url.port.length > 0 ? Number(url.port) : defaultPort;
  if (url.hostname.length === 0 || !Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('Invalid dependency endpoint.');
  }
  return Object.freeze({ host: url.hostname, port });
}

export class TcpDependencyProbe implements DependencyProbe {
  public readonly name: string;
  readonly #endpoint: TcpEndpoint;
  readonly #timeoutMs: number;

  public constructor(name: string, endpoint: TcpEndpoint, timeoutMs: number) {
    if (!/^[a-z][a-z0-9_-]{0,63}$/u.test(name)) {
      throw new Error('Invalid dependency name.');
    }
    if (!Number.isInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 30_000) {
      throw new Error('Invalid dependency timeout.');
    }
    this.name = name;
    this.#endpoint = Object.freeze({ ...endpoint });
    this.#timeoutMs = timeoutMs;
  }

  public check(): Promise<DependencyCheck> {
    const startedAt = performance.now();
    return new Promise((resolve) => {
      const socket = connect(this.#endpoint);
      let settled = false;
      const complete = (status: DependencyStatus): void => {
        if (settled) return;
        settled = true;
        socket.destroy();
        resolve(
          Object.freeze({
            latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
            name: this.name,
            status,
          }),
        );
      };

      socket.setTimeout(this.#timeoutMs);
      socket.once('connect', () => complete('up'));
      socket.once('error', () => complete('down'));
      socket.once('timeout', () => complete('down'));
    });
  }
}

export async function checkDependencies(
  probes: readonly DependencyProbe[],
): Promise<readonly DependencyCheck[]> {
  return Object.freeze(await Promise.all(probes.map(async (probe) => probe.check())));
}
