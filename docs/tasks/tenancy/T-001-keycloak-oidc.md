---
id: T-001
title: Keycloak/OIDC integrieren
phase: tenancy
status: done
priority: P0
owner: Engineering/Security
dependencies: [G1]
gate: G2
outputs: [keycloak-config, oidc-api-validation, web-session, auth-tests]
completed_at: 2026-08-13
---

# T-001 – Keycloak/OIDC integrieren

## Ziel und Scope

Sichere Login-, Logout- und Session-Basis gemäß
[ADR-006](../../adr/ADR-006-keycloak-oidc.md). Realm-/Client-Konfiguration ohne
Secrets versionieren, Authorization Code + PKCE, API-JWT-Validierung,
Web-Session und Rollen `tenant_owner`, `tenant_admin`, `agent`, `viewer` sowie
getrenntes `support_admin` umsetzen.

## Akzeptanz und Verifikation

- [x] Login, Logout und Refresh funktionieren E2E.
- [x] Abgelaufene, falsch signierte, falscher Issuer/Audience und manipulierte
      Tokens werden abgelehnt.
- [x] Tokens liegen nicht im Local Storage; Cookie-Security ist getestet.
- [x] Privilegierte Rollen können MFA erzwingen.
- [x] Noch keine Clientangabe autorisiert einen Tenant.

Stop: Keine produktive Realm-/Domain-Konfiguration oder echten Nutzer anlegen.

## Abschlussnachweis

- Das versionierte lokale Realm enthält keine Nutzer, erzwingt Authorization
  Code + PKCE `S256`, lehnt Direct/Implicit Grants ab und fordert TOTP für
  `tenant_owner`, `tenant_admin` und `support_admin`.
- Das Web verwaltet State, Nonce und Token ausschließlich über verschlüsselte
  HttpOnly-/SameSite-Cookies; Refresh und Logout sind same-origin POSTs.
- Die API prüft RS256-Signatur, Issuer, Audience und Ablauf. Token-/Clientclaims
  erzeugen ausdrücklich keinen Tenant-Kontext; dieser bleibt bis `T-002`
  `null`.
- `compose:identity` beweist den vollständigen lokalen Browser-, Refresh-,
  Logout-, MFA- und API-Flow mit kurzlebigen synthetischen Nutzern und entfernt
  sie anschließend. Reale Konten, Provider oder Domains wurden nicht angelegt.
- Unter Node `24.18.0` und pnpm `11.20.0` sind Format, Lint, Typecheck, Unit-,
  Architektur-, Security-, CI-Policy-, Integration-, OpenAPI- und Buildchecks
  sowie der Dependency-Scan grün. Der generische `tests/e2e`-Runner besitzt
  weiterhin keine separaten Testdateien; der taskbezogene OIDC-E2E läuft
  ausführbar über `compose:identity` und in der CI-Infrastruktur-Stage.
