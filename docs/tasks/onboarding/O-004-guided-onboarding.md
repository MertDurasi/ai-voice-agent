---
id: O-004
title: Geführtes Voice+Text-Onboarding
phase: onboarding
status: blocked
priority: P1
owner: Product/Engineering
dependencies: [O-002, O-003]
gate: G3
outputs: [onboarding-state-machine, onboarding-ui, combined-onboarding-e2e]
completed_at: null
---

# O-004 – Geführtes Voice+Text-Onboarding

## Ziel und Scope

Wiederaufnehmbare Folge Betrieb/Intents → Rufnummer/Routing →
Disclosure/Handoff → Textback-Regeln → kombinierter Test → Aktivierung mit
verständlichen, sicheren Fehlern umsetzen. Test arbeitet ausschließlich mit
Fake-Adaptern: synthetischer Call, Disclosure, Handoff- und Textback-Fall.

## Akzeptanz und Verifikation

- [ ] Neuer Tenant erreicht im Fake-E2E in der dokumentierten
      Time-to-Value-Bandbreite einen Voice- und einen Textback-Testerfolg.
- [ ] Fortschritt ist speicherbar, versioniert und sicher wiederaufnehmbar.
- [ ] Unvollständige/veraltete Konfiguration, fehlender Disclosure- oder
      Handoffpfad kann den kombinierten Assistenten nicht aktivieren.
- [ ] Back/Refresh/Parallel-Tab sowie fehlgeschlagene Voice-, Handoff- und
      Textback-Tests sind abgedeckt.
- [ ] Tastaturbedienung, Labels, Fokus- und Fehlermeldungen sind zugänglich.
- [ ] Alle Schritte wahren RBAC, RLS und Audit; Faketest erzeugt keine reale
      Außenwirkung.

Gate-Nachweis: kombinierter Onboarding-E2E plus nachvollziehbarer
Konfigurationssnapshot. Dies ist keine Provider- oder Realbetriebsaktivierung.
