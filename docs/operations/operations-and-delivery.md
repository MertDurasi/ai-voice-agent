# Observability, Runbooks und Delivery

Der ausführbare API-/Web-/Worker-Vertrag der lokalen Foundation ist separat in
der [Application-Runtime](application-runtime.md) dokumentiert.

## SLOs des gehärteten Textbacks

| SLI | Ziel |
|---|---|
| API-Verfügbarkeit | 99,5 %/Monat im Pilot; später 99,9 % |
| Webhook-Annahme | p95 < 500 ms; Verarbeitung asynchron |
| Textback-Auslösung | p95 < 60 s nach validiertem Missed Call |
| RPO | ≤ 24 h intern; ≤ 1 h vor zahlendem Go-live |
| RTO | ≤ 4 h im Pilot; später ≤ 1 h |
| Queue-Alter | Alarm bei ältestem Job > 2 min |

## Pflichttelemetrie

Strukturierte JSON-Logs enthalten Zeit, Level, Service, Environment,
Request-/Trace-ID, optional gehashte Tenant-Referenz, Event-/Jobtyp und stabilen
Error Code. Inhalte und PII fehlen.

Metriken decken ab: Webhook-Ergebnisse, Inbox-/Outbox-Lag, Queue-Tiefe/-Alter,
Retry/DLQ, Eligibility/Suppression, Message-Status, End-to-End-Latenz,
Lead-Conversion, Billing-Drift, DB/Redis-Ressourcen; später Voice-Latenzen und
Kosten. Tracing folgt Webhook → Inbox → Call → Outbox → Queue → Message →
Callback → Lead, ohne Payloads/Prompts in Span-Attributen.

## Pflicht-Runbooks vor Pilot

- Telefonieprovider liefert keine Webhooks / Signaturen schlagen flächig fehl
- Messagingprovider down oder 429
- Queue wächst, DLQ befüllt oder Outbox hängt
- PostgreSQL-Speicher/Connections erschöpft; Redis-Neustart
- Zertifikat/Domainproblem; Backup-Restore; Secret-Rotation
- Tenant-Export/Löschung
- falsche oder doppelte Nachricht

Jedes Runbook enthält Symptom, Alarm, Diagnose, sichere Sofortmaßnahme,
Recovery, Datenkorrektur, Kommunikation und Postmortem-Trigger.

## CI/CD

Trunk-based Development mit kleinen Branches/PRs. Ein Task oder eine kohärente
vertikale Teilscheibe pro PR. Conventional Commits. Provider, Billing und Voice
bleiben hinter Feature Flags. Codex pusht oder deployt nur nach Autorisierung.

Deploymentfolge:

1. Checks, Images, SBOM und Scans.
2. Staging-Backup und Readiness prüfen.
3. rückwärtskompatible Expand-Migration.
4. App/Worker ausrollen und Smoke Tests.
5. Feature Flag kontrolliert aktivieren.
6. Contract-/Golden-Path-Probe.
7. alte Strukturen erst in späterer Contract-Migration entfernen.

Rollback nutzt den vorherigen Image-Digest. Destruktive Down-Migrationen sind
kein Standard-Rettungsweg. Queue- und Eventverträge bleiben mindestens eine
Releasegeneration kompatibel. Kill Switches existieren je Tenant und Provider.
