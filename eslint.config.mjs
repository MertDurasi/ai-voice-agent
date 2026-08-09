import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

const typescriptFiles = ['**/*.{ts,tsx,mts,cts}'];
const webFiles = ['apps/web/**/*.{ts,tsx,mts,cts}'];

function scope(configs, files) {
  return configs.map((config) => ({ ...config, files }));
}

export default defineConfig([
  globalIgnores([
    '**/.next/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/*.d.ts',
    'tooling/architecture/fixtures/**',
  ]),
  { ...eslint.configs.recommended, files: ['**/*.{js,mjs,cjs}'] },
  ...scope(typescriptEslint.configs.strict, typescriptFiles),
  ...scope(typescriptEslint.configs.stylistic, typescriptFiles),
  ...scope(nextVitals, webFiles),
  ...scope(nextTypescript, webFiles),
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: typescriptFiles,
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['apps/{api,worker}/src/**/*.module.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  prettier,
]);
