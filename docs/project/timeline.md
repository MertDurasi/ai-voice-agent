# Rolling Forecast

Stand: 2026-08-13. Kapazitätshypothese: ungefähr 20 Netto-Stunden pro Woche.
Dies ist eine Forecastbandbreite für Replenishment, kein Liefertermin und keine
Freigabe. Die verbindliche Reihenfolge steht in der
[Now–Next–Later-Roadmap](roadmap.md).

| Horizont | Forecastannahme | erwartetes Ergebnis | Konfidenz |
|---|---|---|---|
| `Now` | je ein WIP-Slot pro Spur; Abschluss vor neuem Pull | `T-003` im Engineering-Track und `PO-001` im Product-Track; `T-001`/`T-002` sind abgeschlossen | mittel für Reihenfolge, niedrig für Datum bis weitere Cycle Time vorliegt |
| `Next` | ungefähr 2–6 Wochen, abhängig von Evidenz, Taskzuschnitt und Durchsatz | `PO-001`–`PO-003`/`V-001` als Investment-Checkpoint, `T-003`/`T-004` bis `G2` und danach Voice+Text-Konfiguration für `G3` | niedrig; Anbieter-/Runtimebenchmark und erste 3–5 vergleichbare Tasks fehlen |
| `Later` | keine Kalenderprognose | `G4` Realtime Telephony & Media, `G5` synthetischer Combined Assistant, `G6` Pilot Ready, `G7` kontrollierter Pilot und `G8` Post-pilot-Entscheid | absichtlich keine Termin-Konfidenz |

## Forecast-Regeln

- Aufwand wird pro `Now`-Task als Bandbreite mit Annahmen erfasst; eine
  Bandbreite ist keine Zusage.
- Wöchentlich werden Cycle Time, abgeschlossene Tasks je Spur, Blocked Time und
  ungeplante Expedites dokumentiert. Erst reale Durchsatzdaten schärfen den
  Forecast.
- Externe Wartezeit für Interviews, Legal, Provider, Safety oder
  Ownerentscheidungen wird separat von aktiver Engineeringzeit ausgewiesen.
- Ein P50/P85-Forecast wird erst nach mindestens fünf vergleichbaren
  abgeschlossenen Tasks erwogen; vorher bleiben qualitative Bandbreiten.
- Scope-/Risikowachstum ändert zuerst `Next`/`Later`, nie still Akzeptanz oder
  Sicherheitsgates einer aktiven Task.
- Vor jedem Pull aus `Later` wird nur die kleinste vertikale Scheibe bis zum
  nächsten Nachweis detailliert. Die übrige Gatefolge bleibt Outcome-Planung.

Eine interne synthetische Voice+Text-Walking-Skeleton-Demo wird nach `G3` über
`G4`/`G5` priorisiert. Ein rechtlich, finanziell und betrieblich kontrollierter
Realpilot folgt erst nach `G6`. Termindruck hebt Tenant-Isolation, Disclosure,
Handoff, Idempotenz, Löschung, Signaturprüfung, Inhaltsminimierung oder
Realbetriebsblocker nicht auf.
