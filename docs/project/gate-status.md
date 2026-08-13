# Gate-Status

Stand: 2026-08-12

| Gate | Status | Voraussetzungen | Freigabe/Datum | Nachweis |
|---|---|---|---|---|
| G0 Discovery | passed | D-001–D-003; reversible SHK-/Angebots-/Kanalhypothesen; realistischer synthetischer Replay-Pfad; Realbetriebsblocker sichtbar | Product Owner / 2026-08-08 | [D-003](../tasks/discovery/D-003-privacy-abuse-workshop.md), [Compliance-Paket](../compliance/README.md), [D-002-Abnahme](../product/decision-log.md) |
| G0V Voice-first Rebaseline | passed | PM-002; akzeptierte Voice-first-Entscheidung und ADR-013; Produkt-, Architektur-, Compliance-, Roadmap-, Gate- und Taskdelta konsistent; ausschließlich Fake-/Replay-Scope | Product Owner / 2026-08-11 | [PM-002](../tasks/project-management/PM-002-voice-first-mvp-rebaseline.md), [ADR-013](../adr/ADR-013-voice-first-combined-mvp.md), [Product Brief v2.0](../product/product-brief.md), [Compliance](../compliance/README.md) |
| G1 Skelett | passed | F-001–F-005; Setup reproduzierbar, Apps healthy, CI grün, keine Secrets | Product Owner / 2026-08-12 | [CI vollständig grün](https://github.com/MertDurasi/ai-voice-agent/actions/runs/31616117821), [aktives `main`-Ruleset](https://github.com/MertDurasi/ai-voice-agent/rules/20759048), [F-005](../tasks/foundation/F-005-ci-supply-chain.md) |
| G2 Isolation | open | T-001–T-004; Cross-Tenant-Negativsuite und Rollenmatrix; `G0V` bestanden | – | – |
| G3 Voice+Text Configuration | blocked_by_G2_and_product_checkpoint | `PO-001`–`PO-003`; `V-001` benchmarkt Anbieter-/Build-vs-Buy-/Runtimeoptionen ohne Vorentscheidung; O-001–O-004; kombinierter Fake-Onboarding-E2E, Versionierung und Audit | – | – |
| G4 Realtime Telephony & Media | blocked_by_G3 | E-001–E-004, V-002 und V-005; providerneutrale Call-/Media-Verträge, authentisierter Fake-/Replay-Ingress, kanonisches CallOutcome, Session-Cleanup sowie Restart-/Lastnachweise | – | – |
| G5 Combined Assistant MVP (synthetisch) | blocked_by_G4 | V-003, V-004, V-006, V-007 und M-001–M-007; synthetischer Voice→CallOutcome→optional-Textback→ein-Lead-Golden-Path; Disclosure, Handoff, Idempotenz und 24-h-Soak; keine Audio-/Rohtranskriptpersistenz | – | – |
| G6 Pilot Ready | blocked_by_G5 | B-001, B-002 und B-004–B-006; V-008; P-001; PO-004–PO-006; konkrete Legal-/DSFA-/Safety-/Security-/Provider-/Budgetnachweise, Restore, Runbooks, Kill Switch und Designpartner | – | – |
| G7 Controlled Voice+Text Pilot | blocked_by_G6_and_explicit_approvals | P-002, P-003 und PO-009; explizite Provider-, Vertrags-, Legal-, Safety-, Security-, Budget- und Go-live-Freigaben; kontrollierte Kohorten mit Stop-/Rollbacknachweis | – | – |
| G8 Post-pilot Continue/Scale | blocked_by_sufficient_pilot_evidence | P-004 und PO-010; ausreichende kombinierte Voice-/Textback-Evidenz zu Nutzen, Qualität, Handoff, Safety, Support, Kosten und Incidents; expliziter `stop | continue | scale`-Entscheid | – | – |

## Nächste zulässige Arbeit

- Engineering `Now`: `T-001` wird nach bestandenem `G1` als erste
  Identity-/Isolation-Task gezogen.
- Product/Discovery `Now`: `PO-001` als erster Evidenz-Pull nach bestandenem
  `G0V`.
- `PO-002`, `V-001` und `PO-003` werden anschließend WIP-gesteuert gezogen.
  Kein Ergebnis aus `V-001` aktiviert einen echten Provider.

`G0` bleibt ein historischer, bestandener Discovery-Nachweis. Weder `G0` noch
`G0V` ist eine Kanal-, Provider-, Rechts-, Vertrags-, Budget- oder
Realbetriebsfreigabe.

Ein Gate wird erst geschlossen, wenn Freigabeperson, Datum und Links auf
Testberichte, Entscheidungen oder Reviews in der Tabelle ergänzt sind.
