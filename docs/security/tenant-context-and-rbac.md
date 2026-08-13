# Tenant-Kontext und Rollenmodell

- Stand: 2026-08-13
- Task: `T-002`
- Scope: providerfreie, synthetische Control-Plane-Basis
- Nicht enthalten: PostgreSQL-Persistenz/RLS (`T-003`), vollständiges Audit
  (`T-004`) und Supportzugriff (`B-005`)

## Sicherheitsinvarianten

Ein authentifiziertes OIDC-Token beweist die Identität und globale Rollen, aber
keine Tenant-Berechtigung. Der Tenant-Kontext entsteht nur aus einer aktiven,
serverseitig gefundenen `Membership` zu einem aktiven `Tenant`:

```text
OIDC subject + angeforderte Tenant-ID
  -> MembershipDirectory
  -> aktive Membership + aktiver Tenant
  -> unveränderlicher TenantContext
  -> konkrete Permission
```

Die Tenant-ID aus dem URL-Pfad ist nur ein Auswahl- und Lookup-Schlüssel. Die
anschließend verwendeten Werte `tenantId`, `membershipId`,
`membershipVersion` und `role` stammen vollständig aus der Membership. Header,
Query und Body dürfen keinen alternativen Tenant-Kontext einschleusen. Fehlende,
deaktivierte, suspendierte, inkonsistente oder manipulierte Zuordnungen liefern
denselben inhaltsfreien HTTP-Status `403`.

`support_admin` ist bewusst keine Tenant-Rolle. Ein solches Token erhält auch
mit einer normalen Tenant-Route keinen Zugriff. Der spätere Supportpfad benötigt
eine zeitlich begrenzte, zweckgebundene und auditierte Freigabe aus `B-005`; er
darf weder Membership noch RLS umgehen.

## Fachliches Schema

| Objekt | Pflichtfelder | Invarianten |
|---|---|---|
| `Tenant` | `id`, `status`, `version` | UUID; `active | suspended`; positive Version |
| `Membership` | `id`, `subject`, `tenantId`, `role`, `status`, `version` | genau eine Zuordnung je Subject/Tenant; `active | disabled`; Rolle aus der Matrix |
| `TenantContext` | `actorSubject`, `tenantId`, `membershipId`, `membershipVersion`, `role` | nur durch Resolver erzeugt; immutable; vor Jobausführung erneut validiert |

Dies ist das fachliche, frameworkunabhängige Schema. Tabellen, Constraints,
Runtime-/Migrationsrollen und `ENABLE/FORCE RLS` werden atomar in `T-003`
eingeführt, damit zu keinem Zeitpunkt ungeschützte Tenant-Tabellen entstehen.

## RBAC-Matrix

| Permission | Owner | Admin | Agent | Viewer |
|---|:---:|:---:|:---:|:---:|
| `tenant:read` | ✓ | ✓ | ✓ | ✓ |
| `tenant:manage` | ✓ | – | – | – |
| `members:read` | ✓ | ✓ | – | – |
| `members:manage` | ✓ | ✓ | – | – |
| `work:read` | ✓ | ✓ | ✓ | ✓ |
| `work:write` | ✓ | ✓ | ✓ | – |

`tenant_owner` verwaltet den Tenant und Memberships. `tenant_admin` verwaltet
Memberships und operative Arbeit, aber nicht den Tenant-Lifecycle. `agent`
bearbeitet operative Vorgänge. `viewer` besitzt ausschließlich Lesezugriff.
Controller deklarieren genau eine benötigte Permission; eine unbekannte oder
fehlende Deklaration wird fail-closed abgelehnt.

## HTTP- und Jobvertrag

Die synthetisch getestete API-Route
`GET /api/v1/tenants/{tenantId}/context` führt nacheinander Bearer-,
Membership- und Permission-Prüfung aus. Ohne injiziertes produktives
`MembershipDirectory` verwendet die Runtime absichtlich ein leeres Directory
und verweigert jeden Tenant-Zugriff. Eine Datenbankanbindung wird nicht vor
`T-003` vorgezogen.

Asynchrone Arbeit nutzt ausschließlich `TenantJobEnvelope` mit Version `1`,
UUID-Job-ID, begrenztem Jobtyp, unveränderlichem Tenant-Kontext und reinem
JSON-Payload. Tenant-/Actor-/Membership-Selektoren im Payload sowie gefährliche
Objektschlüssel werden verworfen. Der Consumer validiert den Vertrag und löst
die Membership vor jeder Ausführung erneut auf; Rollenänderung, Deaktivierung,
Versionsabweichung oder Tenant-Manipulation verhindern die Ausführung.

## Logging und Nachweise

HTTP- und Jobgrenzen leiten aus dem validierten Kontext nur stabile
pseudonyme Korrelationen `act_*` aus der hochentropischen Membership-ID und
`ten_*` aus der Tenant-ID ab. Rohe Subjects, Membership-/Tenant-UUIDs, Token,
Header, URL-Pfade und Payloads werden nicht protokolliert. Die Referenzen sind
pseudonym, nicht anonym, und unterliegen weiterhin Zugriff und Retention.

Automatisierte Tests decken alle vier Rollen, fehlende Membership, gesperrte
Tenants/Memberships, Header-/Query-/Body-/Pfad-Manipulation, veraltete und
veränderte Jobkontexte, Payload-Prototyp-Manipulation sowie PII-freie
Korrelation ab. Die zusätzliche Datenbank-Isolation und der Pool-Leak-Nachweis
folgen in [`T-003`](../tasks/tenancy/T-003-rls-db-roles.md).
