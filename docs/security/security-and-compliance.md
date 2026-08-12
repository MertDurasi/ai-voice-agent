# Security, Datenschutz und regulatorische Leitplanken

Dies ist eine technische Baseline, keine Rechtsberatung. Vor dem ersten realen
Voice-Anruf oder Textback müssen Rechtsgrundlagen, Telekommunikations-/
Direktmarketingregeln, KI-Transparenz, Human-/Safety-Pfad, AV-Verträge,
Subprozessoren, Transfers und Kommunikationstexte fachlich geprüft werden.

Das vollständige D-003-Paket steht im
[Compliance-Index](../compliance/README.md); konkrete Angriffs- und
Recovery-Szenarien stehen im [Abuse-Katalog](abuse-cases.md). Der ausführbare
Konfigurations-, Klassifikations- und Rotationsvertrag steht im
[Secret-Leitfaden](configuration-and-secrets.md).

## Security-Baseline

- Secure/HttpOnly/SameSite-Cookies oder korrekt validierte Bearer Tokens;
  keine Tokens im Local Storage.
- CSRF-Schutz für cookie-authentifizierte Mutationen.
- CSP, HSTS, Referrer Policy, `X-Content-Type-Options` und restriktive CORS-Liste.
- Schema-/DTO-Validierung lehnt unbekannte Felder ab.
- Rate Limits je IP, Tenant und sensibler Operation.
- Webhooks: Signatur, Timestamp, Replay-Schutz und Raw-Body-Verifikation.
- Keine sequenziellen öffentlichen Lead-IDs. Formularzugriff über kurzlebiges,
  gehasht gespeichertes Capability Token.
- Least-Privilege-DB-Rollen; Migration und Runtime getrennt.
- SBOM, Secret-, Dependency- und Container-Scan gemäß
  [CI-/Supply-Chain-Vertrag](../operations/ci-supply-chain.md).
- verschlüsselte Backups und regelmäßige Restore-Tests.

## Datenschutz-Arbeitspunkte

- Verzeichnis der Verarbeitungstätigkeiten und Datenflusskarte
- Rollenklärung Verantwortlicher/Auftragsverarbeiter je Datenfluss
- Rechtsgrundlage je Zweck statt pauschalem Consent
- vollständige DSFA vor dem ersten realen Voice-Anruf; Review bei Anbieter-,
  Zweck-, Intent-, Kanal-, Region- oder Modelländerung
- Subprozessorregister, Datenstandort, Lösch- und Transfermechanismen
- Transparenzhinweis bei direkter KI-Interaktion
- AI-Literacy-/Betriebsunterweisung
- versionierte Retention je Datenklasse; Produktionsfristen erst nach Legal-
  und Privacy-Freigabe
- Voice-Audio und Rohtranskript mit Persistenz `0`; Aufzeichnung technisch
  verboten, strukturierte Summary erst nach separater Freigabe

## Sprachdaten

Sprachaufnahme ist personenbezogen, aber nicht automatisch biometrische
Sonderkategorie nach Art. 9 DSGVO. Biometrische Daten setzen eine spezifische
technische Verarbeitung zur eindeutigen Identifizierung voraus. Auch flüchtige
Transkription benötigt Zweck, Rechtsgrundlage, Transparenz, Datenminimierung,
Auftragsverarbeitung und Löschung. Für den primären Voice-KI-Assistenten ist
eine vollständige DSFA vor jedem Realanruf verbindliches Projektgate.
Telefonie-, Media-, STT-, Dialogmodell- und TTS-Anbieter werden je juristischer
Einheit, Zweck, Region, Supportzugriff, Retention und Training geprüft; ein
allgemeines „EU Hosting“ reicht nicht.

Sprecheridentifikation, Voiceprints, Emotionserkennung oder biometrische
Kategorisierung sind ohne neuen Rechts-, Risiko- und Architekturentscheid
verboten.

## Abuse-Fälle, die vor Realbetrieb behandelt werden

Falsche oder wiederverwendete Nummer, wiederholte Webhooks, unerwünschte
Werbenachricht, Minderjährige, beleidigende Inhalte, Notfallmeldung,
Auskunft/Löschung, Supportzugriff und Providerkompromittierung.

Offene Rechtsfragen blockieren den betroffenen Realbetrieb, nicht die
Entwicklung mit Fake-/Replay-Adaptern, simuliertem Audio und synthetischen
Golden-/Red-Team-Korpora nach den jeweiligen Engineering-Gates.
