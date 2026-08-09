import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { formatStartupError, loadWebConfig } from '@voice-ai/config';

const allowedCommands = new Set(['dev', 'start']);
const command = process.argv[2];

if (!allowedCommands.has(command)) {
  process.stderr.write('Web startup failed (unsupported_command).\n');
  process.exitCode = 1;
} else {
  try {
    loadWebConfig(process.env);
    const require = createRequire(import.meta.url);
    const nextCli = require.resolve('next/dist/bin/next');
    const child = spawn(process.execPath, [nextCli, command, ...process.argv.slice(3)], {
      env: process.env,
      stdio: 'inherit',
    });

    child.once('error', () => {
      process.stderr.write('Web startup failed (spawn_error).\n');
      process.exitCode = 1;
    });
    child.once('exit', (code) => {
      process.exitCode = code ?? 1;
    });
  } catch (error) {
    process.stderr.write(`${formatStartupError(error)}\n`);
    process.exitCode = 1;
  }
}
