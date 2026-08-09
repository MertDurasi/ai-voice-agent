---
id: B-005
title: Supportzugriff und Impersonation-Schutz
phase: billing-compliance
status: blocked
priority: P0
owner: Security/Engineering
dependencies: [T-004]
gate: G6
outputs: [support-access-workflow, step-up-auth, support-banner, access-audit]
completed_at: null
---

# B-005 – Supportzugriff und Impersonation-Schutz

## Ziel und Scope

Zeitlich begrenzten, begründeten, standardmäßig read-only Supportzugriff mit
Step-up Auth/MFA, sichtbarem Banner, Ticket/Grund, Ablauf und Audit schaffen.
Tenant kann Zugriff deaktivieren, sofern das freigegebene Betriebsmodell dies
zulässt.

## Akzeptanz und Verifikation

- [ ] Kein verstecktes oder dauerhaftes Tenant-Impersonation.
- [ ] Jeder Zugriff hat internen Actor, Ticket/Grund, Scope und Ablaufzeit.
- [ ] Write-Eskalation ist separat, minimal, sichtbar und auditiert.
- [ ] Abgelaufener/deaktivierter Zugriff scheitert sofort und negativ getestet.
- [ ] `support_admin` kann RLS/Audit nicht allgemein umgehen.

Stop: Betriebsmodell und Tenant-Steuerung bei Konflikt durch Product/Security
entscheiden lassen.
