import { type INestApplication, type LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { createRemoteAccessTokenVerifier, type AccessTokenVerifier } from '@voice-ai/auth';
import type { ApiConfig } from '@voice-ai/config';
import { PostgresMembershipDirectory } from '@voice-ai/db';
import {
  JsonLogger,
  noopRuntimeEventLogger,
  type RuntimeEventLogger,
} from '@voice-ai/observability';
import { TcpDependencyProbe, type DependencyProbe, tcpEndpointFromUrl } from '@voice-ai/runtime';
import type { MembershipDirectory } from '@voice-ai/tenancy';

import { AppModule } from './app.module.js';
import { ApiErrorDetailDto, ApiErrorResponseDto } from './http/api-contract.js';
import { ApiExceptionFilter } from './http/api-exception.filter.js';
import { createRequestIdMiddleware } from './http/request-id.middleware.js';

export interface ApiApplication {
  readonly app: INestApplication;
  readonly document: OpenAPIObject;
}

export interface ApiApplicationOptions {
  readonly enableShutdownHooks?: boolean;
  readonly logger?: LoggerService | false;
  readonly membershipDirectory?: MembershipDirectory;
  readonly probes?: readonly DependencyProbe[];
  readonly accessTokenVerifier?: AccessTokenVerifier;
}

export function dependencyProbesFromConfig(
  config: Readonly<ApiConfig>,
): readonly DependencyProbe[] {
  return Object.freeze([
    new TcpDependencyProbe(
      'postgres',
      tcpEndpointFromUrl(config.databaseUrl.reveal(), 5432),
      config.dependencyProbeTimeoutMs,
    ),
    new TcpDependencyProbe(
      'redis',
      tcpEndpointFromUrl(config.redisUrl.reveal(), 6379),
      config.dependencyProbeTimeoutMs,
    ),
  ]);
}

function eventLoggerFrom(logger: LoggerService | false): RuntimeEventLogger {
  return logger !== false && 'event' in logger && typeof logger.event === 'function'
    ? (logger as RuntimeEventLogger)
    : noopRuntimeEventLogger;
}

function configureHttp(app: INestApplication, eventLogger: RuntimeEventLogger): void {
  app.use(createRequestIdMiddleware(eventLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: false,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter(eventLogger));
}

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const configuration = new DocumentBuilder()
    .setTitle('Voice AI Agent API')
    .setDescription('Providerfreie, synthetische Foundation API.')
    .setVersion('1.0.0')
    .addBearerAuth({ bearerFormat: 'JWT', scheme: 'bearer', type: 'http' }, 'bearer')
    .build();
  return SwaggerModule.createDocument(app, configuration, {
    extraModels: [ApiErrorDetailDto, ApiErrorResponseDto],
    operationIdFactory: (controllerKey, methodKey) => `${controllerKey}_${methodKey}`,
  });
}

export async function createApiApplication(
  config: Readonly<ApiConfig>,
  options: ApiApplicationOptions = {},
): Promise<ApiApplication> {
  const probes = options.probes ?? dependencyProbesFromConfig(config);
  const logger =
    options.logger === undefined
      ? new JsonLogger({
          environment: config.environment,
          minimumLevel: config.logLevel,
          service: 'voice-ai-api',
        })
      : options.logger;
  const eventLogger = eventLoggerFrom(logger);
  const accessTokenVerifier =
    options.accessTokenVerifier ??
    createRemoteAccessTokenVerifier({
      audience: config.oidcClientId,
      issuer: config.oidcIssuerUrl.href.replace(/\/$/u, ''),
    });
  const membershipDirectory =
    options.membershipDirectory ??
    new PostgresMembershipDirectory({
      applicationName: 'voice-ai-api-membership',
      connectionString: config.databaseUrl.reveal(),
    });
  const app = await NestFactory.create(
    AppModule.register(probes, accessTokenVerifier, membershipDirectory),
    {
      abortOnError: false,
      forceCloseConnections: true,
      logger,
    },
  );
  configureHttp(app, eventLogger);
  const document = buildOpenApiDocument(app);
  SwaggerModule.setup('api/v1/openapi', app, document, {
    jsonDocumentUrl: 'api/v1/openapi.json',
    raw: ['json'],
    ui: false,
  });
  if (options.enableShutdownHooks !== false) app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  return { app, document };
}
