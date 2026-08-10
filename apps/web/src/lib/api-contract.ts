import type { ApiV1Paths } from '../generated/api-v1';

export type ApiRootResponse = ApiV1Paths['/api/v1']['get']['responses']['200'];
export type LivenessResponse = ApiV1Paths['/health/live']['get']['responses']['200'];
export type ReadinessResponse = ApiV1Paths['/health/ready']['get']['responses']['200'];
