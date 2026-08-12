# ADR-009 – Textback vor Voice

- Status: superseded
- Datum: 2026-08-07
- Ersetzt durch: [ADR-013](ADR-013-voice-first-combined-mvp.md)

> Historischer Entscheid: Die Product-Owner-Entscheidung vom 2026-08-11 macht
> Voice zum primären Anrufpfad desselben MVP. Die nachfolgende Begründung bleibt
> als damaliger Trade-off erhalten, ist aber nicht mehr ausführungsleitend.

## Kontext

Textback löst den Kern-Job mit geringerer Latenz-, Safety-, Rechts- und
Kostenkomplexität. Voice-Nachfrage und Unit Economics sind noch unbewiesen.

## Entscheidung

Alle Voice-Implementierung wartet auf das datengestützte Gate `G7`. Bis dahin
wird der Textback-Kernpfad pilotiert und gemessen.

## Konsequenzen

Keine Voice-Skeletons oder Anbieterintegration vor dem Gate. Ein späteres
Voice-Modul startet begrenzt auf ein Gewerk und höchstens drei Intents.
