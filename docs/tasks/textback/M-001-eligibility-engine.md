---
id: M-001
title: Eligibility Engine
phase: textback
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [G4, O-003]
gate: G5
outputs: [eligibility-domain, decision-table, suppression-reason-codes]
completed_at: null
---

# M-001 – Eligibility Engine

## Ziel und Scope

Reine deterministische Entscheidung für aktiven Tenant/Nummer,
verpassten/kurzen Anruf, Geschäftszeit, Ruhezeit/Cooldown, Blockliste,
Template, Kanal und Subscription-Zustand. Jede Ablehnung liefert stabilen,
maschinenlesbaren Reason Code und keine Außenwirkung.

## Akzeptanz und Verifikation

- [ ] Vollständige Decision Table mit Grenz-, Positiv- und Negativfällen.
- [ ] Gleiche fachliche Eingabe/Clock erzeugt gleiche Entscheidung.
- [ ] DST, Cooldown-Grenze, blockierte Nummer und suspendierter Tenant getestet.
- [ ] Unvollständige Daten führen fail-closed zu begründeter Suppression.
- [ ] Domain-Code kennt weder Provider noch Framework/DB.

Stop: Rechts-/Consent-Annahmen nicht als `eligible` erfinden; offen heißt
unterdrückt oder nur Testmodus.
