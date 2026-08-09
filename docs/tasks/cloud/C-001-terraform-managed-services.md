---
id: C-001
title: Terraform und Managed Services
phase: cloud
status: blocked
priority: P1
owner: Operations/Security
dependencies: [cloud-trigger-approved]
gate: null
outputs: [terraform, cloud-architecture-adr, migration-plan, budget-alerts]
completed_at: null
---

# C-001 – Terraform und Managed Services

## Trigger und Ziel

Nur bei zahlendem Go-live oder wenn RPO/RTO bzw. gemessener VPS-Betriebsaufwand
nicht ausreichen. EU-Region, segmentierte Netze, Managed PostgreSQL/Redis/Object
Storage, Secret Store, zentrale Logs, Backup Policies und Budgetalarme als IaC.

## Akzeptanz und Verifikation

- [ ] Triggerdaten und Business Case sind vor Ressourcenanlage dokumentiert.
- [ ] Plan/Policy-Checks, Least Privilege und State-Schutz sind grün.
- [ ] Datenregion, Subprozessoren, Verschlüsselung und Exit sind bewertet.
- [ ] Migration, Rollback, Downtime und Datenvalidierung sind geprobt.
- [ ] Budgetalarme und Ressourcenlimits existieren vor Aktivierung.

Stop: Cloudanbieter, Accounts, Kosten und Datenmigration benötigen Freigabe;
keine Produktionsressource autonom anlegen.
