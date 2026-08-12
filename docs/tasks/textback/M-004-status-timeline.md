---
id: M-004
title: Kanalstatus und gemeinsame Conversation Timeline
phase: textback
status: blocked
priority: P1
owner: Engineering
dependencies: [M-003]
gate: G5
outputs: [status-webhook, message-state-machine, combined-conversation-timeline]
completed_at: null
---

# M-004 – Kanalstatus und gemeinsame Conversation Timeline

## Ziel und Scope

Signierte Messaging-Statuscallbacks über Inbox verarbeiten und eine
unveränderliche Timeline aus strukturierten Call-/VoiceSession-Metadaten,
Disclosure-/Handoff-/Outcome-Events, Textback-Entscheid und Zustellstatus
liefern. Manuelle Retries sind rollenbasiert und auf sichere Zustände begrenzt.

## Akzeptanz und Verifikation

- [ ] Manipulierte, alte und duplizierte Callbacks bestehen Negativtests.
- [ ] Zustandsrückschritte werden ignoriert und auditiert; Out-of-order-
      Callbacks ergeben einen deterministischen Endzustand.
- [ ] Unbekannte ProviderMessageId wird geparkt und alarmierbar.
- [ ] Timeline enthält keine Providersecrets, Payloads, Audio, Rohtranskripte,
      Prompts oder Gesprächszitate.
- [ ] Retry kann kein bereits zugestelltes oder cross-channel dupliziertes
      Message-Duplikat erzeugen.
