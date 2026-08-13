# Providerfreie Application-Runtime

- Stand: 2026-08-13
- Tasks: `F-004`, `T-001`
- Geltungsbereich: synthetische lokale Foundation und Identity-Basis; keine
  Provider- oder produktive Fachfunktion

## Runtime-Bausteine

| Baustein | Vertrag | Start |
|---|---|---|
| API | NestJS REST unter `/api/v1`, getrennte Health-Endpunkte, OpenAPI und sichere JSON-Fehler | `corepack pnpm --filter @voice-ai/api dev` |
| Web | Next.js-BFF mit OIDC Code + PKCE und verschlüsselter HttpOnly-Session | `corepack pnpm --filter @voice-ai/web dev` |
| Worker | NestJS Application Context mit Dependency-Gate und kontrolliertem Drain | `corepack pnpm --filter @voice-ai/worker dev` |

Alle drei Prozesse validieren ihre Konfiguration vor dem eigentlichen Start.
`corepack pnpm dev` startet sie gemeinsam. Es existieren weiterhin keine
fachlichen Tenantdaten, Provideradapter oder realen Außenwirkungen. Die lokale
Keycloak-Konfiguration enthält keine Nutzer.

## Identity- und Session-Vertrag

Keycloak wird lokal unter `127.0.0.1:8080` exponiert; alle anderen
Infrastrukturports bleiben geschlossen. Beim ersten Start importiert Keycloak
das versionierte Realm `voice-ai-local` mit einem confidential Client,
Authorization Code, verpflichtendem PKCE `S256`, deaktiviertem Direct/Implicit
Grant und einer expliziten API-Audience. Das Clientsecret kommt ausschließlich
aus der lokalen Env-Vorlage und steht nicht im Realm-JSON.

Das Web ist der BFF: Login-State, Code-Verifier, Access- und Refresh-Token
werden ausschließlich serverseitig verarbeitet und als AES-GCM-verschlüsselte
HttpOnly-/SameSite-Cookies transportiert. Production-Cookies verwenden
zusätzlich `Secure` und den `__Host-`-Prefix; nichts wird in Local Storage oder
Browser-JavaScript exponiert. Session- und Cookieablauf überschreiten nie die
vom IdP gemeldete Refresh-Lebensdauer. Callback bindet `state`, `nonce`, PKCE
und Redirect-URI. Refresh und Logout sind POST-only und verlangen denselben
`Origin` wie `WEB_ORIGIN`.

Die API akzeptiert ausschließlich Bearer Tokens mit RS256-Signatur, richtigem
Issuer, Audience und Ablauf. Aus Claims werden nur Subject und die
allowgelisteten Rollen `tenant_owner`, `tenant_admin`, `agent`, `viewer` und
`support_admin` übernommen. `tenantContext` bleibt zwingend `null`; erst
`T-002` löst Tenant-Membership serverseitig aus PostgreSQL auf.

Der lokale Browserflow erzwingt für `tenant_owner`, `tenant_admin` und
`support_admin` per Composite-Rolle `mfa_required` die Einrichtung und Nutzung
von TOTP. `agent` und `viewer` erhalten diese Pflicht nicht. Realmvertrag und
Browserflow werden statisch sowie mit kurzlebigen synthetischen Nutzern
geprüft; nach dem Test verbleibt kein Nutzer im Realm.

## API- und Health-Vertrag

| Methode/Endpunkt | Bedeutung | Abhängigkeiten |
|---|---|---|
| `GET /api/v1` | stabile Versions- und Servicekennung | keine |
| `GET /health/live` | Prozess kann Requests beantworten | keine |
| `GET /health/ready` | PostgreSQL und Redis sind per begrenzter TCP-Probe erreichbar | PostgreSQL, Redis |
| `GET /api/v1/openapi.json` | maschinenlesbarer, versionierter API-Vertrag | keine |

Ein Ausfall von PostgreSQL oder Redis liefert für Readiness `503` und
`not_ready`; Liveness bleibt `200`. Die Foundation prüft absichtlich nur
TCP-Erreichbarkeit und exponiert weder URLs noch Credentials. Ein späterer
echter DB-/Queue-Adapter erweitert die Probe um eine authentifizierte
Protokollprüfung, ohne den HTTP-Vertrag zu ändern.

Jeder Request erhält einen Header `x-request-id`. Eine mitgesendete ID wird nur
als syntaktisch gültige UUID übernommen, andernfalls wird eine neue UUID
erzeugt. Clientfehler besitzen ausschließlich:

```json
{
  "code": "NOT_FOUND",
  "message": "Resource not found.",
  "requestId": "00000000-0000-4000-8000-000000000000",
  "status": 404
}
```

`details` ist optional und wird nur aus validierten Code-/Feldpaaren
übernommen. Stacktraces, Pfade, Exceptiontexte, Payloads und Konfiguration
werden nie an Clients ausgegeben.

## Logs und Korrelation

API und Worker schreiben zeilenweise UTC-JSON. Das Schema besitzt eine
Allowlist für `timestamp`, `level`, `service`, `environment`, `message`,
`context` sowie sichere technische Felder wie `requestId`, `eventType`,
`jobType`, `errorCode`, `status` und `durationMs`. Beliebige Objekte,
Stacktraces, URLs, Tokens und Payloads werden nicht serialisiert. HTTP-
Abschlusslogs enthalten Request-ID, Status und Dauer, aber bewusst keinen
ungeprüften URL-Pfad, weil spätere öffentliche Links Capability-Tokens tragen
könnten.

## Worker-Readiness und Shutdown

Der Worker nimmt Arbeit nur an, wenn PostgreSQL und Redis erreichbar sind.
Readiness wird seriell gegen überlappende Prüfungen geschützt und periodisch
aktualisiert. Bei `SIGINT` oder `SIGTERM` gilt folgende Reihenfolge:

1. Aufnahme neuer Arbeit atomar schließen;
2. Readiness-Timer stoppen;
3. bereits registrierte Jobs bis `SHUTDOWN_GRACE_PERIOD_MS` auslaufen lassen;
4. bei Fristablauf einen inhaltsfreien `worker.drain_timeout` protokollieren;
5. Application Context schließen.

Ein noch laufender Readiness-Check darf die Aufnahme während des Drains nicht
wieder öffnen. Fachliche BullMQ-Consumer werden erst mit ihren jeweiligen
Tasks an diesen Runtime-Vertrag angebunden.

## OpenAPI und Web-Verträge

Der eingecheckte Vertrag liegt unter
[`contracts/openapi/api-v1.json`](../../contracts/openapi/api-v1.json); die
daraus erzeugten Readonly-Typen liegen unter
[`apps/web/src/generated/api-v1.ts`](../../apps/web/src/generated/api-v1.ts).

```bash
corepack pnpm openapi:check
corepack pnpm openapi:generate
```

`openapi:check` baut die API deterministisch neu und scheitert bei jeder
Abweichung. Entfernte Pfade, Operationen, Schemas oder Felder werden zusätzlich
als Breaking-Fund gemeldet. Regeneration ist eine bewusste Änderung mit
Diff-Review, kein automatisches Überschreiben in CI.

## Lokale Netzwerkgrenze und Smoke-Nachweis

Die Infrastruktur aus `F-002` bleibt bis auf den für T-001 benötigten,
ausschließlich an Loopback gebundenen Keycloak-Port im internen Compose-Netz.
Das schützt die No-Real-Data-Grenze; der Identity-Bridge ist keine Freigabe für
Provider-Egress oder reale Konten.
Die URLs in `.env.example` beschreiben und validieren den App-Vertrag, sind
aber keine Behauptung, dass der Host auf die isolierten Container zugreifen
kann. Datenbank- oder Redis-Ports dürfen für ein grünes Readiness-Signal nicht
ad hoc geöffnet werden.

Der ausführbare Identity-Smoke startet Web und API nur auf den zusätzlichen
Loopback-Testports `3100`/`3101`, durchläuft Login, PKCE, Refresh, API-
Tokenvalidierung, Logout und das privilegierte MFA-Gate und entfernt seine
zufälligen synthetischen Nutzer immer im Cleanup:

```bash
corepack pnpm compose:identity
```

Die Integrationstests starten gebaute API-, Web- und Worker-Prozesse und
stellen ihnen kurzlebige synthetische TCP-Endpunkte auf Loopback bereit. Damit
werden Start, Dependency-Ausfall, Liveness/Readiness, Fehlervertrag,
Request-ID, OpenAPI und Signalbehandlung ohne reale Infrastrukturzugänge
bewiesen. Der Compose-Stack besitzt unabhängig davon eigene Health- und
Persistenzprüfungen. Eine spätere CI-/Deployment-Topologie muss Apps und
Abhängigkeiten in ein ausdrücklich freigegebenes internes Netz setzen.

## Verifikation

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:integration
corepack pnpm test:e2e
corepack pnpm build
corepack pnpm compose:health
```

`test:e2e` enthält in `F-004` noch keine fachliche Nutzerreise und läuft mit
`passWithNoTests`. Die ausführbaren Runtime-Smokes liegen auf der
Integrationsebene; fachliche E2E-Pfade beginnen erst nach den entsprechenden
Domain- und Tenancy-Tasks.
