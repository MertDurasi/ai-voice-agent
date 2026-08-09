import { compose } from './lib/local-infra.mjs';

const argumentsToCompose = process.argv.slice(2);

if (argumentsToCompose.length === 0) {
  throw new Error('A Docker Compose command is required');
}

compose(argumentsToCompose, { capture: false });
