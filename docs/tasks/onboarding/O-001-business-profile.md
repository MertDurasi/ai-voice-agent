---
id: O-001
title: Betriebsprofil und Geschäftszeiten
phase: onboarding
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [G2, PO-001, PO-002, PO-003]
gate: G3
outputs: [business-profile-domain, schedule-domain, profile-api]
completed_at: null
---

# O-001 – Betriebsprofil und Geschäftszeiten

## Ziel und Scope

Betriebsname, Gewerk, Kontaktkanäle, Zeitzone, Wochenplan,
Ausnahmen/Feiertage und Eskalationskontakt als validierte Value Objects und Use
Cases umsetzen. Intern UTC, lokale Geschäftsregeln explizit in Tenant-Zeitzone.

## Akzeptanz und Verifikation

- [ ] Öffnungsstatus ist für DST-Wechsel, Mitternacht, überlappende Intervalle
      und Feiertagsausnahmen deterministisch getestet.
- [ ] Unbekannte Felder und ungültige Kontakt-/Zeitzonenwerte werden abgelehnt.
- [ ] Autorisierung und RLS sind bei allen CRUD-Pfaden negativ getestet.
- [ ] Änderungen sind versioniert und auditierbar.
- [ ] Keine PII erscheint in Logs/Telemetry.

Nicht im Scope: Provider-Rufnummer oder Messaging-Templates.
