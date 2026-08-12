# Observability, Runbooks und Delivery

Der ausführbare API-/Web-/Worker-Vertrag der lokalen Foundation ist separat in
der [Application-Runtime](application-runtime.md) dokumentiert.

## SLOs des gehärteten Voice-/Textback-MVP

| SLI | Ziel |
|---|---|
| API-Verfügbarkeit | 99,5 %/Monat im Pilot; später 99,9 % |
| Webhook-Annahme | p95 < 500 ms; Verarbeitung asynchron |
| Voice Answer | Ziel nach `V-001` anhand Routing/Provider; technische Fehler getrennt messen |
| Voice Turn | Benchmarkhypothese Median <1,2 s, p95 <2,0 s; vor Providerwahl kein Produktionsversprechen |
| Human Handoff | jeder angeforderte Handoff endet sichtbar in `transferred`, `callback_requested` oder `handoff_failed` |
| Textback-Auslösung | p95 <60 s nach positivem, bestätigtem Channel-Intent |
| RPO | ≤ 24 h intern; ≤ 1 h vor zahlendem Go-live |
| RTO | ≤ 4 h im Pilot; später ≤ 1 h |
| Queue-Alter | Alarm bei ältestem Job > 2 min |

## Pflichttelemetrie

Strukturierte JSON-Logs enthalten Zeit, Level, Service, Environment,
Request-/Trace-ID, optional gehashte Tenant-Referenz, Event-/Jobtyp und stabilen
Error Code. Inhalte und PII fehlen.

Metriken decken ab: Call-/Sessionzustände, Disclosure, Intentresultat,
Handoff, Komponentenlatenz, Sessionbudget, Voice-Minuten/-Kosten,
Webhook-Ergebnisse, Inbox-/Outbox-Lag, Queue-Tiefe/-Alter, Retry/DLQ,
Eligibility/Suppression, Message-Status, Lead-Conversion, Billing-Drift und
DB/Redis-Ressourcen. Tracing korreliert Call → VoiceSession → inhaltsfreien
Tool-/Handoffstatus → Lead → optional Textback/Formular, ohne Audio,
Rohtranskript, Prompt, Toolinhalt, Payload oder Capability Token.

## Pflicht-Runbooks vor Pilot

- Telefonieprovider liefert keine Webhooks / Signaturen schlagen flächig fehl
- Messagingprovider down oder 429
- Queue wächst, DLQ befüllt oder Outbox hängt
- PostgreSQL-Speicher/Connections erschöpft; Redis-Neustart
- Zertifikat/Domainproblem; Backup-Restore; Secret-Rotation
- Tenant-Export/Löschung
- falsche oder doppelte Nachricht
- Voice-Runtime/STT/LLM/TTS degraded oder nicht erreichbar
- Disclosure-/Policykonfiguration ungültig; Voice bleibt fail-closed
- Human-Handoff nicht erreichbar oder Transferloop
- auffällige Sessiondauer, Parallelität oder Voice-Kosten
- Voice-Kill-Switch, sicherer Drain und Nachweis, dass keine Audio-/
  Rohtranskriptartefakte persistiert wurden

Jedes Runbook enthält Symptom, Alarm, Diagnose, sichere Sofortmaßnahme,
Recovery, Datenkorrektur, Kommunikation und Postmortem-Trigger.

## CI/CD

Trunk-based Development mit kleinen Branches/PRs. Ein Task oder eine kohärente
vertikale Teilscheibe pro PR. Conventional Commits. Provider, Billing sowie
jeder reale Voice-/Textpfad bleiben hinter Feature Flags und Kill Switches.
Codex pusht oder deployt nur nach Autorisierung.

Der ausführbare Job-, Scan-, Migrations-, Artefakt- und Required-Check-Vertrag
steht in der [CI- und Supply-Chain-Baseline](ci-supply-chain.md).

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
