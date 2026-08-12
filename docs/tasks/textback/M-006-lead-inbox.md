---
id: M-006
title: Gemeinsames Lead-Aggregat und Inbox
phase: textback
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [M-005, V-007]
gate: G5
outputs: [lead-domain, lead-api, lead-dashboard, concurrency-tests]
completed_at: null
---

# M-006 – Gemeinsames Lead-Aggregat und Inbox

## Ziel und Scope

Genau ein Lead-Aggregat je Call-/Contact-Vorgang umsetzen. Strukturierte
Voice-Summary und optionale Formulareingabe werden idempotent feldweise
zusammengeführt; Unsicherheit und Herkunftskategorie bleiben sichtbar, ohne
Audio-/Transkriptsegment oder Gesprächsrekonstruktion. Zustandsautomat,
Notizen, Filter, stabile Pagination, optimistische Nebenläufigkeit, API und
zugängliches Dashboard gehören zur kleinsten Scheibe.

## Akzeptanz und Verifikation

- [ ] Parallele Voice-/Formularabschlüsse erzeugen einen Lead und
      deterministische Konflikt-/Merge-Regeln.
- [ ] Zulässige/ungültige Statusübergänge und Versionskonflikte sind getestet.
- [ ] Rollenrechte und Cross-Tenant-IDOR sind für Read/Write negativ getestet.
- [ ] Performanceziel wird mit synthetischen Leads und dokumentierter Last
      nachgewiesen; Filter/Pagination bleiben bei Inserts stabil.
- [ ] PII fehlt in Telemetrie/URLs; interne Notizen erscheinen nie öffentlich.
- [ ] Leadansicht enthält weder Audio/Rohtranskript noch Quellsegment/Offset.

Nicht im Scope: CRM, Angebote, Rechnungen oder komplexes Assignment.
