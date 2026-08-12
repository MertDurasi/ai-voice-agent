# Architecture Decision Records

Akzeptierte ADRs sind verbindlich. Änderungen erfolgen durch eine neue ADR, die
die alte explizit ersetzt; bestehende Dateien werden nicht rückwirkend
umgedeutet.

| ADR | Entscheidung | Status |
|---|---|---|
| [001](ADR-001-modularer-monolith.md) | Modularer Monolith | accepted |
| [002](ADR-002-tenant-rls.md) | `tenant_id` plus PostgreSQL RLS | accepted |
| [003](ADR-003-inbox-outbox.md) | Transactional Outbox und Webhook Inbox | accepted |
| [004](ADR-004-ports-adapters.md) | Ports & Adapter für Anbieter | accepted |
| [005](ADR-005-rest-openapi.md) | REST `/api/v1`, OpenAPI, separate Webhooks | accepted |
| [006](ADR-006-keycloak-oidc.md) | Keycloak via OIDC | accepted |
| [007](ADR-007-postgres-source-of-truth.md) | PostgreSQL Source of Truth, Redis transient | accepted |
| [008](ADR-008-recording-off.md) | Gesprächsaufzeichnung standardmäßig aus | accepted |
| [009](ADR-009-textback-before-voice.md) | Historisch: Textback vor Voice | superseded by ADR-013 |
| [010](ADR-010-pragmatic-provider-neutrality.md) | Providerneutralität nur an realen Wechselpunkten | accepted |
| [011](ADR-011-supported-versions.md) | Unterstützte Runtime- und Toolchain-Versionen | accepted |
| [012](ADR-012-provider-channel.md) | Historische Textback-first-Providerhypothese | superseded by ADR-013; neue Auswahl in V-001 |
| [013](ADR-013-voice-first-combined-mvp.md) | Voice-first als gemeinsamer Voice-/Textback-MVP | accepted |

`ADR-013` wählt keinen Anbieter. Telefonie-, Voice-, Modell-, Messaging- und
Rufnummerntopologie werden erst durch `V-001`, `PO-004` und einen neuen
Provider-ADR entscheidbar. Bis dahin bleibt Fake-/Replay der einzige aktive
Pfad. Vorlage: [ADR-Template](../templates/adr-template.md).
