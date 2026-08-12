# ADR-013 – Voice-first als gemeinsamer Voice-/Textback-MVP

- Status: accepted
- Datum: 2026-08-11
- Entscheider: Product Owner
- Ersetzt: [ADR-009](ADR-009-textback-before-voice.md)
- Ersetzt durch: –
- Task: `PM-002`

## Kontext

Die erste Baseline behandelte Textback als eigenständiges MVP und Voice als
Option nach einem Textback-Pilot. Die Product-Owner-Entscheidung vom 2026-08-11
verlangt dagegen, dass das MVP das zentrale Nutzenversprechen „Anruf wird
beantwortet und als verwertbarer Lead gesichert“ primär im Gespräch erfüllt.
Textback bleibt wertvoll, wenn der Anrufer Informationen schriftlich ergänzen
möchte, Voice nicht sicher abschließen kann oder ein freigegebener Link
benötigt wird.

Voice erhöht gegenüber Textback Latenz-, Kosten-, Safety-, Datenschutz- und
Betriebsrisiken. Die vorhandene D-003-Inventur erfasst Audio, transiente
Transkripte, Dialogzustand, Disclosure, Handoff, Summary und Providerkopien
bereits, erteilt aber keine Rechts- oder Realbetriebsfreigabe.

## Entscheidung

1. **Voice ist der primäre MVP-Anrufpfad.** Nach einer klaren, nicht
   überspringbaren KI-Transparenzansage führt ein begrenzter Voice-Agent die
   Erstaufnahme. Menschliche Weiterleitung beziehungsweise ein Rückrufpfad
   bleibt jederzeit als sicherer Ausweg vorgesehen.
2. **Textback gehört zum selben MVP**, ist aber kein unkoordinierter
   Parallelversand. Eine SMS oder ein anderer später freigegebener Kanal darf
   nur nach positiver Eligibility und dokumentierter Kommunikationsbefugnis
   als angeforderte Fortsetzung, sicherer Link oder Fallback geplant werden.
3. **Beide Kanäle teilen einen fachlichen Vorgang.** Call, VoiceSession,
   ChannelAttempt, Conversation und Lead referenzieren denselben
   tenantgebundenen Kontaktvorgang. Kanalwechsel, Retries und Provider-Replays
   erzeugen weder doppelte Leads noch eine zweite gleichartige Außenwirkung.
4. **Der MVP bleibt eng.** Genau ein Gewerk und höchstens drei durch
   `PO-001`/`V-001` validierte Intents. Zulässig sind strukturierte
   Erstaufnahme, kontrollierte Fakten, Rückrufwunsch und Handoff. Diagnose,
   verbindliche Preise, Einsatz-, Termin- oder Verfügbarkeitszusagen,
   Zahlungen und beliebige Tool-/URL-Aufrufe sind nicht Teil des MVP.
5. **Voice-Inhalte bleiben flüchtig.** Aufzeichnung, Audio- oder
   Rohtranskriptpersistenz, Voiceprints, Sprecheridentifikation,
   Emotionserkennung und Providertraining mit Gesprächsdaten bleiben
   verboten. Nur eine separat freigegebene strukturierte Summary darf
   persistiert werden.
6. **Die technische Form bleibt offen.** `V-001` entscheidet mit Benchmark und
   Exitplan zwischen eigenem Orchestrierungsbaustein und Anbieterfähigkeit.
   Diese ADR wählt weder CPaaS noch STT, LLM, TTS, Programmiersprache,
   Servicetrennung, Rufnummernmodell oder Datenregion.
7. **Delivery bleibt gestuft.** Foundation, Tenant-Isolation, Konfiguration,
   Call-Vertrag und der providerfreie Lead-/Textback-Kern werden zuerst
   bewiesen. Danach wird Voice an dieselben Ports und Use Cases angebunden.
   Das MVP ist erst mit der synthetischen integrierten Voice-/Textback-Scheibe
   vollständig; ein Realpilot folgt ausschließlich nach Legal-, DSFA-, Safety-,
   Security-, Provider-, Budget- und Go-live-Freigabe.

## Konsequenzen

### Positiv

- Das MVP entspricht dem eigentlichen Produktversprechen eines
  KI-Telefonassistenten und nicht nur einer Benachrichtigungsautomation.
- Voice und Textback nutzen eine gemeinsame Lead-, Audit-, Retention- und
  Zuverlässigkeitsbasis statt zwei widersprüchlicher Automationen.
- Textback kann Voice kontrolliert ergänzen, ohne jeden Anruf mit einer
  zusätzlichen Nachricht zu belasten.
- Provider-/Build-vs-Buy-Entscheidungen bleiben durch Ports, Fakes und
  Contracttests reversibel.

### Negativ und Risiken

- Scope, variable Kosten, Testaufwand und Zeit bis zu einem kontrollierten
  Pilot steigen wesentlich.
- Latenz, Dialekte, Lärm, Halluzination, Prompt-/Tool-Injection, Notfälle und
  Human-Handoff werden MVP-kritische statt spätere Risiken.
- Die vollständige DSFA und konkrete Voice-/Telekommunikationsprüfung werden
  vor dem ersten Realpilot benötigt.
- Ohne dauerhafte Rohtranskripte ist Qualitätsanalyse schwieriger; deshalb sind
  synthetische, versionierte Golden-/Red-Team-Korpora und strukturierte
  Laufzeitmetriken zwingend.

## Betrachtete Alternativen

### Textback-only-MVP, Voice nach Pilot

Technisch und rechtlich risikoärmer, entspricht aber nicht der verbindlichen
Product-Owner-Vorgabe und validiert das primäre Voice-Nutzenversprechen nicht.

### Voice-only-MVP

Verwirft einen robusten Fallback für abgebrochene, ungeeignete oder schriftlich
fortzusetzende Anfragen. Wegen Accessibility, Providerfehlern und sicheren
Links abgelehnt.

### Voice und Textback als unabhängige Automationen

Einfacher mit Standardplattformen konfigurierbar, erzeugt aber Risiken für
Doppelansprache, doppelte Leads, inkonsistente Einwilligung und nicht
reconcilierbare Kosten. Abgelehnt.

### Sofortiger Full-Service-Rezeptionist

FAQ, freie Terminbuchung, Diagnose, Disposition, Zahlung und CRM-Aktionen im
ersten Release erzeugen eine nicht beherrschbare Safety-/Tooloberfläche. Bis
zu eigener Evidenz außerhalb des MVP.

## Nachweise und Review

- ausdrückliche Product-Owner-Entscheidung vom 2026-08-11;
- [Product Brief v2.0](../product/product-brief.md);
- [D-003 Compliance-Basis](../compliance/README.md);
- [Abuse-Katalog](../security/abuse-cases.md);
- [PM-002 Rebaseline](../tasks/project-management/PM-002-voice-first-mvp-rebaseline.md).

Review-Trigger: widersprechende Interviewevidenz, nicht tragfähige Voice-Kosten
oder -Qualität, ungelöste Legal-/Safety-Blocker, kein sicherer Human-Handoff oder
ein Provider-/Architekturbenchmark, der den vorgesehenen Betrieb widerlegt.
