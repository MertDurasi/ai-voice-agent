# Product Brief – Textback für verpasste Handwerker-Anrufe

- Status: Product-Owner-abgenommene Discovery-Baseline
- Version: 1.0
- Stand: 2026-08-08
- Owner: Product Owner
- Zugehöriger Task: `D-001`
- Nächste Review: bei widersprechender Interviewevidenz oder vor `G0`

## 1. Dokumentlogik

Dieses Dokument trennt verbindliche Leitplanken von noch unvalidierten
Hypothesen:

- **Leitplanke**: durch Projektbaseline oder akzeptierte ADR festgelegt.
- **Hypothese**: muss durch Interviews, Produktdaten oder einen expliziten
  Product-Owner-Entscheid validiert werden.
- **Offen**: steht im [Decision Log](decision-log.md) und blockiert nur den dort
  genannten Realbetrieb oder Folgetask.

Es handelt sich weder um Rechtsberatung noch um eine Freigabe für echte
Nachrichten, Providerverträge oder Zahlungen.

## 2. Kurzfassung

### Problemhypothese

Kleine Handwerksbetriebe verpassen während Außeneinsätzen relevante Anrufe. Die
anschließende manuelle Rückrufbearbeitung ist langsam und unstrukturiert;
dadurch entstehen verlorene Chancen, unnötige Rückrufschleifen und schlechtere
Erreichbarkeit für Bestandskunden.

### Lösungshypothese

Eine sofortige, seriöse Textnachricht nach einem tatsächlich verpassten Anruf
erwartet weniger Verhalten vom Betrieb als ein neues CRM und weniger Verhalten
vom Anrufer als eine App. Ein kurzes mobiles Formular liefert dem Betrieb genug
Kontext für einen priorisierten Rückruf.

### Primäre Segmenthypothese

Als erstes Segment wird **SHK-Service- und Reparaturbetriebe in Deutschland mit
2–30 Mitarbeitenden** untersucht. Fokus sind Betriebe mit Außendienst,
nennenswertem mobilen Anrufvolumen und ohne strukturiertes CRM.

SHK ist als reversible Discovery-Kohorte gewählt, aber noch nicht durch
Interviews validiert. `PO-001` prüft den Bedarf innerhalb dieser Kohorte;
Elektro bleibt eine Pivotoption, wenn die dokumentierten Stop-/Pivot-Signale
eintreten (`DEC-001`).

### Kernnutzenhypothese

Wenn ein Betrieb verpasste Anrufe innerhalb von 60 Sekunden automatisch
qualifiziert beantwortet, steigt der Anteil verwertbarer Rückrufanfragen, ohne
dass die laufende Support- und Bearbeitungszeit pro Tenant untragbar wird.

## 3. Zielgruppe und Akteure

### 3.1 Ideal Customer Profile – Hypothese H-SEG-01

| Merkmal | Arbeitshypothese | Ausschluss für ersten Pilot |
|---|---|---|
| Gewerk | SHK Service/Reparatur | Mischkonzern oder Generalunternehmer |
| Größe | 2–30 Mitarbeitende | Solo-Selbstständige nur als Gegenprobe; >30 separat |
| Markt | Deutschland, deutschsprachig | Ausland/Mehrsprachigkeit |
| Arbeitsweise | hoher Außendienstanteil | dauerhaft besetztes Callcenter |
| Eingang | relevante mobile Telefonanfragen | fast ausschließlich Portal-/E-Mail-Leads |
| Software | kein/einfaches CRM | komplexe Enterprise-Dispatch-Landschaft |
| Kaufmotiv | weniger verlorene Aufträge und Rückrufaufwand | primär Voice-Automatisierung gesucht |

### 3.2 Rollen

| Rolle | Job-to-be-done | Erfolg | Hauptrisiko |
|---|---|---|---|
| Entscheider: Inhaber/Geschäftsführung | Verpasste Chancen ohne zusätzliche Büroarbeit zurückgewinnen | Nutzen und Kosten monatlich sichtbar | Sorge um Seriosität, Recht und Kundenreaktion |
| Nutzer: Büro/Disposition | Rückrufe mit Kontext und Dringlichkeit priorisieren | weniger Rückfragen und Medienbrüche | noch ein Posteingang ohne Workflownutzen |
| Nutzer: Techniker/Inhaber unterwegs | nicht jeden Anruf sofort unterbrechen müssen | nur relevante, strukturierte Rückrufe | Benachrichtigungsüberlastung |
| Anrufer | sofort Orientierung und einfachen Rückrufweg erhalten | Antwort ohne App, wenig Dateneingabe | unerwünschte Nachricht oder unklarer Absender |
| Interner Support | Tenant sicher aktivieren und Störungen beheben | geringe Supportzeit, auditierbare Werkzeuge | verdeckte Impersonation oder manueller Dauerbetrieb |

### 3.3 Nicht primär adressierte Nutzer

Notrufende, Anrufer ohne textfähige Nummer, komplexe Ausschreibungs-/B2B-
Beschaffungsprozesse sowie Kunden, die zwingend synchrone Fachberatung
benötigen. Für diese Fälle braucht es sichere Fallbacks; sie werden nicht durch
generative Antworten gelöst.

## 4. Zu validierende Problem- und Nutzenhypothesen

| ID | Hypothese | Mess-/Entscheidungskriterium | Validierung |
|---|---|---|---|
| H-PROB-01 | Zielbetriebe verpassen regelmäßig wirtschaftlich relevante Anrufe. | ≥ 7/10 Interviews nennen mindestens fünf relevante verpasste Anrufe pro Woche oder quantifizieren vergleichbaren Schmerz. | PO-001 |
| H-PROB-02 | Späte/unstrukturierte Rückrufe führen zu verlorenen Aufträgen oder hohem Aufwand. | ≥ 6/10 berichten konkrete Verluste oder >30 Minuten tägliche Rückrufkoordination. | PO-001 |
| H-VALUE-01 | Sofortiger Textback wird als seriöse Verbesserung akzeptiert. | ≥ 7/10 würden einen klar beschriebenen Test zulassen; zentrale Einwände sind lösbar. | PO-001/PO-002 |
| H-VALUE-02 | Ein Kurzformular erzeugt verwertbaren Kontext. | Im Pilot ≥ 25 % der zugestellten Textbacks führen zu einer vollständigen Einreichung; Ziel nach Baseline anpassen. | B-006/Pilot |
| H-VALUE-03 | Automatisierung bleibt betrieblich leichtgewichtig. | Medianes Onboarding <20 Minuten und Support <60 Minuten/Tenant/Monat. | O-004/Pilot |
| H-TRUST-01 | Regelbasierte Templates schaffen mehr Vertrauen als freie KI-Antworten. | In Interviews bevorzugen ≥ 7/10 kontrollierbare Vorlagen für den Erstkontakt. | PO-001 |
| H-SEG-01 | Die reversible SHK-Kohorte zeigt ausreichend häufigen, dringlichen und wirtschaftlich relevanten Bedarf. | Interview-Schwellen für Schmerz, Häufigkeit, Dringlichkeit und Zahlungsbereitschaft werden erreicht; sonst Elektro als Vergleichs-/Pivotkohorte aktivieren. | PO-001/DEC-001 |

Schwellenwerte sind Discovery-Hypothesen, keine statistischen
Wirksamkeitsnachweise. Gegenbeispiele und Segmentunterschiede werden explizit
dokumentiert.

## 5. Anrufgründe – SHK-Arbeitshypothese

Die Reihenfolge ist zu validieren; sie basiert nicht auf Produktivdaten.

| Rang | Anrufgrund | Minimaler Formular-Kontext | Gewünschtes Betriebsergebnis |
|---|---|---|---|
| 1 | akute Störung/Reparatur | Kategorie, Ort grob, Rückrufzeit, Freitext | Dringlichkeit prüfen und zurückrufen |
| 2 | Wartung/Service | Anlage/Leistung grob, Wunschtermin | planbaren Lead erfassen |
| 3 | Angebot für Austausch/Installation | Vorhaben, Objektart grob, Erreichbarkeit | Opportunity qualifizieren |
| 4 | Bestandsauftrag: Status/Rückfrage | Kategorie „bestehender Auftrag“, Rückrufzeit | bestehendem Vorgang manuell zuordnen |
| 5 | Termin ändern/absagen | Kategorie, Rückrufzeit | Disposition informieren |

Das MVP diagnostiziert keine technische Ursache und macht keine Preis-, Termin-
oder Verfügbarkeitszusage.

## 6. Notfall- und Dringlichkeitsfälle – Safety-Hypothesen

Die folgenden Fälle sind keine medizinische oder technische Beratung. Sie
definieren Interview- und Rechtsprüfbedarf. Texte, Eskalationswege und
Klassifikation werden in `D-003` als Prüfbedarf strukturiert und benötigen vor
Realbetrieb eine separate Product-/Safety-/Legal-Freigabe über `PO-004`.

| Priorität | Szenariohypothese | Produktgrenze/Fallback-Hypothese |
|---|---|---|
| S0 | Gasgeruch oder vermuteter Gasaustritt | Keine Diagnose; freigegebener Hinweis auf zuständige Notfallstelle/Notruf und Ende des normalen Lead-Flows |
| S0 | unmittelbare Gefahr für Leib/Leben, Feuer oder Strom-/Gasgefahr | Keine generative Beratung; freigegebener Notfallhinweis |
| S1 | großer unkontrollierter Wasseraustritt/Überflutung | als dringend kennzeichnen; sicherer freigegebener Hinweis und menschlicher Rückrufpfad |
| S1 | Abwasser-Rückstau mit akutem Gebäudeschaden | als dringend kennzeichnen; keine technische Selbsthilfeanleitung |
| S2 | Heizungsausfall bei Frost oder besonders schutzbedürftigen Personen | priorisierter Rückruf; keine garantierte Einsatzzeit |

Offen sind insbesondere Erkennung, zulässiger Wortlaut, Haftungsgrenzen,
Erreichbarkeit außerhalb von Betriebszeiten und Verhalten bei nicht textfähiger
Nummer (`DEC-006`).

## 7. MVP-Nutzerreise

1. Tenant beginnt Onboarding und hinterlegt Betriebsprofil.
2. Rufnummer und Nachrichtenkonfiguration werden im Testmodus validiert.
3. Tenant verarbeitet ein synthetisches Testevent und aktiviert Textback.
4. Im späteren, weiterhin blockierten Realflow meldet ein verifizierter
   Provider-Webhook einen verpassten Anruf.
5. Eligibility entscheidet deterministisch und fail-closed über Send-Intent
   oder Suppression.
6. Nur nach Kanal-, Rechts- und Providerfreigabe wird genau eine versionierte
   Nachricht geplant und providerseitig akzeptiert.
7. Anrufer öffnet ein kurzlebiges, tenantgebundenes Formular.
8. Eine valide Einsendung erzeugt genau einen Lead.
9. Betrieb sieht den Lead und erhält eine minimale E-Mail-Benachrichtigung.
10. Zustellung, Nutzung, Audit und spätere Löschung bleiben nachvollziehbar.

## 8. MVP-Funnel und Eventkatalog v1

### 8.1 Konvention

- Produkt-Events tragen den Suffix `_v1`; semantische Änderungen erzeugen eine
  neue Version statt stiller Umdeutung.
- Pflichtmetadaten: `eventId`, `occurredAt`, `schemaVersion`, `source`,
  pseudonyme `tenantRef`, optional `correlationId`.
- Verboten: Telefonnummer, E-Mail, Name, Nachrichten-/Formulartext, Provider-
  Token, Capability Token und Raw Payload.
- Fachliche Source-of-Truth-Events und Analytics-Events bleiben unterscheidbar.

### 8.2 Ereignisse

| Stufe | Event | Auslösebedingung | KPI-Nutzung |
|---|---|---|---|
| 1 | `onboarding_started_v1` | erster persistierter Onboarding-Schritt je Tenant | Funnel-Basis |
| 2 | `phone_connected_v1` | Nummer erfolgreich testverifiziert | Aktivierung/Drop-off |
| 3 | `test_event_processed_v1` | kanonisches Test-Call-Event fachlich verarbeitet | Setup-Qualität |
| 4 | `test_textback_accepted_v1` | Fake/Testadapter akzeptiert genau eine Testnachricht | Time-to-Value |
| 5 | `textback_activated_v1` | vollständige Konfiguration explizit aktiviert | Aktivierungsrate |
| 6 | `missed_call_detected_v1` | deduplizierter Call erreicht fachlich `missed` | Kernvolumen |
| 7a | `textback_suppressed_v1` | Eligibility lehnt mit Reason Code ab | Guardrail/Diagnose |
| 7b | `textback_provider_accepted_v1` | Provider akzeptiert Sendung | Latenz/Usage |
| 8 | `textback_delivered_v1` | verifizierter Statuscallback meldet Zustellung | Zustellquote |
| 9 | `lead_form_opened_v1` | gültiges Capability Token öffnet Formular | Formular-Drop-off |
| 10 | `lead_submitted_v1` | valide Einsendung erzeugt idempotent Lead | Lead-Conversion |
| 11 | `lead_qualified_v1` | autorisierter Nutzer setzt Lead auf qualifiziert | Business Outcome |

### 8.3 Funnel-Definitionen

- Aktivierung = eindeutige Tenants mit `textback_activated_v1` / eindeutige
  Tenants mit `onboarding_started_v1` im betrachteten Kohortenfenster.
- Time-to-Value = Zeit zwischen `onboarding_started_v1` und erstem
  `test_textback_accepted_v1` desselben Tenants.
- Textback-Latenz = `textback_provider_accepted_v1.occurredAt` minus
  `missed_call_detected_v1.occurredAt` je Correlation ID.
- Lead-Conversion = eindeutige `lead_submitted_v1` / zugestellte Textbacks mit
  gültigem Formularpfad im definierten Attribution Window.
- Duplicate Guardrail = mehr als eine fachliche Sendewirkung je dedupliziertem
  Missed-Call-/Cooldown-Schlüssel; Ziel exakt 0.

Attribution Window, Testevent-Ausschluss und kanalbereinigte Auswertung werden
in `B-006` versioniert. Bis dahin sind sie offene Analytikdetails, keine
Produktentscheidungen.

## 9. Pilotangebot – Hypothesen, keine Konditionen

### H-OFFER-01 – Form

- acht Wochen Designpartner-Pilot;
- erste zwei Wochen technische Einrichtung und Akzeptanz, danach sechs Wochen
  Nutzung/Messung;
- eine Rufnummer, ein Gewerk, deutsche Templates, Textback und Lead-Inbox;
- Concierge-Onboarding und wöchentlich 30 Minuten strukturiertes Feedback;
- keine Voice-Funktion, keine SLA und keine individuelle CRM-Entwicklung.

### H-PRICE-01 – Zahlungsbereitschaft

Zu testen ist ein monatlicher Nettopreis von **99 EUR** inklusive einer noch
anhand `D-002` festzulegenden fairen Nutzungsmenge. In Interviews werden
zusätzlich 49/149 EUR als Sensitivitätsanker geprüft. Während Discovery erfolgt
keine Abrechnung; im Pilot gibt es keine automatische Mehrverbrauchsbelastung.

Validierung: Mindestens fünf qualifizierte Betriebe akzeptieren 99 EUR nicht nur
abstrakt, sondern als Bestandteil einer konkreten Pilotvereinbarung, sofern
Providerkosten das Margenziel zulassen.

### H-TRIAL-01 – Trial

Die zweiwöchige technische Akzeptanzphase ist ohne langfristige Bindung. Erst
nach erfolgreichem Test-Textback beginnt die messbare Pilotnutzung. Exakte
Zahlungs- und Trialbedingungen bleiben bis `PO-007`/`PO-008` offen.

### H-CANCEL-01 – Kündigung

Designpartner sollen mit kurzer Frist aus dem Pilot aussteigen können; als
Testhypothese gelten sieben Kalendertage. Datenexport und Löschung folgen dem in
`D-003` entworfenen und erst über `PO-004` rechtlich zu prüfenden Prozess, nicht
einer spontanen manuellen Löschung.

### H-SUPPORT-01 – Supportgrenzen

- Kanalhypothese: E-Mail, dringende Pilotstörung zusätzlich definierter
  Eskalationskontakt.
- Betriebszeithypothese: Werktage 09:00–17:00 Europe/Berlin.
- Reaktionshypothese: kritischer Kernpfadausfall innerhalb von vier
  Betriebsstunden, sonst innerhalb eines Arbeitstags.
- Kein 24/7-Support und keine Garantie eines Handwerkerrückrufs.
- Ziel: unter 60 Minuten Supportaufwand je aktivem Tenant und Monat.

Alle Konditionen benötigen Product-Owner-, Kosten- und gegebenenfalls
Rechtsprüfung (`DEC-003`, `DEC-007`, `DEC-008`).

## 10. Nicht-Ziele dieses Piloten

- vollständiger Voice-Agent, Aufzeichnung oder freie generative Kundenantworten;
- Notruf-, Stördienst- oder fachliche Diagnosefunktion;
- verbindliche Termin-, Preis- oder Verfügbarkeitszusage;
- Kalender-Schreibzugriff, CRM-Synchronisation oder Angebots-/Rechnungswesen;
- native App, Mehrsprachigkeit oder mandantenspezifischer Fork;
- mehrere Rufnummern je Tenant im ersten Pilot;
- automatische Produktionsabrechnung oder unkontrollierter Massenversand;
- 24/7-Support oder garantierte Providerverfügbarkeit.

## 11. Bewusst manuelle Backoffice-Schritte

| Schritt | Warum zunächst manuell | Exit-Kriterium für Automatisierung |
|---|---|---|
| Designpartner qualifizieren und Vertrag prüfen | Segment und Recht noch in Discovery | wiederholbarer, freigegebener Prozess |
| Provider-/Nummern-Onboarding begleiten | Provider noch nicht gewählt, Portierung riskant | ≥5 vergleichbare erfolgreiche Setups |
| Template und Kanalfreigabe prüfen | Rechts-/Provideranforderungen offen | versionierter freigegebener Katalog |
| Testevent und Aktivierung gemeinsam abnehmen | verhindert unbeabsichtigten Realversand | niedrige Fehlerquote und sichere Self-Service-Gates |
| DLQ/Requeue und Providerabweichungen prüfen | seltene Fälle erst klassifizieren | Runbook + sichere begrenzte Ops-Funktion |
| Support und Feedback triagieren | Taxonomie muss aus realen Fällen entstehen | stabile Kategorien und vertretbare Automatisierung |
| Export-/Erasure-Anfragen verifizieren | Identität und Scope sicher prüfen | B-004-Prozess rechtlich/technisch abgenommen |
| Rechnungs-/Mehrverbrauchskontrolle | Preis und Unit Economics unvalidiert | B-002/B-003 reconciled und Echtgeld freigegeben |

Manuell bedeutet nicht unkontrolliert: Jeder sicherheits-, daten- oder
versandrelevante Schritt benötigt Actor, Grund, Audit und gegebenenfalls
Vier-Augen-Freigabe.

## 12. Discovery-Erfolg und Abbruchkriterien

### Erfolg für D-001/Segmententscheidung

- zehn auswertbare Interviews im gewählten Vergleichsdesign;
- Problem und heutige Alternative sind quantifiziert;
- mindestens ein Segment zeigt wiederkehrenden Schmerz und konkrete
  Testbereitschaft;
- Preis-/Support-/Trust-Einwände sind dokumentiert;
- primäres Gewerk und Pilotangebot sind ausdrücklich entschieden.

### Pivot-/Stop-Signale

- Mehrheit meldet kaum relevante verpasste Anrufe;
- Betriebe lösen das Problem bereits zufriedenstellend und günstig;
- Anrufer-/Betriebsakzeptanz für automatischen Textback ist niedrig;
- zulässiger Kanal oder Providerfähigkeit ist nicht realistisch erreichbar;
- benötigter Support widerspricht dem Ziel eines skalierbaren Kleinteamprodukts;
- Zahlungsbereitschaft liegt strukturell unter variablen und operativen Kosten.

## 13. Interviewleitfaden

Die Fragen werden offen gestellt. Zahlen, jüngste konkrete Beispiele und
heutiges Verhalten haben Vorrang vor Meinungen über eine hypothetische Lösung.

1. Erzähle vom letzten Arbeitstag, an dem ihr einen Kundenanruf nicht annehmen
   konntet. Was passierte danach?
2. Wie viele eingehende Anrufe habt ihr an einem typischen Tag, und wie viele
   davon werden ungefähr verpasst?
3. Welche Arten verpasster Anrufe sind wirtschaftlich besonders relevant?
4. Woran erkennt ihr heute, ob ein Rückruf dringend ist?
5. Wer bearbeitet verpasste Anrufe, wann und mit welchem Zeitaufwand?
6. Wie oft erreicht ihr den Anrufer beim Rückruf nicht mehr?
7. Kannst du einen konkreten verlorenen oder verspäteten Auftrag beschreiben?
   Woran lag es?
8. Welche Systeme oder Workarounds nutzt ihr heute für Rückruflisten und Leads?
9. Was funktioniert daran gut, und was erzeugt die meiste Reibung?
10. Welche fünf Anrufgründe kommen am häufigsten vor? Welche davon sind wirklich
    dringend?
11. Wie behandelt ihr Gasgeruch, Wasserschäden, Heizungsausfall oder andere
    Gefahrenfälle heute?
12. Wie würden Stammkunden und Neukunden auf eine sofortige automatische SMS
    oder WhatsApp-Nachricht reagieren?
13. Welche Angaben wären für einen sinnvollen Rückruf unbedingt nötig, und
    welche wären zu viel?
14. Welche Formulierungen oder Automatisierungen würden unprofessionell oder
    riskant wirken?
15. Wer dürfte eine solche Funktion freigeben, und welche Einwände hätten
    Datenschutz, Büro oder Techniker?
16. Was müsste in den ersten zwei Wochen passieren, damit du den Pilot als
    nützlich bewertest?
17. Welche monatliche Größenordnung wäre bei nachgewiesenem Nutzen leicht,
    gerade noch oder nicht vertretbar? Warum?
18. Würdest du für einen achtwöchigen Pilot mit wöchentlichem Feedback Zeit und
    99 EUR pro Monat verbindlich einplanen? Was müsste vorher geklärt sein?

## 14. Interview-Auswertungsschema

Je Betrieb werden ausschließlich notwendige, möglichst pseudonymisierte Daten
erfasst:

- Segmentfit und Rolle des Gesprächspartners;
- Anrufvolumen als Bandbreite und verpasste Anrufe;
- letzter konkreter Fall, Auswirkung und heutiger Workflow;
- Top-Anrufgründe/Dringlichkeit;
- Trust-, Rechts-, Kanal- und Integrationsbedenken;
- Testbereitschaft und Preisreaktion;
- starke Gegenbelege;
- Evidenzstärke (`observed`, `recalled`, `opinion`, `commitment`).

Keine privaten Telefonnummern, Kundennamen oder Gesprächsinhalte werden in
Produkt-/Analyticsdokumente übernommen.

## 15. Offene Entscheidungen

Die ausführliche und maßgebliche Liste steht im [Decision Log](decision-log.md).
Für Abschluss von `D-001` sind mindestens `DEC-001`, `DEC-003`, `DEC-007` und
`DEC-008` durch den Product Owner zu prüfen. Kanal-/Providerentscheidungen
bleiben Aufgabe von `D-002` und `D-003`.

## 16. Review-Nachweis

- Product-Owner-Review: abgenommen
- Datum: 2026-08-08
- Ergebnis: als Discovery-Baseline freigegeben
- Freigegebene Entscheidungen: `DEC-001`, `DEC-002`, `DEC-003`, `DEC-007`,
  `DEC-008`
- Änderungsbedarf: keiner für den Start von `D-002`; Hypothesen bleiben durch
  Interviews und Kosten-/Rechtsprüfung widerlegbar

`D-001` ist abgeschlossen. Diese Abnahme erlaubt `D-002`, aber keine Accounts,
Verträge, echten Nachrichten, Zahlungen oder rechtlich ungeprüften Pilotbetrieb.
