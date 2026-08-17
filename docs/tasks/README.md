# Ausführbarer Task-Katalog

Jede ID ist ein eigenständiger Arbeitsvertrag. Vor Ausführung gelten
[`AGENTS.md`](../../AGENTS.md), die referenzierten Dokumente und akzeptierte
ADRs. Der Status in der jeweiligen Task-Datei ist maßgeblich. Das
Frontmatter-Feld `gate` bedeutet `contributes_to`; die vollständigen
Gatevoraussetzungen stehen in [Gate-Status](../project/gate-status.md).

## Aktueller Pull – Rolling Wave

| Horizont/Spur | Task/Outcome |
|---|---|
| `Now` Engineering | `T-004` ist nach abgeschlossenem `T-003` bereit: inhaltsarme, unveränderliche Audit-Grundlage |
| `Now` Product | `PO-001` in Arbeit: Interview-Kit fertig; zehn Interviews und Intent-Evidenz offen |
| `Next` | Nach `T-004`: G2-Review; nach `PO-001`: `PO-002`/`V-001`; weitere Arbeit WIP-gesteuert |
| `Later` | `G3` Voice+Text Configuration → `G4` Realtime Telephony & Media → `G5` synthetischer Combined Assistant → Pilot-Readiness und kontrollierter Pilot |

WIP: höchstens eine Engineering- und eine Product-/Discovery-Task. `Next` ist
eine Outcome-Reihenfolge für ungefähr zwei bis sechs Wochen, keine Zusage.
Downstream-Tasks werden vor Pull just in time auf die kleinste vertikale
Scheibe refinert.

## Discovery – historisches Gate G0

| Task | Status | Abhängigkeit |
|---|---|---|
| [D-001 Product Brief](discovery/D-001-product-brief.md) | done | – |
| [D-002 Provider-Spike](discovery/D-002-provider-spike.md) | done | D-001 |
| [D-003 Datenschutz-/Abuse-Workshop](discovery/D-003-privacy-abuse-workshop.md) | done | D-001, D-002 |

`G0` bleibt bestanden und belegt nur die damalige Fake-/Replay-Baseline. Es
wird durch die spätere Scopeentscheidung nicht rückwirkend umgedeutet.

## Projektmanagement und Voice-first-Rebaseline – Gate G0V

| Task | Status | Abhängigkeit |
|---|---|---|
| [PM-001 Dual-Track und Rolling Wave](project-management/PM-001-rolling-wave-baseline.md) | done | D-003 |
| [PM-002 Voice-first-MVP-Rebaseline](project-management/PM-002-voice-first-mvp-rebaseline.md) | done | PM-001 |

`G0V` ersetzt nicht `G0` und erlaubt nur synthetische Planung/Fake-/Replay-
Entwicklung. Anbieter, Runtime, Rechtsgrundlage, Budget und Realbetrieb bleiben
offen.

## Engineering-Fundament – Gate G1

| Task | Status | Abhängigkeit |
|---|---|---|
| [F-000 Minimale Git-Basis](foundation/F-000-git-baseline.md) | done | – |
| [F-001 Repository und Toolchain](foundation/F-001-repository-toolchain.md) | done | G0, F-000 |
| [F-002 Lokale Infrastruktur](foundation/F-002-local-infrastructure.md) | done | F-001 |
| [F-003 Konfiguration und Secrets](foundation/F-003-configuration-secrets.md) | done | F-001 |
| [F-004 API/Web/Worker-Basis](foundation/F-004-application-baseline.md) | done | F-002, F-003 |
| [F-005 CI und Supply Chain](foundation/F-005-ci-supply-chain.md) | done | F-001–F-004 |

## Identity, Tenancy und Datenbasis – Gate G2

| Task | Status | Abhängigkeit |
|---|---|---|
| [T-001 Keycloak/OIDC](tenancy/T-001-keycloak-oidc.md) | done | G1 |
| [T-002 Tenant und Kontext](tenancy/T-002-tenant-context.md) | done | T-001 |
| [T-003 RLS und DB-Rollen](tenancy/T-003-rls-db-roles.md) | done | T-002 |
| [T-004 Audit-Grundlage](tenancy/T-004-audit-foundation.md) | ready (`Now`) | T-003 |

`G2` verlangt zusätzlich das bestandene `G0V`; die historischen Tenancy-Tasks
werden nicht rückwirkend erweitert.

## Product-Investment-Checkpoint und Voice+Text Configuration – Gate G3

| Task | Status | Abhängigkeit |
|---|---|---|
| [PO-001 Problem-/Vertrauensinterviews](product-owner/PO-001-problem-interviews.md) | in_progress (`Now`) | G0V |
| [PO-002 Kombiniertes Pilotangebot](product-owner/PO-002-pilot-offer.md) | blocked | PO-001 |
| [V-001 Provider-/Runtime-Benchmark](voice/V-001-discovery-benchmark.md) | blocked | G0V, PO-001 |
| [PO-003 Voice-/Text-Kostenmodell](product-owner/PO-003-cost-pricing-model.md) | blocked | D-002, V-001 |
| [O-001 Betriebsprofil/Assistant-Policy](onboarding/O-001-business-profile.md) | blocked | G2, PO-001–PO-003 |
| [O-002 Rufnummer/Routing/Handoff](onboarding/O-002-phone-configuration.md) | blocked | O-001, V-001 |
| [O-003 Disclosure/Handoff/Textback-Policies](onboarding/O-003-message-templates.md) | blocked | O-001 |
| [O-004 Geführtes Voice+Text-Onboarding](onboarding/O-004-guided-onboarding.md) | blocked | O-002, O-003 |

`V-001` vergleicht Optionen, bevor Provider, Programmiersprache,
Servicetrennung oder Runtime festgelegt werden. Das Gate endet mit einem
kombinierten Fake-Onboarding, nicht mit einer echten Nummer oder Nachricht.

## Realtime Telephony & Media – Gate G4

| Task | Status | Abhängigkeit |
|---|---|---|
| [E-001 Telephony-/Realtime-Verträge](telephony/E-001-telephony-contracts.md) | blocked | G3, V-001 |
| [E-002 Sicherer Webhook-/Media-Ingress](telephony/E-002-secure-webhook.md) | blocked | E-001 |
| [E-003 Call-/VoiceSession-Aggregat](telephony/E-003-inbox-call-aggregate.md) | blocked | E-002 |
| [E-004 Asynchrone Worker/DLQ](telephony/E-004-worker-retries-dlq.md) | blocked | E-003 |
| [V-002 Voice-Runtime/simulierte Pipeline](voice/V-002-voice-service.md) | blocked | G3 |
| [V-005 Realtime-Latenz/Audio](voice/V-005-latency-audio.md) | blocked | V-002 |

Live-Audio- und Dialogturns werden nicht über Event-Retries wiederholt. Alle
Nachweise bleiben synthetisch und providerneutral beziehungsweise nutzen nur
ausdrücklich freigegebene Testmittel.

## Combined Assistant MVP (synthetisch) – Gate G5

| Task | Status | Abhängigkeit |
|---|---|---|
| [V-003 Dialog/Tool-Gateway](voice/V-003-dialog-tool-gateway.md) | blocked | G4 |
| [V-004 Disclosure/Choice/Datenminimierung](voice/V-004-transparency-consent.md) | blocked | G4, O-003 |
| [V-006 Safety/Emergency/Handoff](voice/V-006-emergency-handoff.md) | blocked | V-003 |
| [V-007 Strukturierte Summary/Metering](voice/V-007-summary-metering.md) | blocked | V-003, V-004, V-005, V-006 |
| [M-001 Outcome-/Textback-Eligibility](textback/M-001-eligibility-engine.md) | blocked | G4, O-003 |
| [M-002 MessagingPort/Fake](textback/M-002-messaging-port.md) | blocked | M-001 |
| [M-003 Integrierte Fortsetzung](textback/M-003-textback-orchestration.md) | blocked | M-002, V-003 |
| [M-004 Gemeinsame Timeline](textback/M-004-status-timeline.md) | blocked | M-003 |
| [M-005 Fortsetzungsformular](textback/M-005-public-form.md) | blocked | M-003 |
| [M-006 Gemeinsamer Lead/Inbox](textback/M-006-lead-inbox.md) | blocked | M-005, V-007 |
| [M-007 Lead-Benachrichtigung](textback/M-007-business-notification.md) | blocked | M-006 |

Gate-Nachweis ist eine synthetische vertikale Scheibe: Fake-Call/Media →
Disclosure und begrenzter Voice-Dialog → kanonisches Outcome → optionaler
Fake-Textback → genau ein Lead. Audio, Rohtranskript und Quellsegmente werden
nicht persistiert.

## Pilot Ready – Gate G6

| Task | Status | Abhängigkeit |
|---|---|---|
| [B-001 Voice+Text Plan/Entitlements](billing-compliance/B-001-plans-entitlements.md) | blocked | G5 |
| [B-002 Usage Ledger](billing-compliance/B-002-usage-ledger.md) | blocked | B-001, M-003, V-007 |
| [B-004 Datenschutzfunktionen](billing-compliance/B-004-privacy-features.md) | blocked | D-003, G5 |
| [B-005 Supportzugriff](billing-compliance/B-005-support-access.md) | blocked | T-004 |
| [B-006 Combined-Assistant Analytics/KPI](billing-compliance/B-006-analytics-kpi.md) | blocked | G5, B-002 |
| [V-008 Red Team/Pilot-Readiness](voice/V-008-red-team-pilot.md) | blocked | G5 |
| [P-001 Staging/Pilot-Betriebsgrundlage](pilot/P-001-staging-production.md) | blocked | G5 |
| [PO-004 Voice-/Text-Rechts-/DSFA-Prüfung](product-owner/PO-004-legal-review.md) | blocked | G3 |
| [PO-005 Voice+Text-Supportmodell](product-owner/PO-005-support-model.md) | blocked | PO-002 |
| [PO-006 Voice+Text-Designpartner](product-owner/PO-006-design-partners.md) | blocked | PO-001, PO-002, PO-004 |

`G6` benötigt konkrete Legal-, DSFA-, Safety-, Security-, Provider-, Budget-,
Restore-, Runbook- und Kill-Switch-Nachweise. Es enthält weder `B-003` noch
eine automatische Go-live-Freigabe.

## Controlled Voice+Text Pilot – Gate G7

| Task | Status | Abhängigkeit |
|---|---|---|
| [P-002 Kontrollierter Kohortenrollout](pilot/P-002-cohort-rollout.md) | blocked | G6, explizite Go-live-Freigabe |
| [P-003 Operations/Feedback](pilot/P-003-operations-feedback.md) | blocked | P-002 |
| [PO-009 Wöchentliche Voice+Text-Review](product-owner/PO-009-weekly-review.md) | blocked | P-002 |

Reale Außenwirkung beginnt nur nach den expliziten `G6`-/Go-live-Freigaben.
Weder Pilot noch Operationszugriff erlaubt stille Produktivgesprächsreviews.

## Post-pilot Continue/Scale – Gate G8

| Task | Status | Abhängigkeit |
|---|---|---|
| [P-004 Stop/Continue/Scale-Dossier](pilot/P-004-pmf-voice-decision.md) | blocked | P-003, ausreichende Pilotdaten |
| [PO-010 Stop/Continue/Scale-Entscheid](product-owner/PO-010-voice-go-no-go.md) | blocked | P-004 |

Voice startet nicht erst an `G8`. Das Gate entscheidet evidenzbasiert über
Stop, Fortsetzung im engen Scope oder eine separat freizugebende Skalierung.

## Spätere kommerzielle und technische Optionen

| Task | Status | Trigger/Abhängigkeit |
|---|---|---|
| [PO-007 Voice+Text Pricing](product-owner/PO-007-pricing.md) | blocked | PO-003, Pilotevidenz |
| [PO-008 Commercial Policies](product-owner/PO-008-commercial-policies.md) | blocked | PO-004, PO-007 |
| [B-003 Payment-Adapter Testmodus](billing-compliance/B-003-payment-adapter.md) | blocked | B-001, B-002, separate Providerfreigabe; nicht G6 |
| [C-001 Terraform/Managed Services](cloud/C-001-terraform-managed-services.md) | blocked | zahlender Go-live oder RPO/RTO/Betriebsaufwand |
| [C-002 HA/Disaster Recovery](cloud/C-002-ha-disaster-recovery.md) | blocked | C-001 und Business Case |
| [C-003 Service-Extraktion](cloud/C-003-service-extraction.md) | blocked | messbares Extraktionskriterium |

## Product-Owner-Arbeit

Diese Tasks benötigen Interviews, qualifizierte rechtliche Prüfung oder
Geschäftsentscheidungen und können nicht autonom durch Code ersetzt werden.
Der WIP-Vertrag gilt auch dann, wenn mehrere Aufgaben bereits vorbereitet sind.
