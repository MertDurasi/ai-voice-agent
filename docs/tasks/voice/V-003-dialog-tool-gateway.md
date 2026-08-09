---
id: V-003
title: Dialog State Machine und Tool Gateway
phase: voice
status: blocked
priority: P0
owner: Engineering/Safety
dependencies: [V-002]
gate: G8
outputs: [dialog-state-machine, tool-gateway, schemas, injection-suite]
completed_at: null
---

# V-003 – Dialog State Machine und Tool Gateway

## Ziel und Scope

Explizite Dialogzustände, drei begrenzte Intents und strukturierte Tool Calls
mit JSON Schema. Gateway autorisiert serverseitig, begrenzt URL/Tool-Liste,
erzwingt Timeout, Gesprächsbudget und Bestätigung vor jeder Schreibaktion.

## Akzeptanz und Verifikation

- [ ] Modell kann keine beliebigen URLs, Tools, Tenant-IDs oder Argumente wählen.
- [ ] Ungültige/zusätzliche Felder und unautorisierte Calls werden abgelehnt.
- [ ] Lead-/Terminänderung verlangt bestätigte strukturierte Daten.
- [ ] Timeout/Budgetende führt zu sicherem Fallback statt Endlosschleife.
- [ ] Versioniertes Prompt-Injection-/Social-Engineering-Korpus ist grün.
- [ ] Tool-Resultate werden minimiert und nicht blind als Anweisung behandelt.
