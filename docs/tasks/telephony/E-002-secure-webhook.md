---
id: E-002
title: Sicherer Webhook Endpoint
phase: telephony
status: blocked
priority: P0
owner: Engineering/Security
dependencies: [E-001]
gate: G4
outputs: [webhook-endpoint, signature-verifier, replay-protection, webhook-tests]
completed_at: null
---

# E-002 – Sicherer Webhook Endpoint

## Ziel und Scope

Raw Body, Signatur und Timestamp prüfen; Größenlimit, Rate Limit und
Replay-Schutz anwenden; nach dauerhafter Inbox-Aufnahme schnell `2xx` liefern.
IP-Allowlist ist höchstens Defense in Depth. Providerfehler erhalten stabile
Antwortsemantik ohne Informationsleck.

## Akzeptanz und Verifikation

- [ ] Manipulierte, alte, zu große und ungültig formatierte Requests werden
      deterministisch abgelehnt.
- [ ] Duplicate wird idempotent behandelt und nicht erneut fachlich verarbeitet.
- [ ] Secrets und Payloads fehlen in Logs/Traces/Fehlern.
- [ ] p95-Annahme im definierten Integrationstest liegt unter 500 ms.
- [ ] Raw-Body- und Proxy-Verhalten ist mit realistischen Fixtures getestet.

Stop: Echte Provider-Endpoints/Secrets nur nach Freigabe konfigurieren.
