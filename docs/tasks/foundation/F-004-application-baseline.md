---
id: F-004
title: API-, Web- und Worker-Basis
phase: foundation
status: done
priority: P0
owner: Engineering
dependencies: [F-002, F-003]
gate: G1
outputs: [api-baseline, web-shell, worker-bootstrap, openapi-baseline]
completed_at: 2026-08-10
---

# F-004 – API-, Web- und Worker-Basis

## Ziel

Lauffähige, beobachtbare App-Basen mit stabilen Verträgen und sauberem Shutdown.
Lies ADR-005 und [Operations](../../operations/operations-and-delivery.md).

## Scope

`/health/live`, `/health/ready`, `/api/v1`, Fehlervertrag (`code`, `message`,
`status`, `requestId`, validierte `details`), Request-ID, OpenAPI, Web-Shell,
Worker-Bootstrap, Dependency-Readiness und Graceful Shutdown. UTC intern;
`Europe/Berlin` nur Darstellung/Fachregeln.

## Akzeptanz und Verifikation

- [x] DB-/Redis-Ausfall verändert Readiness, nicht Liveness.
- [x] Clientfehler enthalten keine Stacktraces.
- [x] OpenAPI wird erzeugt und auf Breaking Changes prüfbar.
- [x] SIGTERM nimmt keine neuen Jobs an und beendet laufende Arbeit kontrolliert.
- [x] API, Web und Worker bestehen Smoke-/Integrationstests.

Nicht im Scope: Auth, fachliche Endpunkte oder reale Provider.

## Testentwurf vor Implementierung

- Happy Path: Gebaute API, Web-Shell und Worker-Runtime starten mit
  synthetischer Testkonfiguration; Liveness, Readiness, `/api/v1` und der
  versionierte OpenAPI-Vertrag sind erreichbar.
- Dependency-Negativfall: TCP-Erreichbarkeit von PostgreSQL und Redis wird
  unabhängig geprüft. Fällt eine Abhängigkeit aus, liefert Readiness `503`,
  während Liveness unverändert `200` bleibt; Namen und Zustände enthalten
  weder URLs noch Credentials.
- Fehler-/Security-Vertrag: unbekannte Route, ungültige Request-ID und interne
  Exception liefern nur den stabilen Fehlervertrag beziehungsweise eine neue
  sichere Request-ID; Stack, Exceptiondetails und Konfigurationswerte fehlen.
- Contract-Fall: die deterministisch erzeugte OpenAPI-Datei und die daraus
  generierten Web-Typen müssen dem eingecheckten Stand entsprechen. Jede
  Vertragsänderung bricht den Check und erzwingt bewusste Review/Regeneration.
- Shutdown-/Nebenläufigkeitsfall: Bei `SIGTERM` wird die Worker-Annahme atomar
  geschlossen. Neue Arbeit scheitert, bereits registrierte synthetische Arbeit
  darf innerhalb der konfigurierten Frist enden; danach stoppt der Prozess
  kontrolliert.
- Smoke-Fall: echte lokale Kindprozesse für API, Next-Web und Worker werden mit
  synthetischen TCP-Abhängigkeiten gestartet, per HTTP/Logsignal geprüft und
  anschließend ohne verwaiste Prozesse beendet.

Mandantenautorisierung und Idempotenz fachlicher Wirkungen sind nicht
anwendbar, weil F-004 weder Tenant- noch Fachendpunkte oder Jobs einführt.

## Abschlussnachweis

- API: `/api/v1`, getrennte Live-/Ready-Proben, sicherer Fehlervertrag,
  Request-ID, allowlist-basierte JSON-Logs und maschinenlesbares OpenAPI.
- Web: statisch baubare, zugängliche und trackerfreie Foundation-Shell mit
  generierten API-Vertragstypen.
- Worker: Dependency-Gate, periodische Readiness, geschlossene Jobaufnahme beim
  Shutdown und begrenzter Drain einschließlich Nebenläufigkeits-Negativtest.
- Runtime-Smoke: sechs Prozessfälle prüfen Fail-fast-Konfiguration,
  API-Ausfallverhalten, Worker-Signalbehandlung und gebauten Next-Server. Die
  Abhängigkeiten sind kurzlebige synthetische Loopback-TCP-Endpunkte; der
  isolierte Compose-Stack bleibt ohne Host-Ports.
- Verifikation am 2026-08-10: Frozen Install, Format, Lint, Typecheck, Unit-,
  Architektur-, Secret-, OpenAPI- und Integrationstests sowie Build grün.
  `test:e2e` läuft mit `passWithNoTests`, weil F-004 noch keine fachliche
  Nutzerreise enthält. Compose-Health ist für alle fünf lokalen Dienste grün.
- Betriebsdetails und bekannte Grenzen stehen im
  [Runtime-Vertrag](../../operations/application-runtime.md). Reale Provider,
  Realdaten und Außenwirkungen bleiben unverändert blockiert.
