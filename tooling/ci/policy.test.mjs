import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  evaluateMergeGate,
  infrastructurePolicyViolations,
  workflowPolicyViolations,
} from './policy.mjs';

const fixture = (name) =>
  JSON.parse(readFileSync(new URL(`fixtures/${name}.json`, import.meta.url), 'utf8'));

describe('merge gate policy', () => {
  it('accepts a complete passing report', () => {
    expect(evaluateMergeGate(fixture('passing'), '2026-08-11')).toEqual({
      allowed: true,
      reasons: [],
    });
  });

  it.each([
    ['blocked-test', 'check_not_passed:tests'],
    ['blocked-typecheck', 'check_not_passed:typecheck'],
    ['blocked-migration', 'check_not_passed:migrations'],
    ['blocked-critical', 'unaccepted_critical:CVE-SYNTHETIC-0001'],
  ])('blocks the %s negative fixture', (name, reason) => {
    const result = evaluateMergeGate(fixture(name), '2026-08-11');
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain(reason);
  });

  it('requires a named, reasoned and unexpired exception', () => {
    const report = fixture('blocked-critical');
    report.exceptions = [
      {
        expiresAt: '2026-08-31',
        findingId: 'CVE-SYNTHETIC-0001',
        owner: 'Security',
        reason: 'Synthetic acceptance-path fixture only.',
      },
    ];
    expect(evaluateMergeGate(report, '2026-08-11').allowed).toBe(true);
    expect(evaluateMergeGate(report, '2026-09-01').allowed).toBe(false);
  });
});

describe('workflow policy', () => {
  const workflow = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
  const compose = readFileSync(
    new URL('../../infra/compose/compose.yaml', import.meta.url),
    'utf8',
  );
  const dockerfiles = {
    mailpit: readFileSync(
      new URL('../../infra/compose/mailpit/Dockerfile', import.meta.url),
      'utf8',
    ),
    minio: readFileSync(new URL('../../infra/compose/minio/Dockerfile', import.meta.url), 'utf8'),
  };

  it('accepts the repository workflow', () => {
    expect(workflowPolicyViolations(workflow)).toEqual([]);
    expect(
      infrastructurePolicyViolations({
        composeSource: compose,
        dockerfiles,
        workflowSource: workflow,
      }),
    ).toEqual([]);
  });

  it('rejects mutable actions, write permissions, long retention and non-frozen install', () => {
    const mutable = workflow.replace(
      'actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0',
      'actions/checkout@v7',
    );
    expect(workflowPolicyViolations(mutable)).toContain('action_unpinned:actions/checkout');

    expect(
      workflowPolicyViolations(workflow.replace('contents: read', 'contents: write')),
    ).toContain('permissions_not_read_only');
    expect(
      workflowPolicyViolations(workflow.replaceAll('retention-days: 7', 'retention-days: 30')),
    ).toContain('artifact_retention_invalid');
    expect(
      workflowPolicyViolations(
        workflow.replace(
          "if: always() && steps.artifact-policy.outcome == 'success'",
          'if: always()',
        ),
      ),
    ).toContain('artifact_upload_not_policy_guarded');
    expect(
      workflowPolicyViolations(workflow.replaceAll('fetch-depth: 0', 'fetch-depth: 1')),
    ).toContain('checkout_history_incomplete');
    expect(
      workflowPolicyViolations(workflow.replaceAll('--frozen-lockfile', '--no-frozen-lockfile')),
    ).toContain('required_step_missing:corepack pnpm install --frozen-lockfile');
    expect(
      workflowPolicyViolations(workflow.replaceAll('corepack enable', 'corepack disable')),
    ).toContain('package_manager_shim_not_enabled');
  });

  it('rejects unpinned or unscanned infrastructure images', () => {
    const unpinnedCompose = compose.replace(
      /postgres:18\.4-alpine3\.23@sha256:[a-f0-9]{64}/u,
      'postgres:18.4-alpine3.23',
    );
    expect(
      infrastructurePolicyViolations({
        composeSource: unpinnedCompose,
        dockerfiles,
        workflowSource: workflow,
      }),
    ).toContain('compose_image_unpinned:postgres:18.4-alpine3.23');

    const unpinnedDockerfile = {
      ...dockerfiles,
      mailpit: dockerfiles.mailpit.replace(
        /axllent\/mailpit:v1\.30\.7@sha256:[a-f0-9]{64}/u,
        'axllent/mailpit:v1.30.7',
      ),
    };
    expect(
      infrastructurePolicyViolations({
        composeSource: compose,
        dockerfiles: unpinnedDockerfile,
        workflowSource: workflow,
      }),
    ).toContain('dockerfile_base_unpinned:mailpit:axllent/mailpit:v1.30.7');
  });

  it('rejects a silently widened container baseline', () => {
    const widened = workflow.replace(
      /(id: mailpit-upstream[\s\S]*?policy:) blocking/u,
      '$1 baseline',
    );
    expect(workflowPolicyViolations(widened)).toContain('container_baseline_scope_changed');
  });
});
