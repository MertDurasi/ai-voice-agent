---
id: PO-003
title: Voice-/Textback-Kosten- und Preissensitivitätsmodell
phase: product-owner
status: blocked
priority: P0
owner: Product/Finance
dependencies: [D-002, V-001]
gate: G3
outputs: [cost-model, sensitivity-scenarios, pilot-budget-cap]
completed_at: null
---

# PO-003 – Voice-/Textback-Kosten- und Preissensitivitätsmodell

## Ziel und Scope

Fixe und variable Kosten je aktivem Tenant, Voice-Minute/-Session, Call,
Handoff, Textback, Lead und Supportstunde modellieren. Low/Base/High-Szenarien
nutzen die gemessenen Bandbreiten aus `V-001` und berücksichtigen Telefonie,
STT/LLM/TTS beziehungsweise Managed Runtime, Messaging, Degradation und
Sessionlimits providerneutral.

## Akzeptanz und Verifikation

- [ ] Quellen, Preisdatum, Annahmen und noch nicht vergleichbare Einheiten sind
      sichtbar.
- [ ] Kosten pro Minute, Session, Call und verwertbarem Lead sowie Bruttomarge
      und Break-even sind als Bandbreiten berechnet.
- [ ] Volumen, Dialogdauer, Transfer-/Textbackquote, Support und Providerfehler
      besitzen Sensitivität und Stopwerte.
- [ ] Ein harter synthetischer/Pilot-Budget-Cap ist als Ownerentscheidung
      vorbereitet.
- [ ] Das Modell erteilt weder finale Preis- noch Anbieter-/Budgetfreigabe.
