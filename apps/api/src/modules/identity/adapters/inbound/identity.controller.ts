import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AccessPrincipal } from '@voice-ai/auth';

import { ApiErrorResponseDto } from '../../../../http/api-contract.js';
import { BearerAuthGuard } from '../../../../platform/auth/bearer-auth.guard.js';
import { AuthenticatedUser } from './authenticated-user.decorator.js';

export class IdentityResponseDto {
  @ApiProperty({
    enum: ['agent', 'support_admin', 'tenant_admin', 'tenant_owner', 'viewer'],
    isArray: true,
  })
  public roles!: string[];

  @ApiProperty({ example: 'f25c47ed-6f91-469b-865a-84f42b088a7d' })
  public subject!: string;

  @ApiProperty({ nullable: true, type: 'string' })
  public tenantContext!: null;
}

@ApiTags('identity')
@Controller('api/v1/identity')
export class IdentityController {
  @Get('me')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the validated identity without a tenant context' })
  @ApiOkResponse({ type: IdentityResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  public getIdentity(@AuthenticatedUser() principal: AccessPrincipal): IdentityResponseDto {
    return {
      roles: [...principal.roles],
      subject: principal.subject,
      tenantContext: null,
    };
  }
}
