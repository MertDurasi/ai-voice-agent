import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiRootResponseDto {
  @ApiProperty({ example: 'voice-ai-api' })
  public service!: string;

  @ApiProperty({ enum: ['ok'], example: 'ok' })
  public status!: 'ok';

  @ApiProperty({ enum: ['v1'], example: 'v1' })
  public version!: 'v1';
}

export class ApiErrorDetailDto {
  @ApiProperty({ example: 'invalid_request' })
  public code!: string;

  @ApiPropertyOptional({ example: 'fieldName' })
  public field?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 'NOT_FOUND' })
  public code!: string;

  @ApiPropertyOptional({ type: [ApiErrorDetailDto] })
  public details?: ApiErrorDetailDto[];

  @ApiProperty({ example: 'Resource not found.' })
  public message!: string;

  @ApiProperty({ example: '0193f8d7-7f03-7f25-a4c0-f043f3d78a50' })
  public requestId!: string;

  @ApiProperty({ example: 404 })
  public status!: number;
}

export class DependencyStatusDto {
  @ApiProperty({ example: 2, minimum: 0 })
  public latencyMs!: number;

  @ApiProperty({ enum: ['down', 'up'] })
  public status!: 'down' | 'up';
}

export class ReadinessDependenciesDto {
  @ApiProperty({ type: DependencyStatusDto })
  public postgres!: DependencyStatusDto;

  @ApiProperty({ type: DependencyStatusDto })
  public redis!: DependencyStatusDto;
}

export class LivenessResponseDto {
  @ApiProperty({ example: '2026-08-10T12:00:00.000Z', format: 'date-time' })
  public checkedAt!: string;

  @ApiProperty({ example: 'voice-ai-api' })
  public service!: string;

  @ApiProperty({ enum: ['ok'] })
  public status!: 'ok';
}

export class ReadinessResponseDto {
  @ApiProperty({ example: '2026-08-10T12:00:00.000Z', format: 'date-time' })
  public checkedAt!: string;

  @ApiProperty({ type: ReadinessDependenciesDto })
  public dependencies!: ReadinessDependenciesDto;

  @ApiProperty({ enum: ['not_ready', 'ready'] })
  public status!: 'not_ready' | 'ready';
}
