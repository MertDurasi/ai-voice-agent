---
id: T-003
title: RLS-Baseline und DB-Rollen
phase: tenancy
status: blocked
priority: P0
owner: Engineering/Security
dependencies: [T-002]
gate: G2
outputs: [db-roles, rls-policies, schema-linter, cross-tenant-suite]
completed_at: null
---

# T-003 – RLS-Baseline und DB-Rollen

## Ziel und Scope

Tenant-Isolation zusätzlich in PostgreSQL erzwingen. Verbindlich sind
[ADR-002](../../adr/ADR-002-tenant-rls.md) und das
[RLS-Muster](../../architecture/data-and-reliability.md). Runtime-/Migration-
Rollen, transaktionales `SET LOCAL`, `ENABLE/FORCE RLS`, Policies, Testhelper
und Schema-Linter umsetzen.

## Akzeptanz und Verifikation

- [ ] Tenant A kann B weder lesen noch über bekannte IDs erraten.
- [ ] Fremde Inserts, Updates und Deletes schlagen fehl.
- [ ] Pool-Leak-Test beweist Kontextreset zwischen Requests/Jobs.
- [ ] Runtime ist weder Owner noch `BYPASSRLS`; Migrationrolle ist getrennt.
- [ ] Neue Tenant-Tabelle ohne vollständige Policy lässt den CI-Test scheitern.
- [ ] Expliziter Systempfad ist eng, auditierbar und negativ getestet.

Stop: Keine globale Bypass-Option hinzufügen; Policy-Abweichung benötigt ADR.
