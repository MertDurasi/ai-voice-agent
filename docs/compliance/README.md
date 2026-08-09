# Compliance-Arbeitsbasis

- Status: Discovery-Entwurf, keine Rechtsfreigabe
- Stand: 2026-08-08
- Rechtsraum: Deutschland/EU
- Betreiber: `[PLATTFORMBETREIBER_OFFEN]`
- Task: `D-003`

Diese Dokumente schaffen eine prüfbare Datenschutz-, Rechts- und
Missbrauchsbasis. Sie sind keine Rechtsberatung und erlauben weder reale SMS,
Providerkonten, Telefonnummern noch Voice-Anrufe. Bis zu den jeweils genannten
Freigaben ist ausschließlich der synthetische Fake-/Replay-Pfad zulässig.

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
| `fake` | synthetische Fixtures, Replay, Fake Messaging, Mailpit, lokale Testdaten | produktive Dumps, erreichbare Rufnummern, echte Provider-/E-Mail-Endpunkte |
| `real` | nichts ohne separate Provider-, Legal-, Security- und Go-live-Freigabe | SMS, Calls, KYC, Nummernbestellung, Zahlung oder Kontaktaufnahme |
| `voice` | synthetisches/freigegebenes Testkorpus erst nach `G7` | reale Calls, Recording, persistiertes Audio/Rohtranskript, Voiceprints, Emotionserkennung |

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

1. Ein verpasster Anruf beweist weder den Anrufzweck noch eine SMS-Einwilligung.
2. Das konkrete Textback-Template ist nach DSGVO, UWG, TDDDG und TKG zu prüfen.
3. Betreiber, Verantwortlichkeiten, AVV, Subprozessoren und Transfers sind offen.
4. Retention, Transparenz, Widerspruch, falsche Nummer und Betroffenenrechte
   benötigen einen freigegebenen Prozess.
5. Voice benötigt vor dem ersten Realanruf eine vollständige DSFA, AI-Act-
   Transparenz, Anbieterprüfung und gesonderte Product-/Legal-/Safety-Freigabe.

`PO-004` ist der Freigabepfad für reale Verarbeitung. Offene Rechtsfragen
blockieren nicht die Entwicklung mit synthetischen Daten.
