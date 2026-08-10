# Ausführbarer Task-Katalog

Jede ID ist ein eigenständiger Arbeitsvertrag. Vor Ausführung gelten
[`AGENTS.md`](../../AGENTS.md), die referenzierten Dokumente und akzeptierte
ADRs. Der Status in der jeweiligen Task-Datei ist maßgeblich.

## Aktueller Pull – Rolling Wave

| Horizont/Spur | Task/Outcome |
|---|---|
| `Now` Engineering | `F-005`: reproduzierbare CI- und Supply-Chain-Baseline |
| `Now` Product | `PO-001`: SHK-Probleminterviews und Pivot-Evidenz |
| `Next` | nach F-005 Tenancy; Product nacheinander PO-002/PO-003 |
| `Later` | Onboarding, synthetischer Walking Skeleton, Ingestion/Textback, Pilot, Voice/Cloud nur bei Aktivierungstrigger |

WIP: höchstens eine Engineering- und eine Product-/Discovery-Task. `Next` ist
eine Outcome-Reihenfolge für ungefähr zwei bis sechs Wochen, keine Zusage.

## Discovery – Gate G0

| Task | Status | Abhängigkeit |
|---|---|---|
| [D-001 Product Brief](discovery/D-001-product-brief.md) | done | – |
| [D-002 Provider-Spike](discovery/D-002-provider-spike.md) | done | D-001 |
| [D-003 Datenschutz-/Abuse-Workshop](discovery/D-003-privacy-abuse-workshop.md) | done | D-001, D-002 |

## Projektmanagement – Rolling-Wave-Baseline

| Task | Status | Abhängigkeit |
|---|---|---|
| [PM-001 Dual-Track und Rolling Wave](project-management/PM-001-rolling-wave-baseline.md) | done | D-003 |

## Engineering-Fundament – Gate G1

| Task | Status | Abhängigkeit |
|---|---|---|
| [F-000 Minimale Git-Basis](foundation/F-000-git-baseline.md) | done | – |
| [F-001 Repository und Toolchain](foundation/F-001-repository-toolchain.md) | done | G0, F-000 |
| [F-002 Lokale Infrastruktur](foundation/F-002-local-infrastructure.md) | done | F-001 |
| [F-003 Konfiguration und Secrets](foundation/F-003-configuration-secrets.md) | done | F-001 |
| [F-004 API/Web/Worker-Basis](foundation/F-004-application-baseline.md) | done | F-002, F-003 |
| [F-005 CI und Supply Chain](foundation/F-005-ci-supply-chain.md) | ready | F-001–F-004 |

## Identity, Tenancy und Datenbasis – Gate G2

| Task | Status | Abhängigkeit |
|---|---|---|
| [T-001 Keycloak/OIDC](tenancy/T-001-keycloak-oidc.md) | blocked | G1 |
| [T-002 Tenant und Kontext](tenancy/T-002-tenant-context.md) | blocked | T-001 |
| [T-003 RLS und DB-Rollen](tenancy/T-003-rls-db-roles.md) | blocked | T-002 |
| [T-004 Audit-Grundlage](tenancy/T-004-audit-foundation.md) | blocked | T-002 |

## Onboarding und Konfiguration – Gate G3

| Task | Status | Abhängigkeit |
|---|---|---|
| [O-001 Betriebsprofil](onboarding/O-001-business-profile.md) | blocked | G2, PO-001–PO-003 |
| [O-002 Rufnummernkonfiguration](onboarding/O-002-phone-configuration.md) | blocked | O-001, D-002 |
| [O-003 Templates und Regeln](onboarding/O-003-message-templates.md) | blocked | O-001 |
| [O-004 Geführtes Onboarding](onboarding/O-004-guided-onboarding.md) | blocked | O-002, O-003 |

## Telephony Event Ingestion – Gate G4

| Task | Status | Abhängigkeit |
|---|---|---|
| [E-001 TelephonyPort und Fixtures](telephony/E-001-telephony-contracts.md) | blocked | G3 |
| [E-002 Sicherer Webhook](telephony/E-002-secure-webhook.md) | blocked | E-001 |
| [E-003 Inbox und Call-Aggregat](telephony/E-003-inbox-call-aggregate.md) | blocked | E-002 |
| [E-004 Worker, Retries und DLQ](telephony/E-004-worker-retries-dlq.md) | blocked | E-003 |

## Textback, Conversation und Lead – Gate G5

| Task | Status | Abhängigkeit |
|---|---|---|
| [M-001 Eligibility Engine](textback/M-001-eligibility-engine.md) | blocked | G4, O-003 |
| [M-002 MessagingPort](textback/M-002-messaging-port.md) | blocked | M-001 |
| [M-003 Textback-Orchestrierung](textback/M-003-textback-orchestration.md) | blocked | M-002 |
| [M-004 Status und Timeline](textback/M-004-status-timeline.md) | blocked | M-003 |
| [M-005 Öffentliches Kurzformular](textback/M-005-public-form.md) | blocked | M-003 |
| [M-006 Lead und Inbox](textback/M-006-lead-inbox.md) | blocked | M-005 |
| [M-007 Betriebsbenachrichtigung](textback/M-007-business-notification.md) | blocked | M-006 |

## Billing, Compliance und Produktreife – Gate G6

| Task | Status | Abhängigkeit |
|---|---|---|
| [B-001 Plan und Entitlements](billing-compliance/B-001-plans-entitlements.md) | blocked | G5 |
| [B-002 Usage Ledger](billing-compliance/B-002-usage-ledger.md) | blocked | B-001, M-003 |
| [B-003 Payment-Adapter Testmodus](billing-compliance/B-003-payment-adapter.md) | blocked | B-001, B-002, Freigabe |
| [B-004 Datenschutzfunktionen](billing-compliance/B-004-privacy-features.md) | blocked | D-003, G5 |
| [B-005 Supportzugriff](billing-compliance/B-005-support-access.md) | blocked | T-004 |
| [B-006 Analytics/KPI](billing-compliance/B-006-analytics-kpi.md) | blocked | G5, B-002 |

## Kontrollierter Pilot – Gate G7

| Task | Status | Abhängigkeit |
|---|---|---|
| [P-001 Staging/Produktion](pilot/P-001-staging-production.md) | blocked | G6 |
| [P-002 Kohorten-Rollout](pilot/P-002-cohort-rollout.md) | blocked | P-001, Go-live-Freigabe |
| [P-003 Operations/Feedback](pilot/P-003-operations-feedback.md) | blocked | P-002 |
| [P-004 PMF-/Voice-Entscheid](pilot/P-004-pmf-voice-decision.md) | blocked | ausreichende Pilotdaten |

## Voice – Gate G8

| Task | Status | Abhängigkeit |
|---|---|---|
| [V-001 Discovery/Benchmark](voice/V-001-discovery-benchmark.md) | blocked | G7 = Go |
| [V-002 Voice-Service](voice/V-002-voice-service.md) | blocked | V-001 |
| [V-003 Dialog/Tool-Gateway](voice/V-003-dialog-tool-gateway.md) | blocked | V-002 |
| [V-004 Transparenz/Consent](voice/V-004-transparency-consent.md) | blocked | V-001, Rechtsfreigabe |
| [V-005 Latenz/Audio](voice/V-005-latency-audio.md) | blocked | V-002 |
| [V-006 Emergency/Handoff](voice/V-006-emergency-handoff.md) | blocked | V-003 |
| [V-007 Summary/Metering](voice/V-007-summary-metering.md) | blocked | V-003–V-006 |
| [V-008 Red Team/Pilot](voice/V-008-red-team-pilot.md) | blocked | V-007 |

## Cloud und selektive Skalierung

| Task | Status | Trigger/Abhängigkeit |
|---|---|---|
| [C-001 Terraform/Managed Services](cloud/C-001-terraform-managed-services.md) | blocked | zahlender Go-live oder RPO/RTO/Betriebsaufwand |
| [C-002 HA/Disaster Recovery](cloud/C-002-ha-disaster-recovery.md) | blocked | C-001 und Business Case |
| [C-003 Service-Extraktion](cloud/C-003-service-extraction.md) | blocked | messbares Extraktionskriterium |

## Product-Owner-Arbeit

Siehe [separaten PO-Katalog](product-owner/README.md). Diese Tasks benötigen
überwiegend Interviews, rechtliche Prüfung oder Geschäftsentscheidungen und
können nicht autonom durch Code ersetzt werden.
