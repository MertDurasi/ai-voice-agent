import { describe, expect, it } from 'vitest';

import { isSafeCorrelationId, JsonLogger, type LogSink } from './index';

describe('JsonLogger', () => {
  it('emits bounded structured UTC records without serializing objects or traces', () => {
    const lines: string[] = [];
    const sink: LogSink = {
      write(_destination, line) {
        lines.push(line);
      },
    };
    const logger = new JsonLogger({
      environment: 'test',
      minimumLevel: 'debug',
      service: 'synthetic-service',
      sink,
    });

    logger.log('runtime.ready', 'RuntimeContext');
    logger.error({ token: 'must-not-leak' }, 'secret-stack', 'RuntimeContext');
    logger.event(
      'info',
      'http.request.completed',
      {
        durationMs: 2.6,
        eventType: 'http_request',
        requestId: '0193f8d7-7f03-7f25-a4c0-f043f3d78a50',
        status: 200,
      },
      'RequestContext',
    );

    expect(lines).toHaveLength(3);
    expect(JSON.parse(lines[0] ?? '{}')).toMatchObject({
      context: 'RuntimeContext',
      level: 'info',
      message: 'runtime.ready',
      service: 'synthetic-service',
    });
    expect(lines.join('\n')).not.toContain('must-not-leak');
    expect(lines.join('\n')).not.toContain('secret-stack');
    expect(lines.join('\n')).toMatch(/"timestamp":"[^"\n]+Z"/u);
    expect(JSON.parse(lines[2] ?? '{}')).toMatchObject({
      durationMs: 3,
      eventType: 'http_request',
      requestId: '0193f8d7-7f03-7f25-a4c0-f043f3d78a50',
      status: 200,
    });
    expect(isSafeCorrelationId('0193f8d7-7f03-7f25-a4c0-f043f3d78a50')).toBe(true);
    expect(isSafeCorrelationId('491701234567')).toBe(false);
  });
});
