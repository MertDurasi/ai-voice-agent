# Roadmap – Now, Next, Later

Stand: 2026-08-13. Ausführbar sind ausschließlich die Task-Verträge unter
`docs/tasks/`. Diese Roadmap zeigt Outcomes und Pull-Reihenfolge, keine
Lieferzusage. Maximal eine Engineering- und eine Product-/Discovery-Task sind
gleichzeitig aktiv.

## Now

| Spur | Task | überprüfbares Outcome | Stop-/Reviewpunkt |
|---|---|---|---|
| Engineering | `T-002` | Tenant/Membership und unveränderlicher serverseitiger Tenant-Kontext | kein RLS-/Audit-Vorgriff und keine reale Tenant-PII |
| Product/Discovery | `PO-001` | zehn Problem-/Vertrauensinterviews prüfen Bedarf, begrenzte Intents, KI-Transparenz, Handoff und Textfortsetzung in der SHK-Kohorte | Interviewevidenz kann Scope oder Kohorte ändern; keine Anbieter-/Realfreigabe |

`Now` enthält bewusst nur diese zwei Tasks. `PM-002`/`G0V`, `F-005`/`G1` und
`T-001` sind abgeschlossen; andere Product-Tasks werden nicht parallel zu
`PO-001` begonnen.

## Next – ungefähr 2–6 Wochen, wöchentlich neu zu forecasten

| Outcome | wahrscheinliche Tasks/Abhängigkeiten | Nachweis vor Pull |
|---|---|---|
| Problem, Pilotangebot und technische Machbarkeit sind als Investment-Checkpoint belastbar | `PO-001`; danach WIP-gesteuert `PO-002` und `V-001`; `PO-003` nutzt den Benchmark | anonymisierte Interviewevidenz, testbares Angebot, providerneutrale Voice-Scorecard, Kostenbandbreite und Stopregeln |
| Tenant-Isolation ist beweisbar | `T-002`–`T-004` für `G2`; OIDC-Basis aus `T-001` ist abgeschlossen | Membership-/Kontext-, RLS- und Audit-Negativfälle; keine reale Tenant-PII |
| Voice+Text-Konfiguration ist synthetisch aktivierbar | `O-001`–`O-004` erst nach `G2` und `PO-001`–`PO-003`; Abschluss `G3` | versionierte Profile, begrenzte Intents, Routing/Handoff, Disclosure- und Textback-Policy sowie kombinierter Fake-Test |
| dünne kombinierte Scheibe ist für den nächsten Pull geschnitten | Just-in-time-Refinement der für `G4`/`G5` benötigten `E-*`, `V-*` und `M-*` | Fake-Call/Media → Voice → CallOutcome → optionaler Fake-Textback → ein Lead; Negativfälle für Disclosure, Handoff, Duplikate und Inhaltsleaks |

Die Reihenfolge zwischen Engineering- und Discovery-Outcomes wird beim
wöchentlichen Replenishment anhand erfüllter Abhängigkeiten, Lernwert und
tatsächlichem Durchsatz entschieden. Noch nicht gezogene Tasks dürfen dabei
kleiner geschnitten werden; Gates und Sicherheitsgrenzen dürfen nicht
abgeschwächt werden.

## Later – Optionen mit Aktivierungstrigger

| Gate/Epic | Nutzen | Hauptrisiko | Aktivierungstrigger |
|---|---|---|---|
| `G4` Realtime Telephony & Media | providerneutrale, zuverlässige Call-/Media-Session mit kanonischem Outcome | Providersemantik, Latenz oder Live-Audio-Retry werden voreilig festgeschrieben | `G3`; akzeptierter `V-001`-Benchmark; `E-*`, `V-002` und `V-005` JIT refinieren |
| `G5` Combined Assistant MVP (synthetisch) | Voice und Textback beweisen gemeinsam genau einen Lead | getrennte Automationen, Safety-Lücke oder Inhalts-/Rohtranskriptpersistenz | `G4`; `V-003`/`V-004`/`V-006`/`V-007` und `M-*` als vertikale Scheiben ziehen |
| `G6` Pilot Ready | technische, rechtliche und operative Entry-Nachweise | Featureumfang wird mit Realbetriebsreife verwechselt | stabiler synthetischer Kernpfad; konkrete Providerkandidaten; unabhängige Legal-/DSFA-/Safety-/Security-Reviews und `P-001` |
| `G7` Controlled Voice+Text Pilot | echte Nutzenevidenz unter kleinen Kohorten | reale Kontakte, Kosten, Incidents oder verdeckte Qualitätsreviews | `G6` plus explizite Provider-, Budget- und Go-live-Freigabe; `P-002`/`P-003` |
| `G8` Post-pilot Continue/Scale | evidenzbasierter `stop | continue | scale`-Entscheid | Skalierung aufgrund Kalender oder Demoqualität | ausreichende kombinierte Pilotdaten; `P-004` und `PO-010` |
| Echtgeld-Billing | validierte Monetarisierung | steuerliche/vertragliche Komplexität | bestätigte Preis-/Commercial-Entscheidungen; `B-003` separat refinieren und freigeben |
| Cloud/HA/Service-Extraktion | messbaren Betriebsengpass lösen | vorzeitige Plattformkomplexität | zahlender Betrieb oder belegtes RPO/RTO-/Skalierungsproblem; `C-*` neu refinieren |

## Unveränderliche Sequenzleitplanken

- `G0` bleibt die historische synthetische Fake-/Replay-Freigabe; `G0V`
  rebaselined den Scope, erweitert aber keine Realbetriebsbefugnis.
- Tenant-Isolation (`G2`) geht jeder Speicherung fachlicher Tenantdaten voraus.
- `V-001` benchmarkt Anbieter-, Build-vs-Buy- und Runtime-Optionen, bevor eine
  Implementierungsform oder ein Provider festgelegt wird.
- Idempotenz erzeugt höchstens eine Außenwirkung auf mindestens-einmal-
  Transport; Voice, Handoff und Textback teilen einen Vorgang.
- Audio und Rohtranskripte werden nicht persistiert. Qualitätsreview verwendet
  synthetische Korpora; Produktivreviews benötigen einen separaten,
  transparenten und rechtlich freigegebenen Prozess.
- Reale Provider, Kontakte, Daten, Zahlungen und Produktion benötigen ihre
  jeweils explizite Freigabe. Kein Gate wird durch Kalenderzeit bestanden.
