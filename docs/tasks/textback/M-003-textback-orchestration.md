---
id: M-003
title: Textback-Orchestrierung
phase: textback
status: blocked
priority: P0
owner: Engineering
dependencies: [M-002]
gate: G5
outputs: [textback-use-case, conversation-message-model, send-job, usage-intent]
completed_at: null
---

# M-003 – Textback-Orchestrierung

## Ziel und Scope

`MissedCallDetected` → Eligibility → Conversation → Message → Versandjob →
Usage Intent atomar/idempotent orchestrieren. Kanal-Fallback nur nach
dokumentierter Fehlerklasse; höchstens eine Endkundenreaktion pro Regelzeitfenster.

## Akzeptanz und Verifikation

- [ ] Fake-Adapter-E2E bildet den vollständigen Pfad ab.
- [ ] Parallel-/Replay-/Crash-Tests erzeugen keine Double Delivery.
- [ ] Unterdrückung erzeugt Reason Code, Audit und keine Versand-/Usage-Wirkung.
- [ ] Fallback ist begrenzt, explizit und gegen Doppelversand getestet.
- [ ] Lasttest erfüllt das dokumentierte p95-Ziel.
- [ ] Trace/Audit verknüpft Call, Attempt, Conversation, Message und Usage Intent.

Referenzen: ADR-003/004/007 und [Qualität](../../quality/quality-and-testing.md).
