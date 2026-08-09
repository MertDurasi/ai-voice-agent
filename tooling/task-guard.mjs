import process from 'node:process';

const [task = 'future task', command = 'command'] = process.argv.slice(2);

console.error(`${command} is intentionally unavailable until ${task} is implemented.`);
process.exitCode = 1;
