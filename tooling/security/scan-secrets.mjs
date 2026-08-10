import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const expectedCanary = Object.freeze({
  detector: 'synthetic_canary',
  path: 'tooling/security/fixtures/synthetic-secret-canary.txt',
});

const detectors = Object.freeze([
  {
    id: 'private_key',
    pattern: /-----BEGIN (?:EC |OPENSSH |PGP |RSA )?PRIVATE KEY-----/gu,
  },
  {
    id: 'aws_access_key',
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/gu,
  },
  {
    id: 'github_token',
    pattern: /\b(?:gh[oprsu]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/gu,
  },
  {
    id: 'slack_token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/gu,
  },
  {
    id: 'stripe_live_key',
    pattern: /\bsk_live_[A-Za-z0-9]{20,}\b/gu,
  },
  {
    id: 'twilio_api_key',
    pattern: /\bSK[a-fA-F0-9]{32}\b/gu,
  },
  {
    id: 'synthetic_canary',
    pattern: /\bVOICE_AI_SYNTHETIC_SECRET_CANARY_[A-Z0-9]{32}\b/gu,
  },
]);

const environmentLikeFile = /(?:^|\/)(?:\.env(?:\.[^/]*)?|[^/]+\.(?:env|ya?ml))$/u;
const environmentSecret =
  /^(?:export\s+)?[A-Z0-9_]*(?:API_KEY|PASSWORD|PRIVATE_KEY|SECRET|TOKEN)[A-Z0-9_]*\s*=\s*([^\s#][^#]*)$/gmu;
const safeExampleMarkers = ['local-only', 'replace-with', 'synthetic-secret-canary', 'test-only'];

function lineForOffset(content, offset) {
  return content.slice(0, offset).split('\n').length;
}

export function scanText(filePath, content) {
  const findings = [];
  for (const detector of detectors) {
    for (const match of content.matchAll(detector.pattern)) {
      findings.push({
        detector: detector.id,
        line: lineForOffset(content, match.index ?? 0),
        path: filePath,
      });
    }
  }

  if (environmentLikeFile.test(filePath)) {
    for (const match of content.matchAll(environmentSecret)) {
      const value = (match[1] ?? '').trim().toLowerCase();
      const isCanary = findings.some(
        (finding) =>
          finding.detector === 'synthetic_canary' &&
          finding.line === lineForOffset(content, match.index ?? 0),
      );
      if (!isCanary && !safeExampleMarkers.some((marker) => value.includes(marker))) {
        findings.push({
          detector: 'assigned_secret',
          line: lineForOffset(content, match.index ?? 0),
          path: filePath,
        });
      }
    }
  }

  return findings;
}

function repositoryFiles(workspaceRoot) {
  const output = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: workspaceRoot, encoding: 'utf8' },
  );
  return output.split('\0').filter(Boolean).sort();
}

export function scanRepository(workspaceRoot) {
  const findings = [];
  for (const relativePath of repositoryFiles(workspaceRoot)) {
    const absolutePath = path.join(workspaceRoot, relativePath);
    if (!existsSync(absolutePath)) continue;
    const content = readFileSync(absolutePath);
    if (content.includes(0)) continue;
    findings.push(...scanText(relativePath, content.toString('utf8')));
  }
  return findings;
}

export function assessFindings(findings) {
  const expected = findings.filter(
    ({ detector, path: findingPath }) =>
      detector === expectedCanary.detector && findingPath === expectedCanary.path,
  );
  const unexpected = findings.filter(
    ({ detector, path: findingPath }) =>
      detector !== expectedCanary.detector || findingPath !== expectedCanary.path,
  );
  return Object.freeze({
    canaryCount: expected.length,
    unexpected: Object.freeze(unexpected),
  });
}

function main() {
  const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
  const result = assessFindings(scanRepository(workspaceRoot));
  if (result.canaryCount !== 1 || result.unexpected.length > 0) {
    process.stderr.write(
      `Secret scan failed: expected_canary=${result.canaryCount}; unexpected=${result.unexpected.length}.\n`,
    );
    for (const finding of result.unexpected) {
      process.stderr.write(`${finding.path}:${finding.line} ${finding.detector}\n`);
    }
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    'Secret scan passed: one synthetic canary detected; no unexpected findings.\n',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
