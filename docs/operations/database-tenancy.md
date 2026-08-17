# PostgreSQL-Tenancy, Rollen und RLS

- Stand: 2026-08-17
- Task: `T-003`
- Scope: synthetische lokale Daten und providerfreie Control Plane

## Sicherheitsmodell

Die Anwendung prüft Tenantzugriff zweistufig. OIDC authentifiziert nur die
Identität. Das [`MembershipDirectory`](../../packages/db/src/index.ts) löst
anschließend innerhalb einer Read-only-Transaktion ausschließlich die aktive
Membership für `subject + ausgewählte tenant_id` auf. Erst der daraus erzeugte
`TenantContext` darf eine fachliche Datenbanktransaktion öffnen.

Jede Tenanttransaktion setzt ausschließlich lokal und transaktional:

```text
app.tenant_id
app.actor_subject
app.membership_id
app.membership_version
app.membership_role
```

`SET LOCAL` beziehungsweise `set_config(..., true)` wird bei Commit oder
Rollback automatisch verworfen. Ein Pool-Connection-Reuse ohne neuen Kontext
sieht deshalb keine Tenantzeilen. Die Anwendung setzt den Kontext aus der
serverseitigen Membership, niemals aus Header, Query, Body oder Token-Claims.

PostgreSQL erzwingt auf `app.tenants` und `app.memberships` zusätzlich
`ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY`, `USING` und
`WITH CHECK`. Die Datenbank gleicht Membership-ID, Subject, Version, Rolle und
Status sowie den Tenantstatus für jeden Write nochmals gegen die autoritative
Membership ab. Bekannte UUIDs eines fremden Tenants ändern das Ergebnis nicht:
Reads sowie Update/Delete liefern keine Zeile; ein fremder Insert, ein
Tenantwechsel oder ein veralteter/manipulierter Kontext wird von PostgreSQL
abgewiesen.

## Getrennte Rollen

| Login/Gruppe | Zweck | Rechte und Grenze |
|---|---|---|
| `voice_ai_migration_login` → `voice_ai_migrator` | kontrollierte Migration/Fixtures | besitzt `app`-Objekte, darf Schema migrieren; kein Superuser und kein `BYPASSRLS`; Credential nie in API/Worker |
| `voice_ai_runtime_login` → `voice_ai_runtime` | API und spätere Worker | DML nur durch RLS; weder Owner noch Superuser, `CREATEROLE` oder `BYPASSRLS`; keine Mitgliedschaft in Migration/System |
| `voice_ai_system_login` → `voice_ai_system` | enger tenantübergreifender Read-/Reconciliation-Pfad | ausschließlich Select-Policy nach vorherigem append-only Access Receipt; keine Tenant-Writes; keine Mitgliedschaft in Runtime/Migration |
| lokaler Compose-Admin | lokale Rollenprovisionierung und Keycloak-DB | ausschließlich Setup/Test, nicht in der App-Konfiguration und nicht für reale Daten |

Der Systempfad verlangt vor jedem Read einen pseudonymen `actorRef`, einen
stabilen Reason Code und eine Operation. Daraus entsteht separat und vor dem
Read ein unveränderliches `system_access_log`-Receipt; ohne passende
transaktionslokale Receipt-ID sieht die Systemrolle keine Tenantzeile. Dies ist
die minimale T-003-Grundlage. Das vollständige fachliche Auditmodell,
Ergebnis-/Request-Korrelation und Retention folgen in `T-004`.

## Schema und Migrationen

- Drizzle beschreibt das typisierte Schema in
  [`packages/db/src/schema.ts`](../../packages/db/src/schema.ts).
- Unveränderliche SQL-Migrationen liegen unter
  [`packages/db/migrations`](../../packages/db/migrations).
- Clusterrollen werden getrennt über
  [`packages/db/sql/roles.sql`](../../packages/db/sql/roles.sql) provisioniert.
- `tooling/ci/migrations.manifest.json` bindet Dateimenge und SHA-256 der
  Migrationen. Ein nachträglich geänderter angewandter Hash bricht den Runner.
- Der Runner verwendet einen Advisory Lock und eine eigene
  `voice_ai_internal.schema_migrations`-Tabelle. Ein zweiter Lauf ist ein
  No-op.

Die erste Migration ist additiv. Ein automatisches Down-Script existiert
bewusst nicht, weil das Entfernen von RLS, Tabellen oder Rollen destruktiv und
sicherheitskritisch wäre. Fehler werden über eine neue vorwärtsgerichtete
Migration korrigiert; ein Rollback vor Realdaten erfolgt nur über einen
explizit geprüften Restore beziehungsweise das bewusste Verwerfen einer rein
synthetischen Testdatenbank.

## Schema-Linter und Nachweise

Der Catalog-Linter betrachtet jede normale Tabelle im Schema `app` außer dem
nicht-tenantgebundenen `system_access_log`. Er verlangt:

- `tenant_id`;
- aktiviertes und erzwungenes RLS;
- Policy-Coverage für Select, Insert, Update und Delete;
- `USING` für Select/Update/Delete sowie `WITH CHECK` für Insert/Update.

Der Integrationstest erzeugt absichtlich eine ungeschützte Tenanttabelle und
beweist, dass `assertTenantRls` den CI-Lauf blockieren würde. Dieselbe Suite
prüft Clean-DB-Migration, No-op-Rerun, Rollen/Owner, Cross-Tenant Read/Write,
Pool-Reset und den auditierten Systempfad gegen einen kurzlebigen, digest-
gepinnten PostgreSQL-18-Container.

## Lokale Bedienung

```bash
corepack pnpm compose:up
corepack pnpm compose:health
corepack pnpm test:integration
```

`compose:up` provisioniert nach dem Infrastrukturstart die lokalen Rollen,
wendet Migrationen an und erzeugt nur die beiden versionierten synthetischen
Tenants. PostgreSQL ist ausschließlich auf `127.0.0.1:5432` gebunden. Die
Root-`.env.example` enthält nur das Runtime-Credential; Migration-, System- und
lokale Admin-Credentials bleiben im getrennten Compose-/Tooling-Kontext.

Für eine explizite nichtlokale Migration muss der Operator
`DATABASE_MIGRATION_URL` aus einem freigegebenen Secret Store nur dem
Migrationsprozess bereitstellen:

```bash
DATABASE_MIGRATION_URL='postgresql://…' corepack pnpm db:migrate
```

`db:seed` verweigert Staging und Produktion. Keine dieser Grundlagen erlaubt
reale Tenantdaten, Providerkonten oder Voice-/Textback-Außenwirkungen.
