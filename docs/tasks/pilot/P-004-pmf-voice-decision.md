---
id: P-004
title: Post-pilot Stop/Continue/Scale-Entscheidungsgrundlage
phase: pilot
status: blocked
priority: P0
owner: Product/Engineering/Safety
dependencies: [P-003, sufficient-pilot-data]
gate: G8
outputs: [post-pilot-decision-dossier]
completed_at: null
---

# P-004 – Post-pilot Stop/Continue/Scale-Entscheidungsgrundlage

## Ziel und Scope

Ein schriftliches Entscheidungsdossier nach den
[Post-Pilot-Kriterien](../../product/metrics.md) erstellen. Es bewertet den
gemeinsamen Voice-first-/Textback-MVP anhand Nutzenevidenz, Voice-Qualität,
Disclosure, Handoff, Textback, Leadqualität, Safety/Security/Privacy,
Supportaufwand, Unit Economics und Incidentprofil. Datenzeitraum, Stichprobe,
Ausfälle und Unsicherheit sind sichtbar.

## Akzeptanz und Verifikation

- [ ] Jede Aussage ist auf KPI, Interviewevidenz oder Incidentdaten
      rückführbar; Test-, Pilot- und fehlende Daten sind getrennt.
- [ ] Offene P0/P1 Security-/Privacy-/Safety-Probleme verhindern eine
      Scale-Empfehlung.
- [ ] Kostenmodell enthält Telephony/Runtime, STT/LLM/TTS beziehungsweise
      Managed-Komponenten, Messaging und Support.
- [ ] Optionen `stop`, `continue` und `scale` nennen jeweils Wirkung, Scope,
      Guardrails, Kosten, Reversibilität und nächsten Reviewpunkt.
- [ ] Product, Engineering, Safety und Operations zeichnen das Dossier ab;
      `PO-010` trifft den eigentlichen Entscheid.

Stop: Kein automatisches Scale, keine neue Fähigkeit und keine
Provider-/Budgeterhöhung allein aus Demoqualität oder Kalenderzeit.
