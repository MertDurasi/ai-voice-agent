---
id: PM-002
title: Voice-first-MVP-Rebaseline und Gate-Neuschnitt
phase: project-management
status: done
priority: P0
owner: Product Owner/Architecture/Engineering/Safety
dependencies: [PM-001]
gate: G0V
outputs: [docs/adr/ADR-013-voice-first-combined-mvp.md, docs/product/product-brief.md, docs/project/gate-status.md, docs/project/roadmap.md, docs/tasks/README.md, docs/compliance/README.md, docs/security/abuse-cases.md]
completed_at: 2026-08-11
---

# PM-002 – Voice-first-MVP-Rebaseline und Gate-Neuschnitt

## Anlass und Outcome

Die Product-Owner-Entscheidung vom 2026-08-11 macht einen begrenzten
Voice-Agenten und Textback zu Bestandteilen desselben MVP. Voice ist der
primäre Anrufpfad; Textback dient als rechtlich freizugebender Fortsetzungs-
und Fallbackkanal. Die bisherige Strategie „Textback pilotieren, danach Voice
entscheiden“ wird nachvollziehbar ersetzt, ohne reale Provider-, Kontakt- oder
Rechtsfreigaben vorwegzunehmen.

## Scope

- Product Brief, Strategie, Metriken und Decision Log auf Voice-first v2.0
  aktualisieren;
- `ADR-009` durch eine neue akzeptierte Entscheidung ersetzen und die noch
  nicht akzeptierte provider-/kanalbezogene Hypothese neu einordnen;
- Architektur, Qualität, Betrieb, Compliance und Abuse-Gates auf einen
  gemeinsamen Voice-/Textback-MVP ausrichten;
- Gatefolge, Roadmap und Task-Abhängigkeiten so schneiden, dass zuerst eine
  synthetische integrierte Scheibe und erst danach ein kontrollierter Realpilot
  entsteht;
- Voice auf ein Gewerk, höchstens drei validierte Intents, klare KI-Transparenz,
  Human-Handoff und strukturierte Leads begrenzen;
- Audio-/Rohtranskriptpersistenz, Voiceprints, Emotionserkennung, Diagnose,
  Preis-/Terminzusage und unkontrollierte Toolwirkungen weiterhin verbieten.

## Nicht-Ziele

- keine Voice-, Telefonie-, SMS- oder Providerintegration implementieren;
- keinen Anbieter, Tarif, Datenstandort oder Nummernweg auswählen;
- keine Rechts-, DSFA-, Safety-, Budget- oder Go-live-Freigabe behaupten;
- `master.md` als historische Baseline nicht rückwirkend umschreiben;
- keine Toolchain- oder Runtime-Arbeit aus `F-005` vorziehen.

Die historisch abgenommenen Tasks `D-001`–`D-003`, `PM-001` und
`F-001`–`F-004` bleiben `done`. Ihre damaligen Nachweise werden nicht
rückwirkend umgedeutet; aktuelle Artefakte ersetzen oder erweitern nur die
Produkt- und Delivery-Baseline ab `G0V`.

## Betroffene Module und Datenflüsse

- Module: Telephony, Voice Runtime, Textback, Conversations, Leads,
  Notifications, Compliance, Billing und Admin/Ops;
- Flows: `FLOW-00` bis `FLOW-07` sowie `FLOW-V01`/`FLOW-V02`, erweitert um die
  gemeinsame Kanalorchestrierung Voice → Lead → optional Textback;
- Daten: `DATA-01` bis `DATA-27` und `DATA-V01` bis `DATA-V10`; bestehende
  Retention- und Abuse-Kontrollen bleiben mindestens gleich streng.

## Risiken und Reversibilität

- Scope, Kosten, Latenz, Safety und Legal-Aufwand steigen gegenüber dem
  Textback-only-MVP deutlich.
- Die Rebaseline ist dokumentarisch reversibel; reale Außenwirkungen bleiben
  durch Fake-/Replay-Modus, Gates und Kill-Switch-Anforderungen gesperrt.
- Voice-first ist eine Produktentscheidung, keine Vorentscheidung für
  Eigenbau, separaten Service, CPaaS, STT, LLM oder TTS.

## Akzeptanz und Verifikation

- [x] Jede aktuelle Scope-Aussage beschreibt Voice als primären MVP-Anrufpfad
      und Textback als integrierten Fallback/Fortsetzungskanal.
- [x] Historische Entscheidungen sind als ersetzt markiert, nicht still
      umgedeutet; eine neue ADR dokumentiert Trade-offs und Exitkriterien.
- [x] Gates erzwingen Isolation vor Fachdaten, synthetische Voice-/Textback-
      Integration vor Realbetrieb sowie Legal/Safety/Security/DSFA vor Pilot.
- [x] Voice-Tasks präjudizieren weder einen separaten Python-Service noch einen
      Provider vor dem Build-vs-Buy-/Benchmarkentscheid.
- [x] Pilot und KPI messen Voice, Textback, Handoff, Leadqualität, Kosten und
      Kanalwechsel gemeinsam; die spätere Entscheidung betrifft Skalierung und
      Produktfortsetzung, nicht erst den Beginn von Voice.
- [x] Compliance-Rückverfolgbarkeit bleibt lückenlos; Audio und Rohtranskript
      haben Persistenz `0`, alle Realflüsse bleiben `real_blocker`.
- [x] Alle lokalen Markdown-Links und Task-/Gate-/ADR-Referenzen sind
      automatisiert geprüft; unbelegte Freigabeformulierungen fehlen.

## Verifikation

- lokaler Markdown-Linkcheck;
- Referenzcheck für Task-, Gate-, ADR-, `FLOW-*`-, `DATA-*`-, `PUR-*`-,
  `RET-*`- und `ABUSE-*`-IDs;
- Negativsuche nach der nicht mehr aktuellen Strategie „Voice erst nach G7“ in
  allen gepflegten Dokumenten außer historischen Nachweisen;
- Git-Diff-Review, das `master.md` und die vorhandene lokale Next.js-
  Generatoränderung unberührt lässt.

## Abschlussnachweis – 2026-08-11

- 110 Markdown-Dateien wurden auf lokale Links geprüft; alle Ziele sind
  auflösbar.
- `FLOW-*`, `DATA-*`, `PUR-*`, `RET-*` und `ABUSE-*` sind vollständig;
  37 Datenklassen besitzen Retention-Mapping und alle 33 Abuse-Fälle die neun
  Pflichtspalten.
- Prettier und `git diff --check` sind grün. Code-/Provider-Tests sind für
  diese reine Rebaseline nicht anwendbar; `F-005` prüft die unveränderte
  Runtime-Basis als nächster Engineering-Task.
- `master.md` und `apps/web/next-env.d.ts` wurden nicht durch `PM-002`
  verändert.
