import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { RuntimeEventLogger } from '@voice-ai/observability';
import { randomUUID } from 'node:crypto';
import type { ServerResponse } from 'node:http';

import type { ApiErrorDetailDto, ApiErrorResponseDto } from './api-contract';
import type { RequestWithId } from './request-id.middleware';

const errorContract: Readonly<Record<number, Readonly<{ code: string; message: string }>>> = {
  [HttpStatus.BAD_REQUEST]: { code: 'INVALID_REQUEST', message: 'Request validation failed.' },
  [HttpStatus.FORBIDDEN]: { code: 'FORBIDDEN', message: 'Request is forbidden.' },
  [HttpStatus.METHOD_NOT_ALLOWED]: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' },
  [HttpStatus.NOT_FOUND]: { code: 'NOT_FOUND', message: 'Resource not found.' },
  [HttpStatus.TOO_MANY_REQUESTS]: { code: 'RATE_LIMITED', message: 'Too many requests.' },
  [HttpStatus.UNAUTHORIZED]: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
};

function validatedDetails(exception: HttpException): ApiErrorDetailDto[] | undefined {
  const response = exception.getResponse();
  if (typeof response !== 'object' || response === null || !('details' in response))
    return undefined;
  const details = (response as { readonly details?: unknown }).details;
  if (!Array.isArray(details)) return undefined;
  const validated = details.flatMap((detail): ApiErrorDetailDto[] => {
    if (typeof detail !== 'object' || detail === null) return [];
    const candidate = detail as { readonly code?: unknown; readonly field?: unknown };
    if (typeof candidate.code !== 'string' || !/^[a-z][a-z0-9_]{0,63}$/u.test(candidate.code)) {
      return [];
    }
    if (
      candidate.field !== undefined &&
      (typeof candidate.field !== 'string' ||
        !/^[A-Za-z][A-Za-z0-9_.]{0,127}$/u.test(candidate.field))
    ) {
      return [];
    }
    return [
      {
        code: candidate.code,
        ...(candidate.field === undefined ? {} : { field: candidate.field }),
      },
    ];
  });
  return validated.length === 0 ? undefined : validated;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  public constructor(private readonly logger: RuntimeEventLogger) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<ServerResponse>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const safeContract =
      errorContract[status] ??
      (status >= 500
        ? { code: 'INTERNAL_ERROR', message: 'An internal error occurred.' }
        : { code: 'REQUEST_FAILED', message: 'Request failed.' });
    const details = exception instanceof HttpException ? validatedDetails(exception) : undefined;
    const body: ApiErrorResponseDto = {
      code: safeContract.code,
      ...(details === undefined ? {} : { details }),
      message: safeContract.message,
      requestId: request.requestId ?? randomUUID(),
      status,
    };

    if (status >= 500) {
      this.logger.event(
        'error',
        'http.request.failed',
        {
          errorCode: safeContract.code,
          eventType: 'http_request',
          requestId: body.requestId,
          status,
        },
        ApiExceptionFilter.name,
      );
    }

    response.statusCode = status;
    response.setHeader('cache-control', 'no-store');
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(body));
  }
}
