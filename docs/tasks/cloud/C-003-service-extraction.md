---
id: C-003
title: Service-Extraktion nach Messkriterien
phase: cloud
status: blocked
priority: P2
owner: Architecture/Engineering
dependencies: [measurable-extraction-trigger]
gate: null
outputs: [extraction-adr, contract-plan, data-ownership-plan, migration-evidence]
completed_at: null
---

# C-003 – Service-Extraktion nach Messkriterien

## Trigger und Ziel

Ein Modul nur extrahieren, wenn unabhängige Skalierung messbar nötig ist, ein
eigenes Security/Availability-Niveau gilt, Deploy-Kopplung wiederholt Incidents
verursacht oder Teamownership getrennte Lebenszyklen rechtfertigt. Kandidaten:
Voice, Telephony Gateway, Worker/Messaging; Billing nicht aus Prestigegründen.

## Akzeptanz und Verifikation

- [ ] Mindestens ein Trigger ist mit Metrik/Incident/Ownership belegt.
- [ ] ADR vergleicht Nichtstun, modulare Härtung und Extraktion.
- [ ] Datenownership, Verträge, Idempotenz, Observability und Failure Modes klar.
- [ ] Strangler-/Rollbackplan wahrt mindestens eine Releasekompatibilität.
- [ ] Last-/Resilience-Nachweis zeigt den erwarteten Nutzen.

Stop: Keine Extraktion ohne belegten Trigger und Architekturfreigabe.
