---
id: V-006
title: Emergency und Human Handoff
phase: voice
status: blocked
priority: P0
owner: Product/Safety/Engineering
dependencies: [V-003]
gate: G8
outputs: [emergency-classifier, transfer-flow, golden-dataset, emergency-runbook]
completed_at: null
---

# V-006 – Emergency und Human Handoff

## Ziel und Scope

Konservative regel- plus modellgestützte Klassifikation, sofortigen Transfer,
DTMF-/Sprachfallback, nicht erreichbaren Menschen, freigegebene Disclaimer,
Events und Runbook. Das System berät nicht medizinisch und ist kein Notrufdienst.

## Akzeptanz und Verifikation

- [ ] Freigegebenes Golden Dataset erreicht vorab definierte hohe Sensitivität.
- [ ] Transfer-E2E deckt Annahme, Nichtannahme, Abbruch und Providerfehler ab.
- [ ] Nach kritischer Klassifikation startet kein FAQ-/Termin-/Lead-Dialog mehr.
- [ ] Generative Antwort verzögert niemals den Notfallpfad.
- [ ] Handoff, Alarm und Incidentdaten minimieren PII und sind auditierbar.

Stop: Schwellenwerte, Texte und Pilotbetrieb benötigen unabhängige Safety- und
Legal-Abnahme.
