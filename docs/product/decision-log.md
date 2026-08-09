# Decision Log – Discovery und Pilot

- Status: aktiv
- Stand: 2026-08-08
- Owner: Product Owner
- Zugehörige Tasks: `D-001`, `D-002`, `D-003`

## Regeln

- `open`: benötigt Evidenz oder Entscheidung.
- `decided`: Entscheider, Datum und Begründung sind vorhanden.
- `deferred`: bewusst vertagt; Auswirkung und neuer Trigger sind dokumentiert.
- `superseded`: durch verlinkte neuere Entscheidung ersetzt.

Jede Entscheidung trennt Annahmen von Fakten, nennt betroffene Tasks/Gates und
einen Trigger zur Neubewertung. Anbieter-, Rechts-, Datenstandort-, Zahlungs-
oder Realbetriebsentscheidungen benötigen die in `AGENTS.md` geforderte
ausdrückliche Freigabe.

## Entscheidungsregister

| ID | Frage | Optionen/Arbeitshypothese | benötigter Nachweis | Owner | Zieltermin | blockiert | Status |
|---|---|---|---|---|---|---|---|
| DEC-001 | Welches Gewerk dient als erste Discovery-Kohorte? | SHK reversibel gewählt; Elektro als Pivotoption | Ownerentscheidung für Fokus; Interviews validieren Bedarf und lösen bei negativen Signalen den Pivot aus | Product Owner | 2026-08-08 | Discovery-Fokus | decided |
| DEC-002 | Enges ICP innerhalb des Gewerks? | Service/Reparatur 2–30 MA / Installation / gemischt | Interviewsegmente und Ausschlusskriterien | Product Owner | 2026-08-21 | D-001-Abnahme | decided |
| DEC-003 | Welches Pilotangebot? | 8 Wochen mit 2 Wochen Akzeptanz + 6 Wochen Messung | Reaktion aus Interviews, operativer Aufwand, Partnercommitment | Product Owner | 2026-08-21 | G0 | decided |
| DEC-004 | Primärer Textback-Kanal im Realbetrieb? | SMS als bedingte D-002-Testhypothese / WhatsApp; kein stiller Dual-Send | D-002 Scorecard, D-003 Blockerpaket und qualifizierte Prüfung in PO-004 | Product/Legal | vor realer Provideraktivierung | Realversand | open |
| DEC-005 | Welche Call-Ereignisse gelten als „verpasst“? | Providerstatus plus Timeout/Kurzanruf-Regel | Providerfixtures und fachliche Decision Table | Product/Engineering | D-002 | E-001/M-001 | open |
| DEC-006 | Wie behandeln wir Notfall-/Dringlichkeitsfälle? | freigegebener Hinweis, Suppression, priorisierter Rückruf | Legal/Safety-Review und Interviews; Erreichbarkeitsmodell | Product/Legal | D-003 | betroffener Realbetrieb | open |
| DEC-007 | Welche Trial-/Pricing-Hypothese wird getestet? | 99 EUR netto/Monat, Sensitivität 49/149; keine Auto-Overages | PO-003 Kostenmodell und Interviewcommitments | Product/Finance | vor G0 | Pilotangebot | decided |
| DEC-008 | Welche Supportgrenzen gelten? | Werktage 09–17, kritisch 4 Betriebsstunden, sonst 1 Arbeitstag | erwartete Fälle, Kapazität und Designpartnerfeedback | Product/Operations | vor G0 | Pilotangebot | decided |
| DEC-009 | Welches minimale Formular ist akzeptabel? | Name optional, Kategorie, Rückrufzeit, kurzer Freitext | Interviews, Datenminimierung, Conversiontest | Product/Privacy | vor M-005 | M-005 | open |
| DEC-010 | Wie werden Nummern im Pilot verbunden? | Conditional Forwarding als bedingte D-002-Testhypothese / neue Nummer / Portierung | D-002 Providerfähigkeit, Setupzeit, Verträge | Product/Engineering | vor O-002 | O-002 | open |
| DEC-011 | Welches Attribution Window nutzt Lead-Conversion? | 24 h / 72 h / tokengebundene Lebensdauer | Pilotverhalten und Capability-Retention | Product/Data | vor B-006 | KPI-Vergleich | open |
| DEC-012 | Welche manuellen Backoffice-Schritte sind im Pilot vertretbar? | Liste aus Product Brief, mit Zeitbudget | gemessene Support-/Onboardingzeit | Product/Operations | vor G6 | Kohortenbreite | open |

## Bereits verbindliche Leitplanken – keine erneute D-001-Entscheidung

| Referenz | Leitplanke | Neubewertung |
|---|---|---|
| ADR-009 | Textback vor Voice | nur durch neues ADR nach `G7` |
| ADR-008 | keine Gesprächsaufzeichnung | nur mit neuem Rechts-/Risiko-/Architekturentscheid |
| Produktstrategie | Deutschland, Deutsch, ein Gewerk, 2–30 MA als MVP-Fokus | nach Discovery-Evidenz |
| Qualitätsbaseline | exakt null doppelte Außenwirkungen | nicht als Produkttrade-off abschwächen |
| Security/Compliance | kein echter Versand ohne Kanal-/Rechtsfreigabe | vor Realbetrieb |

## Entscheidungsprotokoll

### D-001-Abnahme – 2026-08-08

- Entscheider: Product Owner
- Entscheidung: `DEC-001` SHK; `DEC-002` Service-/Reparaturbetriebe mit 2–30
  Mitarbeitenden; `DEC-003` achtwöchiger Pilot mit zwei Wochen technischer
  Akzeptanz und sechs Wochen Messung; `DEC-007` Preistest 99 EUR netto/Monat
  mit Sensitivität 49/149 EUR und ohne automatische Mehrverbrauchsbelastung;
  `DEC-008` Support werktags 09:00–17:00 Europe/Berlin, kritisch vier
  Betriebsstunden, sonst ein Arbeitstag.
- Evidenz: Product Brief v1.0 und ausdrückliche Nutzerfreigabe vom 2026-08-08.
- Trade-off: schneller enger Discovery-Fokus; alle Werte bleiben anhand von
  Interviews, Providerkosten und Rechtsprüfung überprüfbare Hypothesen.
- Betroffene Tasks/Gates: schließt `D-001`, entsperrt `D-002`; `G0` bleibt bis
  `D-002` und `D-003` offen.
- Restrisiken: keine Kanal-, Provider-, Rechts-, Vertrags- oder
  Realbetriebsfreigabe.
- Review-Trigger: widersprechende Interviewevidenz, untragbare Providerkosten
  oder Rechts-/Supportconstraints; spätestens vor `G0`.

### D-002-Abnahme – 2026-08-08

- Entscheider: Product Owner
- Entscheidung: Das eingeschränkte Discovery-Ergebnis ist abgenommen.
  Fake-/Replay-Betrieb ist die einzige freigegebene Entwicklungsbaseline;
  keine bindende Anbieterentscheidung.
- Arbeitshypothese: Twilio Voice `IE1`, SMS und Conditional Forwarding zuerst
  mit der identischen Account-Testmatrix prüfen.
- Bis zu separaten Freigaben verbindlich: ausschließlich Fake-/Replay-Betrieb;
  keine Accounts, Nummern, Verträge, Kosten oder echten Nachrichten.
- Evidenz: [Provider-Scorecard](provider-scorecard.md) und
  [ADR-012](../adr/ADR-012-provider-channel.md) im Status `proposed`.
- Offene Entscheidungen: `DEC-004`, `DEC-005` und `DEC-010`; D-003 bewertet
  Rechts-, Datenschutz- und Abuse-Annahmen, ohne selbst eine Rechtsfreigabe zu
  behaupten.
- Betroffene Tasks/Gates: schließt `D-002`, entsperrt `D-003` und `PO-003`;
  `G0` bleibt offen.
- Review-Trigger: qualifizierte Rechtsprüfung, grüne Account-Testmatrix und
  ausdrückliche Provider-/Budgetfreigabe vor jeder realen Provideraktion.

### D-003-/G0-Abnahme – 2026-08-08

- Entscheider: Product Owner; dokumentarischer Security-/Privacy-Review.
- Entscheidung: Das D-003-Compliance-Paket ist als Discovery- und
  Entwicklungsbaseline abgenommen. `G0` entsperrt ausschließlich synthetische
  Fake-/Replay-Foundation ohne externe Providerwirkung.
- Evidenz: [Compliance-Paket](../compliance/README.md),
  [Dateninventar](../compliance/data-flow.md),
  [Rechtsfragenpaket](../compliance/purpose-legal-basis.md),
  [Retention-Entwurf](../compliance/retention-draft.md) und
  [Abuse-Katalog](../security/abuse-cases.md); lokale Links und vollständige
  ID-Abdeckung wurden am 2026-08-08 automatisiert geprüft.
- Nicht entschieden: Keine Position ist `approved_by_legal`; SMS, Provider,
  Conditional Forwarding, ESP, Payment und Voice bleiben `real_blocker`.
- Betroffene Tasks/Gates: schließt `D-003` und `G0`; entsperrt `PM-001` sowie
  danach die Fake-/Replay-Foundation ab `F-001`.
- Review-Trigger: jede reale Datenverarbeitung, Kanal-/Provider-/Regionänderung,
  Echtgeld, Cloudmigration oder Voice; qualifizierte Freigabe in `PO-004`.

Bei einer Entscheidung wird hier ein Eintrag ergänzt:

```text
DEC-NNN – Kurztitel
Datum:
Entscheider:
Entscheidung:
Evidenz:
Begründung/Trade-offs:
Betroffene Tasks/Gates:
Restrisiken:
Review-Trigger/-datum:
```
