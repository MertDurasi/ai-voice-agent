import { compose, loadLocalEnvironment } from './lib/local-infra.mjs';

const marker = 'f002-persistence-v1';
const subject = `F-002 synthetic persistence ${Date.now()}`;
const environment = loadLocalEnvironment();

compose([
  'exec',
  '-T',
  'postgres',
  'psql',
  '-v',
  'ON_ERROR_STOP=1',
  '-U',
  environment.POSTGRES_USER,
  '-d',
  environment.POSTGRES_DB,
  '-c',
  `CREATE TABLE IF NOT EXISTS f002_persistence_probe (id text PRIMARY KEY); INSERT INTO f002_persistence_probe(id) VALUES ('${marker}') ON CONFLICT DO NOTHING;`,
]);
compose([
  'exec',
  '-T',
  'redis',
  'sh',
  '-ec',
  `REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli SET f002:persistence ${marker}`,
]);
compose([
  'run',
  '--rm',
  '--no-deps',
  'minio-client',
  'mb',
  '--ignore-existing',
  'local/f002-probe',
]);
compose(['run', '--rm', '--no-deps', 'minio-client', 'pipe', 'local/f002-probe/persistence.txt'], {
  input: marker,
});
compose(
  [
    'exec',
    '-T',
    'mailpit',
    'mailpit',
    'sendmail',
    '-S',
    '127.0.0.1:1025',
    '-f',
    'synthetic-sender@invalid.example',
    'synthetic-recipient@invalid.example',
  ],
  {
    input: `From: synthetic-sender@invalid.example\r\nTo: synthetic-recipient@invalid.example\r\nSubject: ${subject}\r\nMessage-ID: <f002-${Date.now()}@invalid.example>\r\n\r\nSynthetic F-002 persistence probe.\r\n`,
  },
);

compose(['restart', 'postgres', 'redis', 'keycloak', 'minio', 'mailpit'], { capture: false });
compose(['up', '--detach', '--wait', '--wait-timeout', '300'], { capture: false });

const postgresMarker = compose([
  'exec',
  '-T',
  'postgres',
  'psql',
  '-At',
  '-U',
  environment.POSTGRES_USER,
  '-d',
  environment.POSTGRES_DB,
  '-c',
  `SELECT id FROM f002_persistence_probe WHERE id = '${marker}';`,
]);
if (postgresMarker !== marker) throw new Error('PostgreSQL persistence marker is missing');

const redisMarker = compose([
  'exec',
  '-T',
  'redis',
  'sh',
  '-ec',
  'REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli --raw GET f002:persistence',
]);
if (redisMarker !== marker) throw new Error('Redis persistence marker is missing');

const objectMarker = compose([
  'run',
  '--rm',
  '--no-deps',
  'minio-client',
  'cat',
  'local/f002-probe/persistence.txt',
]);
if (objectMarker !== marker) throw new Error('MinIO persistence marker is missing');

const mailbox = JSON.parse(
  compose([
    'run',
    '--rm',
    '--no-deps',
    'health-client',
    'wget',
    '--quiet',
    '--output-document=-',
    'http://mailpit:8025/api/v1/messages',
  ]),
);
const messages = Array.isArray(mailbox.messages) ? mailbox.messages : mailbox.Messages;
if (!Array.isArray(messages) || !messages.some((message) => message.Subject === subject)) {
  throw new Error('Synthetic Mailpit message did not survive restart');
}

console.log('F-002 persistence and synthetic mail smoke test: OK');
