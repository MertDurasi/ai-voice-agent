---
id: M-007
title: Betriebsbenachrichtigung
phase: textback
status: blocked
priority: P1
owner: Engineering
dependencies: [M-006]
gate: G5
outputs: [email-port, mailpit-adapter, notification-policy, notification-tests]
completed_at: null
---

# M-007 – Betriebsbenachrichtigung

## Ziel und Scope

EmailPort, Mailpit-Adapter, minimale sichere Zusammenfassung, tenantgebundenen
Dashboard-Link, Retry/Suppression und Benachrichtigungseinstellungen umsetzen.
Ein Produktionsadapter folgt separat nach Anbieterfreigabe.

## Akzeptanz und Verifikation

- [ ] Fehlgeschlagene E-Mail blockiert oder dupliziert den Lead nicht.
- [ ] Links erfordern Auth und können keinen anderen Tenant öffnen.
- [ ] Mail enthält nur ausdrücklich freigegebene Mindestdaten.
- [ ] Retry, Bounce-/permanent-Fehler und deaktivierte Einstellung sind getestet.
- [ ] Mailpit-E2E verifiziert genau eine Benachrichtigung.

Gate-Nachweis zusätzlich: kompletter Textback-Golden-Path, Correlation Trace und
24-Stunden-Soak ohne Eventverlust. Kein echter ESP-Versand ohne Freigabe.
