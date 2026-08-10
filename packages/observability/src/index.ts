import type { LoggerService } from '@nestjs/common';

export type RuntimeLogLevel = 'debug' | 'error' | 'info' | 'warn';

export interface LogSink {
  write(destination: 'stderr' | 'stdout', line: string): void;
}

export interface JsonLoggerOptions {
  readonly environment: string;
  readonly minimumLevel: RuntimeLogLevel;
  readonly service: string;
  readonly sink?: LogSink;
}

export interface RuntimeLogFields {
  readonly durationMs?: number;
  readonly errorCode?: string;
  readonly eventType?: string;
  readonly jobType?: string;
  readonly requestId?: string;
  readonly status?: number | string;
}

export interface RuntimeEventLogger extends LoggerService {
  event(
    level: RuntimeLogLevel,
    message: string,
    fields?: Readonly<RuntimeLogFields>,
    context?: string,
  ): void;
}

const levelPriority: Readonly<Record<RuntimeLogLevel, number>> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const processSink: LogSink = {
  write(destination, line) {
    const stream = destination === 'stderr' ? process.stderr : process.stdout;
    stream.write(`${line}\n`);
  },
};

function safeMessage(message: unknown): string {
  if (typeof message !== 'string') return 'non_string_message';
  return message.replace(/[\u0000-\u001f\u007f]/gu, ' ').slice(0, 256);
}

function safeContext(optionalParameters: readonly unknown[]): string | undefined {
  const candidate = optionalParameters.at(-1);
  if (typeof candidate !== 'string') return undefined;
  if (!/^[A-Za-z][A-Za-z0-9_.:/-]{0,127}$/u.test(candidate)) return undefined;
  return candidate;
}

function safeCode(value: string | undefined): string | undefined {
  return value !== undefined && /^[A-Za-z][A-Za-z0-9_.:-]{0,127}$/u.test(value) ? value : undefined;
}

export function isSafeCorrelationId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value)
  );
}

function safeFields(fields: Readonly<RuntimeLogFields> | undefined): RuntimeLogFields {
  if (fields === undefined) return {};
  const durationMs =
    typeof fields.durationMs === 'number' &&
    Number.isFinite(fields.durationMs) &&
    fields.durationMs >= 0
      ? Math.round(fields.durationMs)
      : undefined;
  const status =
    (typeof fields.status === 'number' &&
      Number.isInteger(fields.status) &&
      fields.status >= 100 &&
      fields.status <= 599) ||
    (typeof fields.status === 'string' && safeCode(fields.status) !== undefined)
      ? fields.status
      : undefined;
  return {
    ...(durationMs === undefined ? {} : { durationMs }),
    ...(safeCode(fields.errorCode) === undefined ? {} : { errorCode: fields.errorCode }),
    ...(safeCode(fields.eventType) === undefined ? {} : { eventType: fields.eventType }),
    ...(safeCode(fields.jobType) === undefined ? {} : { jobType: fields.jobType }),
    ...(isSafeCorrelationId(fields.requestId) ? { requestId: fields.requestId } : {}),
    ...(status === undefined ? {} : { status }),
  };
}

export class JsonLogger implements RuntimeEventLogger {
  readonly #environment: string;
  readonly #minimumLevel: RuntimeLogLevel;
  readonly #service: string;
  readonly #sink: LogSink;

  public constructor(options: JsonLoggerOptions) {
    this.#environment = options.environment;
    this.#minimumLevel = options.minimumLevel;
    this.#service = options.service;
    this.#sink = options.sink ?? processSink;
  }

  public debug(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('debug', message, optionalParameters);
  }

  public error(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('error', message, optionalParameters);
  }

  public fatal(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('error', message, optionalParameters);
  }

  public log(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('info', message, optionalParameters);
  }

  public verbose(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('debug', message, optionalParameters);
  }

  public warn(message: unknown, ...optionalParameters: unknown[]): void {
    this.#emit('warn', message, optionalParameters);
  }

  public event(
    level: RuntimeLogLevel,
    message: string,
    fields?: Readonly<RuntimeLogFields>,
    context?: string,
  ): void {
    this.#emit(level, message, context === undefined ? [] : [context], fields);
  }

  #emit(
    level: RuntimeLogLevel,
    message: unknown,
    optionalParameters: readonly unknown[],
    fields?: Readonly<RuntimeLogFields>,
  ): void {
    if (levelPriority[level] < levelPriority[this.#minimumLevel]) return;
    const context = safeContext(optionalParameters);
    const record = {
      ...(context === undefined ? {} : { context }),
      environment: this.#environment,
      ...safeFields(fields),
      level,
      message: safeMessage(message),
      service: this.#service,
      timestamp: new Date().toISOString(),
    };
    this.#sink.write(level === 'error' ? 'stderr' : 'stdout', JSON.stringify(record));
  }
}

const ignoreLogCall = (...arguments_: readonly unknown[]): void => {
  void arguments_;
};

export const noopRuntimeEventLogger: RuntimeEventLogger = Object.freeze({
  debug: ignoreLogCall,
  error: ignoreLogCall,
  event: ignoreLogCall,
  fatal: ignoreLogCall,
  log: ignoreLogCall,
  verbose: ignoreLogCall,
  warn: ignoreLogCall,
});
