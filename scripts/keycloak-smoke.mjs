import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

import {
  AuthenticationError,
  OidcClient,
  createRemoteAccessTokenVerifier,
  openAuthSession,
} from '../packages/auth/dist/index.js';
import { compose, loadLocalEnvironment } from './lib/local-infra.mjs';

const realm = 'voice-ai-local';
const webOrigin = 'http://127.0.0.1:3100';
const apiOrigin = 'http://127.0.0.1:3101';
const issuer = 'http://127.0.0.1:8080/realms/voice-ai-local';
const webSessionCookie = 'voice-ai-session-local';
const localEnvironment = loadLocalEnvironment();
const clientId = 'voice-ai-api-local';
const clientSecret = localEnvironment.OIDC_CLIENT_SECRET;
const sessionSecret = 'synthetic-oidc-smoke-session-key-material';

if (clientSecret === undefined) throw new Error('Missing local OIDC client credential.');

function keycloak(args, options = {}) {
  return compose(['exec', '-T', 'keycloak', '/opt/keycloak/bin/kcadm.sh', ...args], options);
}

function configureAdmin() {
  compose([
    'exec',
    '-T',
    'keycloak',
    'sh',
    '-c',
    '/opt/keycloak/bin/kcadm.sh config credentials --server http://127.0.0.1:8080 --realm master --user "$KC_BOOTSTRAP_ADMIN_USERNAME" --password "$KC_BOOTSTRAP_ADMIN_PASSWORD" >/dev/null',
  ]);
}

function createSyntheticUser(role) {
  const username = `synthetic-${role}-${randomBytes(8).toString('hex')}`;
  const password = randomBytes(32).toString('base64url');
  const id = keycloak([
    'create',
    'users',
    '-r',
    realm,
    '-s',
    `username=${username}`,
    '-s',
    'enabled=true',
    '-s',
    'emailVerified=true',
    '-i',
  ]);
  keycloak(['update', `users/${id}/reset-password`, '-r', realm, '-f', '-'], {
    input: JSON.stringify({ temporary: false, type: 'password', value: password }),
  });
  keycloak(['add-roles', '-r', realm, '--uid', id, '--rolename', role]);
  return { id, password, username };
}

function deleteSyntheticUser(id) {
  keycloak(['delete', `users/${id}`, '-r', realm]);
}

function decodeHtmlAttribute(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function loginFormAction(html) {
  const form = html.match(/<form[^>]+id="kc-form-login"[^>]+action="([^"]+)"/iu);
  if (form?.[1] === undefined) throw new Error('Identity login form was not returned.');
  return decodeHtmlAttribute(form[1]);
}

class CookieJar {
  #cookies = new Map();

  value(name) {
    return this.#cookies.get(name);
  }

  async fetch(input, init = {}) {
    const headers = new Headers(init.headers);
    if (this.#cookies.size > 0) {
      headers.set(
        'cookie',
        [...this.#cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; '),
      );
    }
    const response = await fetch(input, { ...init, headers, redirect: 'manual' });
    for (const setCookie of response.headers.getSetCookie()) {
      const [pair = '', ...attributes] = setCookie.split(';');
      const separator = pair.indexOf('=');
      if (separator < 1) continue;
      const name = pair.slice(0, separator);
      const value = pair.slice(separator + 1);
      const deleted =
        value.length === 0 || attributes.some((attribute) => /^\s*max-age=0\s*$/iu.test(attribute));
      if (deleted) this.#cookies.delete(name);
      else this.#cookies.set(name, value);
    }
    return response;
  }
}

async function waitForRuntime(processState, endpoint, name) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (processState.child.exitCode !== null) {
      throw new Error(`${name} runtime stopped before identity smoke (${processState.stderr()}).`);
    }
    try {
      const response = await fetch(endpoint);
      if (response.ok) return;
    } catch {
      // Runtime is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for the local ${name} runtime.`);
}

function startRuntime(entry, args, environment) {
  const child = spawn(process.execPath, [entry, ...args], {
    env: {
      ...process.env,
      ...environment,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr = `${stderr}${chunk.toString()}`.slice(-2_000);
  });
  child.stdout.resume();
  return { child, stderr: () => stderr };
}

function startWeb() {
  return startRuntime('apps/web/scripts/run-next.mjs', ['start', '-H', '127.0.0.1', '-p', '3100'], {
    APP_ENV: 'test',
    NEXT_PUBLIC_API_BASE_URL: apiOrigin,
    NODE_ENV: 'production',
    OIDC_CLIENT_ID: clientId,
    OIDC_CLIENT_SECRET: clientSecret,
    OIDC_ISSUER_URL: issuer,
    SESSION_SECRET: sessionSecret,
    WEB_ORIGIN: webOrigin,
  });
}

function startApi() {
  return startRuntime('apps/api/dist/main.js', [], {
    API_HOST: '127.0.0.1',
    API_LOG_LEVEL: 'error',
    API_PORT: '3101',
    APP_ENV: 'test',
    DATABASE_URL: 'postgresql://synthetic:synthetic@127.0.0.1:9/synthetic',
    DEPENDENCY_PROBE_TIMEOUT_MS: '100',
    NODE_ENV: 'test',
    OIDC_CLIENT_ID: clientId,
    OIDC_ISSUER_URL: issuer,
    REDIS_URL: 'redis://:synthetic@127.0.0.1:9',
  });
}

async function stopRuntime(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Local web runtime did not stop.'));
    }, 5_000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
    child.kill('SIGTERM');
  });
}

async function beginBrowserLogin(jar) {
  const login = await jar.fetch(`${webOrigin}/auth/login?returnTo=%2F`);
  if (login.status !== 303) throw new Error(`Unexpected web login status ${login.status}.`);
  const authorizationLocation = login.headers.get('location');
  if (authorizationLocation === null || !authorizationLocation.startsWith(`${issuer}/protocol/`)) {
    throw new Error('Web login did not redirect to the configured issuer.');
  }
  const authorization = new URL(authorizationLocation);
  if (authorization.searchParams.get('code_challenge_method') !== 'S256') {
    throw new Error('OIDC authorization did not enforce PKCE S256.');
  }
  if (authorization.searchParams.get('nonce') === null) {
    throw new Error('OIDC authorization did not bind a nonce.');
  }
  const identityLogin = await jar.fetch(authorization);
  if (identityLogin.status !== 200) {
    throw new Error(`Unexpected identity login status ${identityLogin.status}.`);
  }
  return loginFormAction(await identityLogin.text());
}

async function submitCredentials(jar, action, user) {
  return jar.fetch(action, {
    body: new URLSearchParams({ password: user.password, username: user.username }),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  });
}

async function followIdentityRedirects(jar, response) {
  let current = response;
  for (let step = 0; step < 5; step += 1) {
    const location = current.headers.get('location');
    if (location === null) return current;
    const destination = new URL(location, issuer);
    if (
      destination.origin === new URL(webOrigin).origin &&
      destination.pathname === '/auth/callback'
    ) {
      return current;
    }
    current = await jar.fetch(destination);
  }
  throw new Error('Identity flow exceeded the redirect limit.');
}

async function verifyStandardLogin(user, client, accessVerifier) {
  const jar = new CookieJar();
  const action = await beginBrowserLogin(jar);
  const identityResponse = await followIdentityRedirects(
    jar,
    await submitCredentials(jar, action, user),
  );
  const callbackLocation = identityResponse.headers.get('location');
  if (callbackLocation === null) throw new Error('Identity login did not return an OIDC code.');
  const callback = new URL(callbackLocation);
  if (callback.origin !== new URL(webOrigin).origin || callback.pathname !== '/auth/callback') {
    throw new Error('Identity login returned to an unexpected callback.');
  }
  if (callback.searchParams.get('code') === null || callback.searchParams.get('state') === null) {
    throw new Error('Identity callback omitted code or state.');
  }

  const completed = await jar.fetch(callback);
  if (completed.status !== 303 || completed.headers.get('location') !== `${webOrigin}/`) {
    throw new Error('Web callback did not complete the local session.');
  }
  const sealedBeforeRefresh = jar.value(webSessionCookie);
  if (sealedBeforeRefresh === undefined) throw new Error('Web session cookie was not created.');
  if (sealedBeforeRefresh.length > 3_800)
    throw new Error('Encrypted web session exceeds cookie budget.');
  const beforeRefresh = await openAuthSession(sealedBeforeRefresh, sessionSecret);
  const principal = await accessVerifier.verify(beforeRefresh.accessToken);
  if (principal.subject !== beforeRefresh.subject || !principal.roles.includes('agent')) {
    throw new Error('Web session did not contain the expected validated principal.');
  }
  if (principal.tenantContext !== null) throw new Error('Token input created a tenant context.');
  const apiIdentity = await fetch(`${apiOrigin}/api/v1/identity/me`, {
    headers: { authorization: `Bearer ${beforeRefresh.accessToken}` },
  });
  if (apiIdentity.status !== 200) {
    throw new Error(`API rejected the valid local access token (${apiIdentity.status}).`);
  }
  const identity = await apiIdentity.json();
  if (
    identity.subject !== beforeRefresh.subject ||
    identity.tenantContext !== null ||
    !Array.isArray(identity.roles) ||
    !identity.roles.includes('agent')
  ) {
    throw new Error('API identity contract did not preserve the tenant trust boundary.');
  }

  const refreshed = await jar.fetch(`${webOrigin}/auth/refresh`, {
    headers: { origin: webOrigin },
    method: 'POST',
  });
  if (refreshed.status !== 204) throw new Error(`Unexpected refresh status ${refreshed.status}.`);
  const sealedAfterRefresh = jar.value(webSessionCookie);
  if (sealedAfterRefresh === undefined || sealedAfterRefresh === sealedBeforeRefresh) {
    throw new Error('Refresh did not rotate the encrypted web session.');
  }
  const afterRefresh = await openAuthSession(sealedAfterRefresh, sessionSecret);
  if (afterRefresh.subject !== beforeRefresh.subject)
    throw new Error('Refresh changed the subject.');

  const loggedOut = await jar.fetch(`${webOrigin}/auth/logout`, {
    headers: { origin: webOrigin },
    method: 'POST',
  });
  if (loggedOut.status !== 303 || jar.value(webSessionCookie) !== undefined) {
    throw new Error('Logout did not remove the local web session.');
  }
  try {
    await client.refresh(afterRefresh.refreshToken);
    throw new Error('Logout left the refresh token active.');
  } catch (error) {
    if (!(error instanceof AuthenticationError)) throw error;
  }
}

async function verifyPrivilegedMfa(user) {
  const jar = new CookieJar();
  const action = await beginBrowserLogin(jar);
  const response = await followIdentityRedirects(jar, await submitCredentials(jar, action, user));
  const location = response.headers.get('location') ?? '';
  const html = response.status === 200 ? await response.text() : '';
  if (!/required-action|CONFIGURE_TOTP/iu.test(location) && !/totp|authenticator/iu.test(html)) {
    throw new Error('Privileged role reached the callback without mandatory TOTP setup.');
  }
}

configureAdmin();
const web = startWeb();
const api = startApi();
const createdUsers = [];
let cleanupError;

try {
  await Promise.all([
    waitForRuntime(web, webOrigin, 'web'),
    waitForRuntime(api, `${apiOrigin}/health/live`, 'api'),
  ]);
  const agent = createSyntheticUser('agent');
  createdUsers.push(agent.id);
  const owner = createSyntheticUser('tenant_owner');
  createdUsers.push(owner.id);
  const client = new OidcClient({ clientId, clientSecret, issuer });
  const accessVerifier = createRemoteAccessTokenVerifier({ audience: clientId, issuer });

  await verifyStandardLogin(agent, client, accessVerifier);
  await verifyPrivilegedMfa(owner);
} finally {
  for (const id of createdUsers.reverse()) {
    try {
      deleteSyntheticUser(id);
    } catch (error) {
      cleanupError ??= error;
    }
  }
  try {
    await Promise.all([stopRuntime(web.child), stopRuntime(api.child)]);
  } catch (error) {
    cleanupError ??= error;
  }
}

if (cleanupError !== undefined) throw cleanupError;

process.stdout.write('Local OIDC login, refresh, logout, MFA and tenant-boundary smoke passed.\n');
