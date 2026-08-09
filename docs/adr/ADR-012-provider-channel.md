# ADR-012 – Pilotprovider und primärer Textback-Kanal

- Status: proposed
- Datum: 2026-08-08
- Entscheider: Product Owner, Engineering, Legal/Privacy
- Ersetzt: –
- Ersetzt durch: –
- Task: `D-002`

## Kontext

Der Textback-MVP benötigt genau einen Telefonieadapter und einen primären
Messagingkanal. Verglichen wurden Twilio und Vonage sowie SMS und WhatsApp auf
Basis öffentlich verfügbarer Unterlagen. Die vollständige Evidenz, Kosten und
offenen Tests stehen in der
[Provider-Scorecard](../product/provider-scorecard.md).

`D-001` ist abgenommen. Es existieren jedoch noch kein Providerkonto, keine
freigegebene Testnummer, kein Budget und keine Rechts-/Vertragsfreigabe. Die
identische Account-Testmatrix aus der Scorecard wurde daher noch nicht
ausgeführt.

## Vorgeschlagene Entscheidung

Unter den unten genannten Annahmebedingungen soll der kontrollierte Pilot
verwenden:

1. **Twilio Programmable Voice** mit Processing Region `IE1` als ersten
   Telefonieadapter.
2. **SMS** als primären Textback-Kanal.
3. **Conditional Forwarding bei Nichtannahme** von der bestehenden
   Betriebsnummer an eine Provider-Nummer als bevorzugte Pilot-Topologie.
4. **Fake-/Replay-Adapter als einzige aktive Entwicklungsbaseline**, bis alle
   Freigabebedingungen erfüllt sind.

WhatsApp wird nicht als stiller Fallback aktiviert. Der Kanal bleibt hinter
einer separaten Freigabe, bis Opt-in, Business Account, Templateklassifikation,
Kosten und Rechtsgrundlage geklärt sind.

## Annahmebedingungen

Der Status darf nur von `proposed` auf `accepted` wechseln, wenn:

- Product Owner Provider, SMS, Nummerntopologie und Testbudget ausdrücklich
  freigibt;
- `D-003` Datenflüsse, Abuse-Fälle und Rechtsblocker vollständig abbildet und
  `PO-004` den konkreten SMS-Fluss nach qualifizierter Beratung ausdrücklich
  freigibt oder verwirft;
- DPA/TIA, Subprozessoren, Retention, Controller-/Processor-Rollen und
  Transfermechanismen geprüft sind;
- Twilio schriftlich/vertraglich bestätigt, wie deutsche Nummern je Tenant ohne
  unzulässiges Subassignment betrieben werden;
- `IE1` für alle verwendeten Voice-/Messagingressourcen und Logs nachgewiesen
  konfiguriert ist;
- die Scorecard-Testmatrix für Conditional Forwarding, Caller-ID,
  `no-answer`/Busy/Voicemail, Signatur, Retry, Duplicate, DLR und Billing grün
  ist;
- tatsächliche Stückkosten das Product-Brief-Margenziel nicht widerlegen;
- Port-out, Accountschließung und Datenlöschung praktisch/vertraglich
  nachvollziehbar sind.

Scheitert eine Bedingung, bleibt der Fake-/Replay-Pfad aktiv und Vonage wird mit
demselben Testprotokoll neu bewertet. Eine Aufteilung von Telefonie und
Messaging auf zwei Provider benötigt eine ergänzende Entscheidung.

## Begründung

Twilio ist aktuell die risikoärmere Spike-Empfehlung wegen öffentlich
nachvollziehbarer Deutschlandpreise, deutscher Porting-/Regulatory-
Dokumentation, Test Credentials, dokumentierter Ireland-Region und reifer
Voice-/Messaging-/Media-Ports.

Vonage ist technisch konkurrenzfähig und bei der Webhook-Sicherheit im
Dokumentvergleich stärker: Signed Webhook JWTs enthalten `iat`, `jti` und einen
Payloadhash; Voice liefert einen expliziten `unanswered`-Status. Gegen eine
sofortige Auswahl sprechen derzeit fehlende öffentlich abrufbare deutsche
Preis-, Nummern- und Portingdetails sowie offene Vertrags-/DPA-Einzelheiten.

SMS wird für den Pilot vor WhatsApp vorgeschlagen, weil es ohne installierte App
erreichbar ist und weniger Business-/Template-Onboarding benötigt. SMS ist
trotzdem nicht automatisch rechtlich zulässig. WhatsApp verlangt für die hier
geschäftsinitiierte erste Nachricht einen belegten Opt-in und ein genehmigtes
Template; ein Telefonanruf öffnet kein WhatsApp-Servicefenster.

## Konsequenzen

### Positiv

- kleinster realistischer Integrationspfad für den Textback-Golden-Path;
- ein Provider für Voice und SMS reduziert anfängliche Betriebsoberfläche;
- transparente Twilio-Listenpreise erlauben ein erstes Kostenmodell;
- spätere SIP-/Media-Streaming-Fähigkeit bleibt vorhanden, ohne Voice jetzt zu
  bauen;
- Fake-/Replay-Vertrag ermöglicht Entwicklung ohne Account oder Realversand.

### Negativ/Risiken

- Twilio-Webhook-Signaturen besitzen keinen dokumentierten signierten
  Timestamp; Inbox-Deduplikation und eigener Replay-Schutz bleiben zwingend;
- Test Credentials erzeugen keine Statuscallbacks; reale Contracttests brauchen
  ein kontrolliertes Konto;
- SMS kostet pro Segment und kann bei Unicode/Links deutlich teurer werden;
- Conditional Forwarding hängt von Carrierverhalten und Caller-ID-Erhalt ab;
- Twilio verarbeitet trotz `IE1` bestimmte Account-/Billing-/Transferdaten
  möglicherweise außerhalb der EU;
- deutsche Nummern-/Tenant-Inhaberschaft kann das SaaS-Modell einschränken;
- Ein-Provider-Start erzeugt Betriebsabhängigkeit, die über Ports, Export und
  Kill Switch begrenzt werden muss.

## Adaptervertrag

Providerdetails bleiben auf Adapter beschränkt. Der kanonische Telefonievertrag
kennt mindestens:

```text
providerCallId
providerEventKey
occurredAt
fromE164
toE164
status: started | ringing | answered | missed | failed | completed
rawEventHash
```

Der Messagingvertrag kennt mindestens:

```text
sendTemplate(command, idempotencyKey)
providerMessageId
status: provider_accepted | delivered | failed
failureClass: transient | permanent | unknown
```

Kein Provider-SDK oder Providerstatus darf in Domain-/Application-Code
importiert werden. Für beide Ports existieren Fake-/Replay-Adapter und eine
anbieterunabhängige Contract-Suite.

## Betrachtete Alternativen

### Vonage Voice + SMS

Technisch attraktiv wegen explizitem `unanswered`, JWT-Signaturen und EU-
Regionen. Neu bewerten, sobald Deutschlandpreise, Nummern-/Portingbedingungen,
DPA-Anhänge und die identische Testmatrix vorliegen.

### WhatsApp als Primärkanal

Reichere UX und Status, wahrscheinlich geringere reine Plattformkosten.
Abgelehnt für den ersten Pilotpfad wegen Opt-in-/Template-/Business-Onboarding,
Meta als zusätzlichem Subprozessor/Regelwerk und offener Templatekategorie.

### Sofortige Nummernportierung

Mehr Kontrolle über Callstatus, aber höhere Rollback-, KYC-, Zeit- und
Betriebsrisiken. Für den ersten Discovery-Pilot abgelehnt.

### Direkte Providerintegration ohne Ports

Widerspricht ADR-004/010 und verhindert reproduzierbare Tests sowie einen
kontrollierten Exit. Abgelehnt.

## Nachweise

- [Provider-Scorecard, Quellen und Testmatrix](../product/provider-scorecard.md)
- [ADR-004 – Ports & Adapter](ADR-004-ports-adapters.md)
- [ADR-010 – Pragmatische Providerneutralität](ADR-010-pragmatic-provider-neutrality.md)
- Product-Owner-Abnahme von `D-001` am 2026-08-08

Offen: Accounttests, D-003, Legal/Privacy Review und ausdrückliche Annahme dieser
ADR. Bis dahin ist `proposed` bindend nur in dem Sinn, dass keine echte
Provideraktion stattfinden darf.
