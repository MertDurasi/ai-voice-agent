# Lokale Infrastruktur

Diese Compose-Umgebung ist ausschließlich für synthetische lokale Entwicklung
bestimmt. Sie enthält keine Provideradapter und keine realen Daten. Keycloak
und die least-privilege PostgreSQL-Runtime werden über jeweils eine eigene,
nur lokal veröffentlichte Bridge an Loopback gebunden; die übrigen Dienste
teilen ein internes Projektnetz. Health-, SMTP- und
Persistenzproben laufen über kurzlebige Tool-Container oder `exec` innerhalb
dieses Netzes.

Die Befehle verwenden die leere Client-Konfiguration `docker-anonymous`. So
werden ausschließlich öffentliche Images anonym geladen und weder persönliche
Registry-Credentials noch der globale Docker-Credential-Helper verwendet.

## Start und Prüfung

Voraussetzungen sind Docker Desktop/Engine mit Compose sowie die in der
Root-README gepinnte Node-/pnpm-Version.

```bash
corepack pnpm compose:up
corepack pnpm compose:health
corepack pnpm compose:verify
corepack pnpm compose:identity
```

`compose:up` provisioniert zusätzlich getrennte PostgreSQL-Rollen, wendet die
unveränderlichen Migrationen an und erzeugt zwei synthetische
Tenant-/Membership-Fixtures. `compose:verify` legt ausschließlich synthetische
Marker in PostgreSQL, Redis
und MinIO sowie eine E-Mail an `invalid.example` an, startet alle Dienste neu
und beweist anschließend deren Persistenz. Der Test ist wiederholbar.
`compose:identity` baut Web/API, erzeugt nur für den Lauf zufällige synthetische
Nutzer, prüft OIDC Code + PKCE, Refresh, Logout, API-Signaturprüfung und das
TOTP-Gate privilegierter Rollen und entfernt die Nutzer anschließend wieder.

## Endpunkte

| Dienst | Endpunkt im internen Compose-Netz | Persistenz |
|---|---|---|
| PostgreSQL 18.4 | intern `postgres:5432`, Host ausschließlich `127.0.0.1:5432` | `postgres-data` |
| Redis 8.8.1 | `redis:6379` | `redis-data`, AOF |
| Keycloak 26.7.0 | intern `keycloak:8080`, Host ausschließlich `127.0.0.1:8080` | PostgreSQL |
| MinIO | API `minio:9000`, Console `minio:9001` | `minio-data` |
| Mailpit 1.30.7 | SMTP `mailpit:1025`, UI `mailpit:8025` | `mailpit-data` |

Lokale Testzugänge stehen in `.env.example`. Sie sind absichtlich als
`local-only` markiert und dürfen niemals für Staging, Produktion oder echte
Daten wiederverwendet werden. Keycloak und PostgreSQL sind ausschließlich an
Loopback gebunden. Die App-`.env.example` enthält nur das Runtime-Credential;
Migration-/System-/Admin-Credentials bleiben im Compose-/Tooling-Kontext.
Redis, MinIO und Mailpit bleiben ohne Host-Port. Beim ersten Start wird das Realm
aus `keycloak/voice-ai-local-realm.json` importiert; es enthält Rollen und Client,
aber bewusst keine Testnutzer oder Secrets. Die Compose-Datei besitzt keine
Passwortdefaults: ohne eine ausdrücklich übergebene Env-Datei bricht die
Auswertung ab. Eine
Produktionskonfiguration existiert nicht. Die Loopback-Freigabe ist eng auf
lokale Identity-/RLS-Nachweise begrenzt; siehe
[Application-Runtime](../../docs/operations/application-runtime.md#lokale-netzwerkgrenze-und-smoke-nachweis).

## Stoppen und Löschen

```bash
corepack pnpm compose:down
```

Dieser Befehl stoppt Container und Netz, löscht aber **keine** Volumes. Nur wenn
alle lokalen synthetischen Daten bewusst verworfen werden sollen, darf der
Owner explizit ausführen:

```bash
docker --config infra/compose/docker-anonymous compose \
  --env-file infra/compose/.env.example \
  -f infra/compose/compose.yaml down --volumes --remove-orphans
```

## Image- und Sicherheitsgrenze

PostgreSQL, Redis, Keycloak und Mailpit sind exakt gepinnt. Mailpit wird um eine
minimale Alpine-Laufzeit ergänzt, damit der offizielle `/readyz`-Endpunkt als
echter Container-Healthcheck dient.

MinIO Community liefert seit Ende 2025 keine gepflegten Binär- oder
Container-Releases mehr. Deshalb baut die lokale Umgebung den letzten
Security-Fix-Tag `RELEASE.2025-10-15T17-29-55Z` aus Source mit einem aktuellen,
exakt gepinnten Go-Builder. Das ist eine reversible lokale Baseline, keine
Produktions- oder Cloudentscheidung; der S3-Anbieter wird vor Realbetrieb neu
bewertet.

Quellen: [PostgreSQL Official Image](https://hub.docker.com/_/postgres),
[Redis Official Image](https://hub.docker.com/_/redis),
[Keycloak 26.7.0](https://www.keycloak.org/2026/07/keycloak-2670-released),
[Mailpit 1.30.7](https://github.com/axllent/mailpit/releases/tag/v1.30.7) und
[MinIO Security-Fix-Tag](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z).
