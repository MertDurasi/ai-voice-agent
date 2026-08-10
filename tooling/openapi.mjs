import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { format } from 'prettier';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const contractPath = path.join(workspaceRoot, 'contracts/openapi/api-v1.json');
const webTypesPath = path.join(workspaceRoot, 'apps/web/src/generated/api-v1.ts');
const httpMethods = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'];

function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, sorted(nested)]),
  );
}

export function stableJson(value) {
  return `${JSON.stringify(sorted(value), null, 2)}\n`;
}

function schemaType(schema) {
  if (typeof schema !== 'object' || schema === null) return 'unknown';
  if ('$ref' in schema && typeof schema.$ref === 'string') {
    return schema.$ref.split('/').at(-1) ?? 'unknown';
  }
  if (Array.isArray(schema.enum))
    return schema.enum.map((value) => JSON.stringify(value)).join(' | ');
  if (schema.type === 'array') return `readonly ${schemaType(schema.items)}[]`;
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'string') return 'string';
  if (schema.type === 'object' || typeof schema.properties === 'object') {
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);
    const properties = Object.entries(schema.properties ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(
        ([name, property]) =>
          `readonly ${JSON.stringify(name)}${required.has(name) ? '' : '?'}: ${schemaType(property)};`,
      );
    return `{ ${properties.join(' ')} }`;
  }
  return 'unknown';
}

function responseType(response) {
  if (typeof response !== 'object' || response === null) return 'unknown';
  if ('$ref' in response && typeof response.$ref === 'string') {
    return response.$ref.split('/').at(-1) ?? 'unknown';
  }
  return schemaType(response.content?.['application/json']?.schema);
}

export function generateWebTypes(document) {
  const lines = [
    '/* This file is generated from contracts/openapi/api-v1.json. Do not edit manually. */',
    '/* eslint-disable @typescript-eslint/consistent-type-definitions -- generated schemas can be object or union aliases. */',
    '',
  ];
  const schemas = document.components?.schemas ?? {};
  for (const [name, schema] of Object.entries(schemas).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    lines.push(`export type ${name} = ${schemaType(schema)};`, '');
  }

  lines.push('export interface ApiV1Paths {');
  for (const [apiPath, pathItem] of Object.entries(document.paths ?? {}).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    lines.push(`  readonly ${JSON.stringify(apiPath)}: {`);
    for (const method of httpMethods) {
      const operation = pathItem?.[method];
      if (typeof operation !== 'object' || operation === null) continue;
      lines.push(`    readonly ${method}: {`, '      readonly responses: {');
      for (const [status, response] of Object.entries(operation.responses ?? {}).sort(
        ([left], [right]) => left.localeCompare(right),
      )) {
        lines.push(`        readonly ${JSON.stringify(status)}: ${responseType(response)};`);
      }
      lines.push('      };', '    };');
    }
    lines.push('  };');
  }
  lines.push('}', '');
  return `${lines.join('\n')}\n`;
}

export function detectBreakingChanges(previous, candidate) {
  const findings = [];
  for (const [apiPath, pathItem] of Object.entries(previous.paths ?? {})) {
    if (!(apiPath in (candidate.paths ?? {}))) {
      findings.push(`removed_path:${apiPath}`);
      continue;
    }
    for (const method of httpMethods) {
      if (pathItem?.[method] !== undefined && candidate.paths?.[apiPath]?.[method] === undefined) {
        findings.push(`removed_operation:${method.toUpperCase()} ${apiPath}`);
      }
    }
  }
  for (const [name, schema] of Object.entries(previous.components?.schemas ?? {})) {
    const candidateSchema = candidate.components?.schemas?.[name];
    if (candidateSchema === undefined) {
      findings.push(`removed_schema:${name}`);
      continue;
    }
    for (const property of Object.keys(schema.properties ?? {})) {
      if (!(property in (candidateSchema.properties ?? {}))) {
        findings.push(`removed_property:${name}.${property}`);
      }
    }
  }
  return findings.sort();
}

async function generatedArtifacts() {
  const compiledModuleUrl = pathToFileURL(path.join(workspaceRoot, 'apps/api/dist/openapi.js'));
  const { generateOpenApiDocument } = await import(compiledModuleUrl.href);
  const document = await generateOpenApiDocument();
  return {
    document,
    json: await format(stableJson(document), {
      parser: 'json',
      printWidth: 100,
      tabWidth: 2,
    }),
    webTypes: await format(generateWebTypes(document), {
      parser: 'typescript',
      printWidth: 100,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    }),
  };
}

async function main() {
  const mode = process.argv[2];
  if (mode !== '--check' && mode !== '--write') {
    process.stderr.write('Usage: node tooling/openapi.mjs --check|--write\n');
    process.exitCode = 2;
    return;
  }
  const artifacts = await generatedArtifacts();
  if (mode === '--write') {
    mkdirSync(path.dirname(contractPath), { recursive: true });
    mkdirSync(path.dirname(webTypesPath), { recursive: true });
    writeFileSync(contractPath, artifacts.json);
    writeFileSync(webTypesPath, artifacts.webTypes);
    process.stdout.write('OpenAPI contract and web types generated.\n');
    return;
  }

  let committedJson;
  let committedTypes;
  try {
    committedJson = readFileSync(contractPath, 'utf8');
    committedTypes = readFileSync(webTypesPath, 'utf8');
  } catch {
    process.stderr.write('OpenAPI artifacts are missing; run pnpm openapi:generate.\n');
    process.exitCode = 1;
    return;
  }
  if (committedJson !== artifacts.json || committedTypes !== artifacts.webTypes) {
    const previous = JSON.parse(committedJson);
    const breaking = detectBreakingChanges(previous, artifacts.document);
    process.stderr.write(
      `OpenAPI artifacts are stale; breaking_findings=${breaking.length}. Run pnpm openapi:generate and review the diff.\n`,
    );
    for (const finding of breaking) process.stderr.write(`${finding}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write('OpenAPI contract check passed; snapshot and web types are current.\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
