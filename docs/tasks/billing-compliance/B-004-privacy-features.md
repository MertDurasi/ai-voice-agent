---
id: B-004
title: Datenschutzfunktionen
phase: billing-compliance
status: blocked
priority: P0
owner: Engineering/Privacy
dependencies: [D-003, G5]
gate: G6
outputs: [retention-jobs, tenant-export, data-subject-export, erasure-workflow]
completed_at: null
---

# B-004 – Datenschutzfunktionen

## Ziel und Scope

Freigegebene Retention je Datenklasse, täglichen Löschjob, Tenant-/Betroffenen-
Export, verifizierten Erasure-Workflow und expliziten Legal Hold umsetzen.
Backup-Retention und Grenze physischer Sofortlöschung dokumentieren.

## Akzeptanz und Verifikation

- [ ] Ein synthetischer Datensatz wird über alle Tabellen/Objekte gefunden.
- [ ] Export/Löschung ist tenantisoliert, autorisiert und idempotent.
- [ ] Audit belegt Vorgang ohne gelöschten Inhalt weiter zu speichern.
- [ ] Legal Hold benötigt Grund, Owner, Ablauf/Review und ist nicht still.
- [ ] Crash/Retry und bereits gelöschte Daten enden deterministisch.
- [ ] Backups und Providerkopien sind in der Löschsemantik dokumentiert.

Stop: Keine Frist oder Rechtsgrundlage ohne D-003/Legal-Freigabe festlegen; nur
synthetische Daten löschen, bis Realbetrieb ausdrücklich freigegeben ist.
