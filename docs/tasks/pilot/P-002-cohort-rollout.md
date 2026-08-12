---
id: P-002
title: Kontrollierter Voice+Text-Kohortenrollout
phase: pilot
status: blocked
priority: P0
owner: Product/Operations
dependencies: [G6, explicit-go-live-approval]
gate: G7
outputs: [rollout-plan, tenant-kill-switch, pilot-checklist, daily-review]
completed_at: null
---

# P-002 – Kontrollierter Voice+Text-Kohortenrollout

## Ziel und Scope

Den kombinierten Assistenten kontrolliert intern → 1 Designpartner → 3 →
höchstens 5–10 ausrollen. Voice ist primär; Handoff und positiv geprüfter
Textback bleiben derselbe Vorgang. Erweiterung erfolgt erst nach dem je Kohorte
festgelegten stabilen Beobachtungsfenster und explizitem Review. Kill Switch je
Tenant, Session-/Providerbudget, Rate Limits und tägliche Guardrail-/KPI-
Prüfung begrenzen die reale Außenwirkung.

## Akzeptanz und Verifikation

- [ ] `G6`, konkrete Provider-/Vertrags-/Legal-/DSFA-/Safety-/Security-/Budget-
      Nachweise und explizite Go-live-Freigabe liegen vor.
- [ ] Kill Switch, Budget-/Rate-/Sessiongrenzen sowie nicht erreichbarer
      Human-Fallback sind vor erstem Kontakt getestet.
- [ ] Jede Kohorte besitzt Entry/Exit-, Beobachtungs-, Rollback- und
      Kommunikationskriterien.
- [ ] Expansion ist mit Datenqualität, Voice-/Textback-/Handoffmetriken,
      Incidents und verantworteter Entscheidung dokumentiert.
- [ ] Kein Bulk-Onboarding oder ungesteuerte Tenantaktivierung ist möglich.
- [ ] Pilotfreigabe autorisiert keine verdeckte Gesprächsaufzeichnung oder
      stille manuelle Produktivbewertung.

Stop: Erster Realanruf, erster Textback und jede Kohortenexpansion sind reale
Außenwirkungen und benötigen die vorgesehenen Freigaben; Incidents stoppen
Expansion jederzeit.
