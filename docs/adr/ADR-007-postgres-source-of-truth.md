# ADR-007 – PostgreSQL als Source of Truth, Redis transient

- Status: accepted
- Datum: 2026-08-07

## Kontext

Queue- und Cache-Systeme können Daten verlieren oder neu gestartet werden.
Geschäftskritische Calls, Nachrichten, Leads und Usage dürfen davon nicht
abhängen.

## Entscheidung

PostgreSQL ist die fachliche Source of Truth. Redis dient ausschließlich Queue,
Locks und Cache. Wiederaufbau und Reconciliation erfolgen aus persistierten
DB-Zuständen und Outbox/Inbox.

## Konsequenzen

Redis-Ausfall darf Verarbeitung verzögern, aber keine fachlichen Datensätze
vernichten. DB-Kapazität, Outbox-Lag und Recovery werden überwacht.
