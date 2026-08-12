---
id: M-003
title: Integrierte Textback-Fortsetzungsorchestrierung
phase: textback
status: blocked
priority: P0
owner: Engineering
dependencies: [M-002, V-003]
gate: G5
outputs: [continuation-use-case, conversation-channel-model, send-job, usage-intent]
completed_at: null
---

# M-003 – Integrierte Textback-Fortsetzungsorchestrierung

## Ziel und Scope

`CallOutcomeRecorded` → Eligibility → derselbe Contact-/Conversation-Vorgang →
MessageIntent → Fake-Versandjob → Usage Intent atomar/idempotent
orchestrieren. Textback ist eine Voice-Fortsetzung/ein Fallback, kein
unabhängiger Broadcast. Kanal-Fallback erfolgt nur nach dokumentierter
Fehlerklasse und nie nach bereits erfolgreichem gleichartigem Effekt.

## Akzeptanz und Verifikation

- [ ] Fake-E2E deckt Callerwunsch, technische Degradation, Suppression und
      erfolgreichen Voice-/Handoff-Abschluss ab.
- [ ] Parallel-, Replay- und Crash-Tests erzeugen weder Double Delivery noch
      einen zweiten Conversation-/Lead-Vorgang.
- [ ] Suppression erzeugt Reason Code/Audit und keine Versand-/Usage-Wirkung.
- [ ] Fallback ist begrenzt, explizit und gegen Cross-Channel-Doppelwirkung
      getestet.
- [ ] Trace/Audit verknüpft Call, VoiceSession, Outcome, Eligibility,
      Conversation, MessageAttempt und Usage Intent ohne Gesprächsinhalt.

Referenzen: ADR-003/004/007 und [Qualität](../../quality/quality-and-testing.md).
