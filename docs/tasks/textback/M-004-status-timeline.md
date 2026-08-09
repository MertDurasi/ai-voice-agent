---
id: M-004
title: Status-Webhooks und Conversation Timeline
phase: textback
status: blocked
priority: P1
owner: Engineering
dependencies: [M-003]
gate: G5
outputs: [status-webhook, message-state-machine, conversation-timeline]
completed_at: null
---

# M-004 – Status-Webhooks und Conversation Timeline

## Ziel und Scope

Signierte Statuscallbacks über Inbox verarbeiten, Message-Zustandsautomat und
unveränderliche Timeline mit Zustellzeiten/Fehlergründen liefern. Manuelle
Retries sind rollenbasiert und auf sichere Zustände begrenzt.

## Akzeptanz und Verifikation

- [ ] Manipulierte/alte/duplizierte Callbacks bestehen Security-Negativtests.
- [ ] Zustandsrückschritte werden ignoriert und auditiert.
- [ ] Unbekannte ProviderMessageId wird geparkt und alarmierbar.
- [ ] Out-of-order-Callbacks ergeben deterministischen Endzustand.
- [ ] Timeline zeigt keine Providersecrets oder internen Payloads.
- [ ] Retry kann kein bereits zugestelltes Message-Duplikat erzeugen.
