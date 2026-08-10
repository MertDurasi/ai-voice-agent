/* This file is generated from contracts/openapi/api-v1.json. Do not edit manually. */
/* eslint-disable @typescript-eslint/consistent-type-definitions -- generated schemas can be object or union aliases. */

export type ApiErrorDetailDto = { readonly code: string; readonly field?: string };

export type ApiErrorResponseDto = {
  readonly code: string;
  readonly details?: readonly ApiErrorDetailDto[];
  readonly message: string;
  readonly requestId: string;
  readonly status: number;
};

export type ApiRootResponseDto = {
  readonly service: string;
  readonly status: 'ok';
  readonly version: 'v1';
};

export type DependencyStatusDto = { readonly latencyMs: number; readonly status: 'down' | 'up' };

export type LivenessResponseDto = {
  readonly checkedAt: string;
  readonly service: string;
  readonly status: 'ok';
};

export type ReadinessDependenciesDto = {
  readonly postgres: DependencyStatusDto;
  readonly redis: DependencyStatusDto;
};

export type ReadinessResponseDto = {
  readonly checkedAt: string;
  readonly dependencies: ReadinessDependenciesDto;
  readonly status: 'not_ready' | 'ready';
};

export interface ApiV1Paths {
  readonly '/api/v1': {
    readonly get: {
      readonly responses: {
        readonly '200': ApiRootResponseDto;
        readonly '500': ApiErrorResponseDto;
      };
    };
  };
  readonly '/health/live': {
    readonly get: {
      readonly responses: {
        readonly '200': LivenessResponseDto;
        readonly '500': ApiErrorResponseDto;
      };
    };
  };
  readonly '/health/ready': {
    readonly get: {
      readonly responses: {
        readonly '200': ReadinessResponseDto;
        readonly '500': ApiErrorResponseDto;
        readonly '503': ReadinessResponseDto;
      };
    };
  };
}
