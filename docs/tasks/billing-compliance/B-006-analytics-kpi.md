---
id: B-006
title: Analytics Events und KPI-Dashboard
phase: billing-compliance
status: blocked
priority: P1
owner: Product/Engineering
dependencies: [G5, B-002]
gate: G6
outputs: [event-catalog, analytics-pipeline, kpi-dashboard, reconciliation-checks]
completed_at: null
---

# B-006 – Analytics Events und KPI-Dashboard

## Ziel und Scope

Datensparsame versionierte Produkt-Events und Funnel für Aktivierung,
Zustellung/Latenz, Leads, Usage und Kosten. Interne Betriebsmetriken und
Tenant-Ansichten sind getrennt und gegen kanonische KPI-Definitionen gebaut.

## Akzeptanz und Verifikation

- [ ] Eventkatalog definiert Name, Semantik, Version, Quelle und zulässige Felder.
- [ ] Events enthalten keine Nummern, E-Mails, Texte oder Capability Tokens.
- [ ] KPI-Werte stimmen mit reproduzierbaren SQL-Stichproben überein.
- [ ] Replay/Retry zählt Funnelereignisse nicht doppelt.
- [ ] Tenant-Ansicht kann keine fremden oder internen Finanzdaten sehen.

Gate `G6` verlangt zusätzlich Rechts-/Security-Review, Restore- und Runbook-
Nachweise sowie Product-Owner-Aufgaben PO-004–PO-006.
