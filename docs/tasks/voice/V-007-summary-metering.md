---
id: V-007
title: Strukturierte Voice-Summary und Usage Metering
phase: voice
status: blocked
priority: P1
owner: Engineering/Product
dependencies: [V-003, V-004, V-005, V-006]
gate: G5
outputs: [structured-summary, correction-audit, voice-usage-intent, cost-reconciliation]
completed_at: null
---

# V-007 – Strukturierte Voice-Summary und Usage Metering

## Ziel und Scope

Aus dem flüchtigen Dialogzustand eine schemafeste, minimal erforderliche
Zusammenfassung mit feldweiser Unsicherheit erzeugen und idempotente
Voice-Nutzungsintents für Session-/Komponentenkosten reconciliieren.
Pflichtfelder werden nicht erfunden; fehlend/unsicher bleibt explizit.

## Akzeptanz und Verifikation

- [ ] Golden Cases enthalten keine erfundenen Pflichtdaten oder verbotenen
      Diagnose-, Preis-, Termin- beziehungsweise Verfügbarkeitsaussagen.
- [ ] Die persistierte Summary enthält weder Zitate noch Audio-/Transkript-
      Quellsegmente, Offsets oder eine Rekonstruktionsreferenz auf Gesprächsinhalt.
- [ ] Korrekturen sind als strukturierte Änderung auditiert, ohne einen
      Gesprächsursprung oder gelöschten Inhalt zu konservieren.
- [ ] Session-/Komponentennutzung und Ledger-Intent reconciliieren idempotent;
      Korrektur erfolgt als Gegenbuchung.
- [ ] Abweichung über Schwellwert alarmiert; Inhalte fehlen in Kostenmetrik,
      Logs, Traces und Reviewartefakten.

Nicht im Scope: Speicherung eines „Beweissegments“, Quality-Recording oder
Rohtranskript für spätere menschliche Prüfung.
