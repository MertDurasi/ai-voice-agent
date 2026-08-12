const allowedActions = Object.freeze({
  'actions/checkout': '9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0',
  'actions/setup-node': '48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e',
  'actions/upload-artifact': '043fb46d1a93c77aae656e7c1c64a875d1fc6a0a',
  'aquasecurity/trivy-action': 'ed142fd0673e97e23eac54620cfb913e5ce36c25',
});

export const requiredGateChecks = Object.freeze([
  'tests',
  'typecheck',
  'migrations',
  'dependencies',
  'containers',
  'secret-scan',
  'sbom',
]);

const requiredWorkflowFragments = Object.freeze([
  'corepack pnpm install --frozen-lockfile',
  'corepack pnpm format:check',
  'corepack pnpm lint',
  'corepack pnpm typecheck',
  'corepack pnpm test',
  'corepack pnpm test:integration',
  'corepack pnpm test:e2e',
  'corepack pnpm build',
  'corepack pnpm ci:policy',
  'corepack pnpm secret:scan',
  'corepack pnpm audit --audit-level=high',
  'corepack pnpm sbom --sbom-format cyclonedx',
  '--sbom-spec-version 1.7',
  'corepack pnpm compose:health',
  'corepack pnpm compose:verify',
  'node tooling/ci/prepare-artifacts.mjs',
  '--profile tools config --quiet',
  'image-ref: voice-ai-agent/minio-local:RELEASE.2025-10-15T17-29-55Z',
  'image-ref: voice-ai-agent/mailpit-local:v1.30.0',
  "scan-type: 'image'",
  'scanners: vuln,misconfig,secret',
  'severity: HIGH,CRITICAL',
  'needs: [quality, supply-chain, container-scan, infrastructure]',
]);

function unique(values) {
  return [...new Set(values)];
}

export function workflowPolicyViolations(source) {
  const violations = [];
  const add = (code) => violations.push(code);

  if (source.includes('pull_request_target:')) add('unsafe_pull_request_target');
  if (!/^permissions:\n {2}contents: read$/mu.test(source)) add('permissions_not_read_only');
  if (
    /^\s+(?:contents|actions|checks|deployments|id-token|packages|security-events):\s*write\s*$/gmu.test(
      source,
    )
  ) {
    add('write_permission_present');
  }
  if (/\bsecrets\.[A-Za-z0-9_]+/u.test(source)) add('repository_secret_reference');
  if (
    /\b(?:docker\s+push|npm\s+publish|pnpm\s+publish|terraform\s+apply|kubectl\s+apply)\b/iu.test(
      source,
    )
  ) {
    add('deployment_or_publish_command');
  }

  const uses = [...source.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gmu)].map(
    (match) => match[1],
  );
  if (uses.length === 0) add('no_actions_declared');
  for (const value of uses) {
    const separator = value.lastIndexOf('@');
    const action = separator > 0 ? value.slice(0, separator) : value;
    const reference = separator > 0 ? value.slice(separator + 1) : '';
    if (!/^[a-f0-9]{40}$/u.test(reference)) add(`action_unpinned:${action}`);
    if (!(action in allowedActions)) add(`action_not_allowlisted:${action}`);
    else if (allowedActions[action] !== reference) add(`action_sha_mismatch:${action}`);
  }

  const checkoutCount = uses.filter((value) => value.startsWith('actions/checkout@')).length;
  const credentialDisableCount = (source.match(/persist-credentials:\s*false/gu) ?? []).length;
  const fullHistoryCount = (source.match(/fetch-depth:\s*0/gu) ?? []).length;
  if (checkoutCount !== credentialDisableCount) add('checkout_credentials_not_disabled');
  if (checkoutCount !== fullHistoryCount) add('checkout_history_incomplete');

  const setupNodeCount = uses.filter((value) => value.startsWith('actions/setup-node@')).length;
  const versionFileCount = (source.match(/node-version-file:\s*\.node-version/gu) ?? []).length;
  const cacheDisableCount = (source.match(/package-manager-cache:\s*false/gu) ?? []).length;
  if (setupNodeCount !== versionFileCount || setupNodeCount !== cacheDisableCount) {
    add('node_setup_not_exact_or_cache_implicit');
  }

  const uploadCount = uses.filter((value) => value.startsWith('actions/upload-artifact@')).length;
  const retentionValues = [...source.matchAll(/retention-days:\s*(\d+)/gu)].map((match) =>
    Number(match[1]),
  );
  if (uploadCount !== retentionValues.length || retentionValues.some((days) => days > 7)) {
    add('artifact_retention_invalid');
  }
  const noFilesErrorCount = (source.match(/if-no-files-found:\s*error/gu) ?? []).length;
  if (uploadCount !== noFilesErrorCount) add('artifact_missing_file_not_blocking');
  const hiddenFileDisableCount = (source.match(/include-hidden-files:\s*false/gu) ?? []).length;
  if (uploadCount !== hiddenFileDisableCount) add('artifact_hidden_files_allowed');
  const guardedUploadCount = (
    source.match(/if:\s*always\(\)\s*&&\s*steps\.artifact-policy\.outcome\s*==\s*'success'/gu) ?? []
  ).length;
  if (uploadCount !== guardedUploadCount) add('artifact_upload_not_policy_guarded');
  if (/^\s*path:\s*['"]?artifacts(?:\/\*\*|\/?)['"]?\s*$/gmu.test(source)) {
    add('artifact_directory_uploaded_broadly');
  }

  for (const fragment of requiredWorkflowFragments) {
    if (!source.includes(fragment)) add(`required_step_missing:${fragment}`);
  }

  const imageValues = [...source.matchAll(/^\s+image:\s*'([^']+)'\s*$/gmu)].map(
    (match) => match[1],
  );
  if (
    imageValues.length === 0 ||
    imageValues.some((image) => !/@sha256:[a-f0-9]{64}$/u.test(image))
  ) {
    add('container_image_not_digest_pinned');
  }

  return unique(violations);
}

function imageReferences(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1].replace(/^['"]|['"]$/gu, ''));
}

export function infrastructurePolicyViolations({ composeSource, dockerfiles, workflowSource }) {
  const violations = [];
  const add = (code) => violations.push(code);
  const composeImages = imageReferences(composeSource, /^\s+image:\s*([^\s#]+)\s*$/gmu);
  const dockerfileImages = Object.entries(dockerfiles).flatMap(([name, source]) =>
    imageReferences(source, /^FROM\s+([^\s]+)(?:\s+AS\s+[^\s]+)?\s*$/gimu).map((image) => ({
      image,
      name,
    })),
  );

  if (composeImages.length === 0) add('compose_images_missing');
  for (const image of composeImages) {
    if (image.startsWith('voice-ai-agent/')) {
      if (!workflowSource.includes(`image-ref: ${image}`)) add(`local_image_not_scanned:${image}`);
      continue;
    }
    if (!/@sha256:[a-f0-9]{64}$/u.test(image)) add(`compose_image_unpinned:${image}`);
    if (!workflowSource.includes(`image: '${image}'`)) add(`compose_image_not_scanned:${image}`);
  }

  for (const { image, name } of dockerfileImages) {
    if (!/@sha256:[a-f0-9]{64}$/u.test(image)) add(`dockerfile_base_unpinned:${name}:${image}`);
    if (!workflowSource.includes(`image: '${image}'`))
      add(`dockerfile_base_not_scanned:${name}:${image}`);
  }

  if (!composeSource.includes('profiles: [tools]')) add('compose_tools_profile_missing');
  if (/^\s+ports:\s*$/gmu.test(composeSource)) add('compose_host_port_present');

  return unique(violations);
}

function validException(exception, findingId, today) {
  if (!exception || exception.findingId !== findingId) return false;
  if (typeof exception.owner !== 'string' || exception.owner.trim().length < 2) return false;
  if (typeof exception.reason !== 'string' || exception.reason.trim().length < 10) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(exception.expiresAt ?? '')) return false;
  return exception.expiresAt >= today;
}

export function evaluateMergeGate(report, today = new Date().toISOString().slice(0, 10)) {
  const reasons = [];
  const checks = new Map((report.checks ?? []).map((check) => [check.id, check.status]));

  for (const check of requiredGateChecks) {
    if (checks.get(check) !== 'passed') reasons.push(`check_not_passed:${check}`);
  }

  for (const finding of report.findings ?? []) {
    const severity = String(finding.severity ?? '').toLowerCase();
    if (!['high', 'critical'].includes(severity)) continue;
    const accepted = (report.exceptions ?? []).some((exception) =>
      validException(exception, finding.id, today),
    );
    if (!accepted) reasons.push(`unaccepted_${severity}:${finding.id}`);
  }

  return Object.freeze({ allowed: reasons.length === 0, reasons: Object.freeze(reasons) });
}
