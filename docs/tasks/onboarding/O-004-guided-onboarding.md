---
id: O-004
title: Geführtes Onboarding
phase: onboarding
status: blocked
priority: P1
owner: Product/Engineering
dependencies: [O-002, O-003]
gate: G3
outputs: [onboarding-state-machine, onboarding-ui, onboarding-e2e]
completed_at: null
---

# O-004 – Geführtes Onboarding

## Ziel und Scope

Wiederaufnehmbare Folge Betrieb → Rufnummer → Nachricht → Test → Aktivierung
mit verständlichen, sicheren Fehlern umsetzen. Test arbeitet mit Fake-Adaptern
und löst keine reale Nachricht aus.

## Akzeptanz und Verifikation

- [ ] Neuer Tenant erreicht im Fake-E2E in unter zehn Minuten einen Erfolg.
- [ ] Fortschritt ist speicherbar, versioniert und sicher wiederaufnehmbar.
- [ ] Unvollständige/veraltete Konfiguration kann Textback nicht aktivieren.
- [ ] Back/Refresh/Parallel-Tab und fehlgeschlagener Test sind abgedeckt.
- [ ] Tastaturbedienung, Labels, Fokus- und Fehlermeldungen sind zugänglich.
- [ ] Alle Schritte wahren RBAC, RLS und Audit.

Gate-Nachweis: Onboarding-E2E plus nachvollziehbare Konfigurationsversion.
