import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { scanBuffer } from '../security/scan-secrets.mjs';

const maximumReportBytes = 25 * 1024 * 1024;

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function containsSecretFinding(value) {
  if (Array.isArray(value)) return value.some((entry) => containsSecretFinding(entry));
  if (!value || typeof value !== 'object') return false;
  if (value.Class === 'secret') return true;
  if (Array.isArray(value.Secrets) && value.Secrets.length > 0) return true;
  return Object.values(value).some((entry) => containsSecretFinding(entry));
}

export function inspectArtifactSet({ directory, expectedFiles }) {
  const violations = [];
  const expected = [...new Set(expectedFiles)].sort();
  const entries = readdirSync(directory, { withFileTypes: true });
  const actual = entries.map((entry) => entry.name).sort();

  for (const name of actual) {
    if (!expected.includes(name)) violations.push(`artifact_not_allowlisted:${name}`);
  }
  for (const name of expected) {
    if (!actual.includes(name)) violations.push(`artifact_missing:${name}`);
  }

  const files = [];
  for (const name of expected) {
    const absolutePath = path.join(directory, name);
    if (!actual.includes(name)) continue;
    const stat = lstatSync(absolutePath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      violations.push(`artifact_not_regular_file:${name}`);
      continue;
    }
    if (!name.endsWith('.json')) violations.push(`artifact_not_json:${name}`);
    if (stat.size > maximumReportBytes) violations.push(`artifact_too_large:${name}`);

    const buffer = readFileSync(absolutePath);
    try {
      const report = JSON.parse(buffer.toString('utf8'));
      if (containsSecretFinding(report)) {
        violations.push(`artifact_contains_secret_finding:${name}`);
      }
    } catch {
      violations.push(`artifact_invalid_json:${name}`);
    }
    for (const finding of scanBuffer(`artifacts/${name}`, buffer)) {
      violations.push(`artifact_secret:${name}:${finding.detector}`);
    }
    files.push(Object.freeze({ name, bytes: stat.size, sha256: sha256(buffer) }));
  }

  return Object.freeze({
    files: Object.freeze(files),
    violations: Object.freeze([...new Set(violations)]),
  });
}

export function writeArtifactManifest({ directory, files, outputName, repositoryRoot }) {
  const packageJson = JSON.parse(readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'));
  const sourceRevision =
    process.env.GITHUB_SHA ??
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim();
  const manifest = {
    schemaVersion: 1,
    sourceRevision,
    toolchain: {
      node: process.versions.node,
      packageManager: packageJson.packageManager,
    },
    files,
  };
  writeFileSync(path.join(directory, outputName), `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
  });
  return manifest;
}
