# Providerfreie Application-Runtime

- Stand: 2026-08-10
- Task: `F-004`
- Geltungsbereich: synthetische lokale Foundation; keine Provider-, Auth- oder
  Fachfunktion

## Runtime-Bausteine

| Baustein | Vertrag | Start |
|---|---|---|
| API | NestJS REST unter `/api/v1`, getrennte Health-Endpunkte, OpenAPI und sichere JSON-Fehler | `corepack pnpm --filter @voice-ai/api dev` |
| Web | zugängliche Next.js-Shell ohne Tracker oder externe Ressourcen | `corepack pnpm --filter @voice-ai/web dev` |
| Worker | NestJS Application Context mit Dependency-Gate und kontrolliertem Drain | `corepack pnpm --filter @voice-ai/worker dev` |

Alle drei Prozesse validieren ihre Konfiguration vor dem eigentlichen Start.
`corepack pnpm dev` startet sie gemeinsam. Es existieren weiterhin keine
fachlichen Endpunkte, Jobs, Tenantdaten, Provideradapter oder realen
Außenwirkungen.

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

Die Infrastruktur aus `F-002` bleibt vollständig im internen Compose-Netz und
veröffentlicht keine Host-Ports. Das schützt den No-Egress-/No-Real-Data-Modus.
Die URLs in `.env.example` beschreiben und validieren den App-Vertrag, sind
aber keine Behauptung, dass der Host auf die isolierten Container zugreifen
kann. Datenbank- oder Redis-Ports dürfen für ein grünes Readiness-Signal nicht
ad hoc geöffnet werden.

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
