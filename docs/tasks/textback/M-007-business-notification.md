---
id: M-007
title: Sichere Benachrichtigung zum gemeinsamen Lead
phase: textback
status: blocked
priority: P1
owner: Engineering
dependencies: [M-006]
gate: G5
outputs: [email-port, mailpit-adapter, notification-policy, notification-tests]
completed_at: null
---

# M-007 – Sichere Benachrichtigung zum gemeinsamen Lead

## Ziel und Scope

EmailPort, Mailpit-Adapter, minimale strukturierte Zusammenfassung,
tenantgebundenen Dashboard-Link, Retry/Suppression und Einstellungen umsetzen.
Eine Benachrichtigung repräsentiert den gemeinsamen Lead unabhängig davon, ob
er in Voice abgeschlossen oder per Textback/Formular ergänzt wurde.

## Akzeptanz und Verifikation

- [ ] Fehlgeschlagene E-Mail blockiert oder dupliziert den Lead nicht.
- [ ] Links erfordern Auth und können keinen anderen Tenant öffnen.
- [ ] Mail enthält nur ausdrücklich freigegebene strukturierte Mindestdaten,
      keine Audio-, Rohtranskript- oder Nachrichten-/Formularinhalte.
- [ ] Retry, Bounce-/permanent-Fehler und deaktivierte Einstellung sind getestet.
- [ ] Mailpit-E2E verifiziert genau eine Benachrichtigung je Lead.

Gate-Nachweis zusätzlich: kompletter synthetischer Voice→Outcome→optional-
Textback→Lead-Golden-Path, Correlation Trace und 24-Stunden-Soak ohne
Eventverlust oder Doppelwirkung. Kein echter ESP-Versand ohne Freigabe.
