import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { inspectArtifactSet, writeArtifactManifest } from './artifacts.mjs';

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
const [outputPath, ...reportPaths] = process.argv.slice(2);

if (!outputPath || reportPaths.length === 0) {
  throw new Error('Usage: prepare-artifacts.mjs <manifest.json> <report.json> [...]');
}

const output = path.resolve(repositoryRoot, outputPath);
const directory = path.dirname(output);
const expectedFiles = reportPaths.map((reportPath) => {
  const resolved = path.resolve(repositoryRoot, reportPath);
  if (path.dirname(resolved) !== directory) {
    throw new Error('Manifest and reports must share one artifact directory.');
  }
  return path.basename(resolved);
});

const result = inspectArtifactSet({ directory, expectedFiles });
if (result.violations.length > 0) {
  process.stderr.write(`Artifact policy failed: ${result.violations.join(', ')}\n`);
  process.exitCode = 1;
} else {
  writeArtifactManifest({
    directory,
    files: result.files,
    outputName: path.basename(output),
    repositoryRoot,
  });
  process.stdout.write(
    `Artifact policy passed: ${result.files.length} JSON report(s), manifest created.\n`,
  );
}
