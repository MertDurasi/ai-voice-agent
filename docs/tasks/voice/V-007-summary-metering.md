---
id: V-007
title: Voice Summary und Usage Metering
phase: voice
status: blocked
priority: P1
owner: Engineering/Product
dependencies: [V-003, V-004, V-005, V-006]
gate: G8
outputs: [structured-summary, human-review, voice-usage-ledger, cost-reconciliation]
completed_at: null
---

# V-007 – Voice Summary und Usage Metering

## Ziel und Scope

Strukturierte, menschlich prüfbare Zusammenfassung mit Unsicherheit sowie
reconciled Voice-Minuten und Kosten je STT/LLM/TTS-Komponente. Pflichtfelder
dürfen nicht erfunden werden; fehlend/unsicher bleibt explizit.

## Akzeptanz und Verifikation

- [ ] Golden Cases enthalten keine erfundenen Pflichtdaten.
- [ ] Summary verweist auf Quelle/Segment, soweit rechtlich gespeichert.
- [ ] Mensch kann korrigieren, ohne Ursprung oder Audit zu überschreiben.
- [ ] Provider-/Session-Minuten und Ledger reconciliieren idempotent.
- [ ] Abweichung über Schwellwert alarmiert; Korrektur ist Gegenbuchung.
- [ ] Inhalte fehlen in Kostenmetrik/Telemetry.
