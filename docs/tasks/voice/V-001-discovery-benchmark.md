---
id: V-001
title: Voice Discovery, Risikoanalyse und Benchmark
phase: voice
status: blocked
priority: P0
owner: Product/Engineering/Safety
dependencies: [G7-go]
gate: G8
outputs: [voice-scorecard, benchmark-report, risk-review, voice-adr]
completed_at: null
---

# V-001 – Voice Discovery, Risikoanalyse und Benchmark

## Ziel und Scope

Für genau ein Gewerk und die Intents FAQ, Rückruf/Terminwunsch, Weiterleitung
einen Anbieter-/Build-vs-Buy-Entscheid treffen. Testkorpus deckt Dialekte,
Fachbegriffe, Adressen, Stille, DTMF und Störungen ab; DSFA-Screening erneuern.

## Akzeptanz und Verifikation

- [ ] Turn-Latenz, eigene WER, Task Completion, Transfer Success,
      Policyverstöße und Kosten/Minute werden reproduzierbar gemessen.
- [ ] Korpus ist synthetisch/freigegeben, versioniert und frei von Produktivdaten.
- [ ] Anbieter und Orchestrierung sind per ADR mit Exit-Plan entschieden.
- [ ] Datenschutz-, Safety- und Betriebsrisiken haben Owner/Gates.
- [ ] Demoqualität wird nicht als Produktionsnachweis verwendet.

Stop: Nur nach `G7 = Go`; Anbieter-/Rechtsentscheid benötigt Freigabe.
