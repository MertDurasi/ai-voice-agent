---
id: V-001
title: Provider-/Runtime-Benchmark und Voice-Risikospike
phase: voice
status: blocked
priority: P0
owner: Product/Engineering/Safety
dependencies: [G0V, PO-001]
gate: G3
outputs: [voice-scorecard, benchmark-report, risk-review, runtime-adr]
completed_at: null
---

# V-001 – Provider-/Runtime-Benchmark und Voice-Risikospike

## Ziel und Scope

Für genau ein Gewerk und höchstens drei durch `PO-001` begründete Intents
werden Build-vs-Buy-, Telephony-, STT-/LLM-/TTS-/Managed-Agent- und
Runtimeoptionen vergleichbar gebenchmarkt. In-Process-Modul, Worker/Sidecar,
separater Dienst und Managed Orchestration werden ohne vorab gewählte
Programmiersprache oder Prozessgrenze betrachtet. Der Korpus deckt Dialekte,
Fachbegriffe, Adressen, Stille, DTMF, Lärm, Handoff und Störungen synthetisch ab.

## Akzeptanz und Verifikation

- [ ] Kriterien und Gewichte stehen vor den Läufen fest; mindestens eine
      realistische Alternative je Build-vs-Buy-/Runtimeklasse wird verglichen.
- [ ] Turn-Latenz, WER/Verständlichkeit, Task Completion, Disclosure,
      Handoff, Policyverstöße, Datenfluss, Betriebsaufwand und Kosten/Minute
      werden reproduzierbar gemessen oder als belegte Lücke markiert.
- [ ] Korpus und Testdaten sind synthetisch/freigegeben, versioniert und frei
      von Produktivdaten.
- [ ] ADR/Scorecard empfehlen die kleinste reversible Option mit Exitplan;
      Unsicherheit, Disqualifikatoren und erneuter Benchmarktrigger sind klar.
- [ ] Datenschutz-, Safety-, Security-, Legal- und Betriebsrisiken besitzen
      Owner und spätere Gates. Demoqualität wird nicht als Produktionsnachweis
      verwendet.

Stop: Vor Abschluss des Benchmarks werden weder Python/Node noch eigener
Service, CPaaS, STT, LLM, TTS, Managed Agent, Datenregion oder Nummernweg
festgelegt. Der Task erstellt keine Accounts, Verträge oder Provider-, Legal-,
Budget- beziehungsweise Realbetriebsfreigabe.
