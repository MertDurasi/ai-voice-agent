---
id: O-001
title: Betriebsprofil und begrenzte Assistant-Policy
phase: onboarding
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [G2, PO-001, PO-002, PO-003]
gate: G3
outputs: [business-profile-domain, schedule-domain, assistant-policy, profile-api]
completed_at: null
---

# O-001 – Betriebsprofil und begrenzte Assistant-Policy

## Ziel und Scope

Betriebsname, Gewerk, Kontaktkanäle, Zeitzone, Wochenplan,
Ausnahmen/Feiertage, Eskalationskontakte sowie höchstens drei freigegebene
Assistant-Intents als validierte, versionierte Value Objects und Use Cases
umsetzen. Die Policy beschreibt erlaubte strukturierte Erstaufnahme,
kontrollierte Fakten, Handoff/Rückruf und mögliche Textback-Fortsetzung;
Diagnose, Preis-/Termin-/Verfügbarkeitszusage und beliebige Tools sind verboten.

## Akzeptanz und Verifikation

- [ ] Öffnungsstatus ist für DST-Wechsel, Mitternacht, überlappende Intervalle
      und Feiertagsausnahmen deterministisch getestet.
- [ ] Mehr als drei Intents, unzulässige Fähigkeiten, unbekannte Felder und
      ungültige Kontakt-/Zeitzonenwerte werden abgelehnt.
- [ ] Autorisierung und RLS sind bei allen CRUD-Pfaden negativ getestet.
- [ ] Jede Policyänderung ist versioniert und auditierbar; ein laufender Vorgang
      verwendet einen stabilen Snapshot.
- [ ] Keine PII erscheint in Logs/Telemetry.

Nicht im Scope: Provider-Rufnummer, Providerprompt oder reale Aktivierung.
