# Product Brief – Voice-first und Textback für Handwerker-Anrufe

- Status: Product-Owner-abgenommene Discovery-Baseline
- Version: 2.0
- Stand: 2026-08-11
- Owner: Product Owner
- Zugehörige Tasks: `D-001`, `PM-002`
- Nächste Review: nach `PO-001`, `V-001` oder bei widersprechender Evidenz

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

Ein klar als KI erkennbarer, begrenzter Voice-Agent beantwortet den Anruf als
primärer Assistent, erfasst maximal drei validierte Anliegen strukturiert und
wechselt bei Unsicherheit, Ablehnung oder Safety-Bedarf in einen menschlichen
Handoff-/Rückrufpfad. Ein rechtlich freigegebener Textback kann denselben
Vorgang auf Wunsch oder als sicherer Fallback mit einem kurzen mobilen Formular
fortsetzen. Beide Kanäle erzeugen genau einen gemeinsamen Lead statt
unabhängiger Automationen.

### Primäre Segmenthypothese

Als erstes Segment wird **SHK-Service- und Reparaturbetriebe in Deutschland mit
2–30 Mitarbeitenden** untersucht. Fokus sind Betriebe mit Außendienst,
nennenswertem mobilen Anrufvolumen und ohne strukturiertes CRM.

SHK ist als reversible Discovery-Kohorte gewählt, aber noch nicht durch
Interviews validiert. `PO-001` prüft den Bedarf innerhalb dieser Kohorte;
Elektro bleibt eine Pivotoption, wenn die dokumentierten Stop-/Pivot-Signale
eintreten (`DEC-001`).

### Kernnutzenhypothese

Wenn ein Betrieb eingehende Anrufe unmittelbar durch einen transparenten,
begrenzten Voice-Agenten erstaufnehmen und bei Bedarf schriftlich fortsetzen
kann, steigt der Anteil verwertbarer Anfragen, ohne dass Support-, Safety- und
Bearbeitungsaufwand pro Tenant untragbar werden.

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
| Kaufmotiv | weniger verlorene Aufträge und Rückrufaufwand | vollautonome Diagnose-/Dispatchlösung gesucht |

### 3.2 Rollen

| Rolle | Job-to-be-done | Erfolg | Hauptrisiko |
|---|---|---|---|
| Entscheider: Inhaber/Geschäftsführung | Verpasste Chancen ohne zusätzliche Büroarbeit zurückgewinnen | Nutzen und Kosten monatlich sichtbar | Sorge um Seriosität, Recht und Kundenreaktion |
| Nutzer: Büro/Disposition | Rückrufe mit Kontext und Dringlichkeit priorisieren | weniger Rückfragen und Medienbrüche | noch ein Posteingang ohne Workflownutzen |
| Nutzer: Techniker/Inhaber unterwegs | nicht jeden Anruf sofort unterbrechen müssen | nur relevante, strukturierte Rückrufe | Benachrichtigungsüberlastung |
| Anrufer | sofort eine ehrliche Erstaufnahme und Wahlmöglichkeit erhalten | KI erkennbar, Anliegen verstanden, sicherer Human-/Textpfad | Halluzination, unerwünschte Nachricht oder unklarer Absender |
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
| H-VALUE-01 | Ein transparenter Voice-first-Assistent mit Human-Fallback wird als seriöse Verbesserung akzeptiert. | ≥ 7/10 würden einen eng begrenzten Test zulassen; zentrale Einwände sind lösbar. | PO-001/PO-002 |
| H-VALUE-02 | Ein Kurzformular erzeugt verwertbaren Kontext. | Im Pilot ≥ 25 % der zugestellten Textbacks führen zu einer vollständigen Einreichung; Ziel nach Baseline anpassen. | B-006/Pilot |
| H-VALUE-03 | Automatisierung bleibt betrieblich leichtgewichtig. | Medianes Onboarding <20 Minuten und Support <60 Minuten/Tenant/Monat. | O-004/Pilot |
| H-VOICE-01 | Drei begrenzte Voice-Intents erfassen genug Kontext für einen menschlichen Rückruf. | Synthetischer Benchmark und Pilot messen Task Completion, Pflichtfeldgenauigkeit, Handoff und verbotene Zusagen. | V-001/B-006/Pilot |
| H-CHANNEL-01 | Textback verbessert Voice als angeforderte Fortsetzung oder Fallback, ohne Doppelansprache. | Kanalwechsel erzeugen genau einen Lead und keine ungeplante Nachricht; Akzeptanz und Conversion werden separat gemessen. | M-003/V-007/B-006 |
| H-TRUST-01 | Begrenzte Dialogzustände und freigegebene Texte schaffen mehr Vertrauen als freie KI-Autonomie. | In Interviews bevorzugen ≥ 7/10 kontrollierbare Intents, klare KI-Ansage und Human-Fallback. | PO-001 |
| H-SEG-01 | Die reversible SHK-Kohorte zeigt ausreichend häufigen, dringlichen und wirtschaftlich relevanten Bedarf. | Interview-Schwellen für Schmerz, Häufigkeit, Dringlichkeit und Zahlungsbereitschaft werden erreicht; sonst Elektro als Vergleichs-/Pivotkohorte aktivieren. | PO-001/DEC-001 |

Schwellenwerte sind Discovery-Hypothesen, keine statistischen
Wirksamkeitsnachweise. Gegenbeispiele und Segmentunterschiede werden explizit
dokumentiert.

## 5. Voice-Intents und Textback-Fortsetzung – SHK-Arbeitshypothese

Die Reihenfolge ist zu validieren; sie basiert nicht auf Produktivdaten.

| Rang | Anrufgrund | Minimaler Voice-/Formular-Kontext | Gewünschtes Betriebsergebnis |
|---|---|---|---|
| 1 | akute Störung/Reparatur | Kategorie, Ort grob, Rückrufzeit, Freitext | Dringlichkeit prüfen und zurückrufen |
| 2 | Wartung/Service | Anlage/Leistung grob, Wunschtermin | planbaren Lead erfassen |
| 3 | Angebot für Austausch/Installation | Vorhaben, Objektart grob, Erreichbarkeit | Opportunity qualifizieren |
| 4 | Bestandsauftrag: Status/Rückfrage | Kategorie „bestehender Auftrag“, Rückrufzeit | bestehendem Vorgang manuell zuordnen |
| 5 | Termin ändern/absagen | Kategorie, Rückrufzeit | Disposition informieren |

Das MVP diagnostiziert keine technische Ursache und macht keine Preis-, Termin-
oder Verfügbarkeitszusage.

`PO-001` und `V-001` wählen aus dieser Liste höchstens drei produktive
Voice-Intents. Ein Notfall ist kein normaler Intent, sondern ein separater,
nichtgenerativer Safety-/Handoffpfad. Textback ist kein vierter unabhängiger
Dialog: Er setzt denselben Call-Vorgang nur mit freigegebenem Zweck, Template
und sicherem Link fort.

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

1. Tenant beginnt Onboarding und hinterlegt Betriebsprofil, Erreichbarkeit,
   Handoffziel und freigegebene Fakten.
2. Rufnummer, Voice-Policy, KI-Hinweis und Textback-Konfiguration werden im
   Testmodus validiert.
3. Tenant absolviert einen synthetischen Voice-Test sowie einen getrennten
   Fake-Textback-/Formulartest und aktiviert die Konfiguration nur für Fake.
4. Im späteren, weiterhin blockierten Realflow erreicht ein eingehender Anruf
   den primären Voice-Pfad.
5. Der Voice-Agent macht sich vor fachlicher Erhebung klar als KI erkennbar und
   bietet Human-/Rückrufalternativen an.
6. Ein begrenzter Dialog erfasst einen erlaubten Intent und strukturierte
   Pflichtdaten; Unsicherheit bleibt sichtbar.
7. Safety-, Ablehnungs- oder Handoffbedingungen beenden den normalen Dialog
   kontrolliert und ohne generative Verzögerung.
8. Eine erfolgreiche Erstaufnahme erzeugt idempotent genau einen gemeinsamen
   Lead und optional eine freigegebene strukturierte Summary.
9. Nur wenn der Anrufer eine schriftliche Fortsetzung verlangt oder ein
   freigegebener Fallback greift, entscheidet Eligibility fail-closed über
   Textback oder Suppression.
10. Nur nach Kanal-, Rechts- und Providerfreigabe wird genau eine versionierte
    Nachricht für diesen Zweck geplant.
11. Der Anrufer kann einen kurzlebigen, tenant-/callgebundenen Formularlink
    öffnen; die Submission ergänzt denselben Lead idempotent.
12. Der Betrieb sieht den Lead und erhält eine minimale Benachrichtigung.
13. Voice-, Kanal-, Handoff-, Zustell-, Usage-, Audit- und Löschstatus bleiben
    ohne Audio-/Rohtranskriptpersistenz nachvollziehbar.

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
| 5 | `test_voice_session_completed_v1` | synthetischer Dialog erreicht erlaubtes Ende ohne Guardrail-Verstoß | Voice-Time-to-Value |
| 6 | `voice_textback_activated_v1` | vollständige kombinierte Konfiguration explizit aktiviert | Aktivierungsrate |
| 7 | `voice_session_started_v1` | deduplizierter Call beginnt Voice-Session | Kernvolumen |
| 8 | `ai_disclosure_completed_v1` | versionierter KI-Hinweispfad erreicht | Transparenz-Guardrail |
| 9a | `voice_lead_captured_v1` | erlaubter Dialog erzeugt idempotent strukturierten Lead | Voice-Completion |
| 9b | `voice_handoff_requested_v1` | Policy/Caller verlangt Human-/Rückrufpfad | Safety/Qualität |
| 10a | `textback_suppressed_v1` | Channel-Eligibility lehnt mit Reason Code ab | Guardrail/Diagnose |
| 10b | `textback_provider_accepted_v1` | Provider akzeptiert freigegebene Fortsetzung | Latenz/Usage |
| 11 | `textback_delivered_v1` | verifizierter Statuscallback meldet Zustellung | Zustellquote |
| 12 | `lead_form_opened_v1` | gültiges Capability Token öffnet Formular | Formular-Drop-off |
| 13 | `lead_submitted_v1` | valide Einsendung erzeugt/ergänzt idempotent denselben Lead | Lead-Conversion |
| 14 | `lead_qualified_v1` | autorisierter Nutzer setzt Lead auf qualifiziert | Business Outcome |

### 8.3 Funnel-Definitionen

- Aktivierung = eindeutige Tenants mit `voice_textback_activated_v1` / eindeutige
  Tenants mit `onboarding_started_v1` im betrachteten Kohortenfenster.
- Time-to-Value = Zeit zwischen `onboarding_started_v1` und erstem
  erfolgreichen `test_voice_session_completed_v1` und
  `test_textback_accepted_v1` desselben Tenants; beide Teilzeiten werden
  zusätzlich getrennt ausgewiesen.
- Voice-Completion = eindeutige `voice_lead_captured_v1` / Sessions mit
  abgeschlossenem KI-Hinweis; Safety-/Caller-Handoffs separat ausweisen.
- Textback-Latenz = `textback_provider_accepted_v1.occurredAt` minus
  `missed_call_detected_v1.occurredAt` je Correlation ID.
- Lead-Conversion = eindeutige `lead_submitted_v1` / zugestellte Textbacks mit
  gültigem Formularpfad im definierten Attribution Window.
- Duplicate Guardrail = mehr als eine fachliche Sendewirkung je dedupliziertem
  Missed-Call-/Cooldown-Schlüssel; Ziel exakt 0.
- Lead-Duplicate Guardrail = mehr als ein Lead für denselben Call-/Kanalvorgang;
  Ziel exakt 0.

Attribution Window, Testevent-Ausschluss und kanalbereinigte Auswertung werden
in `B-006` versioniert. Bis dahin sind sie offene Analytikdetails, keine
Produktentscheidungen.

## 9. Pilotangebot – Hypothesen, keine Konditionen

### H-OFFER-01 – Form

- acht Wochen Designpartner-Pilot;
- erste zwei Wochen technische Einrichtung und Akzeptanz, danach sechs Wochen
  Nutzung/Messung;
- eine Rufnummer, ein Gewerk, höchstens drei Voice-Intents, Human-Handoff,
  freigegebener Textback und gemeinsame Lead-Inbox;
- Concierge-Onboarding und wöchentlich 30 Minuten strukturiertes Feedback;
- keine Diagnose, freie Termin-/Preisentscheidung, SLA oder individuelle
  CRM-Entwicklung.

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
nach erfolgreichem synthetischem Voice-, Handoff- und Textback-Test beginnt die
messbare Pilotnutzung. Exakte Zahlungs- und Trialbedingungen bleiben bis
`PO-007`/`PO-008` offen.

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

- unbeschränkter Voice-Agent, Aufzeichnung, Audio-/Rohtranskriptspeicherung
  oder freie generative Kundenautonomie;
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
- Anrufer-/Betriebsakzeptanz für transparenten Voice-first oder den
  freigegebenen Textback-Fallback ist niedrig;
- zulässiger Kanal oder Providerfähigkeit ist nicht realistisch erreichbar;
- Voice-Qualität, Handoff, Safety oder variable Minutenkosten sind im engen
  Scope nicht tragfähig;
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
12. Wie würden Stammkunden und Neukunden reagieren, wenn ein klar als KI
    erkennbarer Assistent den Anruf zuerst annimmt? Wann muss ein Mensch
    übernehmen?
13. Wann wäre eine anschließende SMS mit sicherem Link hilfreich oder
    unerwünscht?
14. Welche Angaben wären für einen sinnvollen Rückruf unbedingt nötig, und
    welche wären zu viel?
15. Welche Formulierungen oder Automatisierungen würden unprofessionell oder
    riskant wirken?
16. Wer dürfte eine solche Funktion freigeben, und welche Einwände hätten
    Datenschutz, Büro oder Techniker?
17. Was müsste in den ersten zwei Wochen passieren, damit du den Pilot als
    nützlich bewertest?
18. Welche monatliche Größenordnung wäre bei nachgewiesenem Nutzen leicht,
    gerade noch oder nicht vertretbar? Warum?
19. Würdest du für einen achtwöchigen Pilot mit wöchentlichem Feedback Zeit und
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
- Datum: 2026-08-08; Scope-Rebaseline 2026-08-11
- Ergebnis: Discovery-Baseline freigegeben; Voice-first und Textback als
  gemeinsamer MVP durch `PM-002`/`ADR-013` ergänzt
- Freigegebene Entscheidungen: `DEC-001`, `DEC-002`, `DEC-003`, `DEC-007`,
  `DEC-008`
- Änderungsbedarf: keiner für den Start von `D-002`; Hypothesen bleiben durch
  Interviews und Kosten-/Rechtsprüfung widerlegbar

`D-001` ist abgeschlossen. Diese Abnahme erlaubt `D-002`, aber keine Accounts,
Verträge, echten Nachrichten, Zahlungen oder rechtlich ungeprüften Pilotbetrieb.
