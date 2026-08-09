# Roadmap – Now, Next, Later

Stand: 2026-08-08. Ausführbar sind ausschließlich die Task-Verträge unter
`docs/tasks/`. Diese Roadmap zeigt Outcomes und Pull-Reihenfolge, keine
Lieferzusage. Maximal eine Engineering- und eine Product-/Discovery-Task sind
gleichzeitig aktiv.

## Now

| Spur | Task | überprüfbares Outcome | Stop-/Reviewpunkt |
|---|---|---|---|
| Engineering | `F-002` | reproduzierbare lokale Infrastruktur; Healthchecks, persistente Volumes und sichere Reset-/Restore-Nachweise | keine Providerkonten oder Real-Egress; `F-003` erst nach Abschluss/Review ziehen |
| Product/Discovery | `PO-001` | zehn nicht suggestive SHK-Probleminterviews mit anonymisierter Evidenz und Pivot-Signalen | keine PII ohne freigegebenen Prozess; Kohorte ist nicht vorab „validiert“ |

`Now` enthält bewusst höchstens diese zwei Tasks. `PO-002` und `PO-003` bleiben
bereit, werden aber wegen des Product-WIP-Limits nicht parallel begonnen.

## Next – ungefähr 2–6 Wochen, neu zu forecasten

| Outcome | wahrscheinliche Tasks/Abhängigkeiten | Nachweis vor Pull |
|---|---|---|
| lokale Entwicklungsumgebung ist reproduzierbar und secret-sicher | `F-002`, `F-003` nach `F-001` | Toolchain grün; Infrastruktur-/Secret-Scope verfeinert |
| API/Web/Worker und CI bilden ein gesundes, providerfreies Fundament | `F-004`, `F-005` nach F-002/F-003 | Health-/Build-/Supply-Chain-Akzeptanz definiert |
| Product-Investment-Checkpoint vor domänenspezifischem Ausbau | nacheinander `PO-002`, `PO-003`; alle `PO-001`–`PO-003` vor `O-001` | Interviewevidenz, extern testbares Angebot, Kostenbandbreite/Stopregel |
| Tenantkontext ist autoritativ und Cross-Tenant-Zugriff beweisbar ausgeschlossen | `T-001`–`T-004` nach `G1` | Auth-/RLS-/Audit-Negativfälle verfeinert; keine reale Tenant-PII nötig |
| dünne synthetische Walking-Skeleton-Scheibe ist ausführbar geplant | Refinement nach `G2` | Replay Call → Eligibility → Fake Message → lokales Capability-Formular → synthetischer Lead; keine Gateumgehung |

Die genaue Reihenfolge innerhalb eines Outcomes wird beim wöchentlichen
Replenishment nach Abhängigkeit, Lernwert und tatsächlichem Durchsatz gezogen.

## Later – Optionen mit Aktivierungstrigger

| Epic/Option | Nutzen | Hauptrisiko | Aktivierungstrigger |
|---|---|---|---|
| sicheres Onboarding und Konfiguration | Tenant kann einen überprüfbaren Fake-Textback konfigurieren | domänenspezifischer Ausbau vor Marktbeleg | `G2` plus abgeschlossene `PO-001`–`PO-003`; Tasks `O-*` neu refinieren |
| zuverlässige Event-Ingestion | Missed-Call-Fixtures verlust-/duplikatresistent verarbeiten | Providersemantik wird voreilig festgeschrieben | `G3`; `DEC-005` und Contract-Fixtures vor `E-*` |
| vertikaler Textback-Kernpfad | synthetischer Call bis Lead als dünne Scheibe | horizontaler Aufbau liefert spät Nutzernutzen | nach `G2` planen, nach notwendigen Onboarding-/Ingestion-Slices ausführen; `M-*` JIT schneiden |
| Pilot- und Compliance-Reife | Restore, Rechte, Support und belastbare KPI | Rechts-/Betriebsreife wird mit Featureumfang verwechselt | stabiler Fake-Kernpfad, `PO-004` und explizite `G6`-Nachweise |
| kontrollierter Pilot | echte Nutzenevidenz und Operationslernen | reale Kontakte/Kosten/Incidents | separate Go-live-, Provider-, Legal-, Security- und Budgetfreigabe |
| Echtgeld-Billing | validierte Monetarisierung | steuerliche/vertragliche Komplexität | bestätigte Pricingentscheidung und `PO-007`/`PO-008`; `B-003` erst dann refinieren |
| begrenztes Voice-System | höchstens drei validierte Intents | Safety, Latenz, Audio-/KI-Recht, Kosten | Pilotdaten und `P-004`/`G7`; volle DSFA vor Realanruf; `V-*` neu schneiden |
| Cloud/HA/Service-Extraktion | messbaren Betriebsengpass lösen | vorzeitige Plattformkomplexität | zahlender Betrieb oder belegtes RPO/RTO-/Skalierungsproblem; `C-*` neu refinieren |

## Unveränderliche Sequenzleitplanken

- `G0` öffnet nur synthetische Fake-/Replay-Foundation.
- Tenant-Isolation (`G2`) geht jeder Speicherung fachlicher Tenantdaten voraus.
- Idempotenz erzeugt höchstens eine Außenwirkung auf mindestens-einmal-
  Transport; ein Retry ist nie eine zweite fachliche Wirkung.
- Reale Provider, Kontakte, Daten, Zahlungen und Produktion benötigen die
  jeweils explizite Freigabe; `ADR-012` bleibt `proposed`.
- Voice und Cloud werden durch Evidenz ausgelöst, nicht durch Kalenderzeit.
