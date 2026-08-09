---
id: M-002
title: MessagingPort und Fake-Adapter
phase: textback
status: blocked
priority: P0
owner: Engineering
dependencies: [M-001]
gate: G5
outputs: [messaging-port, fake-adapter, adapter-contract-suite, error-taxonomy]
completed_at: null
---

# M-002 – MessagingPort und Fake-Adapter

## Ziel und Scope

Kleinen `sendTemplate`-Vertrag mit Statuscallback, ProviderMessageId und
Idempotency Key definieren. Fake-Adapter erlaubt deterministisch Acceptance,
Timeout, 429, permanente 4xx und transiente 5xx. Contract-Suite gilt später
unverändert für reale Adapter.

## Akzeptanz und Verifikation

- [ ] Fehlerklassen sind eindeutig transient/permanent/unknown klassifiziert.
- [ ] Retry mit gleichem Idempotency Key erzeugt keine zweite Sendewirkung.
- [ ] Providerfelder/-SDKs leaken nicht in Application/Domain.
- [ ] Fake-Clock und planbare Fehler machen Tests deterministisch.
- [ ] Logs/Errors enthalten weder Zielnummer noch Nachrichteninhalt.

Stop: Noch keinen realen Messagingadapter oder echten Versand aktivieren.
