---
id: F-002
title: Lokale Infrastruktur
phase: foundation
status: done
priority: P0
owner: Engineering/Operations
dependencies: [F-001]
gate: G1
outputs: [infra/compose, healthcheck-script, local-infra-docs]
completed_at: 2026-08-09
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

- [x] `compose:up` endet healthy; Skript prüft jede Abhängigkeit.
- [x] Neustart erhält DB- und Objektdaten.
- [x] Mailpit empfängt eine synthetische Testmail.
- [x] Dienste sind nur soweit nötig exponiert; Produktionsdefaults fail-closed.
- [x] `compose:down` ist dokumentiert und löscht Volumes nicht implizit.

Stop: Keine externen Accounts oder produktiven Zugangsdaten verwenden.

## Abschlussnachweis – 2026-08-09

- [Compose-Konfiguration](../../../infra/compose/compose.yaml), exakt gepinnte
  Images, benannte Volumes, Ressourcenlimits und Healthchecks sind in der
  [lokalen Betriebsanleitung](../../../infra/compose/README.md) dokumentiert.
- `compose:up` endet für PostgreSQL, Redis, Keycloak, MinIO und Mailpit mit
  `running/healthy`. `compose:health` prüft zusätzlich die echten internen
  Readiness-Endpunkte von Keycloak, MinIO und Mailpit.
- `compose:verify` legt ausschließlich synthetische Marker und eine Nachricht
  an `invalid.example` an, startet alle Dienste neu und liest PostgreSQL-,
  Redis-, MinIO- sowie Mailpit-Nachweise erfolgreich zurück. Der Test bestand
  erneut nach vollständigem `compose:down`/`compose:up`.
- Das Compose-Netz ist technisch `internal`; alle fünf Services besitzen leere
  Host-Portbindings. Tool-Container laufen nur im selben Netz. Öffentliche
  Images werden mit einer leeren Docker-Client-Konfiguration ohne persönliche
  Registry-Credentials geladen.
- Ohne Env-Datei scheitert bereits `docker compose config` an der ersten
  erforderlichen Variable. Die eingecheckte `.env.example` ist ausdrücklich
  synthetisch und ausschließlich lokal; eine Produktionskonfiguration wurde
  nicht angelegt.
- `compose:down` entfernte Container und Netz, aber keine der vier benannten
  Volumes. Nur die dokumentierte, explizite `--volumes`-Variante ist
  destruktiv.
- `format:check`, `lint`, `typecheck`, Unit-/Architekturtests und `build` sind
  grün. Der allgemeine Integration-Runner enthält vor Fachmodulen weiterhin
  keine Testdateien; die taskbezogene Integration ist der erfolgreiche
  `compose:verify`-Lauf.

Es wurden keine externen Accounts, Provideradapter, produktiven Zugangsdaten,
echten Nachrichten oder realen Daten verwendet. Die lokale Umgebung bleibt
für den nächsten Task healthy aktiv.
