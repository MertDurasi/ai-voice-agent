import { isSafeCorrelationId, type RuntimeEventLogger } from '@voice-ai/observability';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { performance } from 'node:perf_hooks';

export interface RequestWithId extends IncomingMessage {
  requestId?: string;
}

export function createRequestIdMiddleware(logger: RuntimeEventLogger) {
  return (request: RequestWithId, response: ServerResponse, next: () => void): void => {
    const startedAt = performance.now();
    const candidate = request.headers['x-request-id'];
    const requestId =
      typeof candidate === 'string' && isSafeCorrelationId(candidate) ? candidate : randomUUID();
    request.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    response.once('finish', () => {
      logger.event(
        response.statusCode >= 500 ? 'error' : 'info',
        'http.request.completed',
        {
          durationMs: performance.now() - startedAt,
          eventType: 'http_request',
          requestId,
          status: response.statusCode,
        },
        'RequestIdMiddleware',
      );
    });
    next();
  };
}
