# Konfigurations- und Secret-Leitfaden

- Stand: 2026-08-10
- Task: `F-003`
- Owner: Engineering/Security
- Geltungsbereich: lokale, synthetische Foundation; kein produktiver Secret
  Store und keine echte Rotation

## Laufzeitvertrag

`@voice-ai/config` ist die einzige Quelle für typisierte Laufzeitkonfiguration.
API und Worker validieren vor dem NestJS-Bootstrap. Web validiert vor dem
Development- beziehungsweise Production-Serverstart; ein statischer Build
erhält dadurch keinen stillen Zugriff auf Laufzeitsecrets.

`APP_ENV` ist verpflichtend und akzeptiert ausschließlich `development`,
`test`, `staging` oder `production`. Es gibt keinen impliziten Default. Ein
vorhandenes `NODE_ENV` muss dazu passen; `staging` läuft technisch mit
`NODE_ENV=production`. Staging und Produktion lehnen bekannte lokale
Platzhalter, `.invalid`-Ziele sowie HTTP für öffentliche API- und OIDC-URLs ab.
Das ist eine technische Fail-closed-Leitplanke, keine Deploymentfreigabe.

Die vollständige lokale Vorlage liegt in [`.env.example`](../../.env.example).
Eine Arbeitskopie `.env` ist ignoriert und darf ausschließlich synthetische
lokale Werte enthalten:

```bash
cp .env.example .env
```

Die lokalen `dev`-Skripte laden ausschließlich die ignorierte Root-Datei
`.env`, sofern sie existiert. `start` liest dagegen nur das bereits gesetzte
Prozess-Environment; Staging/Produktion können dadurch nicht unbemerkt eine
lokale Datei übernehmen. Anwendungscode sucht nicht selbstständig nach
alternativen Dateien. Die Infrastruktur veröffentlicht ausschließlich Keycloak
und die least-privilege PostgreSQL-Runtime an `127.0.0.1:8080`
beziehungsweise `127.0.0.1:5432`. Die Root-`.env` erhält nur das Runtime-
Credential; Migration-, System- und Admin-Credentials bleiben in getrennten
Tooling-Kontexten. Diese T-003-Erweiterung hält die No-Real-Data-Grenze aufrecht:
Prozess-Smokes verwenden kurzlebige synthetische TCP-Endpunkte; eine spätere
CI-/Deployment-Topologie setzt Apps und Abhängigkeiten in ein ausdrücklich
freigegebenes internes Netz. Details stehen im
[Runtime-Vertrag](../operations/application-runtime.md#lokale-netzwerkgrenze-und-smoke-nachweis).

## Klassifikation und Exposition

| Klasse | Variablen | Behandlung |
|---|---|---|
| öffentlich | `NEXT_PUBLIC_API_BASE_URL` | darf in Browserbundles erscheinen; niemals Credentials, Tokens oder interne Verwaltungsendpunkte ergänzen |
| intern | `APP_ENV`, `API_HOST`, `API_PORT`, `API_LOG_LEVEL`, `DEPENDENCY_PROBE_TIMEOUT_MS`, `SHUTDOWN_GRACE_PERIOD_MS`, `WORKER_LOG_LEVEL`, `WORKER_READINESS_INTERVAL_MS`, `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `WEB_ORIGIN` | nicht vertraulich, aber nicht ungeprüft in Telemetrie oder Clientbundles übernehmen |
| secret (`DATA-26`) | `DATABASE_URL`, `REDIS_URL`, `OIDC_CLIENT_SECRET`, `SESSION_SECRET` | nur serverseitig; im Config-Paket als `SecretValue`, dessen String-, JSON- und Inspect-Darstellung immer `[REDACTED]` ist |

Ein `SecretValue` wird ausschließlich direkt am nutzenden Outbound-Adapter
explizit geöffnet. Der Klartext darf nie an Logger, Exceptions, Metriken,
Traces, Snapshots, E-Mails oder API-Antworten übergeben werden. Das gesamte
Config-Objekt zu loggen bleibt trotz Maskierung verboten: neue Felder könnten
sonst vor ihrer Klassifikation exponiert werden. Namen unter `NEXT_PUBLIC_*`
sind technisch öffentlich und dürfen keine serverseitigen Secrets enthalten.

`.env.example` enthält nur deterministische, als `local-only` oder
`replace-with` markierte Platzhalter. Sie sind keine Zugangsdaten und werden in
Staging/Produktion absichtlich abgelehnt. Echte `.env`-Dateien, Schlüssel und
Credential-Verzeichnisse werden durch `.gitignore` ausgeschlossen.

## Umgebungsgrenzen

| Umgebung | erlaubte Quelle | Daten/Egress | zusätzliche Regel |
|---|---|---|---|
| `development` | lokale ignorierte `.env`/Prozesswerte | nur synthetisch; kein realer Provider | lokale Platzhalter erlaubt |
| `test` | isolierte Test-/CI-Prozesswerte | nur Fixtures; Egress default-deny | deterministisch und nach Lauf verwerfen |
| `staging` | später freizugebender Secret Store/kurzlebige CI-Identität | keine Realdaten ohne eigenes Gate | Produktions-Transportregeln, keine lokalen Defaults |
| `production` | später freizugebender Secret Store/Workload Identity | erst nach Go-live-, Legal-, Security- und Providerfreigabe | kein Fallback; fehlender oder unsicherer Wert stoppt den Start |

Dateien oder Variablen einer Umgebung dürfen nicht in eine andere kopiert
werden. Insbesondere sind Staging und Produktion getrennte Identitäten,
Credentials, Schlüssel, Datenbanken und Provider-Scopes. Eine konkrete
Secret-Store-, Cloud- oder Anbieterwahl ist nicht Teil von `F-003`.

## Rotationsverfahren für eine spätere Runtime

Rotation wird vor der ersten nichtlokalen Umgebung je Secret-Klasse als
ausführbares Runbook und technisch überlappungsfähig implementiert. Bis dahin
gelten diese Designanforderungen:

1. Inventar, Owner, Scope, Erzeugungszeit und spätesten Rotationstermin ohne
   Secret-Wert erfassen; Logs referenzieren nur eine Credential-Version.
2. Neues Credential mit minimalen Rechten erzeugen. Altes Credential bleibt
   während eines kurzen, dokumentierten Überlappungsfensters gültig.
3. Consumer kontrolliert auf die neue Version umstellen; Start-, Health- und
   synthetische Contracttests ausführen. Secret-Werte erscheinen in keinem
   Prüfnachweis.
4. Altes Credential widerrufen, nicht nur aus der Konfiguration entfernen.
   Abhängige Sessions/Verbindungen neu aufbauen und die Ablehnung der alten
   Version verifizieren.
5. Rotation mit Actor, Grund, Version, Zeit und Ergebnis inhaltsfrei auditieren;
   Fehlversuch führt zu Rollback auf eine weiterhin sichere Version oder zum
   Fail-closed-Stopp.

Spezifische Reihenfolge:

- Datenbank/Redis: neue Least-Privilege-Identität anlegen, parallele
  Verbindung prüfen, Consumer umstellen, alte Sessions beenden und alte
  Identität widerrufen.
- OIDC Client Secret: zwei gültige Versionen beziehungsweise kontrolliertes
  Cutover vorsehen, Web-BFF umstellen, Tokenfluss synthetisch prüfen, Altsecret
  widerrufen.
- Session-Schlüssel: versionierte Key-ID und getrennte Ver-/Entschlüsselungsmenge
  vorsehen; nach maximaler Sessionlebensdauer Altkey entfernen. Bei Incident
  Sessions sofort invalidieren.
- spätere Provider-/Webhook-Secrets: erst nach Providerentscheidung; duale
  Signaturprüfung nur im begrenzten Rotationsfenster, Outbound standardmäßig
  aus und Altkey nach Reconciliation widerrufen.

Bei vermutetem Leak: betroffene Außenwirkung stoppen, Credential widerrufen,
abhängige Secrets auf Kaskadenrisiko prüfen, PII-/Breach-Triage starten und erst
nach sicherem Rebuild sowie Reconciliation entsperren. Ein Commit aus der
Historie zu löschen ersetzt niemals die Rotation.

## Automatisierte Nachweise

```bash
corepack pnpm test --filter @voice-ai/config
corepack pnpm test:secret-scan
```

Der Repository-Scan prüft Arbeitsbaum und Git-Historie auf bekannte
strukturierte Credentialmuster, Private-Key-Header und verdächtige
Secret-Zuweisungen in Env/YAML-Dateien. Er verlangt genau einen künstlichen
Canary unter `tooling/security/fixtures/`; derselbe Canary an jedem anderen Ort
ist ein Fehler. Findings nennen nur Datei, Zeile und Detektortyp, niemals den
Wert.
Der projektspezifische Scan ergänzt den Trivy-Dateisystem-/Secret-Scan und die
Artefakt-Allowlist aus `F-005`; serverseitige Push Protection bleibt eine
zusätzliche Repository-Leitplanke.
