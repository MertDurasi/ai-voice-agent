import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inspect } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  ConfigurationError,
  REDACTED_VALUE,
  configCatalog,
  configVariableNames,
  formatStartupError,
  loadApiConfig,
  loadWebConfig,
  loadWorkerConfig,
} from './index';

const developmentEnvironment = Object.freeze({
  API_HOST: '127.0.0.1',
  API_LOG_LEVEL: 'debug',
  API_PORT: '3001',
  APP_ENV: 'development',
  DATABASE_URL:
    'postgresql://voice_ai_local:local-only-postgres-change-before-real-data@127.0.0.1:5432/voice_ai_local',
  DEPENDENCY_PROBE_TIMEOUT_MS: '500',
  NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:3001',
  OIDC_CLIENT_ID: 'voice-ai-api-local',
  OIDC_CLIENT_SECRET: 'replace-with-local-oidc-client-secret',
  OIDC_ISSUER_URL: 'http://127.0.0.1:8080/realms/voice-ai-local',
  REDIS_URL: 'redis://:local-only-redis-change-before-real-data@127.0.0.1:6379',
  SESSION_SECRET: 'replace-with-at-least-32-random-local-bytes',
  SHUTDOWN_GRACE_PERIOD_MS: '5000',
  WORKER_LOG_LEVEL: 'debug',
  WORKER_READINESS_INTERVAL_MS: '2000',
});

const productionEnvironment = Object.freeze({
  ...developmentEnvironment,
  API_HOST: '0.0.0.0',
  API_LOG_LEVEL: 'info',
  APP_ENV: 'production',
  DATABASE_URL: 'postgresql://runtime:Nq8j6xW4zF2cV7mR@postgres.service:5432/runtime',
  NEXT_PUBLIC_API_BASE_URL: 'https://api.product.tld',
  NODE_ENV: 'production',
  OIDC_CLIENT_ID: 'voice-ai-api',
  OIDC_CLIENT_SECRET: 'D7qL3nK9wR5vX2mC8pT6',
  OIDC_ISSUER_URL: 'https://identity.product.tld/realms/runtime',
  REDIS_URL: 'rediss://runtime:B9sQ4kM7vN2xP6tH@redis.service:6379',
  SESSION_SECRET: 'j7M2q9L4w8R5x3V6n1T0p7K2c9F4s8H5',
  WORKER_LOG_LEVEL: 'info',
});

function parseExample(content: string): Record<string, string> {
  return Object.fromEntries(
    content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        if (separator < 1) throw new Error('Malformed example configuration line.');
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

describe('typed application configuration', () => {
  it('loads API, worker and web values with their intended types', () => {
    const api = loadApiConfig(developmentEnvironment);
    const worker = loadWorkerConfig(developmentEnvironment);
    const web = loadWebConfig(developmentEnvironment);

    expect(api.port).toBe(3001);
    expect(api.dependencyProbeTimeoutMs).toBe(500);
    expect(api.oidcIssuerUrl).toBeInstanceOf(URL);
    expect(api.databaseUrl.reveal()).toContain('voice_ai_local');
    expect(worker.environment).toBe('development');
    expect(worker.readinessIntervalMs).toBe(2000);
    expect(web.apiBaseUrl.origin).toBe('http://127.0.0.1:3001');
  });

  it('accepts explicit non-local configuration with secure transports', () => {
    expect(loadApiConfig(productionEnvironment).environment).toBe('production');
    expect(loadWorkerConfig(productionEnvironment).environment).toBe('production');
    expect(loadWebConfig(productionEnvironment).environment).toBe('production');
  });

  it('allows a production-built web server to use the isolated test profile', () => {
    expect(
      loadWebConfig({
        APP_ENV: 'test',
        NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:3001',
        NODE_ENV: 'production',
      }).environment,
    ).toBe('test');
  });

  it('fails fast for missing, invalid and conflicting values', () => {
    const leakedInput = 'value-that-must-never-appear';
    const invalid = {
      ...developmentEnvironment,
      API_LOG_LEVEL: leakedInput,
      API_PORT: '70000',
      NODE_ENV: 'production',
    };

    expect(() => loadApiConfig(invalid)).toThrow(ConfigurationError);
    try {
      loadApiConfig(invalid);
    } catch (error) {
      expect(formatStartupError(error)).toContain('API_LOG_LEVEL');
      expect(formatStartupError(error)).toContain('API_PORT');
      expect(formatStartupError(error)).toContain('NODE_ENV');
      expect(formatStartupError(error)).not.toContain(leakedInput);
    }
  });

  it('rejects local/example defaults and insecure public transports outside local use', () => {
    const invalid = {
      ...developmentEnvironment,
      APP_ENV: 'staging',
      NODE_ENV: 'production',
    };

    expect(() => loadApiConfig(invalid)).toThrowError(/insecure|transport/u);
    expect(() => loadWorkerConfig(invalid)).toThrowError(/development\/example/u);
    expect(() => loadWebConfig(invalid)).toThrowError(/transport/u);
  });

  it('redacts secrets from strings, JSON and diagnostic inspection', () => {
    const api = loadApiConfig(productionEnvironment);
    const serialized = JSON.stringify(api);
    const inspected = inspect(api);

    expect(String(api.sessionSecret)).toBe(REDACTED_VALUE);
    expect(serialized).toContain(REDACTED_VALUE);
    expect(inspected).toContain(REDACTED_VALUE);
    for (const secret of [
      productionEnvironment.DATABASE_URL,
      productionEnvironment.OIDC_CLIENT_SECRET,
      productionEnvironment.REDIS_URL,
      productionEnvironment.SESSION_SECRET,
    ]) {
      expect(serialized).not.toContain(secret);
      expect(inspected).not.toContain(secret);
    }
  });

  it('returns a generic message for unexpected startup errors', () => {
    expect(formatStartupError(new Error('sensitive runtime detail'))).toBe(
      'Application startup failed (unexpected_error).',
    );
  });
});

describe('.env.example contract', () => {
  it('contains every declared variable exactly once and validates for local development', () => {
    const content = readFileSync(resolve(__dirname, '../../../.env.example'), 'utf8');
    const example = parseExample(content);
    const declaredKeys = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => line.slice(0, line.indexOf('=')));

    expect([...new Set(declaredKeys)].sort()).toEqual(configVariableNames);
    expect(declaredKeys).toHaveLength(configVariableNames.length);
    expect(() => loadApiConfig(example)).not.toThrow();
    expect(() => loadWorkerConfig(example)).not.toThrow();
    expect(() => loadWebConfig(example)).not.toThrow();
  });

  it('keeps browser-visible variables public and server secrets outside NEXT_PUBLIC', () => {
    for (const entry of configCatalog) {
      if (entry.name.startsWith('NEXT_PUBLIC_')) {
        expect(entry.sensitivity).toBe('public');
      } else if (entry.sensitivity === 'secret') {
        expect(entry.name.startsWith('NEXT_PUBLIC_')).toBe(false);
      }
    }
  });
});
