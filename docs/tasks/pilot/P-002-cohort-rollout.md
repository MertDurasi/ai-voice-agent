---
id: P-002
title: Pilot-Rollout in Kohorten
phase: pilot
status: blocked
priority: P0
owner: Product/Operations
dependencies: [P-001, explicit-go-live-approval]
gate: G7
outputs: [rollout-plan, tenant-kill-switch, pilot-checklist, daily-review]
completed_at: null
---

# P-002 – Pilot-Rollout in Kohorten

## Ziel und Scope

Kontrollierter Rollout intern → 1 Designpartner → 3 → 5–10. Erweiterung erst
nach sieben stabilen Tagen oder dokumentierter, verantworteter Ausnahme. Kill
Switch je Tenant, Providerbudget, Rate Limits und tägliche KPI-/Fehlerprüfung.

## Akzeptanz und Verifikation

- [ ] Explizite Go-live-Freigabe, Verträge und Kanal-/Rechtsfreigabe liegen vor.
- [ ] Kill Switch und Budget-/Rate-Grenzen sind vor erstem Kontakt getestet.
- [ ] Jede Kohorte besitzt Entry/Exit-, Rollback- und Kommunikationskriterien.
- [ ] Sieben-Tage-Nachweis oder Ausnahme ist vor Expansion dokumentiert.
- [ ] Kein Bulk-Onboarding oder ungesteuerte Tenant-Aktivierung ist möglich.

Stop: Jede Kohortenexpansion ist eine reale Außenwirkung und benötigt die
vorgesehene Freigabe; Incidents können Expansion jederzeit stoppen.
