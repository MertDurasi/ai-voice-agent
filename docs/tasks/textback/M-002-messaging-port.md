---
id: M-002
title: MessagingPort und Fake-Fortsetzungsadapter
phase: textback
status: blocked
priority: P0
owner: Engineering
dependencies: [M-001]
gate: G5
outputs: [messaging-port, fake-adapter, adapter-contract-suite, error-taxonomy]
completed_at: null
---

# M-002 – MessagingPort und Fake-Fortsetzungsadapter

## Ziel und Scope

Kleinen `sendTemplate`-Vertrag mit Vorgangs-/Intentreferenz, Statuscallback,
ProviderMessageId und Idempotency Key definieren. Der Fake-Adapter simuliert
deterministisch Annahme, Timeout, 429, permanente 4xx und transiente 5xx. Die
Contract-Suite gilt später unverändert für einen separat freigegebenen Adapter.

## Akzeptanz und Verifikation

- [ ] Fehlerklassen sind eindeutig transient/permanent/unknown klassifiziert.
- [ ] Retry mit demselben Idempotency Key erzeugt keine zweite Sendewirkung.
- [ ] Ein Messagingversuch ist auf den positiven Eligibility-Entscheid und den
      gemeinsamen Call-/Contact-Vorgang zurückführbar.
- [ ] Providerfelder/-SDKs leaken nicht in Application/Domain.
- [ ] Fake-Clock und planbare Fehler machen Tests deterministisch; Logs/Errors
      enthalten weder Zielnummer noch Nachrichteninhalt.

Stop: Keinen realen Messagingadapter, Provideraccount oder echten Versand
aktivieren.
