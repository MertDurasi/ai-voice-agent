---
id: C-002
title: Hochverfügbarkeit und Disaster Recovery
phase: cloud
status: blocked
priority: P1
owner: Operations
dependencies: [C-001, approved-business-case]
gate: null
outputs: [ha-design, failover-runbook, dr-test-report, provider-failover-decision]
completed_at: null
---

# C-002 – Hochverfügbarkeit und Disaster Recovery

## Ziel und Scope

Redundante App/Worker/Voice-Instanzen, wirtschaftlich begründetes Multi-AZ,
dokumentiertes Failover und quartalsweisen DR-Test planen/umsetzen.
Provider-Failover nur bei belegtem Business Case und konsistenter
Idempotenz-/Zustandssemantik.

## Akzeptanz und Verifikation

- [ ] RPO/RTO werden im kontrollierten DR-Test mit Zeitstempeln erreicht.
- [ ] Split-Brain, Queue/Outbox und DNS/TLS-Failover sind berücksichtigt.
- [ ] Wiederanlauf erzeugt keine doppelten Endkundenwirkungen.
- [ ] Runbook benennt Authority, Kommunikation und Rückkehr zum Primärsystem.
- [ ] Kosten und neue Failure Modes sind gegen Nutzen bewertet.

Stop: Reale Failovertests mit Kundenimpact nur in genehmigtem Wartungsfenster.
