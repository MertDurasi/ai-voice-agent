# Gate-Status

Stand: 2026-08-10

| Gate | Status | Voraussetzungen | Freigabe/Datum | Nachweis |
|---|---|---|---|---|
| G0 Discovery | passed | D-001–D-003; reversible SHK-/Angebots-/SMS-Hypothesen; realistischer synthetischer Replay-Pfad; Realbetriebsblocker sichtbar | Product Owner / 2026-08-08 | [D-003](../tasks/discovery/D-003-privacy-abuse-workshop.md), [Compliance-Paket](../compliance/README.md), [D-002-Abnahme](../product/decision-log.md) |
| G1 Skelett | open | F-001–F-005; Setup reproduzierbar, Apps healthy, CI grün, keine Secrets | – | – |
| G2 Isolation | blocked_by_G1 | T-001–T-004; Cross-Tenant-Negativsuite und Rollenmatrix | – | – |
| G3 Konfiguration | blocked_by_G2 | O-001–O-004; Onboarding-E2E, Versionierung und Audit | – | – |
| G4 Call Ingestion | blocked_by_G3 | E-001–E-004; 1.000 Fixtures ohne Verlust/Duplikat, Restart-Tests | – | – |
| G5 Textback MVP | blocked_by_G4 | M-001–M-007; kompletter Audit-/Trace-Pfad und 24-h-Soak | – | – |
| G6 Pilotbereit | blocked_by_G5 | B-001–B-006; Recht/Security, Restore, Runbooks, fünf Designpartner | – | – |
| G7 Voice Go/No-Go | blocked_by_pilot_data | P-001–P-004 und datengestützter Entscheid | – | – |
| G8 Voice produktionsreif | blocked_by_G7 | V-001–V-008; unabhängige Abnahme von Recht, Qualität, Sicherheit, Handoff, Marge | – | – |

## Nächste zulässige Arbeit

- Engineering `Now`: `F-005` als nächster Pull-Kandidat nach abgeschlossenem
  `F-004`; `G1` bleibt bis zum CI-/Supply-Chain-Nachweis offen.
- Product/Discovery `Now`: `PO-001`; danach nacheinander `PO-002`, `PO-003`

`G0` entsperrt ausschließlich die reversible Fake-/Replay-Foundation. Es ist
keine Kanal-, Provider-, Rechts- oder Realbetriebsfreigabe.

Ein Gate wird erst geschlossen, wenn Freigabeperson, Datum und Links auf
Testberichte, Entscheidungen oder Reviews in der Tabelle ergänzt sind.
