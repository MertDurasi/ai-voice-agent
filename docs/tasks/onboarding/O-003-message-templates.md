---
id: O-003
title: Disclosure-, Handoff- und Textback-Policies
phase: onboarding
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [O-001]
gate: G3
outputs: [disclosure-policy, handoff-policy, template-domain, deterministic-renderer, preview-api]
completed_at: null
---

# O-003 – Disclosure-, Handoff- und Textback-Policies

## Ziel und Scope

Versionierte `de-DE`-Konfiguration für KI-Disclosure, Human-/Rückruf-Handoff,
Textback-Templates, erlaubte Variablen, Ruhezeiten, Cooldown und Suppression
implementieren. Rendering und Policyentscheidungen sind deterministisch;
Testtexte sind sichtbar nicht rechtsfreigegebene Platzhalter.

## Akzeptanz und Verifikation

- [ ] Fachdialog kann ohne vollständig durchlaufenen Disclosure-Pfad nicht
      beginnen; Handoff bleibt verfügbar.
- [ ] Unbekannte Variablen, nicht freigegebene Versionen und unzulässige
      Textback-Gründe sind nicht aktivierbar.
- [ ] Gleiche Eingabe erzeugt bytegleiches Ergebnis; Injection, manipulierte
      Links, Unicode-/Längengrenzen und fehlende Werte sind negativ getestet.
- [ ] Aktivierung/Änderung ist rollenbasiert, RLS-geschützt und auditiert.
- [ ] Vorschau/Faketest löst weder Call noch Versand aus und kann Platzhalter
      nicht als Legal-Freigabe markieren.

Stop: Texte, Rechtsgrundlage, Textback-Befugnis und Retention nicht autonom als
freigegeben setzen.
