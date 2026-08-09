# Rolling Forecast

Stand: 2026-08-08. Kapazitätshypothese: ungefähr 20 Netto-Stunden pro Woche.
Dies ist eine Forecastbandbreite für Replenishment, kein Liefertermin und keine
Freigabe. Die verbindliche Reihenfolge steht in der
[Now–Next–Later-Roadmap](roadmap.md).

| Horizont | Forecastannahme | erwartetes Ergebnis | Konfidenz |
|---|---|---|---|
| `Now` | je ein WIP-Slot pro Spur; Abschluss vor neuem Pull | `F-004` im Engineering-Track und `PO-001` im Product-Track | mittel für Reihenfolge, niedrig für Datum bis weitere Cycle-Time vorliegt |
| `Next` | ungefähr 2–6 Wochen, abhängig von Taskzuschnitt und tatsächlichem Durchsatz | lokale Foundation/CI, erste Tenancy-Outcomes sowie `PO-002`/`PO-003` als Investment-Checkpoint | niedrig bis erste 3–5 Tasks abgeschlossen sind |
| `Later` | keine Kalenderprognose | Onboarding, Walking Skeleton, Ingestion, Textback, Produktreife, Pilot, Voice/Cloud nur bei Trigger | absichtlich keine Termin-Konfidenz |

## Forecast-Regeln

- Aufwand wird pro `Now`-Task als Bandbreite mit Annahmen erfasst; eine
  Bandbreite ist keine Zusage.
- Wöchentlich werden Cycle Time, abgeschlossene Tasks je Spur, Blocked Time und
  ungeplante Expedites dokumentiert. Erst reale Durchsatzdaten schärfen den
  Forecast.
- Externe Wartezeit für Interviews, Legal, Provider oder Ownerentscheidungen
  wird separat von aktiver Engineeringzeit ausgewiesen.
- Ein P50/P85-Forecast wird erst nach mindestens fünf vergleichbaren
  abgeschlossenen Tasks erwogen; vorher bleiben qualitative Bandbreiten.
- Scope-/Risikowachstum ändert zuerst `Next`/`Later`, nie still Akzeptanz oder
  Sicherheitsgates einer aktiven Task.

Eine interne synthetische Walking-Skeleton-Demo kann nach `G2` früh priorisiert
werden. Ein rechtlich, finanziell und betrieblich kontrollierter Pilot folgt
erst nach seinen eigenen Nachweisen. Termindruck hebt Tenant-Isolation,
Idempotenz, Löschung, Signaturprüfung oder Realbetriebsblocker nicht auf.
