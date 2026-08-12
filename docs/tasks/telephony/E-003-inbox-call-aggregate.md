---
id: E-003
title: Inbox, Call-/VoiceSession-Aggregat und CallOutcome
phase: telephony
status: blocked
priority: P0
owner: Engineering
dependencies: [E-002]
gate: G4
outputs: [webhook-inbox, call-aggregate, voice-session-lifecycle, call-outcome-event, ordering-tests]
completed_at: null
---

# E-003 – Inbox, Call-/VoiceSession-Aggregat und CallOutcome

## Ziel und Scope

Webhook-Inbox, Call-State-Machine, flüchtigen VoiceSession-Lifecycle, Unique
Constraints und atomisches kanonisches `CallOutcomeRecorded`-Outbox-Event
implementieren. Outcome unterscheidet unter anderem Voice-Abschluss,
Caller-/Policy-Handoff, technische Degradation, Abbruch und verpassten Call;
es trägt nur strukturierte Metadaten und die erlaubte Fortsetzungsabsicht.

## Akzeptanz und Verifikation

- [ ] 100 Wiederholungen desselben Lifecycle-Events erzeugen einen Call und
      genau ein fachliches Outcome.
- [ ] Verspätete, widersprüchliche und parallele Events ergeben denselben
      deterministischen Endzustand.
- [ ] Fachzustand und Outbox werden atomar committed oder gemeinsam verworfen.
- [ ] Unzulässige Zustandsrückschritte erzeugen keinen Handoff-, Textback- oder
      Lead-Seiteneffekt und sind per Reason Code beobachtbar.
- [ ] Tenant-/Session-Zuordnung ist nicht aus untrusted Payload manipulierbar.
- [ ] Persistenztests finden weder Audio noch Rohtranskript.

Referenzen: ADR-002/003/007 und Datenzuverlässigkeitsdokument.
