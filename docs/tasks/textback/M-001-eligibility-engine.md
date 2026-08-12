---
id: M-001
title: CallOutcome- und Textback-Eligibility
phase: textback
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [G4, O-003]
gate: G5
outputs: [eligibility-domain, outcome-decision-table, suppression-reason-codes]
completed_at: null
---

# M-001 – CallOutcome- und Textback-Eligibility

## Ziel und Scope

Reine deterministische Entscheidung, ob derselbe Call-/Voice-Vorgang einen
Textback als explizit gewünschte Fortsetzung oder sicheren Fallback erhalten
darf. Eingaben sind kanonisches `CallOutcome`, Callerwahl, Tenant-/Nummerstatus,
Disclosure-/Policyversion, Geschäfts-/Ruhezeit, Cooldown, Blockliste, Template,
Kanal und Entitlement. Erfolgreicher Voice-Abschluss/Handoff unterdrückt
standardmäßig eine zusätzliche Nachricht.

## Akzeptanz und Verifikation

- [ ] Vollständige Decision Table deckt Voice-Abschluss, Callerwunsch,
      technische Degradation, Transferfehler, Abbruch und Missed Call ab.
- [ ] Gleiche fachliche Eingabe/Clock erzeugt dieselbe Entscheidung.
- [ ] DST, Cooldown, blockierte Nummer, suspendierter Tenant und bereits
      erfolgte Außenwirkung sind negativ getestet.
- [ ] Unvollständige Rechts-/Policy-/Outcome-Daten führen fail-closed zu einem
      stabilen Suppression Reason Code.
- [ ] Domain-Code kennt weder Provider noch Framework/DB.

Stop: Rechtsgrundlage oder Kommunikationsbefugnis nicht als `eligible`
erfinden; offen bedeutet Suppression beziehungsweise ausschließlich Testmodus.
