---
id: F-003
title: Konfigurations- und Secret-Management
phase: foundation
status: ready
priority: P0
owner: Engineering/Security
dependencies: [F-001]
gate: G1
outputs: [typed-config, env-example, rotation-guide, secret-scan-fixture]
completed_at: null
---

# F-003 – Konfigurations- und Secret-Management

## Ziel

Jede App startet nur mit valider, umgebungsspezifischer Konfiguration und leakt
bei Fehlern keine Secrets.

## Scope

Typisierte Env-Schemas pro App, Fail-fast-Validierung, `.env.example`, Trennung
dev/test/staging/prod, Klassifikation sensibler Werte und Rotationshinweise.
CI-Testfixture mit eindeutig synthetischem Canary-Key für den Secret Scanner.

## Akzeptanz und Verifikation

- [ ] Fehlende/ungültige Variablen verhindern Start mit verständlicher,
      geheimnisfreier Meldung.
- [ ] Unbekannte Produktionsdefaults werden abgelehnt.
- [ ] Beispielkonfiguration enthält keine Geheimnisse und ist vollständig.
- [ ] Secret Scan erkennt das ausschließlich im Test erwartete Canary-Fixture.
- [ ] Logs/Snapshots maskieren sensible Konfigurationswerte.

Nicht im Scope: produktiver Secret Store oder echte Schlüsselrotation.
