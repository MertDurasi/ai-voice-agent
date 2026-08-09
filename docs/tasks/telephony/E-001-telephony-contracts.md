---
id: E-001
title: TelephonyPort und Contract Fixtures
phase: telephony
status: blocked
priority: P0
owner: Engineering
dependencies: [G3]
gate: G4
outputs: [telephony-port, canonical-events, anonymized-fixtures, replay-adapter]
completed_at: null
---

# E-001 – TelephonyPort und Contract Fixtures

## Ziel und Scope

Kanonische Events `CallStarted`, `CallAnswered`, `CallMissed`, `CallCompleted`,
Provider-Mapping sowie anonymisierte Fixtures und Fake-/Replay-Adapter schaffen.
Lies ADR-004/010 und [Datenzuverlässigkeit](../../architecture/data-and-reliability.md).

## Akzeptanz und Verifikation

- [ ] Domain/Application importiert kein Provider-SDK oder Providerpayload.
- [ ] Contract-Tests mappen alle freigegebenen Fixture-Varianten.
- [ ] Fixtures enthalten keine reale PII oder Secrets.
- [ ] Unbekannte Eventtypen werden sicher geparkt und beobachtbar, nicht
      verworfen oder fachlich interpretiert.
- [ ] Zeit, IDs und Nummernnormalisierung sind explizit getestet.

Nicht im Scope: öffentlicher Webhook und Call-Persistenz.
