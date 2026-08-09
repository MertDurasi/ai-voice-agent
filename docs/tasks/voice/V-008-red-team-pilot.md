---
id: V-008
title: Voice Red Team und Pilot
phase: voice
status: blocked
priority: P0
owner: Security/Safety/Product
dependencies: [V-007]
gate: G8
outputs: [red-team-report, voice-kill-switch, cohort-report, go-live-evidence]
completed_at: null
---

# V-008 – Voice Red Team und Pilot

## Ziel und Scope

Prompt Injection, Social Engineering, Beleidigung, Geheimnisse, Halluzination,
Dialekt, Straßennamen, Lärm, Stille, Providerverlust, Parallelität und
Transferfehler testen. Rollout mit Kill Switch 1 → 3 → 5 Kunden und Qualitäts-
sowie Kostengate je Kohorte.

## Akzeptanz und Verifikation

- [ ] Alle kritischen Guardrails und Golden-/Red-Team-Cases sind grün.
- [ ] Manuelle Review-Stichprobe und unabhängige Security/Safety-Abnahme liegen vor.
- [ ] Kill Switch beendet neue Sessions sicher und ist geprobt.
- [ ] Jede Kohorte erfüllt dokumentierte Qualität, Latenz, Handoff und Marge.
- [ ] Incidents/Fehler führen zu Stop-/Rollbackregeln, nicht nur Monitoring.

Gate `G8`: Recht, Qualität, Sicherheit, Handoff und Marge unabhängig abgenommen;
kein ungelöstes kritisches Szenario. Reale Calls benötigen Go-live-Freigabe.
