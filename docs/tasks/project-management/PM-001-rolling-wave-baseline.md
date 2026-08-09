---
id: PM-001
title: Rolling-Wave- und Dual-Track-Arbeitsbaseline
phase: project-management
status: done
priority: P0
owner: Product Owner/Engineering
dependencies: [D-003]
gate: G0
outputs: [docs/project/working-model.md, docs/project/roadmap.md, docs/project/timeline.md, docs/project/gate-status.md, docs/templates/task-template.md, docs/tasks/README.md]
completed_at: 2026-08-08
---

# PM-001 – Rolling-Wave- und Dual-Track-Arbeitsbaseline

## Ziel und Nutzen

Die bestehende sichere Projektbaseline in ein leichtgewichtiges, verbindliches
Dual-Track-Kanban-Modell überführen. Nur unmittelbar anstehende Arbeit wird
entscheidungsvollständig verfeinert; spätere Arbeit bleibt als Outcome,
Leitplanke und messbarer Aktivierungstrigger sichtbar.

## Scope

- `Now`, `Next` und `Later` als eindeutige Planungshorizonte und eine zentrale
  aktuelle Reihenfolge im Task-Katalog definieren.
- WIP auf höchstens eine Engineering-Task und eine parallele Product-/Discovery-
  Task begrenzen. Ein P0-/Security-Expedite pausiert sichtbar die betroffene
  aktive Arbeit, statt das WIP-Limit still zu umgehen.
- Einen wöchentlichen Review-/Replenishment-Termin mit Evidenz, Risiken,
  Entscheidungen, Durchsatz, Forecastbandbreite und nächsten Pull-Kandidaten
  festlegen.
- `G0` als Freigabe ausschließlich für synthetische Fake-/Replay-Entwicklung
  schärfen. G0 ist keine Provider-, Kanal-, Rechts-, Vertrags-, Kosten- oder
  Realbetriebsfreigabe.
- `PO-001`, `PO-002` und `PO-003` als parallelen Product-Discovery-Track und als
  expliziten Investment-Checkpoint vor Start von `O-001` verankern.
- Nach `G2` eine PII-freie Walking-Skeleton-Scheibe priorisieren:
  Replay-Missed-Call → Eligibility → Fake-Nachricht → lokal tokenisiertes
  Formular → synthetischer Lead. Die Scheibe umgeht weder Tenant-Isolation
  noch Idempotenz-, Datenschutz- oder Security-Leitplanken.
- Ferne Billing-, Pilot-, Voice- und Cloud-Tasks als veränderliche Backlog-
  Kandidaten mit Refinement-Trigger kennzeichnen, nicht als bereits
  entschiedene Implementierungsreihenfolge.
- Die kalenderartige Langfristplanung durch eine kapazitäts- und
  evidenzbasierte Forecastbandbreite ersetzen.

## Nicht im Scope

- Umsetzung des Walking Skeleton oder anderer Produkt-/Engineering-Features.
- Änderung akzeptierter ADRs oder bindende Stack-, Provider- und
  Kanalentscheidungen.
- Rechtsfreigabe, Retention-Freigabe, Accounts, Verträge, Kosten, echte
  Kontakte, Nachrichten oder Deployments.
- Vollständige Detailplanung der Phasen nach dem aktuellen `Next`-Horizont.

## Lieferobjekte

- Aktualisiertes Arbeitsmodell mit Pull-Regeln, WIP, Definition of Ready,
  Wochenrhythmus und Verantwortlichkeiten.
- Outcome-orientierte Roadmap und Rolling Forecast mit `Now`/`Next`/`Later`.
- Konsistente Gate- und Task-Sicht mit ausdrücklichen Pflichtnachweisen,
  Product-Discovery-Checkpoint und Walking-Skeleton-Ziel.
- Task-Template mit Planungshorizont, Hypothese/Outcome, Review-Trigger,
  Reversibilität und Evidenzbedarf.

## Akzeptanz und Verifikation

- [x] `Now`, `Next` und `Later` sind eindeutig definiert; nur `Now` verlangt
      vollständig verfeinerten Scope und Akzeptanztests.
- [x] WIP-Limit, Pull-Regel, Expedite-Regel und wöchentliche Cadence besitzen
      klare Owner und beobachtbare Nachweise.
- [x] G0 erlaubt nur Fake-/Replay-Arbeit und behauptet keine reale Provider-,
      Kanal- oder Rechtsfreigabe.
- [x] Der Abschluss von `PO-001`–`PO-003` ist vor `O-001` maschinell oder
      eindeutig dokumentarisch prüfbar.
- [x] Die erste Walking-Skeleton-Scheibe ist als nächstes vertikales Outcome
      nach G2 sichtbar, ohne Sicherheitsgates zu umgehen.
- [x] Ferne Tasks besitzen einen Refinement-/Aktivierungstrigger und werden
      nicht durch feste Kalenderwochen als zugesagt dargestellt.
- [x] Working Model, Roadmap, Timeline, Gate-Status, Task-Katalog und Template
      widersprechen einander nicht; lokale Markdown-Links sind gültig.

## Risiken und Stop-Bedingungen

Offene Rechts- oder Providerfragen werden als Realbetriebsblocker geführt und
nicht durch Prozessformulierungen entschieden. Solange `D-003` nicht
abgeschlossen ist, bleibt diese Task `blocked`. Akzeptierte ADRs und
Security-Leitplanken werden nur referenziert, nicht stillschweigend geändert.

## Abschlussnachweis – 2026-08-08

- Dual-Track-Pull, WIP, `Now`/`Next`/`Later`, Definition of Ready, Expedite und
  Wochenrhythmus sind im Arbeitsmodell verankert.
- Starre Kalenderwochen wurden durch einen Rolling Forecast ersetzt; konkrete
  Bandbreiten werden erst durch beobachtete Cycle Time geschärft.
- `PO-001`–`PO-003` sind als dokumentarisch prüfbare Abhängigkeit von `O-001`
  und die synthetische Walking-Skeleton-Scheibe als Outcome nach `G2` sichtbar.
- Lokale Markdown-Links wurden geprüft; keine Anwendungstests betroffen.
