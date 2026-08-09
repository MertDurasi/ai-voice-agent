# Zwecke, Rollenhypothesen und Rechtsfragen

- Status: Rechtsrecherche und Prüfauftrag, keine Rechtsberatung/Freigabe
- Stand/Quellenabruf: 2026-08-08
- Owner: Product/Legal/Privacy/Security
- Betreiber: `[PLATTFORMBETREIBER_OFFEN]`

## 1. Rechtswirkung dieses Dokuments

Die genannten Rechtsgrundlagen sind Arbeitshypothesen. Keine Zeile trägt
`approved_by_legal`. Eine technische Erforderlichkeit oder ein berechtigtes
Geschäftsinteresse macht einen nach UWG, TDDDG, TKG oder anderem Spezialrecht
unzulässigen Kontaktweg nicht zulässig. `PO-004` muss den konkreten Betreiber,
Tenantvertrag, Provider, Absender, Wortlaut und Ende-zu-Ende-Flow prüfen.

Bis dahin gilt fachlich:

```text
unapproved real processing -> fail closed / reason legal_basis_unapproved
```

Der Reason Code ist eine zukünftige Domänenanforderung, noch keine implementierte
API. Fake-/Replay-Fälle werden unveränderlich als synthetisch markiert und
erzeugen keine Außenwirkung.

## 2. Rollenhypothese je Verarbeitung

Rollen werden funktional je Zweck bestimmt, nicht pauschal je Unternehmen oder
allein nach Vertragsbezeichnung.

| Verarbeitung | Tenant | `[PLATTFORMBETREIBER_OFFEN]` | Externe | Status/offene Prüfung |
|---|---|---|---|---|
| Callbearbeitung, Textback, Formular und Lead | voraussichtlich Verantwortlicher: bestimmt Kundenzweck, Template und Bearbeitung | voraussichtlich Auftragsverarbeiter | CPaaS/ESP/Hosting voraussichtlich Unterauftragsverarbeiter; Carrier ggf. eigener Verantwortlicher | `real_blocker`: Art.-28-Vertrag, TDDDG/TKG und eigene Providerzwecke klären |
| Tenant-Nutzerkonto und Vertragsadministration | Verantwortlicher für Beschäftigten-/Mitgliedschaftsentscheidungen möglich | für eigene Vertrags-, Account- und Sicherheitszwecke ggf. eigener Verantwortlicher | Identity-Provider je Vertrag Auftragsverarbeiter/Unterauftragsverarbeiter | `research_hypothesis`: Zwecke und Informationen trennen |
| Plattformsecurity, Fraud, Missbrauch und Incident Response | erhält Informationen/Auflagen | für eigenständig bestimmte Schutzpflichten ggf. Verantwortlicher, im Tenantauftrag zugleich Processor-Funktionen | Hosting, Observability, Provider können eigene Sicherheits-/Pflichtzwecke besitzen | `real_blocker`: Datenfelder, Weisungsgrenze und Empfänger festlegen |
| Produktanalytics | Tenantinteresse möglich | bei eigenem Produktverbesserungszweck wahrscheinlich eigener Verantwortlicher | Analyticsanbieter nur nach Freigabe; öffentliches Formular ohne Dritttracking | `real_blocker`: nur pseudonym ist nicht anonym; Zweck/Opt-out/Retention prüfen |
| Provider-KYC, Nummerierung, Billing und Fraud | Tenant/Anschlussinhaber je Modell | Vertragspartner und ggf. eigener Verantwortlicher | CPaaS/Carrier wahrscheinlich teilweise eigenständige Verantwortliche | `real_blocker`: konkrete Providerbedingungen und Datenklassen fehlen |
| Betroffenenrechte und Löschung | Verantwortlicher entscheidet für Caller-/Leaddaten | unterstützt nach Art. 28; für eigene Daten selbst verantwortlich | Provider/Unterauftragsverarbeiter müssen unterstützen | `real_blocker`: einheitlicher Intake, Identitätsprüfung und Abschlussnachweis fehlen |
| Voice-Interaktion | datenschutzrechtlich später voraussichtlich Verantwortlicher für Gesprächszweck; AI-Act-Rolle regelmäßig Betreiber/`deployer` | datenschutzrechtlich ggf. Auftragsverarbeiter; AI-Act-`provider`, falls das System unter eigenem Namen/Marke entwickelt und bereitgestellt wird | Telephony/STT/LLM/TTS datenschutz- und AI-Act-seitig separat klassifizieren; eigene Retention-/Training-/Sicherheitszwecke möglich | `real_blocker`: vollständige DSFA, konkrete AI-Act-Rollen nach Art. 3 und Verträge fehlen |

Erforderliche Vertragsbausteine vor Realbetrieb:

- AVV nach Art. 28 DSGVO mit Gegenstand, Dauer, Zwecken, Datenarten,
  Betroffenen, Weisungen, TOMs, Auditrechten und Löschung/Rückgabe;
- genehmigtes Unterauftragsverarbeiterverfahren und gleiche Schutzpflichten;
- unverzügliche Processor-Vorfallmeldung, Unterstützung bei Betroffenenrechten,
  DSFA und Aufsichtsbehördenanfragen;
- dokumentierte Abgrenzung eigener Zwecke und keine stillschweigende
  mandantenübergreifende Nutzung für Training, Analytics oder Suppression;
- Exit, Export, Providerlöschung und Schlüssel-/Secretrotation.

## 3. Zweck- und Rechtsgrundlagenmatrix

| ID | Zweck und Daten/Flows | Arbeitshypothese | Spezialrecht/Transparenz | Status und Realbetriebsbedingung |
|---|---|---|---|---|
| `PUR-01` | Tenant, Membership und Vertragszugang; `DATA-01`, `DATA-03`; `FLOW-01` | Art. 6 Abs. 1 lit. b für Vertragsdurchführung mit natürlicher Vertragspartei; sonst lit. f für B2B-Administration, jeweils je Person/Zweck prüfen | Art. 13 bei direkter Erhebung; Beschäftigtenkontext separat | `research_hypothesis`; Betreiber/Vertrag/Information fehlen |
| `PUR-02` | Authentifizierung, Session und Zugriffsschutz; `DATA-02`, `DATA-14`, `DATA-26`; `FLOW-01`, `FLOW-05` | Art. 6 Abs. 1 lit. b/f; rechtliche Securitypflichten ggf. lit. c, konkrete Norm benennen | Ausnahme nach TDDDG § 25 Abs. 2 nur für technisch unbedingt erforderlichen Zugriff zur Erbringung des ausdrücklich gewünschten Dienstes und dokumentiert je Mechanismus; `Secure`/`HttpOnly`/`SameSite` sind zusätzliche Schutzmerkmale, keine Ausnahmebegründung | `research_hypothesis`; Identityanbieter, Cookie-/Sessioninventar und Retention freigeben |
| `PUR-03` | Betriebsprofil, Nummer, Routing, Templates und Aktivierung; `DATA-04`–`DATA-06`, `DATA-25`; `FLOW-02` | Tenantvertrag Art. 6 Abs. 1 lit. b oder B2B-Interesse lit. f; KYC-/Nummernpflicht ggf. lit. c beim jeweiligen Provider | TKG-/Nummernregeln, Providervertrag und Art. 13 | `real_blocker` für echte Nummer/Provider; Fake-Konfiguration erlaubt |
| `PUR-04` | Empfang, Validierung und Ableitung eines verpassten Calls; `DATA-05`, `DATA-08`, `DATA-09`; `FLOW-03` | Art. 6 Abs. 1 lit. b/f wird geprüft, reicht aber nicht ohne telekommunikationsrechtliche Erlaubnis | TDDDG §§ 3/9 schützen auch Umstände erfolgloser Verbindungen; Art. 13/14 und TKG-Rollen offen | `real_blocker`: fachanwaltliche TDDDG-/TKG-Rollen- und Zweckprüfung |
| `PUR-05` | genau ein Textback und Zustellstatus; `DATA-06`, `DATA-07`, `DATA-11`–`DATA-13`; `FLOW-04` | mögliche Art.-6-Hypothesen: lit. b nur bei Maßnahme auf nachweisbare Anfrage; lit. f nur nach dokumentiertem Drei-Stufen-Test; lit. a nur mit wirksamer vorheriger Einwilligung | § 7 UWG bei Werbung; Ein verpasster Anruf beweist Zweck/Consent nicht. Absender, Art. 13/14, Widerspruch und falsche Nummer klären | `real_blocker`: kein Realversand, bis exaktes Template und Flow qualifiziert freigegeben sind |
| `PUR-06` | Capability-Formular und Leadannahme; `DATA-12`, `DATA-14`, `DATA-15`; `FLOW-05` | Art. 6 Abs. 1 lit. b für vorvertragliche Schritte auf bewusste Formulareingabe oder lit. f prüfen; für beabsichtigte Verarbeitung besonderer Kategorien sind Art. 6 und eine Ausnahme nach Art. 9 Abs. 2 kumulativ erforderlich | Begrenzung und schnelle Löschung unerwarteter Art.-9-Daten reduzieren nur das Risiko und ersetzen keine Ausnahme; Art. 13 beim Formular; TDDDG § 25; keine Tracker; kein Diagnostik-/Notrufversprechen | `real_blocker`: Feldminimum, Freitext, Transparenz, Tokenlaufzeit und Art.-9-Prozess offen |
| `PUR-07` | Leadbearbeitung und minimale Betriebsbenachrichtigung; `DATA-16`, `DATA-17`; `FLOW-06` | Art. 6 Abs. 1 lit. b/f abhängig von Anrufer-/Tenantbeziehung | ESP als Unterauftragsverarbeiter; E-Mail nur Minimaldaten + authentifizierter Link | `real_blocker`: ESP, Empfänger, Rollen, Template und Retention fehlen |
| `PUR-08` | Idempotenz, Betrieb, Audit, Security, Abuse und Incident Response; `DATA-08`, `DATA-10`, `DATA-13`, `DATA-18`, `DATA-19`, `DATA-23`, `DATA-24`, `DATA-26` | Art. 6 Abs. 1 lit. f mit Notwendigkeit/Interessenabwägung; konkrete rechtliche Pflichten ggf. lit. c; im Auftrag auch Art.-28-Weisung | Art. 5 Datenminimierung, Art. 25/32, Art. 33/34; TDDDG-Zweckgrenzen für Verkehrsdaten beachten | `research_hypothesis`; nur PII-freie Fake-Telemetrie freigegeben, Realfelder/-fristen offen |
| `PUR-09` | Produktmessung und Funnel; `DATA-20`; `FLOW-06` | Art. 6 Abs. 1 lit. f nur nach Zweck-/Feld-/Opt-out-Prüfung; echte Anonymisierung wäre außerhalb DSGVO | TDDDG § 25 verbietet nichtnotwendiges Endgerättracking ohne Consent; pseudonyme und serverseitig referenzierbare Events bleiben personenbezogen | `real_blocker` für reale Analytics; nur synthetische oder nachweislich anonymisierte Architekturtests erlaubt, keine pseudonymisierten Echtdaten oder Replays aus echten Providerpayloads |
| `PUR-10` | Plan, Usage, Kosten, Vertrag und spätere Abrechnung; `DATA-01`, `DATA-13`, `DATA-21`, `DATA-25` | Art. 6 Abs. 1 lit. b/c/f zweckspezifisch; gesetzliche Aufbewahrung nur für tatsächlich qualifizierte Unterlagen | Steuer-/Handelsrecht erst bei konkreter Gesellschaft und Echtgeld prüfen | `research_hypothesis`; kein Payment/Echtgeld in D-003 |
| `PUR-11` | Transparenz, Rechte, Export, Löschung, Support und Retention; `DATA-07`, `DATA-18`, `DATA-22`–`DATA-25`; `FLOW-07` | Art. 6 Abs. 1 lit. c für DSGVO-Pflichten, lit. f für sichere Verifikation/Abwehr missbräuchlicher Anträge, Vertragsunterstützung nach Art. 28 | Art. 12–22, 30, 32–34 DSGVO; Suppression/Legal Hold nicht mit normalem Leadbestand vermischen | `real_blocker`: Identitätsprüfung, Fristen, Provider-/Backupsemantik und Rollen offen |
| `PUR-12` | Entwicklung und Qualität mit synthetischen Daten; `DATA-27`, `DATA-V09`; `FLOW-00` | `not_applicable`, sofern keine reale Person direkt/indirekt bestimmbar ist | aktuelle Baseline ausschließlich synthetisch; keine echten oder pseudonymisierten Produktivdumps/-payloads als Fixture | erlaubt, solange synthetisch, egress-gesperrt und klar testmarkiert; späteres anonymisiertes Korpus nur nach separatem Reidentifikationsnachweis |
| `PUR-V01` | spätere direkte KI-Sprachinteraktion; `DATA-V01`, `DATA-V02`, `DATA-V03`, `DATA-V04`, `DATA-V08`; `FLOW-V01` | Art. 6/9-Hypothesen erst nach konkretem Zweck/Intent; kein pauschales Consent oder Vertragsargument | AI Act Art. 4/5/50, DSGVO, TDDDG/TKG und § 201 StGB; KI-Hinweis vor Fachinteraktion, Alternative zum Menschen | `real_blocker`: volle DSFA, Anbieter, No-Retention/No-Training und Legal/Product-Freigabe |
| `PUR-V02` | Notfall-/Safety-Erkennung und Handoff; `DATA-V03`–`DATA-V05`; `FLOW-V02` | Art. 6 Abs. 1 lit. d kann nur im echten Einzelfall lebenswichtiger Interessen relevant sein und ist keine allgemeine Produktgrundlage; Art.-9-Ausnahme separat prüfen | kein Notrufdienst, keine Diagnose, keine generative Verzögerung; freigegebener menschlicher Fallback | `real_blocker`: unabhängige Safety-/Legal-Abnahme und Golden-Testkorpus |
| `PUR-V03` | strukturierte Summary und Voice-Usage; `DATA-V06`, `DATA-V07`; `FLOW-V02` | Art. 6 Abs. 1 lit. b/f und ggf. Art. 9 erst nach Feld-/Zweckprüfung | keine wörtlichen Passagen, Stimmeigenschaften oder verdeckten Inferenzen; Unsicherheit/menschliche Korrektur | `real_blocker`: Summary erst nach `V-004`; Rohtranskript bleibt flüchtig |
| `PUR-V04` | verbotene Voice-Ableitungen; `DATA-V10`; `FLOW-V01` | kein Zweck im genehmigten Scope; `not_applicable` nur aufgrund des verbindlichen Produktverbots | keine Voiceprints, Sprecheridentifikation, Emotionserkennung, sensitive biometrische Kategorisierung oder Aufzeichnung | Erhebung, Ableitung, Persistenz und Providertraining verboten; Änderung nur durch neue ADR, DSFA und Legal-/Product-Freigabe |

## 4. Erste SMS – Rechtsfragenpaket

SMS ist elektronische Post. Falls das konkrete Textback oder der Link als
Werbung eingeordnet wird, verlangt § 7 Abs. 2 Nr. 2 UWG grundsätzlich eine
vorherige ausdrückliche Einwilligung. Die Ausnahme in § 7 Abs. 3 UWG setzt alle
dort genannten Bestandskundenbedingungen kumulativ voraus. Ein verpasster
Anruf belegt weder den Anrufzweck noch Verkauf, Bestandskunde oder Einwilligung.

Vor Realversand muss qualifizierte Beratung schriftlich beantworten:

1. Ist das exakt versionierte, neutrale Template eine angeforderte
   Serviceantwort oder bereits Absatzförderung/Direktwerbung?
2. Welcher Nachweis zeigt, dass die Rufnummer durch den Anrufer für diesen Zweck
   übermittelt und nicht gespooft, weitergeleitet oder wiedervergeben wurde?
3. Kann Art. 6 Abs. 1 lit. b greifen, obwohl der Anrufzweck unbekannt ist, oder
   ist ein dokumentierter Art.-6-Abs.-1-lit.-f-Test erforderlich?
4. Falls Einwilligung nötig ist: Wie wird sie vor der ersten SMS eingeholt und
   nachgewiesen, ohne den Anrufenden unzulässig zu kontaktieren?
5. Gilt Art. 13 oder Art. 14 für die über Rufsignalisierung erhaltene Nummer,
   und welche geschichtete Information muss der erste Kontakt enthalten?
6. Welche Absenderidentität, Impressums-/Kontaktangabe, kommerzielle
   Kennzeichnung nach DDG und welcher wirksame Widerspruchspfad sind
   erforderlich? Ein alphanumerischer One-Way-Sender kann `STOP` nicht
   empfangen.
7. Welche Quiet Hours, Frequenzgrenze, Cooldown-, Wrong-Number- und
   Suppressionsregeln gelten je Tenant und tenantübergreifend?

Bis zu einem positiven, dokumentierten Ergebnis bleibt `PUR-05` ein
`real_blocker`. Das Produkt darf keine werblichen Zusätze, freien KI-Text,
Dual-Sends oder stillen WhatsApp-Fallback verwenden.

## 5. Telekommunikationsrechtliche Fragen

§ 3 TDDDG erfasst Inhalte und nähere Umstände der Telekommunikation ausdrücklich
auch bei erfolglosen Verbindungsversuchen. § 9 TDDDG begrenzt die Verarbeitung
von Verkehrsdaten. Vor `FLOW-03`/`FLOW-04` sind daher zu klären:

- Sind Plattform, Tenant oder CPaaS Anbieter eines Telekommunikationsdienstes
  oder an dessen Erbringung Mitwirkende?
- Darf die Caller-ID aus dem erfolglosen Anruf für eine neue SMS-Verbindung
  genutzt werden, und wer darf sie empfangen?
- Was gehört zur Telekommunikationsleistung, was zur nachgelagerten
  Geschäftsanwendung, und welche Zweck-/Löschgrenze folgt daraus?
- Erfüllt der Absender Nummernnutzungsrecht und eindeutige Identität nach TKG?
- Ist Conditional Forwarding einschließlich Caller-ID-Übermittlung rechtlich,
  vertraglich und technisch zulässig?
- Welche Melde-, Geheimhaltungs-, Sicherheits- oder Auskunftspflichten treffen
  den Betreiber bei der gewählten Topologie?

## 6. Transparenz, Betroffenenrechte und TDDDG § 25

Vor Realbetrieb benötigt jeder direkte oder indirekte Erhebungspunkt eine
zuordenbare Information mit Verantwortlichem, Kontakt, DSB soweit erforderlich,
Zwecken, Rechtsgrundlagen, berechtigten Interessen, Empfängern/Transfers,
Retentionkriterien, Rechten und Beschwerdestelle.

- Der erste zulässige Kontakt muss auf eine kurze, mobil lesbare, versionierte
  Information des verantwortlichen Tenants führen; Betreiberrolle klar nennen.
- Das Formular zeigt die Information vor Submit und protokolliert nur Version
  und Zeitpunkt, nicht einen erfundenen Pauschal-Consent.
- Es werden ausschließlich technisch unbedingt erforderliche Cookies/
  Endgerätezugriffe eingesetzt. Dritttracker, Session Replay, Werbe-/Fingerprint-
  SDKs und nichtnotwendige Pixel bleiben aus.
- Access, Rectification, Objection, Restriction, Portability soweit anwendbar,
  Erasure und Complaint erhalten einen verifizierten, tenantisolierten Prozess.
- Telefonnummer allein genügt nicht automatisch als Identitätsnachweis für
  Vollauskunft oder Löschung. Verifikation muss verhältnismäßig sein und darf
  nicht mehr Daten sammeln als der Antrag schützen soll.
- Eine minimale Suppression kann nach Löschung des Leads weiter erforderlich
  sein; Zweck, Rechtsgrundlage, Hash-/Verschlüsselungsmodell und Frist sind
  getrennt freizugeben.

## 7. Transfer- und Subprozessorprüfung

Eine EU-API oder Region beweist keinen reinen EWR-Datenfluss. Zu kartieren sind
Content, Call-/Message-/Account-/Billing-/Fraud-/Support-/Logdaten sowie
Fernzugriffe und Weitertransfers je konkreter juristischer Einheit.

Prüfkette vor Anbieterfreigabe:

1. Datenkategorie, Zweck, Exporteur, Importeur und tatsächlicher Standort;
2. Art.-28-Vertrag und Subprozessorliste/-änderungsprozess;
3. Angemessenheitsbeschluss nach Art. 45 für die konkrete Organisation;
4. andernfalls gültige SCC, Transfer Impact Assessment und ergänzende Maßnahmen;
5. Behördenzugriffe, Verschlüsselung/Schlüsselzugriff und Support;
6. Weitertransfer, Retention, Training, Löschung, Accountschließung und Exit;
7. erneute Prüfung bei Provider-, Produkt-, Region- oder Rechtsänderung.

Der EU-US Data Privacy Framework ist nur für konkret zertifizierte
Organisationen nutzbar und wird wegen laufender rechtlicher Entwicklung und des
anhängigen Rechtsmittelverfahrens `C-703/25 P` unmittelbar vor Vertragsschluss
erneut anhand der Kommissionsliste geprüft. `IE1` ersetzt DPA/TIA nicht.

## 8. DSFA-Screening

### 8.1 Textback-MVP

Die DSK-Muss-Liste zeigt für den engen, regelbasierten Textback keinen bereits
zweifelsfrei feststehenden Automatismus. Das ist keine Feststellung, dass keine
DSFA erforderlich ist. Vor Pilot wird ein formales Screening protokolliert.

| Prüfkriterium | MVP-Beobachtung | Vorläufiges Risiko/Entscheid |
|---|---|---|
| Bewertung/Scoring | Eligibility und Priorität, aber keine Personenscore-/Vertragsentscheidung geplant | begrenzen und Decision Table prüfen |
| erhebliche automatisierte Entscheidung | SMS/Lead erzeugen keine zugesagte Leistung; Wrong-Number-/Belästigungswirkung bleibt | Wirkung und Human Review bewerten |
| systematische Überwachung | wiederkehrende Call-/Message-Metadaten je Tenant | Umfang, Frequenz und TDDDG-Rolle prüfen |
| vertrauliche/höchst persönliche Daten | Freitext kann Gesundheit, Notfall, Adresse oder Dritte enthalten | Feldminimum, Hinweis, Zugriff, Art.-9-Prozess nötig |
| großer Umfang | Pilot klein geplant, aber SaaS skalierbar | Schwellen/Neubewertung bei Kohortenwachstum |
| Datensatzverknüpfung | Call, Message, Formular, Lead, Usage werden korreliert | Zweckbindung und Attribution begrenzen |
| schutzbedürftige Betroffene | Minderjährige und Notfälle können ungeplant auftreten | kein Profiling; sichere Fallbacks erforderlich |
| innovative Technologie | Textback regelbasiert; Provider-/Capability-Verknüpfung | Security-/Privacy-by-Design nachweisen |
| Verhinderung von Rechten/Leistung | Token-/Suppression-/Eligibility kann Zugang beeinflussen | alternative Kontaktmöglichkeit und Rechteprozess |

Ergebnisstatus: `real_blocker`, bis Product/Privacy/Security das Screening
protokolliert und Legal die Schwelle bewertet hat. Verursacht die geplante
Verarbeitung voraussichtlich ein hohes Risiko, wird vor Beginn eine vollständige
DSFA nach Art. 35 durchgeführt. Verbleibt danach trotz Maßnahmen ein hohes
Risiko, ist vor Verarbeitung die Konsultation nach Art. 36 zu prüfen.

### 8.2 Voice

Für Voice gilt projektintern unabhängig von einer Einzelfalldiskussion:

```text
kein Realanruf ohne abgeschlossene vollständige DSFA
```

Die DSK-Muss-Liste nennt KI-Verarbeitung personenbezogener Daten zur Steuerung
der Interaktion, beispielsweise KI-Kundensupport. Hinzu kommen Audio,
unstrukturierte Inhalte, Notfall-/Vulnerabilitätsrisiken, Providerketten und
automatisierte Dialogsteuerung. Für den genehmigten Voice-Scope ist die DSFA
daher vor Realbetrieb verbindlich. Damit ist nach § 38 Abs. 1 Satz 2 BDSG die
Benennung eines Datenschutzbeauftragten unabhängig von der Beschäftigtenzahl
verbindlich zu prüfen und vor Realbetrieb nachzuweisen.

Die DSFA wird bei `V-001`/`V-004` mit realem Zweck, Intents, Provider,
Korpus, Datenfeldern, Betroffenen, Umfang, TOMs, Restrisiken und Human Fallback
neu erstellt; D-003 ist nur die Vorstruktur.

## 9. Voice und EU AI Act

Für das spätere Voice-System gelten mindestens folgende Produktgrenzen:

- angemessene AI-Literacy-Maßnahmen für Entwicklung, Betrieb, Support und
  Tenant-Nutzer gemäß Art. 4 AI Act;
- klarer, zugänglicher KI-Hinweis spätestens zu Beginn der ersten Interaktion
  und vor fachlicher Datenerhebung gemäß Art. 50;
- erreichbarer menschlicher oder asynchroner Rückruf-Alternativweg;
- keine manipulative/täuschende Gesprächsführung und keine Ausnutzung von Alter,
  Behinderung oder sozioökonomischer Lage;
- keine Voiceprints, Sprecheridentifikation, Emotionserkennung, sensitive
  biometrische Kategorisierung oder Persönlichkeits-/Zahlungsfähigkeitsscores;
- keine automatische Entscheidung über Vertrag, Preis, Leistung oder
  Notfallversorgung;
- keine Gesprächsaufzeichnung, Audio-/Rohtranskriptpersistenz, Debug-Stichprobe
  oder Providertraining mit realen Gesprächen;
- strukturierte Summary nur nach separater Freigabe, ohne wörtliche Passagen,
  Stimmmerkmale oder verdeckte Inferenzen;
- § 201 StGB, DSGVO, TDDDG/TKG und Providerbedingungen zusätzlich prüfen. Ein
  AI-Act-Hinweis ersetzt keine anderweitig erforderliche Erlaubnis.

## 10. Offene Rechtsfragen und Freigabeowner

| ID | Frage/Nachweis | Owner | Trigger | blockiert |
|---|---|---|---|---|
| `LQ-01` | juristische Identität, Anschrift, Datenschutzkontakt, Aufsicht und DSB-Pflicht des Betreibers | Product/Legal | vor Vertrag/Information | alle Realflüsse |
| `LQ-02` | exaktes SMS-Template: Service oder Werbung; DSGVO-/UWG-Grundlage | Product/Legal | vor `M-001` real | `FLOW-04` |
| `LQ-03` | TDDDG/TKG-Rollen, Verkehrsdatenzweck, Conditional Forwarding und Nummernnutzungsrecht | Legal/Provider | vor Account/Nummer | `FLOW-03`, `FLOW-04` |
| `LQ-04` | Art.-13/14-Information, Absender, Widerspruch und Wrong-Number-Prozess | Product/Legal/Privacy | vor Templatefreigabe | `FLOW-04`, `FLOW-05` |
| `LQ-05` | AVV, Subprozessoren, DPA/TIA, Supportstandorte und Exit je Anbieter | Legal/Security | vor externer Verbindung | jeweiliger Providerflow |
| `LQ-06` | Feldminimum, Freitext/Sonderdaten, Minderjährige und Notfalltext | Product/Legal/Safety | vor `M-005` | Formular-/Leadrealbetrieb |
| `LQ-07` | Retention, Suppression, Legal Hold, Backups und Providerlöschung | Legal/Privacy/Ops | vor `B-004`/Pilot | persistente Realdaten |
| `LQ-08` | DSAR-Verifikation, Exportweg, Antwort-/Löschabschluss | Legal/Privacy/Security | vor Pilot | Betroffenenrechte |
| `LQ-09` | Textback-DSFA-Screening und ggf. DSB | Product/Privacy/Security/Legal | vor Pilot | Textback-Go-live |
| `LQ-10` | Voice-DSFA, AI-Act-Rollen/Disclosure/Literacy, § 201 StGB, Provider-No-Retention/No-Training | Product/Legal/Safety/Security | nach `G7`, vor Realanruf | alle Voice-Realflüsse |
| `LQ-11` | Incident-/Breach-Rollen, Processor-Meldezeit und Art.-33/34-Prozess | Security/Privacy/Legal | vor Realdaten | Incidentbetrieb |

## 11. Amtliches Quellenregister

Alle Quellen wurden am 2026-08-08 geprüft. Recht, Guidance, Providerstatus und
Transfermechanismen werden vor jeder Realfreigabe erneut verifiziert.

### Datenschutz und Rollen

- [DSGVO – Verordnung (EU) 2016/679](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679)
- [EDPB Guidelines 07/2020 – Controller und Processor](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en)
- [EDPB Guidelines 4/2019 – Data Protection by Design/Default](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-42019-article-25-data-protection-design-and_en)
- [BfDI-Muster zur Auftragsverarbeitung](https://www.bfdi.bund.de/SharedDocs/Downloads/DE/Muster/Muster_zur_Auftragsverarbeitung.pdf?__blob=publicationFile&v=2)
- [BDSG § 38 – Datenschutzbeauftragte](https://www.gesetze-im-internet.de/bdsg_2018/__38.html)

### Kommunikation und digitale Dienste

- [UWG § 7 – Unzumutbare Belästigungen](https://www.gesetze-im-internet.de/uwg_2004/__7.html)
- [DSK-Orientierungshilfe Direktwerbung](https://www.datenschutzkonferenz-online.de/media/oh/OH-Werbung_Februar%202022_final.pdf)
- [DDG § 5 – allgemeine Informationspflichten](https://www.gesetze-im-internet.de/ddg/__5.html)
- [DDG § 6 – kommerzielle Kommunikation](https://www.gesetze-im-internet.de/ddg/__6.html)
- [Bundesnetzagentur – SMS-Spam](https://www.bundesnetzagentur.de/DE/Vportal/TK/Aerger/Faelle/SMSSpam/start.html)
- [TDDDG § 3 – Fernmeldegeheimnis](https://www.gesetze-im-internet.de/ttdsg/__3.html)
- [TDDDG § 9 – Verarbeitung von Verkehrsdaten](https://www.gesetze-im-internet.de/ttdsg/__9.html)
- [TDDDG § 25 – Endeinrichtungen](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [DSK-Orientierungshilfe Digitale Dienste](https://www.datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf)
- [TKG § 3 – Begriffsbestimmungen](https://www.gesetze-im-internet.de/tkg_2021/__3.html)
- [TKG § 120 – Rufnummernübermittlung](https://www.gesetze-im-internet.de/tkg_2021/__120.html)
- [Bundesnetzagentur – Meldepflicht](https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Unternehmenspflichten/Meldepflicht/artikel.html)

### DSFA, Transfers, Löschung und Vorfälle

- [BfDI – Datenschutz-Folgenabschätzung](https://www.bfdi.bund.de/DE/Fachthemen/Inhalte/Technik/Datenschutz-Folgenabschaetzungen.html)
- [DSK-Muss-Liste für nichtöffentliche Stellen](https://www.datenschutzkonferenz-online.de/media/ah/20181017_ah_DSK_DSFA_Muss-Liste_Version_1.1_Deutsch.pdf)
- [SCC – Durchführungsbeschluss (EU) 2021/914](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj)
- [EDPB Recommendations 01/2020 – ergänzende Transfermaßnahmen](https://www.edpb.europa.eu/documents/recommendation/recommendations-012020-on-measures-that-supplement-transfer-tools-to_en)
- [BfDI – Internationale Datenübermittlungen](https://www.bfdi.bund.de/DE/Fachthemen/Inhalte/Europa-Internationales/Internationaler_Datentransfer.html)
- [EU-Kommission – Angemessenheitsbeschlüsse und DPF-Liste](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en)
- [EDPB – EU-US DPF FAQ für europäische Unternehmen, Version 2.0](https://www.edpb.europa.eu/documents/other-guidance/eu-us-data-privacy-framework-faq-for-european-businesses-version-20_en)
- [EuGH – anhängiges Verfahren C-703/25 P](https://infocuria.curia.europa.eu/tabs/redirect/juris/liste.jsf?num=C-703%2F25+P)
- [BfDI – Löschkonzept](https://www.bfdi.bund.de/SharedDocs/Downloads/DE/DokumenteBfDI/AccessForAll/2023/2021_Loeschkonzept-BfDI.pdf?__blob=publicationFile&v=2)
- [EDPB – Data Breaches für kleine Unternehmen](https://www.edpb.europa.eu/sme/assess-the-risks/data-breaches_en)

### Voice und KI

- [AI Act – Verordnung (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R1689)
- [EU-Kommission – Transparenzpflichten nach Art. 50](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- [StGB § 201 – Vertraulichkeit des Wortes](https://www.gesetze-im-internet.de/stgb/__201.html)
