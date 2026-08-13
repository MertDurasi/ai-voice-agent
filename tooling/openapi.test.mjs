import { describe, expect, it } from 'vitest';

import { detectBreakingChanges, generateWebTypes, stableJson } from './openapi.mjs';

const baseline = {
  components: {
    schemas: {
      Health: {
        properties: { status: { enum: ['ok'], type: 'string' } },
        required: ['status'],
        type: 'object',
      },
    },
  },
  paths: {
    '/health/live': {
      get: {
        responses: {
          200: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Health' } } },
          },
        },
      },
    },
  },
};

describe('OpenAPI contract tooling', () => {
  it('is deterministic and creates readonly web contracts', () => {
    expect(stableJson({ z: 1, a: { z: 2, a: 3 } })).toBe(
      '{\n  "a": {\n    "a": 3,\n    "z": 2\n  },\n  "z": 1\n}\n',
    );
    expect(generateWebTypes(baseline)).toContain('readonly "/health/live"');
    expect(generateWebTypes(baseline)).toContain('readonly "200": Health');
    expect(
      generateWebTypes({
        components: {
          schemas: {
            Identity: {
              properties: { tenantContext: { nullable: true, type: 'string' } },
              required: ['tenantContext'],
              type: 'object',
            },
          },
        },
        paths: {},
      }),
    ).toContain('readonly "tenantContext": string | null');
    expect(
      generateWebTypes({
        components: {
          schemas: {
            Roles: {
              properties: {
                roles: { items: { enum: ['agent', 'viewer'], type: 'string' }, type: 'array' },
              },
              required: ['roles'],
              type: 'object',
            },
          },
        },
        paths: {},
      }),
    ).toContain('readonly "roles": readonly ("agent" | "viewer")[]');
  });

  it('classifies removed paths, operations, schemas and properties as breaking', () => {
    expect(detectBreakingChanges(baseline, { components: { schemas: {} }, paths: {} })).toEqual([
      'removed_path:/health/live',
      'removed_schema:Health',
    ]);
    expect(
      detectBreakingChanges(baseline, {
        components: { schemas: { Health: { properties: {}, type: 'object' } } },
        paths: { '/health/live': {} },
      }),
    ).toEqual(['removed_operation:GET /health/live', 'removed_property:Health.status']);
  });
});
