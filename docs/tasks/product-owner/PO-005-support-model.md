---
id: PO-005
title: Voice+Text-Supportmodell und Betriebsgrenzen
phase: product-owner
status: blocked
priority: P0
owner: Product/Operations
dependencies: [PO-002]
gate: G6
outputs: [support-policy, escalation-matrix, review-policy]
completed_at: null
---

# PO-005 – Voice+Text-Supportmodell

## Ziel und Scope

Supportkanal, Betriebszeiten, Severity, Reaktions-/Kommunikationszeiten,
Voice-/Handoff-/Textback-Eskalation, Datenschutz beim Support und bewusst
ausgeschlossene Leistungen festlegen. Manueller Qualitätsreview wird als
eigener transparenter Prozess behandelt und nicht aus Betriebszugriffen
abgeleitet.

## Akzeptanz und Verifikation

- [ ] Pilotpartner erhalten klare Erwartungen, Owner/Backup und Incidentkontakt.
- [ ] Voice-Ausfall, Safety-Fund, nicht erreichbarer Handoff, Textbackfehler und
      Datenleck besitzen Stop-/Eskalationswege.
- [ ] Supportzugriff referenziert `B-005`; weder Audio noch Rohtranskript oder
      verdeckte Produktivstichprobe wird für Support standardmäßig verfügbar.
- [ ] Kapazität wird gegen <60 Minuten je aktivem Tenant/Monat gemessen und hat
      Kill-/Kohortengrenzen.
