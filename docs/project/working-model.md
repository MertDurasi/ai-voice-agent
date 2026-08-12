# Arbeitsmodell – Dual-Track-Kanban und Rolling Wave

## Rahmen

- Stand: 2026-08-11
- Kapazitätshypothese: Solo-/Kleinteam, ungefähr 20 Netto-Stunden pro Woche
- Produktstrategie: Voice ist der primäre, begrenzte Anrufassistent; Textback
  ist die integrierte Fortsetzung beziehungsweise der Fallback desselben
  Vorgangs.
- Architekturstrategie: mandantenfähiger modularer Monolith; die Form einer
  Voice-Runtime und alle Provider bleiben bis zum Benchmark `V-001` offen.
- Betriebsgrenze: Das historisch bestandene `G0` und das neue `G0V` erlauben
  nur synthetische Fake-/Replay-Arbeit. Reale Provider, Kontakte, Zahlungen,
  Deployments sowie Voice-/Textkommunikation benötigen spätere Freigaben.

Forecasts sind Bandbreiten, keine Lieferzusagen. Gates beruhen auf verlinkten
Nachweisen und benannten Entscheidungen, nie allein auf Kalenderzeit.

## 1. Zwei Pull-Spuren und WIP

| Spur | WIP-Limit | Zweck | aktueller Pull |
|---|---:|---|---|
| Engineering | 1 | kleinste vollständige technische Task bis `done` führen | `F-005` |
| Product/Discovery | 1 | Evidenz, Ownerentscheidungen und externe Reviews | `PO-001` |

- Eine Task zählt ab `in_progress` bis einschließlich `review` zum WIP.
- Eine neue Task wird erst gezogen, wenn der Slot frei, die Definition of Ready
  erfüllt und keine höher priorisierte Sicherheits-/Rechtsblockade offen ist.
- Parallelarbeit innerhalb einer Spur oder verstecktes „fast fertig“ ist nicht
  zulässig. Geblockte aktive Arbeit wird sichtbar auf `blocked` gesetzt oder
  durch eine konkrete unblockende Task ersetzt.
- Ein P0-Security-/Privacy-Incident darf als Expedite beide Spuren pausieren.
  Owner, Grund, Start und Exitkriterium werden im Decision Log dokumentiert;
  Expedite erhöht nicht still das WIP.

## 2. Planungshorizonte

| Horizont | Umfang | notwendige Detailtiefe | Änderungsregel |
|---|---|---|---|
| `Now` | höchstens zwei Tasks insgesamt: eine je Spur | vollständig verfeinerter Scope, Akzeptanztests, Abhängigkeiten, Risiken und Owner | nur durch Abschluss, echten Blocker oder dokumentiertes P0-Expedite ändern |
| `Next` | Outcomes und Abhängigkeiten für ungefähr 2–6 Wochen | Ziel, Nutzen, Bandbreite, Gate-/Entscheidungsbedarf; Details erst kurz vor Pull | wöchentlich anhand Evidenz und Durchsatz neu ordnen |
| `Later` | Epics/Optionen außerhalb des belastbaren Horizonts | Nutzen, Hauptrisiko und messbarer Aktivierungstrigger | keine Lieferzusage; vor `Next` neu schneiden und verfeinern |

Nur `Now` ist ein Arbeitsversprechen. `Next` ist eine Reihenfolgeannahme;
`Later` bewahrt Optionen, ohne Architektur oder Anbieter vorwegzunehmen.

## 3. Definition of Ready

Eine Task darf nach `Now` und `in_progress` nur, wenn:

- Outcome, Nutzer-/Betriebsnutzen und kleinster Scope eindeutig sind;
- Abhängigkeiten und das vorangehende Gate nachweislich erfüllt sind;
- relevante ADRs, Datenklassen, Trust Boundaries und Stop-Regeln benannt sind;
- Akzeptanzfälle einschließlich mindestens eines Negativfalls vorliegen;
- Owner, Reversibilität, offene Entscheidung und Review-Nachweis klar sind;
- keine echte Provider-, Kontakt-, Rechts-, Zahlungs- oder Deploymentfreigabe
  stillschweigend vorausgesetzt wird.

Für `V-001` bedeutet Ready ausdrücklich: Vergleichskriterien und synthetischer
Korpus sind vorhanden, aber Anbieter, Programmiersprache, Prozessgrenze und
Runtime sind noch nicht gewählt. Fehlende Detailplanung in `Next`/`Later` ist
kein Mangel; fehlende Klarheit in `Now` verhindert den Pull.

## 4. Task- und Statusvertrag

Jede Task-Datei besitzt ID, Owner, Status, Priorität, Abhängigkeiten, Gate,
Ziel/Outcome, Scope/Nicht-Ziele, Lieferobjekte, prüfbare Akzeptanz,
Verifikation, Risiken, Reversibilität und Aktivierungs-/Review-Trigger.

```text
blocked -> ready -> in_progress -> review -> done
```

`done` bedeutet: alle Kriterien nachgewiesen, relevante Checks grün,
Dokumentation/Indizes konsistent und Restrisiken berichtet. Zeitablauf,
Teilimplementierung oder ein positiver Happy Path reichen nicht.

## 5. Gate-Vertrag

- Das Frontmatter-Feld `gate` bedeutet `contributes_to`; es macht eine Task
  nicht automatisch zur Gate-Pflicht.
- Die expliziten Voraussetzungen in
  [Gate-Status](gate-status.md) sind autoritativ. Ein Gate schließt nur mit
  Freigabeperson, Datum und verlinktem Nachweis.
- `G0` bleibt der historische Discovery-/Fake-Nachweis. `G0V` dokumentiert die
  nachfolgende Voice-first-Rebaseline, ohne `G0` umzudeuten oder eine
  Realbetriebsfreigabe zu erteilen.
- `PO-001`–`PO-003` bilden den harten Investment-Checkpoint vor
  domänenspezifischer Voice+Text-Konfiguration. `PO-001` validiert Problem und
  Intents; `V-001` benchmarkt erst danach technische Optionen; `PO-003`
  übernimmt dessen Kostenbandbreiten.
- Der gemeinsame synthetische Walking Skeleton wird vertikal geschnitten:
  Fake-Call/Media → Disclosure und begrenzter Voice-Dialog → kanonisches
  CallOutcome → optionaler Fake-Textback → genau ein strukturierter Lead.
- Erst `G6` kann einen Antrag auf Realpilot zulassen; Provider-, Legal-, DSFA-,
  Safety-, Security-, Budget- und Go-live-Freigaben bleiben jeweils explizit.

## 6. Wöchentlicher Rhythmus

Ein gemeinsames Review/Replenishment pro Woche, bei 20 Stunden Kapazität
typischerweise zum Wochenabschluss:

1. abgeschlossene Outcomes, Checks und Restrisiken prüfen;
2. Blocker, Incidents, neue Evidenz und geänderte Annahmen aufnehmen;
3. Durchsatz und tatsächliche Cycle Time je Spur aktualisieren;
4. `Now` nur bei freiem WIP-Slot ziehen, `Next` ordnen, `Later` nur bei neuem
   Trigger anfassen;
5. Forecast als Bandbreite aktualisieren, nie als stilles Fixdatum;
6. Ownerentscheidungen und Gate-Nachweise im Decision Log/Gate-Status pflegen.

Ad-hoc-Replenishment ist nur bei abgeschlossenem Slot, echtem Blocker oder
dokumentiertem Expedite erlaubt.

## 7. Priorisierung und Forecast

Priorität: Sicherheit/Recht/Betriebsfähigkeit, dann zuverlässiger gemeinsamer
Kernpfad, Aktivierung, Conversion/Wirtschaftlichkeit und zuletzt Komfort.
Innerhalb gleicher Priorität entscheiden Risikoreduktion, Lernwert,
Abhängigkeiten, Reversibilität und kleinster vertikaler Nutzen.

Schätzungen werden als Aufwandsspanne und Annahmen dokumentiert. Belastbarere
Terminbandbreiten entstehen erst aus mehreren abgeschlossenen Tasks mit
beobachteter Cycle Time; vorher ist jede Langfristzahl eine Planungsannahme.
