---
id: V-003
title: Begrenzte Dialog-State-Machine und Tool-Gateway
phase: voice
status: blocked
priority: P0
owner: Engineering/Safety
dependencies: [G4]
gate: G5
outputs: [dialog-state-machine, tool-gateway, schemas, injection-suite]
completed_at: null
---

# V-003 – Begrenzte Dialog-State-Machine und Tool-Gateway

## Ziel und Scope

Explizite Dialogzustände für höchstens drei konfigurierte Intents und
strukturierte, providerunabhängige Tool Calls mit geschlossenen JSON Schemas
umsetzen. Das Gateway autorisiert serverseitig, begrenzt Toolliste, Argumente,
Zeit und Gesprächsbudget. Im MVP sind nur lesende kontrollierte Fakten,
strukturierte Lead-Erfassung und Handoff-Intent zulässig; Diagnose, Preise,
Terminzusagen, Zahlung und beliebige URLs/Schreibaktionen bleiben gesperrt.

## Akzeptanz und Verifikation

- [ ] Das Modell kann keine beliebigen URLs, Tools, Tenant-IDs oder Argumente
      wählen; zusätzliche/ungültige Felder werden abgelehnt.
- [ ] Ohne Disclosure-Snapshot beginnt kein Fachdialog und kein Tool Call.
- [ ] Leadfelder benötigen bestätigte strukturierte Daten; Unsicherheit bleibt
      explizit und wird nicht ergänzt.
- [ ] Timeout, Budgetende und unbekannter Intent führen zu Handoff oder einer
      positiv geprüften Textback-Option statt Endlosschleife.
- [ ] Versioniertes Prompt-Injection-/Social-Engineering-Korpus ist grün.
- [ ] Toolresultate sind minimiert und werden nicht als Anweisung interpretiert.
