---
id: P-001
title: Combined-Assistant Staging- und Pilot-Betriebsgrundlage
phase: pilot
status: blocked
priority: P0
owner: Operations/Security
dependencies: [G5]
gate: G6
outputs: [staging-prod-plan, deployment-runbook, backup-restore, monitoring]
completed_at: null
---

# P-001 – Combined-Assistant Staging- und Pilot-Betriebsgrundlage

## Ziel und Scope

Die Produktionsform für Voice-Runtime, API/Web/Worker, Realtime-Ingress,
Textback und Datenhaltung als getrennte Accounts/Netze/Secrets planen und in
einer freigegebenen isolierten Umgebung proben. Immutable Images,
DB-Migrationsjob, Rolling-/Blue-Green-Plan, Offsite-Backup, Monitoring,
Alarmrouting und kanalübergreifender Kill Switch werden nachgewiesen. Staging
enthält keine Produktivdaten oder realen Kontakte.

## Akzeptanz und Verifikation

- [ ] Restore, Rollback, Secret-/Session-Credential-Rotation und Kill Switch
      sind in isolierter Umgebung geprobt.
- [ ] Keine Managementports sind öffentlich; TLS/Security Header sowie
      Realtime-Endpointgrenzen sind geprüft.
- [ ] Migration ist expand/contract-kompatibel und Rollback dokumentiert.
- [ ] RPO/RTO-, Alarm-, Session-/Providerbudget- und On-call-Nachweise sind
      vorhanden.
- [ ] Images sind per Digest reproduzierbar, gescannt und mit SBOM verknüpft.
- [ ] Logs, Traces, Backups und Crashartefakte bestehen Audio-/Rohtranskript-
      Leak-Tests.

Stop: Keine Produktionsressourcen, Domains, Provideraccounts oder Credentials
ohne Freigabe erzeugen/ändern; kein Go-live in diesem Task.
