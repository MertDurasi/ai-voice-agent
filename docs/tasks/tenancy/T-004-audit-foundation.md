---
id: T-004
title: Audit-Grundlage
phase: tenancy
status: ready
priority: P0
owner: Engineering/Security
dependencies: [T-003]
gate: G2
outputs: [audit-event-model, audit-port, audit-policies, audit-tests]
completed_at: null
---

# T-004 – Audit-Grundlage

## Ziel und Scope

Append-only-orientierte Audit Events mit Actor, Tenant, Aktion,
Ressourcentyp/-ID, Zeitpunkt, Request-ID und Ergebnis schaffen. Nur explizit
freigegebene Metadaten statt Vollobjekt/Payload speichern. Die in `T-003`
geschaffenen RLS-, Rollen- und System-Receipt-Grenzen sind verbindlich.

## Akzeptanz und Verifikation

- [ ] Rollenänderung, Login-relevante Adminaktion und Supportzugriff sind
      nachvollziehbar.
- [ ] Secrets, Nachrichtentexte und direkte PII fehlen in Auditdaten.
- [ ] Normale Tenant-Nutzer können Auditdatensätze nicht ändern/löschen.
- [ ] Fehlgeschlagene Aktionen können ohne sensible Payload auditiert werden.
- [ ] Retention/Export-Behandlung ist als offene Compliance-Entscheidung
      markiert.

Gate `G2` benötigt zusätzlich die grüne Cross-Tenant-Suite aus `T-003`.
