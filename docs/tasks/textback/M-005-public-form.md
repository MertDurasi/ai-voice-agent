---
id: M-005
title: Öffentliches Fortsetzungsformular
phase: textback
status: blocked
priority: P0
owner: Product/Engineering/Security
dependencies: [M-003]
gate: G5
outputs: [capability-token, public-form, submission-api, abuse-protection]
completed_at: null
---

# M-005 – Öffentliches Fortsetzungsformular

## Ziel und Scope

Mobil zugängliches Formular über ein kurzlebiges, gehasht gespeichertes
Capability Token umsetzen. Token und Einsendung sind an denselben Call-/
Contact-/Conversation-Vorgang und den positiven Textback-Intent gebunden.
Felder: Name optional, Rückrufzeit, Kategorie, begrenzter Freitext und
freigegebener Datenschutzlink. Ablauf/Einmaligkeit, Bot-/Rate-Schutz und
Tenantbindung werden serverseitig erzwungen.

## Akzeptanz und Verifikation

- [ ] Token besitzt ausreichende Entropie, steht nicht in Serverlogs und ist
      nach Ablauf/Verbrauch unbrauchbar.
- [ ] Enumeration, falscher Tenant/Vorgang, Replay, XSS, CSRF und Spam sind
      getestet.
- [ ] Formular ist mobil, per Tastatur und mit Screenreader-Semantik nutzbar.
- [ ] Feldgrenzen und Unknown-Field-Rejection gelten serverseitig.
- [ ] Einsendung ergänzt denselben Vorgang idempotent; Fehlermeldungen verraten
      weder Lead- noch Tenantexistenz.

Stop: Datenschutztext nur als freigegebene Konfiguration verwenden.
