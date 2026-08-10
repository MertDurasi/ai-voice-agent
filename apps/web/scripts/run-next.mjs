import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { formatStartupError, loadWebConfig } from '@voice-ai/config';

const allowedCommands = new Set(['dev', 'start']);
const command = process.argv[2];
const webRoot = fileURLToPath(new URL('..', import.meta.url));

if (!allowedCommands.has(command)) {
  process.stderr.write('Web startup failed (unsupported_command).\n');
  process.exitCode = 1;
} else {
  try {
    loadWebConfig(process.env);
    const require = createRequire(import.meta.url);
    const nextCli = require.resolve('next/dist/bin/next');
    const child = spawn(process.execPath, [nextCli, command, ...process.argv.slice(3)], {
      cwd: webRoot,
      env: process.env,
      stdio: 'inherit',
    });
    let shutdownForwarded = false;
    const forwardSignal = (signal) => {
      shutdownForwarded = true;
      if (!child.killed) child.kill(signal);
    };
    const forwardSigint = () => forwardSignal('SIGINT');
    const forwardSigterm = () => forwardSignal('SIGTERM');
    process.once('SIGINT', forwardSigint);
    process.once('SIGTERM', forwardSigterm);

    child.once('error', () => {
      process.stderr.write('Web startup failed (spawn_error).\n');
      process.exitCode = 1;
    });
    child.once('exit', (code, signal) => {
      process.removeListener('SIGINT', forwardSigint);
      process.removeListener('SIGTERM', forwardSigterm);
      const expectedSignalExit =
        shutdownForwarded &&
        (code === null ||
          code === 130 ||
          code === 143 ||
          signal === 'SIGINT' ||
          signal === 'SIGTERM');
      process.exitCode = expectedSignalExit ? 0 : (code ?? 1);
    });
  } catch (error) {
    process.stderr.write(`${formatStartupError(error)}\n`);
    process.exitCode = 1;
  }
}
