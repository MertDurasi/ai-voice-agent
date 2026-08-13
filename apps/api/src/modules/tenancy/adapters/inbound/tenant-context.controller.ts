import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { permissionsForRole, type TenantContext, type TenantPermission } from '@voice-ai/tenancy';

import { ApiErrorResponseDto } from '../../../../http/api-contract.js';
import { BearerAuthGuard } from '../../../../platform/auth/bearer-auth.guard.js';
import { CurrentTenant } from './tenant-context.decorator.js';
import { TenantContextGuard } from './tenant-context.guard.js';
import { RequireTenantPermission, TenantPermissionGuard } from './tenant-permission.guard.js';

export class TenantContextResponseDto {
  @ApiProperty({ example: '0193f8d7-7f03-7f25-a4c0-f043f3d78a52', format: 'uuid' })
  public membershipId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  public membershipVersion!: number;

  @ApiProperty({
    enum: [
      'tenant:read',
      'tenant:manage',
      'members:read',
      'members:manage',
      'work:read',
      'work:write',
    ],
    isArray: true,
  })
  public permissions!: TenantPermission[];

  @ApiProperty({ enum: ['tenant_owner', 'tenant_admin', 'agent', 'viewer'] })
  public role!: string;

  @ApiProperty({ example: '0193f8d7-7f03-7f25-a4c0-f043f3d78a50', format: 'uuid' })
  public tenantId!: string;
}

@ApiTags('tenancy')
@ApiBearerAuth('bearer')
@Controller('api/v1/tenants')
@UseGuards(BearerAuthGuard, TenantContextGuard, TenantPermissionGuard)
export class TenantContextController {
  @Get(':tenantId/context')
  @RequireTenantPermission('tenant:read')
  @ApiOperation({ summary: 'Resolve the authoritative membership-backed tenant context' })
  @ApiParam({ format: 'uuid', name: 'tenantId' })
  @ApiOkResponse({ type: TenantContextResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, type: ApiErrorResponseDto })
  public getTenantContext(
    @Param('tenantId') _selectedTenantId: string,
    @CurrentTenant() context: TenantContext,
  ): TenantContextResponseDto {
    return {
      membershipId: context.membershipId,
      membershipVersion: context.membershipVersion,
      permissions: [...permissionsForRole(context.role)],
      role: context.role,
      tenantId: context.tenantId,
    };
  }
}
