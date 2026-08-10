# Lokale Infrastruktur

Diese Compose-Umgebung ist ausschließlich für synthetische lokale Entwicklung
bestimmt. Sie enthält keine Provideradapter, keine realen Daten und kein
Laufzeit-Egress. Es werden keine Host-Ports veröffentlicht; die Dienste teilen
ausschließlich ein internes Projektnetz. Health-, SMTP- und Persistenzproben
laufen über kurzlebige Tool-Container oder `exec` innerhalb dieses Netzes.

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
```

`compose:verify` legt ausschließlich synthetische Marker in PostgreSQL, Redis
und MinIO sowie eine E-Mail an `invalid.example` an, startet alle Dienste neu
und beweist anschließend deren Persistenz. Der Test ist wiederholbar.

## Endpunkte

| Dienst | Endpunkt im internen Compose-Netz | Persistenz |
|---|---|---|
| PostgreSQL 18.4 | `postgres:5432` | `postgres-data` |
| Redis 8.8.1 | `redis:6379` | `redis-data`, AOF |
| Keycloak 26.7.0 | `keycloak:8080` | PostgreSQL |
| MinIO | API `minio:9000`, Console `minio:9001` | `minio-data` |
| Mailpit 1.30.0 | SMTP `mailpit:1025`, UI `mailpit:8025` | `mailpit-data` |

Lokale Testzugänge stehen in `.env.example`. Sie sind absichtlich als
`local-only` markiert und dürfen niemals für Staging, Produktion oder echte
Daten wiederverwendet werden. Die Compose-Datei besitzt keine Passwortdefaults:
ohne eine ausdrücklich übergebene Env-Datei bricht die Auswertung ab. Eine
Produktionskonfiguration existiert in `F-002` nicht. `F-004` lässt Host-Zugriffe
bewusst geschlossen und prüft die App-Runtime separat mit synthetischen
Loopback-Abhängigkeiten; siehe
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
[Mailpit 1.30.0](https://github.com/axllent/mailpit/releases/tag/v1.30.0) und
[MinIO Security-Fix-Tag](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z).
