import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { assessFindings, scanBuffer, scanGitHistory, scanText } from './scan-secrets.mjs';

const temporaryDirectories = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    rmSync(temporaryDirectories.pop(), { force: true, recursive: true });
  }
});

describe('secret scanner', () => {
  it('detects representative credential and private-key signatures without returning values', () => {
    const privateKeyHeader = ['-----BEGIN ', 'PRIVATE KEY-----'].join('');
    const githubToken = ['ghp_', 'A'.repeat(36)].join('');
    const findings = scanText('synthetic-input.txt', `${privateKeyHeader}\n${githubToken}\n`);

    expect(findings.map(({ detector }) => detector)).toEqual(['private_key', 'github_token']);
    expect(JSON.stringify(findings)).not.toContain(githubToken);
  });

  it('flags non-placeholder assignments in environment-like files', () => {
    const findings = scanText('runtime.env', `SERVICE_PASSWORD=${'Z'.repeat(30)}\n`);
    expect(findings).toEqual([{ detector: 'assigned_secret', line: 1, path: 'runtime.env' }]);
  });

  it('flags literal YAML secret assignments without returning their values', () => {
    const literal = 'Y'.repeat(30);
    const findings = scanText('compose.yaml', `SERVICE_TOKEN: "${literal}"\n`);

    expect(findings).toEqual([{ detector: 'assigned_secret', line: 1, path: 'compose.yaml' }]);
    expect(JSON.stringify(findings)).not.toContain(literal);
  });

  it('allows explicit local placeholders and complete environment indirections only', () => {
    expect(
      scanText(
        'compose.yml',
        'SERVICE_TOKEN: ${SERVICE_TOKEN:?SERVICE_TOKEN is required}\nOTHER_SECRET: test-only-placeholder\n',
      ),
    ).toEqual([]);

    const embeddedMarker = `SERVICE_TOKEN=${'X'.repeat(24)}-test-only\n`;
    expect(scanText('.env', embeddedMarker)).toEqual([
      { detector: 'assigned_secret', line: 1, path: '.env' },
    ]);
  });

  it('scans NUL-containing files through a normalized text view', () => {
    const assignment = `SERVICE_TOKEN=${'N'.repeat(30)}`;
    const nulInterleaved = Buffer.from([...assignment].join('\0'), 'utf8');

    const findings = scanBuffer('runtime.env', nulInterleaved);
    expect(findings).toEqual([{ detector: 'assigned_secret', line: 1, path: 'runtime.env' }]);
    expect(JSON.stringify(findings)).not.toContain('N'.repeat(30));
  });

  it('allows documented local placeholders but not additional canary locations', () => {
    expect(scanText('.env.example', 'SERVICE_SECRET=replace-with-local-secret\n')).toEqual([]);

    const canary = ['VOICE_AI_SYNTHETIC_SECRET_CANARY_', '1'.repeat(32)].join('');
    const assessment = assessFindings(scanText('unexpected.txt', canary));
    expect(assessment.canaryCount).toBe(0);
    expect(assessment.unexpected).toHaveLength(1);
  });

  it('finds a credential in Git history after the working-tree value was replaced', () => {
    const repository = mkdtempSync(path.join(tmpdir(), 'voice-ai-secret-history-'));
    temporaryDirectories.push(repository);
    execFileSync('git', ['init', '--initial-branch=main'], { cwd: repository });
    execFileSync('git', ['config', 'user.name', 'Synthetic Test'], { cwd: repository });
    execFileSync('git', ['config', 'user.email', 'synthetic@invalid.example'], { cwd: repository });

    const historicalToken = ['ghp_', 'H'.repeat(36)].join('');
    writeFileSync(path.join(repository, 'removed.txt'), `${historicalToken}\n`);
    execFileSync('git', ['add', 'removed.txt'], { cwd: repository });
    execFileSync('git', ['commit', '--message', 'test: add synthetic credential'], {
      cwd: repository,
    });
    writeFileSync(path.join(repository, 'removed.txt'), 'safe replacement\n');
    execFileSync('git', ['add', 'removed.txt'], { cwd: repository });
    execFileSync('git', ['commit', '--message', 'test: remove synthetic credential'], {
      cwd: repository,
    });

    const findings = scanGitHistory(repository);
    expect(findings).toEqual([{ detector: 'github_token', line: 1, path: 'removed.txt' }]);
    expect(JSON.stringify(findings)).not.toContain(historicalToken);
  });
});
