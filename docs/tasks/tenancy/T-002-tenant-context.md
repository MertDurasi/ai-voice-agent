---
id: T-002
title: Tenant, Membership und Tenant-Kontext
phase: tenancy
status: done
priority: P0
owner: Engineering
dependencies: [T-001]
gate: G2
outputs: [tenant-membership-schema, guards, tenant-context, rbac-matrix]
completed_at: 2026-08-13
---

# T-002 – Tenant, Membership und Tenant-Kontext

## Ziel und Scope

Tenant/Membership modellieren, Tenant-Auswahl und Guards implementieren sowie
unveränderlichen Kontext durch HTTP und Jobs propagieren. Lies
[Systemarchitektur](../../architecture/system-architecture.md) und ADR-002.
Die autoritative Tenant-ID entsteht aus authentifizierter Membership, nie aus
Header oder Body.

## Akzeptanz und Verifikation

- [x] Nutzer ohne passende Membership erhält 403.
- [x] Header-/Body-/Pfad-Manipulation ändert Tenant-Kontext nicht.
- [x] Rollenmatrix ist dokumentiert und API-Integrationstests decken jede Rolle.
- [x] Job-Payload und Consumer validieren Tenant-Kontext unveränderlich.
- [x] Logs besitzen maskierte Actor- und Tenant-Korrelation ohne PII.

Nicht im Scope: DB-RLS (`T-003`) und vollständiges Audit (`T-004`).

## Abschlussnachweis

- `@voice-ai/tenancy` modelliert Tenant, Membership, RBAC, unveränderlichen
  Tenant-Kontext und tenantgebundene Job-Envelopes frameworkunabhängig.
- HTTP-Guards verwenden die Pfad-ID nur als Lookup-Schlüssel und übernehmen
  Tenant, Rolle und Membership-Version ausschließlich aus der aktiven
  Membership. Header, Query, Body, falsche Pfade, fehlende Membership und
  `support_admin` werden einheitlich mit `403` abgelehnt.
- Der Job-Consumer validiert Schema und Payload, löst Memberships vor der
  Ausführung erneut auf und verweigert veränderte, veraltete oder deaktivierte
  Kontexte. Die Rollenmatrix und Sicherheitsgrenzen sind im
  [Tenant-Kontext-Vertrag](../../security/tenant-context-and-rbac.md)
  dokumentiert.
- Logs erhalten nur pseudonyme `act_*`-/`ten_*`-Referenzen. Rohe Subjects,
  Tenant-UUIDs, URL-Pfade und Payloads bleiben außerhalb der Telemetrie.
- OpenAPI und Web-Typen enthalten den synthetisch getesteten Kontextendpunkt.
  Ohne einen injizierten Membership-Adapter bleibt er bis `T-003` bewusst
  fail-closed; es wurden keine ungeschützten Tabellen oder RLS-Anteile
  vorgezogen.
- Unter Node `24.18.0` und pnpm `11.20.0` sind Format, Lint, Typecheck, Unit-,
  Architektur-, Security-, CI-Policy-, OpenAPI-, Integrations- und Buildchecks
  sowie der Dependency-Scan grün. Der generische E2E-Runner besitzt weiterhin
  noch keine separaten fachlichen Testdateien und meldet dies transparent.
