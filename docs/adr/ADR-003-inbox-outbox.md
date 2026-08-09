# ADR-003 – Transactional Outbox und Webhook Inbox

- Status: accepted
- Datum: 2026-08-07

## Kontext

Provider senden Webhooks mehrfach und außerhalb der Reihenfolge; Prozesse und
Queues können zwischen DB-Änderung und Publikation ausfallen.

## Entscheidung

Eingehende Providerereignisse werden vor fachlicher Verarbeitung idempotent in
einer Webhook Inbox persistiert. Fachänderung und ausgehendes Event werden in
derselben DB-Transaktion als Outbox-Datensatz gespeichert.

## Konsequenzen

Consumer müssen idempotent, Replays deterministisch und DLQ/Requeue auditierbar
sein. Polling, Retention und Reconciliation erhöhen Aufwand, verhindern aber
verlorene oder doppelte fachliche Wirkungen.
