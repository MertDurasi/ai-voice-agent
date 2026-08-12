import { readFileSync } from 'node:fs';

import { infrastructurePolicyViolations, workflowPolicyViolations } from './policy.mjs';

const workflowUrl = new URL('../../.github/workflows/ci.yml', import.meta.url);
const workflowSource = readFileSync(workflowUrl, 'utf8');
const violations = [
  ...workflowPolicyViolations(workflowSource),
  ...infrastructurePolicyViolations({
    composeSource: readFileSync(
      new URL('../../infra/compose/compose.yaml', import.meta.url),
      'utf8',
    ),
    dockerfiles: {
      mailpit: readFileSync(
        new URL('../../infra/compose/mailpit/Dockerfile', import.meta.url),
        'utf8',
      ),
      minio: readFileSync(new URL('../../infra/compose/minio/Dockerfile', import.meta.url), 'utf8'),
    },
    workflowSource,
  }),
];

if (violations.length > 0) {
  process.stderr.write(`CI workflow policy failed: ${violations.join(', ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    'CI workflow policy passed: pinned, read-only, complete and non-deploying.\n',
  );
}
