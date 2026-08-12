---
id: B-002
title: Append-only Usage Ledger
phase: billing-compliance
status: blocked
priority: P0
owner: Engineering/Finance
dependencies: [B-001, M-003, V-007]
gate: G6
outputs: [usage-ledger, reconciliation-job, usage-tests]
completed_at: null
---

# B-002 – Append-only Usage Ledger

## Ziel und Scope

`UsageRecord` mit Source Event, Einheit, Menge, `occurredAt`, PricingPeriod und
eindeutigem Idempotency Key für Voice-Session/-Minute, Komponenten, Handoff und
Textback. Korrekturen erfolgen als Gegenbuchung, nie Update. Reconciliation
rekonstruiert Soll-Nutzung aus strukturierten fachlichen Events ohne
Gesprächsinhalt.

## Akzeptanz und Verifikation

- [ ] Replay und parallele Consumer verändern die Summe nicht.
- [ ] Gegenbuchung ist nachvollziehbar mit Original verknüpft.
- [ ] Perioden-/Preiszuordnung ist deterministisch und historisch stabil.
- [ ] Reconciliation meldet Drift und mutiert nicht stillschweigend.
- [ ] Cross-Tenant- und append-only-Negativtests sind grün.
- [ ] Ledger und Reconciliation enthalten weder Audio, Rohtranskript,
      Nachrichten-/Formularinhalt noch Providerpayload.

Nicht im Scope: Rechnung, Steuerlogik, Payment oder Echtgeld.
