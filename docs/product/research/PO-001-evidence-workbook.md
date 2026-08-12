# PO-001 – Evidenz-Workbook

- Status: leere pseudonyme Arbeitsvorlage
- Stand: 2026-08-12
- Task: `PO-001`
- Zielgröße: zehn auswertbare Kerninterviews

## 1. Kodierung

Interview-IDs sind zufällig vergebene Kürzel `I-01` bis `I-10`; es existiert in
Git keine Zuordnung zu Betrieb oder Person. Zulässige Werte:

- Rolle: `owner | dispatch | technician`
- Größe: `2-9 | 10-30`
- Belegstärke: `observed | recalled | opinion | commitment | counterevidence`
- Bewertung: `supports | mixed | contradicts | unknown`
- Frequenz: Zahlenbereich pro Woche, nicht künstlich exakte Schätzung
- Bereitschaft: `no | conditional | concrete_next_step`

## 2. Interviewregister

| ID | Datum | Rolle | Größe | CRM/Rückrufprozess | permission_to_note | auswertbar | Qualitätsgrund |
|---|---|---|---|---|---|---|---|
| `I-01` | – | – | – | – | – | – | – |
| `I-02` | – | – | – | – | – | – | – |
| `I-03` | – | – | – | – | – | – | – |
| `I-04` | – | – | – | – | – | – | – |
| `I-05` | – | – | – | – | – | – | – |
| `I-06` | – | – | – | – | – | – | – |
| `I-07` | – | – | – | – | – | – | – |
| `I-08` | – | – | – | – | – | – | – |
| `I-09` | – | – | – | – | – | – | – |
| `I-10` | – | – | – | – | – | – | – |

## 3. Einzelnachweis – zehn leere Karten

Für jedes Interview genau eine Karte kopieren und nur paraphrasierte,
nichtidentifizierende Fakten eintragen.

### I-01

- Letzter konkreter unbeantworteter Anruf (`recalled|observed`): –
- Anrufe/Tag und zunächst unbeantwortet (Bandbreite): –
- Relevante verpasste Anrufe/Woche (Bandbreite): –
- Rückrufaufwand/Tag (Bandbreite): –
- Konkrete Auswirkung/Verlust: –
- Heutiger Workflow und was daran gut funktioniert: –
- Top-Anrufgründe: –
- Drei mögliche Erstaufnahmefälle: –
- Harte Human-/Safety-Grenzen: –
- Disclosure-Reaktion (`supports|mixed|contradicts`): –
- Handoff-Erwartung: –
- Textfortsetzung hilfreich/unerwünscht: –
- Pilotbereitschaft (`no|conditional|concrete_next_step`): –
- Preisreaktion 49/99/149 EUR, getrennt von Commitment: –
- stärkster Gegenbeleg: –
- Konfidenz (`low|medium|high`) und warum: –

### I-02

Gleiches Schema wie `I-01`.

### I-03

Gleiches Schema wie `I-01`.

### I-04

Gleiches Schema wie `I-01`.

### I-05

Gleiches Schema wie `I-01`.

### I-06

Gleiches Schema wie `I-01`.

### I-07

Gleiches Schema wie `I-01`.

### I-08

Gleiches Schema wie `I-01`.

### I-09

Gleiches Schema wie `I-01`.

### I-10

Gleiches Schema wie `I-01`.

## 4. Hypothesenmatrix

Erst nach jedem Interview die Bewertung ergänzen. Ein Interview zählt je
Hypothese höchstens einmal.

| ID | prüfbare Aussage | Erfolgsschwelle | unterstützt | gemischt | widerspricht | unbekannt | Ergebnis |
|---|---|---:|---:|---:|---:|---:|---|
| `H-PROB-01` | mindestens fünf relevante verpasste Anrufe/Woche oder vergleichbarer quantifizierter Schmerz | ≥7/10 | 0 | 0 | 0 | 10 | offen |
| `H-PROB-02` | konkreter Verlust oder >30 Minuten täglicher Rückrufaufwand | ≥6/10 | 0 | 0 | 0 | 10 | offen |
| `H-VALUE-01` | enger transparenter Voice-Test mit Human-Fallback akzeptabel | ≥7/10 | 0 | 0 | 0 | 10 | offen |
| `H-TRUST-01` | klare Disclosure, begrenzte Intents und Handoff werden freier Autonomie vorgezogen | ≥7/10 | 0 | 0 | 0 | 10 | offen |
| `H-SEG-01` | SHK-Kohorte zeigt wiederkehrenden, dringlichen, wirtschaftlichen Bedarf | alle Problem-/Value-Schwellen plus kein dominantes Gegenmuster | 0 | 0 | 0 | 10 | offen |

Die Schwellen sind Entscheidungsregeln der Discovery, kein statistischer
Wirksamkeitsnachweis. `mixed` zählt nicht als unterstützt.

## 5. Intent-Ranking

Ein Intent darf nur in die Top drei, wenn ein konkreter heutiger Anrufgrund,
ein minimaler Informationsbedarf und eine sichere Nichtzielgrenze belegt sind.

| Kandidat | Betriebe mit konkretem Fall | Häufigkeit/Dringlichkeit | benötigte Felder | Human-/Safety-Grenze | Gegenbelege | Rang |
|---|---:|---|---|---|---|---|
| akute Störung/Reparatur | 0 | – | – | keine Diagnose; Emergency separat | – | – |
| Wartung/Service | 0 | – | – | keine Termin-/Verfügbarkeitszusage | – | – |
| Austausch/Installation | 0 | – | – | kein Preis/Angebot | – | – |
| Bestandsauftrag/Rückfrage | 0 | – | – | keine automatische Zuordnung ohne Nachweis | – | – |
| Termin ändern/absagen | 0 | – | – | kein Kalenderwrite | – | – |
| anderer beobachteter Grund | 0 | – | – | – | – | – |

Notfall, Diagnose, Preis-, Termin- und Verfügbarkeitszusage sind unabhängig von
der Häufigkeit keine normalen MVP-Intents.

## 6. Trust-, Handoff- und Textback-Synthese

| Frage | starke Muster | Gegenmuster | Evidenzstärke | Produktfolge |
|---|---|---|---|---|
| akzeptierter Zeitpunkt/Wortlaut der KI-Disclosure | – | – | – | – |
| erwartete Human-/Rückrufalternative | – | – | – | – |
| Grenzen des Voice-Assistenten | – | – | – | – |
| angeforderte Textfortsetzung | – | – | – | – |
| unerwünschter Textback | – | – | – | – |
| Einwände von Entscheider/Büro/Techniker | – | – | – | – |

Interesse an Voice und Wunsch nach Textback werden getrennt ausgewertet. Ein
Voice-Ja darf kein Textback-Ja implizieren.

## 7. Commitment- und Preisleiter

| Stufe | Definition | Anzahl |
|---|---|---:|
| Interesse | positive Meinung ohne Handlung | 0 |
| bedingt testbereit | Test denkbar, aber kein nächster Schritt | 0 |
| konkreter nächster Schritt | Entscheider, Bedingung und Zeitspanne benannt | 0 |
| 99-EUR-Commitment | konkrete Bereitschaft bei benannten Mindestnachweisen | 0 |

49/99/149-EUR-Antworten als Verteilung und Gründe dokumentieren. Mittelwert
oder „Zahlungsbereitschaft“ nicht aus reinen Meinungen ableiten.

## 8. Abschlussentscheidung nach zehn Interviews

### Ergebnis

- Auswertbare Interviews: `0/10`
- Rekrutierungsquote erfüllt: `open`
- Hypothesenergebnis: `open`
- Top drei belegte Intents: `open`
- stärkste drei Gegenbelege: `open`
- Konfidenz und Stichprobengrenzen: `open`

### Entscheidungslogik

- `continue`: alle vier Kernschwellen erreicht, drei sichere Intents belegt und
  keine dominante unlösbare Trust-/Handoff-Grenze;
- `narrow`: Problem bestätigt, aber nur ein oder zwei Intents beziehungsweise
  eine engere Betriebsgröße/Rolle belastbar;
- `pivot_segment`: SHK-Schwellen verfehlt, während das Problem plausibel bleibt;
  Elektro wird als neue Discovery-Kohorte mit neuer Evidenz geprüft;
- `stop`: Problem, Testbereitschaft oder sichere Produktgrenze ist strukturell
  nicht tragfähig.

Kein automatisches Hochstufen: Der Product Owner dokumentiert Ergebnis,
Gegenbelege, Entscheidung und Reviewdatum im Product Brief und Decision Log.

## 9. PO-001-Abnahmecheck

- [ ] zehn auswertbare Kerninterviews und Quote erfüllt;
- [ ] jede starke These besitzt mindestens einen `observed`-/`recalled`-Beleg;
- [ ] Gegenbeispiele und heutige gut funktionierende Alternativen enthalten;
- [ ] maximal drei Intents mit Feldern und Grenzen priorisiert;
- [ ] Disclosure, Handoff, Textback und Preis getrennt bewertet;
- [ ] keine PII, Rohtranskripte oder identifizierbaren Zitate im Repository;
- [ ] Product Brief/Decision Log aktualisiert;
- [ ] ausdrückliche Product-Owner-Abnahme dokumentiert.
