import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiErrorResponseDto, ApiRootResponseDto } from './api-contract';

@ApiTags('system')
@Controller('api/v1')
export class ApiController {
  @Get()
  @ApiOperation({ summary: 'Describe the stable API baseline' })
  @ApiOkResponse({ type: ApiRootResponseDto })
  @ApiResponse({ status: 500, type: ApiErrorResponseDto })
  public getRoot(): ApiRootResponseDto {
    return {
      service: 'voice-ai-api',
      status: 'ok',
      version: 'v1',
    };
  }
}
