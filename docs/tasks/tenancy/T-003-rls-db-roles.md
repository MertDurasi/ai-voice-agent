---
id: T-003
title: RLS-Baseline und DB-Rollen
phase: tenancy
status: done
priority: P0
owner: Engineering/Security
dependencies: [T-002]
gate: G2
outputs: [db-roles, rls-policies, schema-linter, cross-tenant-suite]
completed_at: 2026-08-17
---

# T-003 – RLS-Baseline und DB-Rollen

## Ziel und Scope

Tenant-Isolation zusätzlich in PostgreSQL erzwingen. Verbindlich sind
[ADR-002](../../adr/ADR-002-tenant-rls.md) und das
[RLS-Muster](../../architecture/data-and-reliability.md). Runtime-/Migration-
Rollen, transaktionales `SET LOCAL`, `ENABLE/FORCE RLS`, Policies, Testhelper
und Schema-Linter umsetzen.

## Akzeptanz und Verifikation

- [x] Tenant A kann B weder lesen noch über bekannte IDs erraten.
- [x] Fremde Inserts, Updates und Deletes schlagen fehl.
- [x] Pool-Leak-Test beweist Kontextreset zwischen Requests/Jobs.
- [x] Runtime ist weder Owner noch `BYPASSRLS`; Migrationrolle ist getrennt.
- [x] Neue Tenant-Tabelle ohne vollständige Policy lässt den CI-Test scheitern.
- [x] Expliziter Systempfad ist eng, auditierbar und negativ getestet.

Stop: Keine globale Bypass-Option hinzufügen; Policy-Abweichung benötigt ADR.

## Abschlussnachweis

- `@voice-ai/db` stellt getrennte Migration-, Runtime- und Systemrollen bereit.
  Keine Anwendungsrolle ist Owner, Superuser oder besitzt `BYPASSRLS`; die
  Rollen sind untereinander nicht vererbt.
- Jede Tenanttransaktion setzt Tenant, Actor, Membership, Version und Rolle
  ausschließlich mit transaktionslokalem `set_config`. Commit und Rollback
  entfernen den Kontext vor der Wiederverwendung einer Poolverbindung. Die
  Datenbank validiert Membership-ID, Subject, Version, Rolle und Status vor
  einem Write erneut gegen die autoritative aktive Membership.
- `app.tenants` und `app.memberships` erzwingen `ENABLE/FORCE RLS` sowie
  vollständige Select-/Insert-/Update-/Delete-Policies. Bekannte fremde IDs
  bleiben unsichtbar; fremde Writes werden abgelehnt oder betreffen null Zeilen.
- Der Catalog-Linter blockiert jede neue `app`-Tenanttabelle ohne `tenant_id`,
  erzwungenes RLS und vollständige `USING`-/`WITH CHECK`-Policies. Migrationen
  sind hashgebunden, serialisiert und bei unverändertem Wiederholungslauf ein
  No-op.
- Der tenantübergreifende Systempfad ist read-only und verlangt vor dem Zugriff
  ein unveränderliches Receipt mit Actor, Reason Code und Operation. Ohne
  Receipt sieht die Systemrolle keine Tenantzeile; vollständiges fachliches
  Audit folgt in `T-004`.
- Der [PostgreSQL-Tenancy-Vertrag](../../operations/database-tenancy.md)
  dokumentiert Rollen, Trust Boundary, Migrationen, lokale Bedienung und die
  synthetische Betriebsgrenze.
- Unter Node `24.18.0` sind Format, Lint, Typecheck, Unit-, Architektur-,
  Security-, CI-Policy-, OpenAPI-, Integrations- und Buildchecks grün. Die
  PostgreSQL-Suite umfasst 8 RLS-/Rollen-/Leak-/Systempfadfälle; der
  Dependency-Scan meldet keine bekannte Schwachstelle. Compose-Health,
  Persistence-Smoke und OIDC-Smoke sind ebenfalls grün. Der E2E-Runner besitzt
  weiterhin noch keine eigene fachliche Testdatei und meldet dies transparent.
