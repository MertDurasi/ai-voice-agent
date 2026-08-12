---
id: V-004
title: Synthetischer Disclosure-, Choice- und Datenminimierungsflow
phase: voice
status: blocked
priority: P0
owner: Product/Legal/Engineering
dependencies: [G4, O-003]
gate: G5
outputs: [disclosure-flow, disclosure-evidence, human-fallback, retention-guards]
completed_at: null
---

# V-004 – Disclosure, Choice und Datenminimierung

## Ziel und Scope

Mit sichtbar nicht rechtsfreigegebenen Testtexten den nicht überspringbaren
KI-Disclosure-Pfad, Wahl eines Menschen/Rückrufs, erlaubte Textback-Fortsetzung,
Nachweis des Policyereignisses und technische Retention-Guards synthetisch
umsetzen. Recording, Audio- und Rohtranskriptpersistenz bleiben deaktiviert.

## Akzeptanz und Verifikation

- [ ] Fachinteraktion startet erst nach vollständig erreichtem Disclosure-Pfad.
- [ ] Ablehnung, Unterbrechung und fehlende Choice führen deterministisch zu
      sicherem Handoff/Ende, nicht zu stiller Fortsetzung.
- [ ] Nachweis speichert Event, Policyversion und Zeit, aber kein Audio,
      Rohtranskript oder Gesprächszitat.
- [ ] Persistenz-, Export-, Erasure- und Content-Leak-Tests decken alle
      strukturierten Voice-Daten ab.
- [ ] Aufnahme/Transkriptspeicherung kann nicht durch Tenantkonfiguration oder
      Providerdefault aktiviert werden.

Stop: Testtexte sind keine Legal-/Product-Freigabe. Rechtsgrundlage, konkrete
Texte, Textback-Befugnis und Retention benötigen `PO-004` vor Realbetrieb.
