---
id: T-001
title: Keycloak/OIDC integrieren
phase: tenancy
status: blocked
priority: P0
owner: Engineering/Security
dependencies: [G1]
gate: G2
outputs: [keycloak-config, oidc-api-validation, web-session, auth-tests]
completed_at: null
---

# T-001 – Keycloak/OIDC integrieren

## Ziel und Scope

Sichere Login-, Logout- und Session-Basis gemäß
[ADR-006](../../adr/ADR-006-keycloak-oidc.md). Realm-/Client-Konfiguration ohne
Secrets versionieren, Authorization Code + PKCE, API-JWT-Validierung,
Web-Session und Rollen `tenant_owner`, `tenant_admin`, `agent`, `viewer` sowie
getrenntes `support_admin` umsetzen.

## Akzeptanz und Verifikation

- [ ] Login, Logout und Refresh funktionieren E2E.
- [ ] Abgelaufene, falsch signierte, falscher Issuer/Audience und manipulierte
      Tokens werden abgelehnt.
- [ ] Tokens liegen nicht im Local Storage; Cookie-Security ist getestet.
- [ ] Privilegierte Rollen können MFA erzwingen.
- [ ] Noch keine Clientangabe autorisiert einen Tenant.

Stop: Keine produktive Realm-/Domain-Konfiguration oder echten Nutzer anlegen.
