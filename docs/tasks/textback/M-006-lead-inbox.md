---
id: M-006
title: Lead-Aggregat und Inbox
phase: textback
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [M-005]
gate: G5
outputs: [lead-domain, lead-api, lead-dashboard, concurrency-tests]
completed_at: null
---

# M-006 – Lead-Aggregat und Inbox

## Ziel und Scope

Idempotente Lead-Erstellung, Zustandsautomat, Notizen, Filter, cursor-/stabile
Pagination, optimistische Nebenläufigkeit, API und zugängliches Dashboard
umsetzen. PII bleibt aus Telemetrie und URLs.

## Akzeptanz und Verifikation

- [ ] Zwei parallele Einsendungen erzeugen keinen doppelten Lead.
- [ ] Zulässige/ungültige Statusübergänge und Versionskonflikte sind getestet.
- [ ] Rollenrechte und Cross-Tenant-IDOR sind für Read/Write negativ getestet.
- [ ] Inbox mit 10.000 synthetischen Leads erfüllt dokumentiertes Performanceziel.
- [ ] Filter/Pagination sind stabil bei parallelen Inserts.
- [ ] Interne Notizen erscheinen nie im öffentlichen Kontext.

Nicht im Scope: CRM, Angebote, Rechnungen oder komplexes Assignment.
