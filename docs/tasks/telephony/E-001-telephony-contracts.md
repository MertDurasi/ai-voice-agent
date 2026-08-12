---
id: E-001
title: Telephony- und Realtime-Session-Verträge
phase: telephony
status: blocked
priority: P0
owner: Engineering
dependencies: [G3, V-001]
gate: G4
outputs: [telephony-port, media-session-port, canonical-events, anonymized-fixtures, replay-adapter]
completed_at: null
---

# E-001 – Telephony- und Realtime-Session-Verträge

## Ziel und Scope

Providerneutrale Verträge für Call-Lifecycle, kurzlebige Media-/VoiceSession,
Routing-/Handoff-Kommandos und kanonische Events wie `CallStarted`,
`CallAnswered`, `MediaSessionOpened`, `CallEnded` und `CallOutcomeRecorded`
schaffen. Anonymisierte Fixtures und Fake-/Replay-Adapter bilden Erfolg,
Abbruch, Handoff, Degradation und Out-of-order-Ereignisse ab. Lies ADR-004/010
und [Datenzuverlässigkeit](../../architecture/data-and-reliability.md).

## Akzeptanz und Verifikation

- [ ] Domain/Application importiert weder Provider-SDK noch Providerpayload.
- [ ] Call-, Media- und Handoff-Verträge sind unabhängig von der in `V-001`
      bewerteten Runtime-Form.
- [ ] Contracttests mappen alle freigegebenen synthetischen Fixture-Varianten;
      Fixtures enthalten keine reale PII, Audio oder Secrets.
- [ ] Unbekannte Event-/Outcome-Typen werden sicher geparkt und beobachtbar,
      nicht verworfen oder fachlich erfunden.
- [ ] Zeit, IDs, Sessionbindung und Nummernnormalisierung sind explizit getestet.

Nicht im Scope: öffentlicher Ingress, Providerkonto oder produktive Media-Session.
