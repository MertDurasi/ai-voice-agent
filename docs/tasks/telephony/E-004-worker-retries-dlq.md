---
id: E-004
title: Asynchrone Worker, Retries und DLQ
phase: telephony
status: blocked
priority: P0
owner: Engineering/Operations
dependencies: [E-003]
gate: G4
outputs: [outbox-dispatcher, queue-consumer, retry-policy, dlq-runbook, requeue-command]
completed_at: null
---

# E-004 – Asynchrone Worker, Retries und DLQ

## Ziel und Scope

Outbox Dispatcher, Queue, idempotenten Consumer, Lease/Lock, begrenztes
Backoff, DLQ und auditierbares Requeue für dauerhafte Lifecycle-/Outcome-
Events umsetzen. Live-Audioframes, Modellturns und bereits ausgeführte
Handoffs sind keine wiederholbaren Queue-Nachrichten.

## Akzeptanz und Verifikation

- [ ] Prozessabbruch vor/nach Publish und Consumer-Commit verliert kein
      fachliches Event und dupliziert keine Wirkung.
- [ ] Redis- und Worker-Neustart sind durch Resilience-Tests abgedeckt.
- [ ] Permanente/transiente Fehler enden korrekt; keine Endlosschleife.
- [ ] DLQ und altes Outbox-/Queue-Item lösen Metrik/Alarm aus.
- [ ] Requeue verlangt Grund, ist begrenzt, idempotent und auditiert; es kann
      keine Live-Session rekonstruieren oder Außenwirkung wiederholen.
- [ ] Replay von mindestens 1.000 synthetischen Lifecycle-Fixtures hat null
      Verlust und null doppelte Outcomes.

Gate `G4` benötigt zusätzlich Session-Cleanup-, Media-Störungs- und
Restart-Nachweise aus `V-002`/`V-005`.
