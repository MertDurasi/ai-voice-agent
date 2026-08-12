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

Freigegebene Retention je strukturierter Voice-/Text-/Lead-Datenklasse,
täglichen Löschjob, Tenant-/Betroffenenexport, verifizierten Erasure-Workflow
und expliziten Legal Hold umsetzen. Backup- und Provider-Retention sowie die
Grenze physischer Sofortlöschung dokumentieren. Audio/Rohtranskript darf wegen
Persistenz `0` in keinem Export-, Hold- oder Löschbestand auftauchen.

## Akzeptanz und Verifikation

- [ ] Ein synthetischer Datensatz wird über alle Tabellen/Objekte gefunden.
- [ ] Export/Löschung ist tenantisoliert, autorisiert und idempotent.
- [ ] Audit belegt Vorgang ohne gelöschten Inhalt weiter zu speichern.
- [ ] Legal Hold benötigt Grund, Owner, Ablauf/Review und ist nicht still.
- [ ] Crash/Retry und bereits gelöschte Daten enden deterministisch.
- [ ] Backups und Providerkopien sind in der Löschsemantik dokumentiert.
- [ ] Negativscan findet Audio/Rohtranskript weder in Primärdaten, Suche,
      Export, Audit, Backup noch Supportartefakten.

Stop: Keine Frist oder Rechtsgrundlage ohne D-003/Legal-Freigabe festlegen; nur
synthetische Daten löschen, bis Realbetrieb ausdrücklich freigegeben ist.
