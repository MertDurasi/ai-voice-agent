import { describe, expect, it } from 'vitest';

import { assessFindings, scanText } from './scan-secrets.mjs';

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

  it('allows documented local placeholders but not additional canary locations', () => {
    expect(scanText('.env.example', 'SERVICE_SECRET=replace-with-local-secret\n')).toEqual([]);

    const canary = ['VOICE_AI_SYNTHETIC_SECRET_CANARY_', '1'.repeat(32)].join('');
    const assessment = assessFindings(scanText('unexpected.txt', canary));
    expect(assessment.canaryCount).toBe(0);
    expect(assessment.unexpected).toHaveLength(1);
  });
});
