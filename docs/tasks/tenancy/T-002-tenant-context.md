---
id: T-002
title: Tenant, Membership und Tenant-Kontext
phase: tenancy
status: blocked
priority: P0
owner: Engineering
dependencies: [T-001]
gate: G2
outputs: [tenant-membership-schema, guards, tenant-context, rbac-matrix]
completed_at: null
---

# T-002 – Tenant, Membership und Tenant-Kontext

## Ziel und Scope

Tenant/Membership modellieren, Tenant-Auswahl und Guards implementieren sowie
unveränderlichen Kontext durch HTTP und Jobs propagieren. Lies
[Systemarchitektur](../../architecture/system-architecture.md) und ADR-002.
Die autoritative Tenant-ID entsteht aus authentifizierter Membership, nie aus
Header oder Body.

## Akzeptanz und Verifikation

- [ ] Nutzer ohne passende Membership erhält 403.
- [ ] Header-/Body-/Pfad-Manipulation ändert Tenant-Kontext nicht.
- [ ] Rollenmatrix ist dokumentiert und API-Integrationstests decken jede Rolle.
- [ ] Job-Payload und Consumer validieren Tenant-Kontext unveränderlich.
- [ ] Logs besitzen maskierte Actor- und Tenant-Korrelation ohne PII.

Nicht im Scope: DB-RLS (`T-003`) und vollständiges Audit (`T-004`).
