# ADR-002 – Tenant-ID plus PostgreSQL Row-Level Security

- Status: accepted
- Datum: 2026-08-07

## Kontext

Anwendungsseitige Filter allein schützen bei vergessenen Prädikaten oder IDOR
nicht zuverlässig vor Cross-Tenant-Zugriffen.

## Entscheidung

Jede mandantenbezogene Tabelle besitzt `tenant_id`. Die Anwendung erzwingt den
Tenant-Kontext und PostgreSQL erzwingt zusätzlich `ENABLE/FORCE RLS` mit
`USING` und `WITH CHECK`. Die Runtime-Rolle ist nicht Owner und besitzt kein
`BYPASSRLS`.

## Konsequenzen

Jeder HTTP-/Job-Pfad benötigt einen transaktionalen `SET LOCAL`-Kontext.
Migrationen, Connection Pool und Systemjobs benötigen besondere Negativtests
und einen expliziten auditierbaren Systempfad.
