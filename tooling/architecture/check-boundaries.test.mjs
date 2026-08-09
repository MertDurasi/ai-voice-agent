import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { checkDirectory } from './check-boundaries.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));

describe('architecture boundary checker', () => {
  it('accepts a framework-free domain', async () => {
    const violations = await checkDirectory(path.join(directory, 'fixtures/valid'), {
      includeFixtures: true,
    });

    expect(violations).toEqual([]);
  });

  it('detects a Domain-to-NestJS import', async () => {
    const violations = await checkDirectory(path.join(directory, 'fixtures/invalid'), {
      includeFixtures: true,
    });

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DOMAIN_FRAMEWORK_IMPORT',
          specifier: '@nestjs/common',
        }),
      ]),
    );
  });
});
