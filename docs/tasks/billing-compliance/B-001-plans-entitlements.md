---
id: B-001
title: Plan, Subscription und Entitlements
phase: billing-compliance
status: blocked
priority: P0
owner: Product/Engineering
dependencies: [G5]
gate: G6
outputs: [plan-domain, subscription-state-machine, entitlement-service]
completed_at: null
---

# B-001 – Plan, Subscription und Entitlements

## Ziel und Scope

Providerneutrale Planversionen, Preis-Snapshot, Trial, Limits, Entitlements und
Subscription-Zustände modellieren. Versandentscheidung konsumiert einen
expliziten Entitlement-Check; Zahlungssystemdetails bleiben außen.

## Akzeptanz und Verifikation

- [ ] Planänderung verändert historische Preise/Nutzung nicht.
- [ ] Abgelaufene oder suspendierte Subscription unterdrückt Versand mit Reason.
- [ ] Trial-, Perioden- und Zeitzonengrenzen sind mit injizierter Clock getestet.
- [ ] Concurrent Planwechsel sind versionsgesichert und auditiert.
- [ ] Domain kennt keinen Payment Provider.

Stop: Preise sind Hypothesen bis PO-Freigabe; keine Echtgeldfunktion.
