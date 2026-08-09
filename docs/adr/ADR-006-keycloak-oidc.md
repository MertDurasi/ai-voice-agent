# ADR-006 – Keycloak via OIDC

- Status: accepted
- Datum: 2026-08-07

## Kontext

Eigene Passwortspeicherung, MFA und Session-Security wären sicherheitskritische
Nebenprodukte außerhalb des Kernnutzens.

## Entscheidung

Keycloak ist Identity Provider. Web nutzt OIDC Authorization Code + PKCE; die
API validiert Token-Signatur, Issuer, Audience und Ablauf. Privilegierte Rollen
können MFA erzwingen.

## Konsequenzen

Realm-/Client-Konfiguration wird ohne Secrets versioniert. Tenant-Membership
und fachliche Autorisierung bleiben Anwendungsdomäne; IdP-Rollen allein setzen
keinen Client-gelieferten Tenant-Kontext.
