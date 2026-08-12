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
const secretName = '[A-Z0-9_]*(?:API_KEY|PASSWORD|PRIVATE_KEY|SECRET|TOKEN)[A-Z0-9_]*';
const environmentAssignments = Object.freeze([
  new RegExp(`^\\s*(?:export\\s+)?${secretName}\\s*=\\s*(\\S.*)\\s*$`, 'gmu'),
  new RegExp(`^\\s*(?:-\\s*)?(?:["'])?${secretName}(?:["'])?\\s*:\\s*(\\S.*)\\s*$`, 'gmu'),
]);
const safePlaceholder =
  /^(?:local-only|replace-with|synthetic-secret-canary|test-only)(?:[-_][a-z0-9][a-z0-9._-]*)?$/iu;
const environmentIndirection = /^\$\{[A-Z][A-Z0-9_]*(?::[-?+][^}]*)?\}$/u;

function lineForOffset(content, offset) {
  return content.slice(0, offset).split('\n').length;
}

function normalizeAssignedValue(value) {
  const trimmed = value.trim();
  const quoted = /^(?:"([\s\S]*)"|'([\s\S]*)')$/u.exec(trimmed);
  return (quoted?.[1] ?? quoted?.[2] ?? trimmed).trim();
}

function isSafeAssignedValue(value) {
  const normalized = normalizeAssignedValue(value);
  return (
    normalized === '' ||
    normalized === 'null' ||
    normalized === '~' ||
    safePlaceholder.test(normalized) ||
    environmentIndirection.test(normalized)
  );
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
    for (const assignment of environmentAssignments) {
      for (const match of content.matchAll(assignment)) {
        const line = lineForOffset(content, match.index ?? 0);
        const isCanary = findings.some(
          (finding) => finding.detector === 'synthetic_canary' && finding.line === line,
        );
        if (!isCanary && !isSafeAssignedValue(match[1] ?? '')) {
          findings.push({
            detector: 'assigned_secret',
            line,
            path: filePath,
          });
        }
      }
    }
  }

  return findings;
}

function uniqueFindings(findings) {
  const seen = new Set();
  return findings.filter((finding) => {
    const key = `${finding.path}:${finding.line}:${finding.detector}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function scanBuffer(filePath, buffer) {
  const utf8 = buffer.toString('utf8');
  const views = utf8.includes('\0') ? [utf8, utf8.replaceAll('\0', '')] : [utf8];
  return uniqueFindings(views.flatMap((content) => scanText(filePath, content)));
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
    findings.push(...scanBuffer(relativePath, content));
  }
  return findings;
}

function historyObjects(workspaceRoot) {
  const records = execFileSync('git', ['rev-list', '--objects', '--all'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(' ');
      return separator > 0
        ? { objectId: line.slice(0, separator), path: line.slice(separator + 1) }
        : { objectId: line, path: '' };
    });
  const objectIds = [...new Set(records.map(({ objectId }) => objectId))];
  const types = new Map(
    execFileSync('git', ['cat-file', '--batch-check=%(objectname) %(objecttype)'], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      input: `${objectIds.join('\n')}\n`,
    })
      .trim()
      .split('\n')
      .map((line) => line.split(' ')),
  );
  return records.filter(
    ({ objectId, path: objectPath }) => objectPath && types.get(objectId) === 'blob',
  );
}

export function scanGitHistory(workspaceRoot) {
  const findings = [];
  const scanned = new Set();

  for (const { objectId, path: objectPath } of historyObjects(workspaceRoot)) {
    const key = `${objectId}:${objectPath}`;
    if (scanned.has(key)) continue;
    scanned.add(key);
    const buffer = execFileSync('git', ['cat-file', 'blob', objectId], {
      cwd: workspaceRoot,
      encoding: null,
      maxBuffer: 25 * 1024 * 1024,
    });
    findings.push(...scanBuffer(objectPath, buffer));
  }

  return uniqueFindings(findings);
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
  const historyUnexpected = scanGitHistory(workspaceRoot).filter(
    ({ detector, path: findingPath }) =>
      detector !== expectedCanary.detector || findingPath !== expectedCanary.path,
  );
  if (result.canaryCount !== 1 || result.unexpected.length > 0 || historyUnexpected.length > 0) {
    process.stderr.write(
      `Secret scan failed: expected_canary=${result.canaryCount}; unexpected=${result.unexpected.length}; history_unexpected=${historyUnexpected.length}.\n`,
    );
    for (const finding of [...result.unexpected, ...historyUnexpected]) {
      process.stderr.write(`${finding.path}:${finding.line} ${finding.detector}\n`);
    }
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    'Secret scan passed: one synthetic canary detected; working tree and Git history have no unexpected findings.\n',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
