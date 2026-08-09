---
id: M-005
title: Öffentliches Kurzformular
phase: textback
status: blocked
priority: P0
owner: Product/Engineering/Security
dependencies: [M-003]
gate: G5
outputs: [capability-token, public-form, submission-api, abuse-protection]
completed_at: null
---

# M-005 – Öffentliches Kurzformular

## Ziel und Scope

Mobil zugängliches Formular über kurzlebiges, gehasht gespeichertes Capability
Token. Felder: Name optional, Rückrufzeit, Kategorie, begrenzter Freitext und
freigegebener Datenschutzlink. Ablauf/Einmaligkeit, Bot-/Rate-Schutz und
Tenant-Bindung serverseitig erzwingen.

## Akzeptanz und Verifikation

- [ ] Token besitzt ausreichende Entropie, steht nicht in Serverlogs und ist
      nach Ablauf/Verbrauch unbrauchbar.
- [ ] Enumeration, falscher Tenant, Replay, XSS, CSRF und Spam sind getestet.
- [ ] Formular ist mobil, per Tastatur und mit Screenreader-Semantik nutzbar.
- [ ] Feldgrenzen und Unknown-Field-Rejection gelten serverseitig.
- [ ] Fehlermeldungen verraten weder Lead- noch Tenant-Existenz.

Stop: Datenschutztext nur als freigegebene Konfiguration verwenden.
