---
id: F-004
title: API-, Web- und Worker-Basis
phase: foundation
status: ready
priority: P0
owner: Engineering
dependencies: [F-002, F-003]
gate: G1
outputs: [api-baseline, web-shell, worker-bootstrap, openapi-baseline]
completed_at: null
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

- [ ] DB-/Redis-Ausfall verändert Readiness, nicht Liveness.
- [ ] Clientfehler enthalten keine Stacktraces.
- [ ] OpenAPI wird erzeugt und auf Breaking Changes prüfbar.
- [ ] SIGTERM nimmt keine neuen Jobs an und beendet laufende Arbeit kontrolliert.
- [ ] API, Web und Worker bestehen Smoke-/Integrationstests.

Nicht im Scope: Auth, fachliche Endpunkte oder reale Provider.
