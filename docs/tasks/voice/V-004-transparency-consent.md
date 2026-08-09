---
id: V-004
title: Transparenz, Consent und Datenminimierung
phase: voice
status: blocked
priority: P0
owner: Product/Legal/Engineering
dependencies: [V-001, legal-approval]
gate: G8
outputs: [disclosure-flow, disclosure-evidence, human-fallback, voice-retention]
completed_at: null
---

# V-004 – Transparenz, Consent und Datenminimierung

## Ziel und Scope

Vor fachlicher Interaktion freigegebene KI-Transparenzansage, Alternativweg zu
Mensch/Rückruf, Nachweis des Ansageereignisses und freigegebene konfigurierbare
Transkript-/Summary-Retention. Recording bleibt technisch deaktiviert.

## Akzeptanz und Verifikation

- [ ] Dialog startet fachlich erst nach vollständig erreichtem Ansagepfad.
- [ ] Ablehnung/Unterbrechung folgt freigegebenem sicheren Fallback.
- [ ] Nachweis speichert Ereignis/Version/Zeit, nicht unnötig Audio.
- [ ] Retention-/Export-/Erasure-Tests decken Voice-Daten vollständig ab.
- [ ] Aufnahme kann nicht durch Mandantenkonfiguration versehentlich starten.

Stop: Texte, Rechtsgrundlage und Retention benötigen explizite Legal/Product-
Freigabe; technische Implementierung ersetzt diese nicht.
