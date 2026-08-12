import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { inspectArtifactSet } from './artifacts.mjs';

const temporaryDirectories = [];

function temporaryDirectory() {
  const directory = mkdtempSync(path.join(tmpdir(), 'voice-ai-ci-artifacts-'));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    rmSync(temporaryDirectories.pop(), { force: true, recursive: true });
  }
});

describe('CI artifact policy', () => {
  it('accepts only the expected, parseable JSON reports', () => {
    const directory = temporaryDirectory();
    writeFileSync(path.join(directory, 'report.json'), '{"result":"synthetic"}\n');

    const result = inspectArtifactSet({ directory, expectedFiles: ['report.json'] });

    expect(result.violations).toEqual([]);
    expect(result.files).toEqual([expect.objectContaining({ name: 'report.json', bytes: 23 })]);
    expect(result.files[0].sha256).toMatch(/^[a-f0-9]{64}$/u);
  });

  it('blocks unexpected, missing, malformed and secret-bearing artifacts', () => {
    const directory = temporaryDirectory();
    const syntheticToken = ['ghp', '_', 'A'.repeat(40)].join('');
    writeFileSync(path.join(directory, 'unexpected.json'), '{}\n');
    writeFileSync(path.join(directory, 'secret.json'), JSON.stringify({ value: syntheticToken }));
    writeFileSync(path.join(directory, 'malformed.json'), '{not-json}\n');

    const result = inspectArtifactSet({
      directory,
      expectedFiles: ['missing.json', 'secret.json', 'malformed.json'],
    });

    expect(result.violations).toContain('artifact_not_allowlisted:unexpected.json');
    expect(result.violations).toContain('artifact_missing:missing.json');
    expect(result.violations).toContain('artifact_invalid_json:malformed.json');
    expect(result.violations).toContain('artifact_secret:secret.json:github_token');
  });

  it('never uploads a Trivy report that contains a secret finding', () => {
    const directory = temporaryDirectory();
    writeFileSync(
      path.join(directory, 'trivy.json'),
      JSON.stringify({ Results: [{ Class: 'secret', Secrets: [{ RuleID: 'synthetic' }] }] }),
    );

    expect(inspectArtifactSet({ directory, expectedFiles: ['trivy.json'] }).violations).toContain(
      'artifact_contains_secret_finding:trivy.json',
    );
  });
});
