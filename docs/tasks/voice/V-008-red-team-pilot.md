---
id: V-008
title: Voice+Text Red Team und Pilot-Readiness
phase: voice
status: blocked
priority: P0
owner: Security/Safety/Product
dependencies: [G5]
gate: G6
outputs: [red-team-report, combined-kill-switch, pilot-entry-evidence, residual-risk-record]
completed_at: null
---

# V-008 – Voice+Text Red Team und Pilot-Readiness

## Ziel und Scope

Den vollständigen synthetischen Combined Assistant gegen Prompt Injection,
Social Engineering, Geheimnis-/Tenant-Leaks, Halluzination, Dialekt, Lärm,
Stille, Providerverlust, Parallelität, Handofffehler, ungeplanten Textback,
doppelte Leads und Inhalts-/Rohtranskriptleaks testen. Kill Switch und
Pilot-Entry-Stopregeln werden ohne reale Calls geprobt.

## Akzeptanz und Verifikation

- [ ] Alle kritischen Guardrails sowie Golden-/Red-Team-Cases sind grün; offene
      P0/P1-Funde blockieren `G6`.
- [ ] Unabhängige Security-/Safety-Review bewertet synthetische Korpora,
      Konfiguration, Metriken und strukturierte Ergebnisse.
- [ ] Kill Switch verhindert neue Sessions/Textbacks sicher und beendet
      laufende Sessions über den definierten Handoff-/Abbruchpfad.
- [ ] Pilot-Entry-Matrix nennt Legal-, DSFA-, Provider-, Budget-, Operations-
      und Go-live-Nachweise ausdrücklich als noch separat zu erfüllende Gates.
- [ ] Incidents/Fehler führen zu Stop-/Rollbackregeln, nicht nur Monitoring.

Dieser Task führt keinen Pilot und keine Produktionsstichprobe durch. Reale
Aufzeichnungen, Audio/Rohtranskripte oder still mitgehörte beziehungsweise
nachträglich geprüfte Produktivgespräche sind ausdrücklich ausgeschlossen. Ein
etwaiger produktiver Qualitätsreview benötigt einen separaten, transparenten,
rechtlich und organisatorisch freigegebenen Prozess; `P-002` aktiviert ihn
nicht automatisch.
