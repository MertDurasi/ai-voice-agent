# Compliance-Arbeitsbasis

- Status: Discovery-Entwurf, keine Rechtsfreigabe
- Stand: 2026-08-11
- Rechtsraum: Deutschland/EU
- Betreiber: `[PLATTFORMBETREIBER_OFFEN]`
- Tasks: `D-003`, `PM-002`

Diese Dokumente schaffen eine prüfbare Datenschutz-, Rechts- und
Missbrauchsbasis für den gemeinsamen Voice-first-/Textback-MVP. Sie sind keine
Rechtsberatung und erlauben weder reale SMS noch Providerkonten, Rufnummern oder
Voice-Anrufe. Bis zu den jeweils genannten Freigaben ist ausschließlich der
synthetische Fake-/Replay-Pfad zulässig.

## Dokumente

- [Datenflüsse und Dateninventar](data-flow.md)
- [Zwecke, Rollenhypothesen, Rechtsfragen und DSFA-Screening](purpose-legal-basis.md)
- [Retention- und Löschentwurf](retention-draft.md)
- [Abuse Cases und Kontrollen](../security/abuse-cases.md)
- [Provider- und Kanal-Scorecard](../product/provider-scorecard.md)
- [Security-Baseline](../security/security-and-compliance.md)

## Statusvokabular

| Status | Bedeutung |
|---|---|
| `research_hypothesis` | fachlich/rechtlich zu prüfende Arbeitshypothese |
| `real_blocker` | verhindert den betroffenen Realbetrieb |
| `approved_by_legal` | darf nur durch den Nachweis aus `PO-004` gesetzt werden |
| `not_applicable` | mit dokumentierter Begründung nicht anwendbar |

In diesem D-003-Stand existiert keine Position mit `approved_by_legal`.

## Verbindliche Modusgrenzen

| Modus | Erlaubt | Nicht erlaubt |
|---|---|---|
| `fake` | kombinierte synthetische Voice-/Handoff-/Lead-/Textback-Fixtures und Replays nach `G0V` und den jeweiligen Abhängigkeiten; Fake Messaging, Mailpit, lokale Testdaten | produktive Dumps, erreichbare Rufnummern, echte Provider-/E-Mail-Endpunkte |
| `real` | nichts ohne separate Provider-, Legal-, Security- und Go-live-Freigabe | SMS, Calls, KYC, Nummernbestellung, Zahlung oder Kontaktaufnahme |
| `voice` | synthetisches Audio-/Dialogkorpus nach `G0V`, Isolation und freigegebenem Testvertrag | reale Calls, Recording, persistiertes Audio/Rohtranskript/Promptinhalt, Voiceprints, Emotionserkennung oder Providertraining |

## Rückverfolgbarkeit

Die Artefakte verwenden stabile Kennungen:

```text
FLOW-* -> DATA-* -> PUR-* -> RET-* -> ABUSE-*
```

Eine neue Datenklasse ist erst reviewfähig, wenn Zweck, Rollenannahme,
Zugriffsgruppe, Speicher-/Empfänger, Retention-/Löschweg und relevante Abuse
Cases referenziert sind. Hashes und pseudonyme Kennungen werden nicht als
anonym behandelt.

## Harte Realbetriebsblocker

1. Betreiber, Nummerntopologie, Verantwortlichkeiten, AVV, Subprozessoren,
   Transfers und jede juristische Einheit der Telephony-/STT-/Modell-/TTS-Kette
   sind offen.
2. Vor dem ersten Realanruf fehlen eine vollständige DSFA, Art.-50-Disclosure,
   AI-Literacy, Safety-/Handoff-Abnahme, No-Retention/No-Training-Nachweise,
   Security-Test und ausdrückliche Provider-/Budget-/Go-live-Freigabe.
3. Retention, Transparenz, Notfallpfad, falsche Nummer, Betroffenenrechte und
   strukturierte Voice-Summary benötigen freigegebene Prozesse.
4. Ein Voice-Dialog oder verpasster Anruf beweist weder den Zweck noch eine
   SMS-Erlaubnis. Das konkrete Textback-Template und die In-call-Permission sind
   separat nach DSGVO, UWG, TDDDG und TKG zu prüfen.
5. Audio, Rohtranskript, Prompt-/Toolinhalt und reale Review-Samples haben intern
   und beim Provider Persistenz `0`; Voiceprints, Emotionserkennung und Training
   mit Gesprächsdaten bleiben verboten.

`PO-004` ist der Freigabepfad für reale Verarbeitung. Offene Rechtsfragen
blockieren nicht die Entwicklung mit synthetischen Daten.
