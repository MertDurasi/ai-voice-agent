---
id: E-003
title: Inbox, Call-Aggregat und Ereignisreihenfolge
phase: telephony
status: blocked
priority: P0
owner: Engineering
dependencies: [E-002]
gate: G4
outputs: [webhook-inbox, call-aggregate, missed-call-outbox-event, ordering-tests]
completed_at: null
---

# E-003 – Inbox, Call-Aggregat und Ereignisreihenfolge

## Ziel und Scope

Webhook Inbox, Call-State-Machine, Unique Constraints und atomisches
`MissedCallDetected`-Outbox-Event implementieren. Duplicate, verspätete und
Out-of-order-Ereignisse müssen denselben fachlichen Endzustand erzeugen.

## Akzeptanz und Verifikation

- [ ] 100 Wiederholungen desselben Events erzeugen einen Call und ein
      fachliches Event.
- [ ] `completed` vor `missed`, verspätetes `answered` und parallele Consumer
      sind deterministisch getestet.
- [ ] Fachzustand und Outbox werden atomar committed oder gemeinsam verworfen.
- [ ] Unzulässige Zustandsrückschritte erzeugen keinen Seiteneffekt und werden
      mit Reason Code beobachtbar.
- [ ] Tenant-Zuordnung ist nicht aus untrusted Payload manipulierbar.

Referenzen: ADR-002/003/007 und Datenzuverlässigkeitsdokument.
