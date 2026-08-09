# Provider- und Kanal-Scorecard

- Status: Desk-Spike; technische Account-Tests ausstehend
- Version: 0.1
- Stand/Preisabruf: 2026-08-08
- Owner: Product/Engineering
- Task: `D-002`
- Vergleich: Twilio vs. Vonage; SMS vs. WhatsApp
- Entscheidungsstatus: Empfehlung, keine Anbieter-/Vertragsfreigabe

## 1. Ergebnis in Kürze

Für einen kontrollierten Pilot ist derzeit folgende Kombination am besten
belegt:

- **Telefonie-Hypothese:** Twilio Programmable Voice in Region `IE1`.
- **Messaging-Hypothese:** SMS als Primärkanal; WhatsApp erst nach belegtem
  Opt-in-, Template- und Business-Onboarding-Pfad.
- **Nummern-Hypothese:** bestehende Betriebsnummer bleibt beim heutigen
  Carrier und leitet nur bei Nichtannahme an eine Provider-Nummer weiter.
- **Entwicklungsbaseline:** ausschließlich Fake-/Replay-Adapter, bis die
  Account-, Vertrags-, Daten- und Realversandfreigaben vorliegen.

Twilio erreicht im dokumentbasierten Providervergleich 74/100 Punkte, Vonage
66/100. Der Abstand ist kein Produktionsnachweis: Vonage hat die stärkere
Webhook-Signatur und explizitere `unanswered`-Events, während Twilio aktuell bei
öffentlicher Preis-, Test- und Deutschland-Dokumentation besser belegt ist.

Die Empfehlung ist nur dann freigabefähig, wenn die offenen Tests aus Abschnitt
11 und die Vertrags-/Datenschutzfragen aus Abschnitt 12 erfolgreich sind.

## 2. Produkt- und Architekturannahmen

### 2.1 Pilotkontext

- SHK-Service-/Reparaturbetriebe mit 2–30 Mitarbeitenden
- Deutschland, deutschsprachig
- eine Rufnummer je Tenant
- genau ein Send-Intent pro dedupliziertem Missed Call/Cooldown; reale
  Textreaktion ausschließlich nach separater Kanal-/Rechtsfreigabe
- kein Voice-Agent und keine Aufzeichnung
- keine echte Nachricht ohne separate Rechts-/Kanal-/Go-live-Freigabe

### 2.2 Rufnummern-Topologien

| Topologie | Beschreibung | Vorteil | Hauptrisiko | Pilotvotum |
|---|---|---|---|---|
| A – Conditional Forwarding | bestehende Betriebsnummer leitet nach Nichtannahme an CPaaS-Nummer | keine Portierung; bestehende Nummer bleibt erhalten | Carrier-Setup, Caller-ID-Erhalt und genaue Ereignis-/Kostenwirkung müssen live getestet werden | bevorzugte Hypothese |
| B – CPaaS als Primärnummer | neue/portierte Provider-Nummer nimmt an und wählt Betrieb | vollständige Call-Timeline und spätere Voice-Fähigkeit | Nummernregulierung, zwei Call-Legs, Kundenumstellung, höhere variable Kosten | nicht erster Pilotpfad |
| C – Portierung | bestehende Nummer wird zum CPaaS portiert | einheitliche Providerkontrolle | Laufzeit, Ausfall-/Rollbackrisiko, deutsche Nummern-/Range-Regeln | frühestens nach Pilotbeleg |

Die Provider-Dokumentation beweist Topologie A nicht Ende-zu-Ende. Insbesondere
müssen bedingte Rufumleitung, übermittelte Original-Caller-ID, Verhalten bei
Voicemail/Busy und die Abrechnung mit mindestens zwei deutschen Carriern
kontrolliert getestet werden.

## 3. Bewertungsmethode

Bewertung je Kriterium: `0` nicht vorhanden, `1` schwach/offen, `2` vorhanden
mit Einschränkung, `3` stark und öffentlich belastbar belegt. Punkte =
`Gewicht × Bewertung`; Maximum 300, anschließend auf 100 normalisiert.

| Kriterium | Gewicht | Twilio | Vonage | Begründung in Kurzform |
|---|---:|---:|---:|---|
| Deutsche Nummern/Regulierung | 10 | 2 | 1 | Twilio veröffentlicht DE-Preise, Regulatory Bundle und Portingdetails; Vonage öffentlich nur generische Nummernfähigkeit |
| Missed-Call-Semantik | 15 | 2 | 3 | Twilio liefert Callstatus inkl. `no-answer`; Vonage dokumentiert `unanswered` explizit |
| Webhook-Signatur/Replay | 10 | 2 | 3 | Twilio HMAC-Signatur ohne eingebauten Timestamp; Vonage JWT mit `iat`, `jti`, `payload_hash` |
| Event-ID/Reihenfolge/Retry | 10 | 2 | 2 | beide benötigen kanonischen deterministischen Inbox-Key und eigene Idempotenz |
| Sandbox/Testbarkeit | 5 | 2 | 2 | Twilio Test Credentials erzeugen keine Callbacks; Vonage Free Credit/Sandbox ersetzt keine deterministischen Voice-Fixtures |
| SMS-Fähigkeit | 5 | 3 | 3 | beide senden SMS und liefern Status/DLR |
| WhatsApp-Fähigkeit | 5 | 3 | 2 | beide unterstützen Templates; Vonage dokumentiert Limited Availability |
| EU-Verarbeitung/Region | 10 | 2 | 2 | Twilio `IE1`; Vonage EU Dublin/Frankfurt; vollständige Produkt-/Metadatenabdeckung offen |
| DPA/Transfers/Subprozessoren | 10 | 2 | 1 | Twilio DPA öffentlich detailliert; Vonage DPA verlinkt, konkrete Prüfung/Anhänge offen |
| Preistransparenz | 10 | 3 | 1 | Twilio DE Voice/SMS öffentlich; Vonage verweist für aktuelle Länderpreise auf Dashboard/XLS |
| Support/Status/SLA | 3 | 2 | 2 | öffentliche Supportwege, höhere Pläne kostenpflichtig; Pilot-SLA ungeprüft |
| Portierung/Ownership | 3 | 2 | 1 | Twilio DE-Porting dokumentiert, aber Subassignment-/Range-Risiken; Vonage DE-Details offen |
| SIP/Media-Streaming später | 2 | 3 | 3 | beide bieten SIP und bidirektionale WebSocket-Audiopfade |
| Exit/Portabilität | 2 | 2 | 2 | Ports reduzieren Lock-in; Nummern-/Datenexport vertraglich zu verifizieren |
| **Gewichtete Summe** | **100** | **222/300 = 74** | **199/300 = 66** | Desk-Score, keine Freigabe |

## 4. Telefonie: technischer Vergleich

### 4.1 Twilio

**Belegt**

- Deutsche lokale Voice-Nummern werden öffentlich mit 1,35 USD/Monat und
  eingehenden Calls mit 0,0100 USD/Minute ausgewiesen.
- Call-Ressourcen verwenden eine stabile `CallSid`. Callstatus umfassen unter
  anderem `ringing`, `completed`, `busy`, `failed` und `no-answer`; Status-
  Callbacks können `initiated`, `ringing`, `answered`, `completed` liefern und
  enthalten eine `SequenceNumber`.
- Alle Webhooks tragen `X-Twilio-Signature`; für Form-Requests wird die exakte
  URL plus vollständiger Parameterbestand signiert. JSON nutzt zusätzlich
  `bodySHA256`. Twilio empfiehlt die SDK-Validierung, da neue Felder ohne
  Vorankündigung hinzukommen können.
- Konfigurierbare Callback-Retries liefern
  `I-Twilio-Idempotency-Token`. Twilio veröffentlicht keine feste Webhook-IP-
  Range, daher darf eine Allowlist nur ergänzend und nicht primär sein.
- Voice- und Messaging-Workloads können in der Ireland-Region `IE1` verarbeitet
  werden. Media Streams sind dort verfügbar.
- Bidirektionale Media Streams und SIP sind für eine spätere, separat
  freizugebende Voice-Phase vorhanden.
- Deutschland-Portierung für Local/Toll-Free Voice ist dokumentiert; lokale
  Nummernblöcke müssen gegebenenfalls vollständig portiert werden.

**Einschränkungen/offen**

- Es gibt keinen fachlichen Eventtyp `missed_call`; er muss aus Topologie und
  Status (`no-answer`, `busy`, `failed`, Weiterleitungsereignis) deterministisch
  abgeleitet werden.
- Die Statuscallback-Dokumentation weist keine eigenständige Event-ID aus.
  Vorgeschlagener Inbox-Key:
  `sha256("twilio|" + accountRef + "|" + CallSid + "|" + SequenceNumber + "|" + CallStatus)`.
- Die HMAC-Signatur enthält keinen für den Use Case dokumentierten signierten
  Eventtimestamp. Replay-Schutz benötigt Inbox-Unique-Key, kurze
  Provider-Retention, Secretrotation und gegebenenfalls Proxy-/Empfangszeit-
  Grenzen; die Signatur allein reicht nicht.
- Test Credentials verursachen keine Voice-/SMS-Statuscallbacks. Contract-
  Fixtures und Fake-/Replay-Adapter bleiben zwingend.
- Die Twilio-DPA sieht je nach Datenklasse sowohl Processor- als auch
  eigenständige Controller-Rollen und internationale Transfermechanismen vor.
  `IE1` ist daher kein Ersatz für DPA-/TIA-/Subprozessorprüfung.
- Deutsche Nummern dürfen nach Twilios Deutschland-Bedingungen nicht ohne
  Weiteres an Endnutzer untervermietet/sub-assigned werden. Das Tenant-
  Ownership-Modell muss vor Bestellung rechtlich und vertraglich bestätigt
  werden.

### 4.2 Vonage

**Belegt**

- Voice Event Webhooks dokumentieren `started`, `ringing`, `answered`, `busy`,
  `cancelled`, `unanswered`, `disconnected`, `rejected`, `failed`, `timeout` und
  `completed`. `uuid` und `conversation_uuid` ermöglichen Call-Korrelation.
- Signed Webhooks sind für neue Voice-, Messages- und Dispatch-Anwendungen
  standardmäßig verfügbar. Das HS256-JWT enthält `iat`, `jti`, `iss`,
  `payload_hash`, `api_key` und optional `application_id`.
- Die EU-Voice-Region nutzt Dublin mit Frankfurt-Fallback. Vonage dokumentiert,
  dass Voice-Nutzerdaten einer Geo-Region nicht aus einer anderen zugänglich
  sind. Die Messages API besitzt einen EU-Endpunkt.
- Voice unterstützt SIP sowie bidirektionale WebSocket-Audioverbindungen.
- SMS bietet Status-/Delivery-Receipts; die Messages API unterstützt kanal-
  übergreifende Statuswebhooks.

**Einschränkungen/offen**

- Öffentliche dynamische Preislisten liefern im abrufbaren HTML keine
  Deutschlandwerte und verweisen auf Dashboard/XLS. Ein belastbarer Kosten-
  vergleich erfordert Angebot oder freigegebenes Konto.
- Öffentliche Unterlagen belegen im Spike keine konkreten aktuellen deutschen
  Nummerntypen, KYC-/Adressanforderungen und Portierungsfristen.
- `uuid + status + timestamp` ist ein guter deterministischer Inbox-Key;
  `jti` wird nur als Transport-/Replay-Indikator behandelt, bis Retry-Verhalten
  mit identischer Payload getestet ist.
- Ältere Voice-Anwendungen können Signed Webhooks deaktiviert haben. Der Adapter
  muss unsignierte Callbacks fail-closed ablehnen und darf nicht automatisch
  auf unsigniert zurückfallen.
- Die verlinkte DPA, Produktsupplements, Subprozessoren, Retention und EU-
  Datenzentrum-Leistungsumfang müssen vor Vertrag anwaltlich/vertraglich geprüft
  werden.
- Vonage dokumentiert WhatsApp als Limited Availability; ein Konto ist nicht
  garantiert.

## 5. Messagingwege: identische Bewertung

| Kriterium | Gewicht | SMS | WhatsApp | Erläuterung |
|---|---:|---:|---:|---|
| Endnutzer-Reichweite | 15 | 3 | 2 | SMS benötigt keine App; WhatsApp nur bei aktivem Konto |
| Onboarding/Time-to-Value | 15 | 3 | 1 | SMS-Sender/Nummer ist einfacher; WhatsApp benötigt Business-/Template-Freigabe |
| Business-initiated Constraints | 20 | 2 | 1 | beide rechtlich offen; WhatsApp verlangt zusätzlich Opt-in und Template außerhalb Servicefenster |
| Zustell-/Statusmodell | 10 | 2 | 3 | SMS-DLR kann Carrier- statt Handsetbestätigung sein; WhatsApp bietet reichere Zustände |
| Kostentransparenz | 10 | 3 | 2 | SMS pro Segment; WhatsApp Plattform- plus dynamische Meta-Kategoriegebühr |
| Link/Brand/UX | 10 | 2 | 3 | WhatsApp reichhaltiger; SMS universeller, aber Segment-/Encodinggrenzen |
| Antwortfähigkeit | 5 | 1 | 3 | alphanumerische SMS ist one-way; WhatsApp dialogfähig |
| Daten-/Subprozessor-Komplexität | 15 | 2 | 1 | WhatsApp fügt Meta, Business Account und weitere Richtlinien hinzu |
| **Gewichtete Summe** | **100** | **235/300 = 78** | **175/300 = 58** | Rechtsfreigabe für beide ausstehend |

### Kanalvotum

SMS ist die Pilot-Hypothese, weil sie den universelleren und schnelleren
Testpfad bietet. Sie ist nicht automatisch rechtlich zulässig: Zweck,
Kommunikationsrecht, Absender, Widerspruch/Suppression und Inhalt sind in
`D-003` als Blocker strukturiert; ausschließlich `PO-004` darf den konkreten
Realflow nach qualifizierter Prüfung freigeben.

WhatsApp bleibt ein späterer, kontrollierter Kanal. Ein verpasster Telefonanruf
öffnet kein WhatsApp-Kundenservicefenster. Die erste WhatsApp-Nachricht wäre
geschäftsinitiiert und benötigt nach Providerdokumentation vorherigen Opt-in
sowie ein genehmigtes Template. Ob der konkrete Textback als Utility oder
Marketing klassifiziert wird, darf das Produkt nicht selbst festlegen.

## 6. Anonymisierte Contract-Fixtures

Die Beispiele sind aus öffentlichen Schemata abgeleitete, reduzierte Fixtures.
Sie enthalten keine realen Nummern, Accounts oder Signaturen und müssen in
einem freigegebenen Account-Test gegen tatsächlich empfangene Payloads ersetzt
oder bestätigt werden.

### 6.1 Twilio – terminaler Voice-Status

```json
{
  "CallSid": "CA00000000000000000000000000000000",
  "AccountSid": "AC00000000000000000000000000000000",
  "From": "ANON_CALLER_E164",
  "To": "ANON_TENANT_E164",
  "Direction": "inbound",
  "CallStatus": "no-answer",
  "SequenceNumber": "3"
}
```

Transportmetadaten:

```text
X-Twilio-Signature: SYNTHETIC_NOT_A_REAL_SIGNATURE
I-Twilio-Idempotency-Token: SYNTHETIC_RETRY_TOKEN
Content-Type: application/x-www-form-urlencoded
```

Kanonisches Mapping erst nach Topologietest:

```text
providerCallId = CallSid
providerEventKey = sha256(accountRef|CallSid|SequenceNumber|CallStatus)
canonicalStatusCandidate = missed
```

### 6.2 Vonage – `unanswered`

```json
{
  "from": "ANON_CALLER_E164",
  "to": "ANON_TENANT_E164",
  "uuid": "00000000-0000-0000-0000-000000000001",
  "conversation_uuid": "CON-00000000-0000-0000-0000-000000000002",
  "status": "unanswered",
  "direction": "inbound",
  "timestamp": "2000-01-01T00:00:00.000Z"
}
```

Transportmetadaten:

```text
Authorization: Bearer SYNTHETIC_NOT_A_REAL_JWT
Content-Type: application/json
```

Kanonisches Mapping:

```text
providerCallId = uuid
providerConversationId = conversation_uuid
providerEventKey = sha256(applicationRef|uuid|status|timestamp)
canonicalStatusCandidate = missed
```

### 6.3 Signatur-Prüfvertrag

Twilio:

1. öffentliche URL exakt wie von Twilio gesehen rekonstruieren;
2. Raw Body bzw. vollständige unveränderte Form-Parameter bewahren;
3. offizielle SDK-Validierung ausschließlich im Inbound-Adapter aufrufen;
4. bei ungültiger/fehlender Signatur ohne Persistenz fachlicher Daten ablehnen;
5. Retry-Token nur als Transportmetadatum, fachliche Idempotenz über Inbox-Key.

Vonage:

1. `Authorization: Bearer` verlangen und Algorithmus auf HS256 pinnen;
2. Signatursecret anhand erlaubtem `api_key` bestimmen;
3. `iss`, `iat`, `jti`, optional `application_id` und `payload_hash` validieren;
4. Raw-Body-SHA-256 konstantzeitlich mit `payload_hash` vergleichen;
5. `jti` kurzzeitig gegen Replay sperren und fachlich zusätzlich Inbox-Key
   deduplizieren.

## 7. Kostenmodell je 100 verpassten Anrufen

Alle Beträge sind Listenpreis-Hypothesen ohne Steuer, Wechselkurs, Rabatte,
Carrier-/Regulatory-Zuschläge, Weiterleitungskosten des Bestandsproviders,
Support und interne Infrastruktur. SMS wird pro Segment berechnet; die Vorlage
muss daher auf genau ein GSM-7-Segment oder bewusst kalkulierte Segmente
begrenzt werden.

### 7.1 Twilio – öffentlich belegbare Werte

Stand 2026-08-08:

| Position | Listenpreis |
|---|---:|
| deutsche lokale Voice-Nummer | 1,35 USD/Monat |
| eingehender Local Call | 0,0100 USD/Minute |
| ausgehender Mobile Call aus EEA | 0,0420 USD/Minute |
| deutsche Outbound-SMS | 0,112 USD/Segment |
| deutsche Mobile-Nummer für bidirektionale SMS | 30,00 USD/Monat |
| WhatsApp Twilio-Plattform | 0,005 USD je inbound/outbound Nachricht |
| WhatsApp Meta | variable Gebühr je Land und Templatekategorie |

#### Topologie A – Conditional Forwarding, SMS

Konservative Bandbreite, solange ungeklärt ist, ob/wie lange der an Twilio
weitergeleitete Call providerseitig als angenommene Voice-Minute berechnet wird:

```text
Nummer                         1,35 USD
100 SMS × 1 Segment × 0,112  11,20 USD
Voice ingress                  0,00 bis 1,00 USD
------------------------------------------------
Providerkosten                12,55 bis 13,55 USD/Tenant/Monat
```

Die Obergrenze setzt pauschal eine berechnete eingehende Minute je Missed Call
an. Der echte Wert muss über Billing Export belegt werden.

#### Topologie B – CPaaS als Primärnummer, SMS

Nur als Vergleich: 100 verpasste Calls, je 30 Sekunden Inbound- und Outbound-
Mobile-Leg, ohne Rundungsaufschlag:

```text
Nummer                                  1,35 USD
50 eingehende Minuten × 0,0100          0,50 USD
50 ausgehende Mobile-Minuten × 0,0420   2,10 USD
100 SMS × 1 Segment × 0,112            11,20 USD
-------------------------------------------------
Providerkosten                         15,15 USD
```

Diese Rechnung unterschätzt einen realen Primärnummerbetrieb, weil auch
angenommene Calls, Rufdauer, Voicemail und mögliche Mindestabrechnung anfallen.

#### Topologie A – WhatsApp

```text
1,35 USD Nummer
+ 0,00 bis 1,00 USD Voice ingress
+ 100 × (0,005 USD Twilio + Meta_DE_Kategoriepreis)
```

Ohne verbindliche Kategorie und aktuellen Meta-Rate-Export wird kein Betrag als
Planwert verwendet.

### 7.2 Vonage – Quote erforderlich

Die öffentlichen Voice-/SMS-Seiten zeigen dynamische Länderpreise im
abgerufenen HTML nicht an und verweisen auf Dashboard/XLS. Das Modell bleibt
daher absichtlich parametrisiert:

```text
SMS = N_DE_voice
    + voice_minutes × P_DE_voice_in
    + 100 × sms_segments × P_DE_sms_out

WhatsApp = N_DE_voice
         + voice_minutes × P_DE_voice_in
         + 100 × (P_vonage_wa_platform + P_meta_de_category)
```

Vor einem finanziellen Votum sind ein datiertes schriftliches Angebot oder ein
freigegebener Dashboard-/Pricing-Export und ein tatsächlicher Billing-Test
erforderlich.

## 8. Datenregion, Vertrag und Retention

| Frage | Twilio | Vonage | Freigabestatus |
|---|---|---|---|
| EU Voice Processing | `IE1` öffentlich dokumentiert | EU: Dublin, Frankfurt-Fallback | technisch plausibel, Account-Test offen |
| EU Messaging Processing | SMS-Inbound-Region `IE1` dokumentiert; Produktabdeckung einzeln prüfen | EU-geospezifischer Messages-Endpunkt dokumentiert | vollständiger Datenfluss offen |
| DPA | öffentlich, Stand 2026-04-09; Processor- und Controllerrollen, BCR/DPF/SCC | offizielle DPA-Seite vorhanden | Legal Review offen |
| Daten außerhalb EU | Verwaltungs-/Billing- und Transferausnahmen möglich | nicht vollständig aus öffentlichem Spike belegbar | TIA/Subprozessorprüfung offen |
| Content-/Log-Retention | je Produkt/Konto zu konfigurieren und vertraglich prüfen | Redact/Reports teils Zusatzprodukt; genaue Defaults offen | vor Pilot festlegen |
| Recording | produktseitig deaktiviert | produktseitig deaktiviert | verbindliche ADR-008 |

Eine EU-API-URL ist kein Beleg dafür, dass Account-, Support-, Abrechnungs-,
Fraud-, Carrier- und Subprozessordaten ausschließlich in der EU verarbeitet
werden.

## 9. Portierung, Nummerninhaberschaft und Exit

### Twilio

- deutsche Local- und Toll-Free-Voice-Portierung ist dokumentiert;
- lokale Nummernranges können nur vollständig portierbar sein;
- KYC/Regulatory Bundle und aktuelle Abrechnung/LOA sind erforderlich;
- der SaaS-Betreiber darf deutsche Nummern nicht ungeprüft an Tenants
  untervermieten oder sub-assignen;
- Porting API ist für Deutschland nicht der dokumentierte Self-Service-Pfad;
  der Prozess läuft über Support/Console.

### Vonage

- globale Nummernmiete und E.164-Verarbeitung sind dokumentiert;
- konkrete deutsche Nummern-, KYC-, Porting- und Exitbedingungen sind vor
  Votum einzuholen.

### Providerunabhängiger Exit

- kanonische Call-/Message-IDs und Zustände bleiben eigene Domainverträge;
- Raw Providerpayload nur in kurzlebiger Inbox mit klassifizierter Retention;
- Templates, CommunicationPermissionEvidence, Leads und Usage bleiben eigene Source of Truth;
- Nummern-/Portierungsregister erfasst rechtlichen Inhaber, Provider,
  Vertragsende, Porting-PIN/LOA niemals im normalen App-Log;
- Fake-/Replay-Contract-Suite muss ein zweiter Adapter unverändert bestehen.

## 10. Support und Betriebsfähigkeit

Vor Pilot werden je Provider belegt:

- öffentliches Status-Feed und Incident-Historie;
- Standard-Supportkanal, Betriebszeit und erste Antwort;
- Kosten und Laufzeit eines SLA-/Premium-Supportplans;
- Fraud-/Budgetlimits und schnelle Sperrmöglichkeit;
- Secretrotation ohne Nachrichten-/Webhookverlust;
- Datenexport, Accountschließung und Nummern-Port-out.

Vonage nennt bezahlte Essentials/Premium/Enterprise-Angebote und 24/7/SLA-
Leistungen in höheren Supportplänen. Twilio-Plan und beide konkrete Angebote
müssen im Account-/Sales-Schritt verglichen werden.

## 11. Identische Account-Testmatrix

Keiner dieser Tests wurde ausgeführt, weil kein Account, Key, Vertrag, Domain
oder eine freigegebene Testnummer vorliegt. Dieselben Fälle gelten für beide
Provider; Ergebnisse werden als Fixture, Requesthash, erwartetes/erhaltenes
Mapping und Billingzeile dokumentiert.

| ID | Test | Erwarteter Nachweis | Status |
|---|---|---|---|
| TEL-01 | deutsche Local-Nummer suchen, aber nicht bestellen | Nummerntyp, Voice/SMS-Fähigkeit, KYC, Preis | not_run |
| TEL-02 | Conditional Forwarding nach Nichtannahme | Original-Caller-ID, Call-ID, Status, Timestamp, UX | not_run |
| TEL-03 | Anruf wird vor Weiterleitung angenommen | kein Missed-Call-Event beim CPaaS | not_run |
| TEL-04 | Busy, Reject, Timeout, Voicemail | eindeutige kanonische Decision Table | not_run |
| TEL-05 | Duplicate und Out-of-order je 100-mal replayen | exakt ein Call/ein Domain Event | fake/replay später |
| WEB-01 | gültige Signatur | 2xx nach persistenter Inbox | not_run |
| WEB-02 | Body/URL/Signatur manipulieren | Ablehnung ohne Fachwirkung | not_run |
| WEB-03 | alter Timestamp/JWT bzw. Replay | Ablehnung oder idempotentes 2xx gemäß Vertrag | not_run |
| WEB-04 | 429/5xx/Timeout provozieren | dokumentierte Retries und stabiler Retry-Identifier | not_run |
| MSG-01 | einsegmentige SMS an freigegebene Testnummer | Accept, DLR, Preis, Segmentzahl | not_run |
| MSG-02 | Unicode/Long SMS | deterministische Segmentierung und Kosten | not_run |
| MSG-03 | WhatsApp außerhalb Servicefenster | nur freigegebenes Template + nachgewiesener Opt-in | not_run |
| MSG-04 | Duplicate Send mit Idempotency Key | keine doppelte Außenwirkung | fake/replay später |
| DATA-01 | Region pro Voice/Messaging-Ressource | EU-Endpunkt plus Vertrags-/Lognachweis | not_run |
| COST-01 | Billing Export für 100 synthetische Fälle | Modellabweichung und echte Stückkosten | not_run |
| EXIT-01 | Nummer/Template/Daten exportieren und Adapter deaktivieren | dokumentierte Dauer, Kosten, Restdaten | not_run |

Reale Tests benötigen ein separates Testkonto, Budgetcap, freigegebene
synthetische Nummern, ausdrückliche Kosten-/Kontaktfreigabe und einen
Testdaten-Löschplan.

## 12. Blocker vor bindender Auswahl

1. `D-001` ist erfüllt; das D-003-Prüfpaket liegt vor, die konkrete
   Kanalrechtsfreigabe in `PO-004` fehlt.
2. Product Owner muss Provider, Kanal, Nummerntopologie und Budget explizit
   freigeben.
3. DPA/TIA, Subprozessoren, Retention und Providerrollen müssen geprüft werden.
4. Deutsche Nummerninhaberschaft/Subassignment und KYC je Tenant müssen
   vertraglich bestätigt werden.
5. Vonage benötigt datierten Preis-/Leistungs-Export; Twilio benötigt
   Account-spezifische Preis-/Inventory-Bestätigung.
6. Die Testmatrix muss mindestens für den empfohlenen Provider mit realen,
   freigegebenen Sandbox-/Testressourcen laufen.
7. WhatsApp erfordert Opt-in-, Business- und Template-Freigabe; bis dahin ist
   der Kanal technisch und rechtlich gesperrt.

## 13. Quellenregister

Alle Quellen wurden am 2026-08-08 abgerufen. Preise und Produktverfügbarkeit
werden vor Bestellung erneut geprüft.

### Twilio

- [Voice-Preise Deutschland](https://www.twilio.com/en-us/voice/pricing/de)
- [SMS-Preise Deutschland](https://www.twilio.com/en-us/sms/pricing/de)
- [Call Resource und Status Callbacks](https://www.twilio.com/docs/voice/api/call-resource)
- [Voice Webhooks](https://www.twilio.com/docs/usage/webhooks/voice-webhooks)
- [Webhook Security](https://www.twilio.com/docs/usage/webhooks/webhooks-security)
- [Webhook Connection Overrides und Retry-Token](https://www.twilio.com/docs/usage/webhooks/webhooks-connection-overrides)
- [Test Credentials](https://www.twilio.com/docs/iam/test-credentials)
- [Twilio Regions](https://www.twilio.com/docs/global-infrastructure/understanding-twilio-regions)
- [Edge Locations und Processing Regions](https://www.twilio.com/docs/global-infrastructure/understanding-edge-locations)
- [Inbound Processing Region API](https://www.twilio.com/docs/global-infrastructure/inbound-processing-api)
- [Media Streams](https://www.twilio.com/docs/voice/media-streams)
- [SIP Trunking](https://www.twilio.com/docs/sip-trunking)
- [Germany Porting](https://help.twilio.com/articles/360052800574-Germany-Porting)
- [Regulatory Compliance](https://www.twilio.com/docs/phone-numbers/regulatory/getting-started)
- [Germany Numbering Requirements](https://www.twilio.com/en-us/legal/numbering-requirements)
- [Data Protection Addendum](https://www.twilio.com/en-us/legal/data-protection-addendum)
- [WhatsApp Pricing](https://www.twilio.com/en-us/whatsapp/pricing)
- [WhatsApp Quickstart und Sandbox](https://www.twilio.com/docs/whatsapp/quickstart)

### Vonage

- [Voice Webhook Reference](https://developer.vonage.com/en/voice/voice-api/webhook-reference)
- [Signed Webhooks](https://developer.vonage.com/en/getting-started/concepts/webhooks)
- [Voice Regions](https://developer.vonage.com/en/voice/voice-api/concepts/regions)
- [Voice Endpoints/SIP/WebSocket](https://developer.vonage.com/en/voice/voice-api/concepts/endpoints)
- [Programmable SIP](https://developer.vonage.com/en/voice/voice-api/concepts/programmable-sip)
- [Voice Pricing](https://www.vonage.com/communications-apis/voice/pricing/)
- [SMS Pricing](https://www.vonage.com/communications-apis/sms/pricing/)
- [SMS Delivery Receipts](https://developer.vonage.com/en/messaging/sms/guides/delivery-receipts)
- [SMS über Messages API](https://developer.vonage.com/en/messages/concepts/sms)
- [WhatsApp Regeln und Sandbox](https://developer.vonage.com/en/messages/concepts/whatsapp)
- [Messages/WhatsApp Pricing](https://www.vonage.com/communications-apis/messages/pricing/)
- [Number Concepts](https://developer.vonage.com/en/voice/voice-api/concepts/numbers)
- [API Security](https://www.vonage.com/security/communication-apis/)
- [API Support Services](https://www.vonage.com/communications-apis/services/)
- [Legal Register](https://www.vonage.com/legal/)
- [Data Processing Addendum](https://www.vonage.com/legal/data/dpa/)
