---
id: V-006
title: Safety-, Emergency- und Human-Handoff
phase: voice
status: blocked
priority: P0
owner: Product/Safety/Engineering
dependencies: [V-003]
gate: G5
outputs: [safety-policy, transfer-flow, golden-dataset, emergency-runbook]
completed_at: null
---

# V-006 – Safety-, Emergency- und Human-Handoff

## Ziel und Scope

Konservative, versionierte Safety-Regeln, sofortigen Human-/Rückruf-Handoff,
DTMF-/Sprachchoice, nicht erreichbaren Menschen, technische Degradation,
synthetische Testtexte, Events und Runbook umsetzen. Das System diagnostiziert
nicht, ist kein Notrufdienst und gibt keine technische Selbsthilfe.

## Akzeptanz und Verifikation

- [ ] Das vorab definierte synthetische Golden Set erreicht die freigegebenen
      Sensitivitäts-/False-positive-Ziele oder der Task stoppt.
- [ ] Transfer-E2E deckt Annahme, Nichtannahme, Abbruch, Timeout und
      Provider-/Runtimefehler mit Fakes ab.
- [ ] Nach kritischer Klassifikation startet kein FAQ-, Lead-, Textback- oder
      Tooldialog ohne explizit erlaubten Safety-Pfad.
- [ ] Generative Antwort verzögert niemals den nichtgenerativen Notfallpfad.
- [ ] Handoff-, Alarm- und Incidentmetadaten minimieren PII und sind auditiert.

Stop: Schwellenwerte, produktive Texte und Realbetrieb benötigen unabhängige
Safety-, Product- und Legal-Abnahme in `G6`.
