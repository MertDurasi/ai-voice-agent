import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const composeFile = path.join(repositoryRoot, 'infra/compose/compose.yaml');
const environmentFile = path.join(repositoryRoot, 'infra/compose/.env.example');
const dockerConfigDirectory = path.join(repositoryRoot, 'infra/compose/docker-anonymous');

export function loadLocalEnvironment() {
  const values = {};

  for (const rawLine of readFileSync(environmentFile, 'utf8').split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator < 1) throw new Error(`Invalid environment line: ${rawLine}`);
    values[line.slice(0, separator)] = line.slice(separator + 1);
  }

  return values;
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: options.capture === false ? 'inherit' : 'pipe',
    input: options.input,
    env: options.env ?? process.env,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status})${details ? `:\n${details}` : ''}`,
    );
  }

  return (result.stdout ?? '').trim();
}

export function compose(args, options = {}) {
  return run(
    'docker',
    [
      '--config',
      dockerConfigDirectory,
      'compose',
      '--env-file',
      environmentFile,
      '-f',
      composeFile,
      ...args,
    ],
    options,
  );
}
