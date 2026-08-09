---
id: F-002
title: Lokale Infrastruktur
phase: foundation
status: ready
priority: P0
owner: Engineering/Operations
dependencies: [F-001]
gate: G1
outputs: [infra/compose, healthcheck-script, local-infra-docs]
completed_at: null
---

# F-002 – Lokale Infrastruktur

## Ziel

PostgreSQL, Redis, Keycloak, MinIO und Mailpit lokal reproduzierbar und
persistenzsicher bereitstellen. Referenzen: [Stack](../../engineering/technology-stack.md)
und [Operations](../../operations/operations-and-delivery.md).

## Scope

Compose-Dateien, Healthchecks, benannte Volumes, isolierte Netze,
ressourcenschonende Defaults, Beispielkonfiguration und ein Healthcheck-Skript.
Produktionsprofile dürfen keine Default-Passwörter akzeptieren.

## Akzeptanz und Verifikation

- [ ] `compose:up` endet healthy; Skript prüft jede Abhängigkeit.
- [ ] Neustart erhält DB- und Objektdaten.
- [ ] Mailpit empfängt eine synthetische Testmail.
- [ ] Dienste sind nur soweit nötig exponiert; Produktionsdefaults fail-closed.
- [ ] `compose:down` ist dokumentiert und löscht Volumes nicht implizit.

Stop: Keine externen Accounts oder produktiven Zugangsdaten verwenden.
