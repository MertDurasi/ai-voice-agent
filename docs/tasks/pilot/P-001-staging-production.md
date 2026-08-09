---
id: P-001
title: Staging- und Produktionsgrundlage
phase: pilot
status: blocked
priority: P0
owner: Operations/Security
dependencies: [G6]
gate: G7
outputs: [staging-prod-infra, deployment-runbook, backup-restore, monitoring]
completed_at: null
---

# P-001 – Staging- und Produktionsgrundlage

## Ziel und Scope

Getrennte Accounts, Secrets und Netze; Caddy/TLS, immutable Images,
DB-Migration-Job, Compose-tauglichen Rolling-/Blue-Green-Plan, Offsite-Backup,
Monitoring und Alarmrouting schaffen. Staging entspricht Produktionsform ohne
Produktionsdaten/-kontakte.

## Akzeptanz und Verifikation

- [ ] Restore, Rollback und Secret-Rotation sind in isolierter Umgebung geprobt.
- [ ] Keine Managementports sind öffentlich; TLS/Security Header sind geprüft.
- [ ] Migration ist expand/contract-kompatibel und Rollback dokumentiert.
- [ ] RPO/RTO-, Alarm- und On-call-Nachweise sind vorhanden.
- [ ] Images sind per Digest reproduzierbar, gescannt und mit SBOM verknüpft.

Stop: Keine Produktionsressourcen, Domains oder Credentials ohne Freigabe
erzeugen/ändern; kein Go-live in diesem Task.
