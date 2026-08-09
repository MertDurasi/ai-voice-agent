---
id: O-003
title: Nachrichten-Templates und Regeln
phase: onboarding
status: blocked
priority: P0
owner: Engineering/Product
dependencies: [O-001]
gate: G3
outputs: [template-domain, deterministic-renderer, suppression-config, preview-api]
completed_at: null
---

# O-003 – Nachrichten-Templates und Regeln

## Ziel und Scope

Versionierte `de-DE`-Templates, freigegebene Variablen, Vorschau,
Kanal-/Längenvalidierung, Aktivierung, Ruhezeiten und Suppression Rules
implementieren. Rendering ist rein deterministisch; keine generative KI.

## Akzeptanz und Verifikation

- [ ] Unbekannte Variablen und nicht freigegebene Versionen sind nicht sendbar.
- [ ] Gleiche Eingabe erzeugt bytegleiches Ergebnis.
- [ ] Injection, manipulierte Links, Unicode-/Längengrenzen und fehlende Werte
      sind negativ getestet.
- [ ] Aktivierung/Änderung ist rollenbasiert, RLS-geschützt und auditiert.
- [ ] Vorschau löst niemals Versand aus.

Stop: Rechtlich erforderliche Texte/Opt-in nicht autonom als freigegeben setzen.
