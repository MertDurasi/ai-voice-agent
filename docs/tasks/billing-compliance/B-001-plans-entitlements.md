---
id: B-001
title: Voice+Text Plan, Subscription und Entitlements
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

Providerneutrale Planversionen, Preis-Snapshot, Trial, Voice-Session-/Minuten-,
Handoff- und Textback-Limits, Entitlements und Subscription-Zustände
modellieren. Sessionstart und Textback-Entscheidung konsumieren explizite,
getrennt auswertbare Entitlement-Checks; Zahlungssystemdetails bleiben außen.

## Akzeptanz und Verifikation

- [ ] Planänderung verändert historische Preise/Nutzung nicht.
- [ ] Abgelaufene oder suspendierte Subscription verhindert neue Voice-Sessions
      und unterdrückt Textback mit stabilem Reason; ein sicherer Handoff bleibt
      nach der freigegebenen Policy möglich.
- [ ] Trial-, Perioden- und Zeitzonengrenzen sind mit injizierter Clock getestet.
- [ ] Concurrent Planwechsel sind versionsgesichert und auditiert.
- [ ] Domain kennt keinen Payment Provider.

Stop: Preise, Einheiten und Caps sind Hypothesen bis PO-Freigabe; keine
Echtgeldfunktion und kein hartes Beenden laufender Sessions ohne sicheren Pfad.
