import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SOURCE_EXTENSIONS = new Set(['.cts', '.mts', '.ts', '.tsx']);
const SKIPPED_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
]);

const FRAMEWORK_OR_INFRA_IMPORTS = [
  '@nestjs/',
  'bullmq',
  'drizzle-orm',
  'ioredis',
  'next',
  'pg',
  'react',
];

const PROVIDER_SDK_IMPORTS = [
  '@anthropic-ai/',
  '@aws-sdk/',
  '@google-cloud/',
  '@vonage/',
  'openai',
  'stripe',
  'twilio',
  'vonage',
];

function normalize(filePath) {
  return filePath.split(path.sep).join('/');
}

function matchesPackage(specifier, candidates) {
  return candidates.some((candidate) =>
    candidate.endsWith('/')
      ? specifier.startsWith(candidate)
      : specifier === candidate || specifier.startsWith(`${candidate}/`),
  );
}

function layerOf(filePath) {
  const match = normalize(filePath).match(
    /\/src\/modules\/([^/]+)\/(domain|application|adapters)(?:\/|$)/,
  );

  if (!match) {
    return undefined;
  }

  return { module: match[1], layer: match[2] };
}

function importedLayer(sourcePath, specifier) {
  if (!specifier.startsWith('.')) {
    return undefined;
  }

  return layerOf(path.resolve(path.dirname(sourcePath), specifier));
}

export function extractImports(source) {
  const imports = new Set();
  const staticImport = /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/gu;
  const dynamicImport = /(?:import|require)\(\s*['"]([^'"]+)['"]\s*\)/gu;

  for (const expression of [staticImport, dynamicImport]) {
    for (const match of source.matchAll(expression)) {
      if (match[1]) {
        imports.add(match[1]);
      }
    }
  }

  return [...imports];
}

export function checkSource(filePath, source) {
  const sourceLayer = layerOf(filePath);
  const violations = [];

  for (const specifier of extractImports(source)) {
    const targetLayer = importedLayer(filePath, specifier);
    const providerImport = matchesPackage(specifier, PROVIDER_SDK_IMPORTS);
    const frameworkOrInfraImport = matchesPackage(specifier, FRAMEWORK_OR_INFRA_IMPORTS);

    if (providerImport && sourceLayer?.layer !== 'adapters') {
      violations.push({
        code: 'PROVIDER_SDK_OUTSIDE_ADAPTER',
        filePath,
        specifier,
      });
    }

    if (sourceLayer?.layer === 'domain' && frameworkOrInfraImport) {
      violations.push({ code: 'DOMAIN_FRAMEWORK_IMPORT', filePath, specifier });
    }

    if (sourceLayer?.layer === 'domain' && targetLayer && targetLayer.layer !== 'domain') {
      violations.push({ code: 'DOMAIN_LAYER_ESCAPE', filePath, specifier });
    }

    if (
      sourceLayer?.layer === 'application' &&
      (frameworkOrInfraImport || targetLayer?.layer === 'adapters')
    ) {
      violations.push({ code: 'APPLICATION_INFRA_IMPORT', filePath, specifier });
    }

    if (sourceLayer && targetLayer && sourceLayer.module !== targetLayer.module) {
      violations.push({ code: 'CROSS_MODULE_INTERNAL_IMPORT', filePath, specifier });
    }
  }

  return violations;
}

async function collectSourceFiles(root, includeFixtures) {
  const files = [];

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      const normalizedPath = normalize(entryPath);

      if (entry.isDirectory()) {
        if (
          SKIPPED_DIRECTORIES.has(entry.name) ||
          (!includeFixtures && normalizedPath.includes('/tooling/architecture/fixtures/'))
        ) {
          continue;
        }
        await visit(entryPath);
        continue;
      }

      if (
        entry.isFile() &&
        SOURCE_EXTENSIONS.has(path.extname(entry.name)) &&
        !entry.name.match(/\.(?:spec|test)\.[cm]?tsx?$/u) &&
        !entry.name.endsWith('.d.ts')
      ) {
        files.push(entryPath);
      }
    }
  }

  await visit(root);
  return files;
}

export async function checkDirectory(root, options = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await collectSourceFiles(absoluteRoot, options.includeFixtures ?? false);
  const violations = [];

  for (const filePath of files) {
    const source = await readFile(filePath, 'utf8');
    violations.push(...checkSource(filePath, source));
  }

  return violations;
}

async function runCli() {
  const root = process.argv[2] ?? process.cwd();
  const violations = await checkDirectory(root);

  if (violations.length === 0) {
    console.log('Architecture boundaries: OK');
    return;
  }

  for (const violation of violations) {
    console.error(
      `${violation.code}: ${path.relative(root, violation.filePath)} -> ${violation.specifier}`,
    );
  }
  process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await runCli();
}
