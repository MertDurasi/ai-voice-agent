import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const realm = JSON.parse(
  readFileSync(
    new URL('../../infra/compose/keycloak/voice-ai-local-realm.json', import.meta.url),
    'utf8',
  ),
);

function realmRole(name) {
  return realm.roles.realm.find((role) => role.name === name);
}

describe('local synthetic Keycloak realm contract', () => {
  it('contains no users and exposes only the confidential PKCE browser client', () => {
    expect(realm.users).toEqual([]);
    expect(realm.registrationAllowed).toBe(false);
    expect(realm.clients).toHaveLength(1);

    const [client] = realm.clients;
    expect(client).toMatchObject({
      clientAuthenticatorType: 'client-secret',
      clientId: 'voice-ai-api-local',
      directAccessGrantsEnabled: false,
      implicitFlowEnabled: false,
      publicClient: false,
      redirectUris: ['http://127.0.0.1:3000/auth/callback', 'http://127.0.0.1:3100/auth/callback'],
      secret: '${OIDC_CLIENT_SECRET}',
      serviceAccountsEnabled: false,
      standardFlowEnabled: true,
      webOrigins: [],
    });
    expect(client.attributes['pkce.code.challenge.method']).toBe('S256');
  });

  it('maps only application roles and the API audience, never a tenant claim', () => {
    const [client] = realm.clients;
    const mapperTypes = client.protocolMappers.map((mapper) => mapper.protocolMapper);

    expect(mapperTypes).toEqual([
      'oidc-audience-mapper',
      'oidc-usermodel-realm-role-mapper',
      'oidc-amr-mapper',
    ]);
    expect(JSON.stringify(client.protocolMappers)).not.toMatch(/tenant(?:Id|_id)?/iu);
    expect(
      client.protocolMappers.find((mapper) => mapper.name === 'voice-ai-api-audience').config,
    ).toMatchObject({
      'access.token.claim': 'true',
      'included.client.audience': 'voice-ai-api-local',
    });
  });

  it('forces TOTP for every privileged role while keeping agent and viewer unprivileged', () => {
    expect(realmRole('agent')).toEqual({ name: 'agent' });
    expect(realmRole('viewer')).toEqual({ name: 'viewer' });

    for (const role of ['support_admin', 'tenant_admin', 'tenant_owner']) {
      expect(realmRole(role)).toMatchObject({
        composite: true,
        composites: { realm: ['mfa_required'] },
        name: role,
      });
    }

    const browserForms = realm.authenticationFlows.find(
      (flow) => flow.alias === 'voice-ai-browser-forms',
    );
    expect(realm.browserFlow).toBe('voice-ai-browser');
    expect(browserForms.authenticationExecutions).toEqual([
      expect.objectContaining({
        authenticator: 'auth-username-password-form',
        requirement: 'REQUIRED',
      }),
      expect.objectContaining({
        authenticator: 'auth-conditional-otp-form',
        authenticatorConfig: 'voice-ai-privileged-mfa',
        requirement: 'REQUIRED',
      }),
    ]);
    expect(realm.authenticatorConfig).toContainEqual({
      alias: 'voice-ai-privileged-mfa',
      config: {
        defaultOtpOutcome: 'skip',
        forceOtpRole: 'mfa_required',
      },
    });
  });
});
