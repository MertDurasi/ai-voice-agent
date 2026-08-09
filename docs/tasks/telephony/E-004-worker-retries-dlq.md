---
id: E-004
title: Worker, Retries und DLQ
phase: telephony
status: blocked
priority: P0
owner: Engineering/Operations
dependencies: [E-003]
gate: G4
outputs: [outbox-dispatcher, queue-consumer, retry-policy, dlq-runbook, requeue-command]
completed_at: null
---

# E-004 – Worker, Retries und DLQ

## Ziel und Scope

Outbox Dispatcher, Queue, idempotenten Consumer, Lease/Lock, exponentielles
Backoff mit Jitter, Max-Versuche, DLQ sowie auditierbares kontrolliertes Requeue
umsetzen.

## Akzeptanz und Verifikation

- [ ] Prozessabbruch vor/nach Publish und vor/nach Consumer-Commit verliert
      kein Event und dupliziert keine fachliche Wirkung.
- [ ] Redis- und Worker-Neustart sind durch Resilience-Tests abgedeckt.
- [ ] Permanente/transiente Fehler enden korrekt; keine Endlosschleife.
- [ ] DLQ und altes Outbox-/Queue-Item lösen Metrik/Alarm aus.
- [ ] Requeue verlangt Grund, ist begrenzt, idempotent und auditiert.
- [ ] Replay von mindestens 1.000 Fixtures hat null Verlust/Duplikate.

Gate `G4` benötigt die 1.000-Fixture- und Restart-Nachweise.
