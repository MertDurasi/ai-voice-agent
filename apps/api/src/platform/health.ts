import { Controller, Get, Header, Inject, Injectable, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { checkDependencies, type DependencyProbe } from '@voice-ai/runtime';
import type { ServerResponse } from 'node:http';

import {
  ApiErrorResponseDto,
  LivenessResponseDto,
  ReadinessResponseDto,
  type DependencyStatusDto,
} from '../http/api-contract';

export const DEPENDENCY_PROBES = Symbol('DEPENDENCY_PROBES');

@Injectable()
export class HealthService {
  public constructor(
    @Inject(DEPENDENCY_PROBES) private readonly probes: readonly DependencyProbe[],
  ) {}

  public liveness(): LivenessResponseDto {
    return {
      checkedAt: new Date().toISOString(),
      service: 'voice-ai-api',
      status: 'ok',
    };
  }

  public async readiness(): Promise<ReadinessResponseDto> {
    const checks = await checkDependencies(this.probes);
    const dependencies = Object.fromEntries(
      checks.map(({ latencyMs, name, status }) => [name, { latencyMs, status }]),
    ) as unknown as { postgres: DependencyStatusDto; redis: DependencyStatusDto };
    const ready = checks.length === 2 && checks.every(({ status }) => status === 'up');
    return {
      checkedAt: new Date().toISOString(),
      dependencies,
      status: ready ? 'ready' : 'not_ready',
    };
  }
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(private readonly health: HealthService) {}

  @Get('live')
  @Header('cache-control', 'no-store')
  @ApiOperation({ summary: 'Report process liveness without checking dependencies' })
  @ApiOkResponse({ type: LivenessResponseDto })
  @ApiResponse({ status: 500, type: ApiErrorResponseDto })
  public liveness(): LivenessResponseDto {
    return this.health.liveness();
  }

  @Get('ready')
  @Header('cache-control', 'no-store')
  @ApiOperation({ summary: 'Report PostgreSQL and Redis reachability' })
  @ApiOkResponse({ type: ReadinessResponseDto })
  @ApiResponse({ status: 503, type: ReadinessResponseDto })
  @ApiResponse({ status: 500, type: ApiErrorResponseDto })
  public async readiness(
    @Res({ passthrough: true }) response: ServerResponse,
  ): Promise<ReadinessResponseDto> {
    const result = await this.health.readiness();
    response.statusCode = result.status === 'ready' ? 200 : 503;
    return result;
  }
}
