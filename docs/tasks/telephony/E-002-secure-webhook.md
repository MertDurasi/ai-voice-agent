---
id: E-002
title: Sicherer Webhook- und Media-Session-Ingress
phase: telephony
status: blocked
priority: P0
owner: Engineering/Security
dependencies: [E-001]
gate: G4
outputs: [webhook-endpoint, media-session-ingress, signature-verifier, replay-protection, ingress-tests]
completed_at: null
---

# E-002 – Sicherer Webhook- und Media-Session-Ingress

## Ziel und Scope

Webhook-Raw-Body, Signatur und Timestamp prüfen sowie Größen-/Rate-Limits und
Replay-Schutz anwenden. Realtime-Verbindungen authentisieren Session,
Tenantbindung, Origin/Endpoint, kurze Credentials, Frame-/Dauer-/Bufferlimits
und Cleanup. Providerfehler erhalten stabile Semantik ohne Informationsleck;
Tests nutzen Fake-/Replay-Ingress.

## Akzeptanz und Verifikation

- [ ] Manipulierte, alte, zu große, ungültige oder einer anderen Session/
      einem anderen Tenant zugeordnete Requests/Frames werden abgelehnt.
- [ ] Doppelte Lifecycle-Events werden idempotent behandelt; Mediaframes werden
      nicht als fachlich retrybare Events missverstanden.
- [ ] Secrets, Payloads, Audio und Transkripte fehlen in Logs, Traces und Fehlern.
- [ ] Webhook bestätigt erst nach dauerhafter Inbox-Aufnahme; Media-Backpressure,
      Timeout, abruptes Ende und Credentialablauf sind getestet.
- [ ] Die dokumentierten Latenz-/Lastgrenzen sind mit realistischen
      synthetischen Fixtures nachgewiesen.

Stop: Echte Endpoints, Domains, Credentials oder Providerverbindungen nur nach
separater Freigabe.
