import { inspect } from 'node:util';

export const REDACTED_VALUE = '[REDACTED]';

export type AppEnvironment = 'development' | 'production' | 'staging' | 'test';
export type LogLevel = 'debug' | 'error' | 'info' | 'warn';
export type ConfigSensitivity = 'internal' | 'public' | 'secret';
export type ConfigApplication = 'api' | 'web' | 'worker';

export type ConfigIssueCode =
  | 'empty'
  | 'environment_mismatch'
  | 'insecure_default'
  | 'invalid_enum'
  | 'invalid_integer'
  | 'invalid_url'
  | 'missing'
  | 'non_local_transport'
  | 'too_short';

export interface ConfigIssue {
  readonly code: ConfigIssueCode;
  readonly variable: string;
}

export interface ConfigCatalogEntry {
  readonly applications: readonly ConfigApplication[];
  readonly description: string;
  readonly name: string;
  readonly sensitivity: ConfigSensitivity;
}

const issueDescriptions: Readonly<Record<ConfigIssueCode, string>> = {
  empty: 'must not be empty',
  environment_mismatch: 'conflicts with the selected application environment',
  insecure_default: 'contains a development/example value forbidden outside local use',
  invalid_enum: 'contains an unsupported option',
  invalid_integer: 'must be an integer in the documented range',
  invalid_url: 'must be an absolute URL with an allowed protocol',
  missing: 'is required',
  non_local_transport: 'must use the production transport policy outside local use',
  too_short: 'does not meet the minimum length',
};

export class ConfigurationError extends Error {
  public readonly application: ConfigApplication;
  public readonly issues: readonly ConfigIssue[];

  public constructor(application: ConfigApplication, issues: readonly ConfigIssue[]) {
    const details = issues
      .map(({ code, variable }) => `${variable}: ${issueDescriptions[code]}`)
      .join('; ');
    super(`Invalid ${application} configuration (${details}).`);
    this.name = 'ConfigurationError';
    this.application = application;
    this.issues = Object.freeze([...issues]);
  }

  public toJSON(): Readonly<{
    application: ConfigApplication;
    issues: readonly ConfigIssue[];
    name: string;
  }> {
    return {
      application: this.application,
      issues: this.issues,
      name: this.name,
    };
  }
}

const inspectSymbol = inspect.custom;

export class SecretValue {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
    Object.freeze(this);
  }

  public static from(value: string): SecretValue {
    return new SecretValue(value);
  }

  public reveal(): string {
    return this.#value;
  }

  public toJSON(): string {
    return REDACTED_VALUE;
  }

  public toString(): string {
    return REDACTED_VALUE;
  }

  public [inspectSymbol](): string {
    return REDACTED_VALUE;
  }
}

export interface ApiConfig {
  readonly databaseUrl: SecretValue;
  readonly environment: AppEnvironment;
  readonly host: string;
  readonly logLevel: LogLevel;
  readonly oidcClientId: string;
  readonly oidcClientSecret: SecretValue;
  readonly oidcIssuerUrl: URL;
  readonly port: number;
  readonly redisUrl: SecretValue;
  readonly sessionSecret: SecretValue;
}

export interface WorkerConfig {
  readonly databaseUrl: SecretValue;
  readonly environment: AppEnvironment;
  readonly logLevel: LogLevel;
  readonly redisUrl: SecretValue;
}

export interface WebConfig {
  readonly apiBaseUrl: URL;
  readonly environment: AppEnvironment;
}

export const configCatalog = Object.freeze([
  {
    applications: ['api', 'web', 'worker'],
    description: 'Explicit runtime profile; no implicit default is permitted.',
    name: 'APP_ENV',
    sensitivity: 'internal',
  },
  {
    applications: ['api'],
    description: 'API bind address.',
    name: 'API_HOST',
    sensitivity: 'internal',
  },
  {
    applications: ['api'],
    description: 'API listen port.',
    name: 'API_PORT',
    sensitivity: 'internal',
  },
  {
    applications: ['api'],
    description: 'API log verbosity.',
    name: 'API_LOG_LEVEL',
    sensitivity: 'internal',
  },
  {
    applications: ['api', 'worker'],
    description: 'PostgreSQL connection string including credentials.',
    name: 'DATABASE_URL',
    sensitivity: 'secret',
  },
  {
    applications: ['api', 'worker'],
    description: 'Redis connection string including credentials.',
    name: 'REDIS_URL',
    sensitivity: 'secret',
  },
  {
    applications: ['api'],
    description: 'OIDC realm issuer URL.',
    name: 'OIDC_ISSUER_URL',
    sensitivity: 'internal',
  },
  {
    applications: ['api'],
    description: 'OIDC client identifier.',
    name: 'OIDC_CLIENT_ID',
    sensitivity: 'internal',
  },
  {
    applications: ['api'],
    description: 'OIDC confidential-client credential.',
    name: 'OIDC_CLIENT_SECRET',
    sensitivity: 'secret',
  },
  {
    applications: ['api'],
    description: 'High-entropy server-side session signing material.',
    name: 'SESSION_SECRET',
    sensitivity: 'secret',
  },
  {
    applications: ['worker'],
    description: 'Worker log verbosity.',
    name: 'WORKER_LOG_LEVEL',
    sensitivity: 'internal',
  },
  {
    applications: ['web'],
    description: 'Browser-visible API origin; must never contain credentials.',
    name: 'NEXT_PUBLIC_API_BASE_URL',
    sensitivity: 'public',
  },
] as const satisfies readonly ConfigCatalogEntry[]);

export const configVariableNames = Object.freeze(configCatalog.map(({ name }) => name).sort());

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

const environments = new Set<AppEnvironment>(['development', 'production', 'staging', 'test']);
const logLevels = new Set<LogLevel>(['debug', 'error', 'info', 'warn']);
const unsafeMarkers = [
  '.invalid',
  'change-before-real-data',
  'changeme',
  'example-',
  'local-only',
  'replace-with',
  'test-only',
] as const;

function required(
  source: EnvironmentSource,
  variable: string,
  issues: ConfigIssue[],
): string | undefined {
  const value = source[variable];
  if (value === undefined) {
    issues.push({ code: 'missing', variable });
    return undefined;
  }
  if (value.trim().length === 0) {
    issues.push({ code: 'empty', variable });
    return undefined;
  }
  return value;
}

function readEnvironment(
  source: EnvironmentSource,
  issues: ConfigIssue[],
): AppEnvironment | undefined {
  const value = required(source, 'APP_ENV', issues);
  if (value === undefined) return undefined;
  if (!environments.has(value as AppEnvironment)) {
    issues.push({ code: 'invalid_enum', variable: 'APP_ENV' });
    return undefined;
  }

  const environment = value as AppEnvironment;
  const nodeEnvironment = source.NODE_ENV;
  const expectedNodeEnvironment = environment === 'staging' ? 'production' : environment;
  if (nodeEnvironment !== undefined && nodeEnvironment !== expectedNodeEnvironment) {
    issues.push({ code: 'environment_mismatch', variable: 'NODE_ENV' });
  }
  return environment;
}

function readLogLevel(
  source: EnvironmentSource,
  variable: string,
  issues: ConfigIssue[],
): LogLevel | undefined {
  const value = required(source, variable, issues);
  if (value === undefined) return undefined;
  if (!logLevels.has(value as LogLevel)) {
    issues.push({ code: 'invalid_enum', variable });
    return undefined;
  }
  return value as LogLevel;
}

function readInteger(
  source: EnvironmentSource,
  variable: string,
  minimum: number,
  maximum: number,
  issues: ConfigIssue[],
): number | undefined {
  const value = required(source, variable, issues);
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) {
    issues.push({ code: 'invalid_integer', variable });
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    issues.push({ code: 'invalid_integer', variable });
    return undefined;
  }
  return parsed;
}

function readUrl(
  source: EnvironmentSource,
  variable: string,
  protocols: readonly string[],
  issues: ConfigIssue[],
): URL | undefined {
  const value = required(source, variable, issues);
  if (value === undefined) return undefined;
  try {
    const url = new URL(value);
    if (!protocols.includes(url.protocol)) {
      issues.push({ code: 'invalid_url', variable });
      return undefined;
    }
    return url;
  } catch {
    issues.push({ code: 'invalid_url', variable });
    return undefined;
  }
}

function rejectUnsafeNonLocalValue(
  environment: AppEnvironment | undefined,
  variable: string,
  value: string | undefined,
  issues: ConfigIssue[],
): void {
  if (environment !== 'production' && environment !== 'staging') return;
  if (value === undefined) return;
  const normalized = value.toLowerCase();
  if (unsafeMarkers.some((marker) => normalized.includes(marker))) {
    issues.push({ code: 'insecure_default', variable });
  }
}

function requireNonLocalHttps(
  environment: AppEnvironment | undefined,
  variable: string,
  value: URL | undefined,
  issues: ConfigIssue[],
): void {
  if (environment !== 'production' && environment !== 'staging') return;
  if (value === undefined) return;
  if (
    value.protocol !== 'https:' ||
    value.hostname === 'localhost' ||
    value.hostname === '127.0.0.1' ||
    value.hostname.endsWith('.invalid')
  ) {
    issues.push({ code: 'non_local_transport', variable });
  }
}

function readSecret(
  source: EnvironmentSource,
  variable: string,
  minimumLength: number,
  environment: AppEnvironment | undefined,
  issues: ConfigIssue[],
): SecretValue | undefined {
  const value = required(source, variable, issues);
  if (value === undefined) return undefined;
  if (value.length < minimumLength) {
    issues.push({ code: 'too_short', variable });
  }
  rejectUnsafeNonLocalValue(environment, variable, value, issues);
  return SecretValue.from(value);
}

function finish<T>(application: ConfigApplication, issues: ConfigIssue[], value: T): Readonly<T> {
  if (issues.length > 0) throw new ConfigurationError(application, issues);
  return Object.freeze(value);
}

export function loadApiConfig(source: EnvironmentSource): Readonly<ApiConfig> {
  const issues: ConfigIssue[] = [];
  const environment = readEnvironment(source, issues);
  const host = required(source, 'API_HOST', issues);
  const port = readInteger(source, 'API_PORT', 1, 65_535, issues);
  const logLevel = readLogLevel(source, 'API_LOG_LEVEL', issues);
  const databaseUrlValue = readUrl(source, 'DATABASE_URL', ['postgres:', 'postgresql:'], issues);
  const redisUrlValue = readUrl(source, 'REDIS_URL', ['rediss:', 'redis:'], issues);
  const oidcIssuerUrl = readUrl(source, 'OIDC_ISSUER_URL', ['http:', 'https:'], issues);
  const oidcClientId = required(source, 'OIDC_CLIENT_ID', issues);
  const oidcClientSecret = readSecret(source, 'OIDC_CLIENT_SECRET', 16, environment, issues);
  const sessionSecret = readSecret(source, 'SESSION_SECRET', 32, environment, issues);

  rejectUnsafeNonLocalValue(environment, 'DATABASE_URL', source.DATABASE_URL, issues);
  rejectUnsafeNonLocalValue(environment, 'REDIS_URL', source.REDIS_URL, issues);
  requireNonLocalHttps(environment, 'OIDC_ISSUER_URL', oidcIssuerUrl, issues);

  const databaseUrl =
    databaseUrlValue === undefined ? undefined : SecretValue.from(databaseUrlValue.href);
  const redisUrl = redisUrlValue === undefined ? undefined : SecretValue.from(redisUrlValue.href);

  return finish('api', issues, {
    databaseUrl: databaseUrl as SecretValue,
    environment: environment as AppEnvironment,
    host: host as string,
    logLevel: logLevel as LogLevel,
    oidcClientId: oidcClientId as string,
    oidcClientSecret: oidcClientSecret as SecretValue,
    oidcIssuerUrl: oidcIssuerUrl as URL,
    port: port as number,
    redisUrl: redisUrl as SecretValue,
    sessionSecret: sessionSecret as SecretValue,
  });
}

export function loadWorkerConfig(source: EnvironmentSource): Readonly<WorkerConfig> {
  const issues: ConfigIssue[] = [];
  const environment = readEnvironment(source, issues);
  const logLevel = readLogLevel(source, 'WORKER_LOG_LEVEL', issues);
  const databaseUrlValue = readUrl(source, 'DATABASE_URL', ['postgres:', 'postgresql:'], issues);
  const redisUrlValue = readUrl(source, 'REDIS_URL', ['rediss:', 'redis:'], issues);

  rejectUnsafeNonLocalValue(environment, 'DATABASE_URL', source.DATABASE_URL, issues);
  rejectUnsafeNonLocalValue(environment, 'REDIS_URL', source.REDIS_URL, issues);

  const databaseUrl =
    databaseUrlValue === undefined ? undefined : SecretValue.from(databaseUrlValue.href);
  const redisUrl = redisUrlValue === undefined ? undefined : SecretValue.from(redisUrlValue.href);

  return finish('worker', issues, {
    databaseUrl: databaseUrl as SecretValue,
    environment: environment as AppEnvironment,
    logLevel: logLevel as LogLevel,
    redisUrl: redisUrl as SecretValue,
  });
}

export function loadWebConfig(source: EnvironmentSource): Readonly<WebConfig> {
  const issues: ConfigIssue[] = [];
  const environment = readEnvironment(source, issues);
  const apiBaseUrl = readUrl(source, 'NEXT_PUBLIC_API_BASE_URL', ['http:', 'https:'], issues);
  requireNonLocalHttps(environment, 'NEXT_PUBLIC_API_BASE_URL', apiBaseUrl, issues);

  return finish('web', issues, {
    apiBaseUrl: apiBaseUrl as URL,
    environment: environment as AppEnvironment,
  });
}

export function formatStartupError(error: unknown): string {
  if (error instanceof ConfigurationError) return error.message;
  return 'Application startup failed (unexpected_error).';
}
