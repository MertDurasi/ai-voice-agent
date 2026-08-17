# CI- und Supply-Chain-Vertrag

- Task: `F-005`
- Stand: 2026-08-11
- Betriebsgrenze: Prüfung und lokale synthetische Infrastruktur; kein Deployment,
  kein Providerkonto und kein Realbetrieb

## Verbindlicher Jobgraph

| Job | Nachweis | Blockiert bei |
|---|---|---|
| `Quality and migration policy` | exakte Toolchain, Frozen Install, Workflow-/Migrationspolicy, Format, Lint, Typecheck, Unit-/Integration-/E2E-Tests, Build und Secret-Scan | jedem Fehler, Lockfile-Drift, unerlaubter Migration oder Secret-Finding |
| `Dependency, filesystem and SBOM` | Dependency-Audit, CycloneDX-1.7-SBOM aus dem Lockfile sowie Dateisystem-/Misconfiguration-/Secret-Scan | High/Critical, Secret-Finding, Scannerfehler, fehlendem oder unsicherem Report |
| `Container <id>` | jedes externe Runtime-, Tool- und Dockerfile-Basisimage am exakten Digest | neuem/verändertem High/Critical, abgelaufener Baseline, ungepinntem oder nicht erfasstem Image, Scannerfehler |
| `Local infrastructure and final images` | kompletter Compose-Vertrag einschließlich Tools-Profil, Build, Health, synthetische Persistenz sowie Scan der finalen MinIO-/Mailpit-Images | Build-/Health-/Persistenzfehler, neuem/verändertem High/Critical, abgelaufener Baseline oder Scannerfehler |
| `Merge gate` | alle vorherigen Jobs enden mit `success` | fehlgeschlagenem, abgebrochenem oder übersprungenem Pflichtjob |

Der stabile Required-Check heißt in GitHub `CI / Merge gate`. Änderungen an
internen Jobs dürfen diesen Vertrag nicht still umgehen. Der Workflow läuft
für Pull Requests, `main` und manuell, besitzt nur `contents: read`, referenziert
keine Repository-Secrets und enthält weder Publish- noch Deploymentpfade.

## Reproduzierbarkeit und Rechte

- Node `24.18.0` kommt ausschließlich aus `.node-version`; pnpm `11.20.0`
  ausschließlich aus `packageManager`.
- Jeder pnpm-/Turbo-Job aktiviert zuerst den Corepack-Shim und prüft die
  exakte pnpm-Version. So kann Turbo den Paketmanager auch auf einem frischen
  Linux-Runner deterministisch auflösen.
- Jede Installation nutzt `pnpm install --frozen-lockfile`. Ein inkonsistentes
  Manifest oder Lockfile ist ein Fehler.
- GitHub Actions sind über vollständige Commit-SHAs erlaubt und in der lokalen
  Workflowpolicy allowgelistet. `checkout` persistiert keine Credentials und
  lädt die vollständige Historie für den Secret-History-Scan.
- CI nutzt zunächst keinen Package-Manager-Cache. Cache-Inhalte werden damit
  weder versteckte Eingabe noch unbeabsichtigtes Artefakt.
- Externe Images und jedes `Dockerfile FROM` sind per SHA-256-Digest fixiert.
  Die beiden lokal gebauten finalen Images werden nach dem Build zusätzlich
  gescannt.
- Telemetrie von Next.js und Turbo ist deaktiviert. Der lokale Compose-Vertrag
  veröffentlicht ausschließlich Keycloak an `127.0.0.1:8080` und die
  least-privilege PostgreSQL-Runtime an `127.0.0.1:5432`; alle anderen
  Host-Ports bleiben geschlossen und alle Werte synthetisch.

## Migrationen vor und ab T-003

Die Check-ID bleibt stabil. `T-003` hat Manifest und Runner atomar auf `active`
geschaltet: Dateimenge und SHA-256 bestehender Migrationen werden
unveränderlich geprüft. Der Runner serialisiert Ausführungen per Advisory Lock,
lehnt unbekannte oder hashveränderte angewandte Migrationen ab und läuft beim
zweiten Durchlauf als No-op. Die PostgreSQL-Integrationssuite beweist Clean-DB-
Anwendung, Schema-/RLS-Lint, Rollen und Cross-Tenant-Isolation. Eine neue
Tenanttabelle ohne `tenant_id`, `ENABLE/FORCE RLS` oder vollständige
Command-Policies blockiert den Lauf.

## Findings und Ausnahmen

High und Critical blockieren Dependencies, Dateisystem, Applikations- und
produktionsfähige Container. Ein Scanner-/Datenbankfehler gilt ebenfalls als
Fehler, nicht als „kein Finding“. `ignore-unfixed` ist deaktiviert.

Für die ausschließlich lokal und synthetisch nutzbaren Upstreamimages von
PostgreSQL, Keycloak und MinIO existiert eine enge Übergangsbaseline in
`tooling/ci/vulnerability-baseline.json`. Sie ist keine pauschale Ausnahme:

- jeder Fund ist über Severity, ID, Paket und installierte Version exakt
  gebunden; jeder neue, entfernte oder veränderte Fund blockiert;
- der konkrete Image-Digest beziehungsweise lokale Build-Tag ist gebunden;
- Nutzung ist `local-synthetic-only`, Promotion ist technisch als `forbidden`
  festgeschrieben;
- Critical-Baselines dürfen höchstens sieben, reine High-Baselines höchstens
  30 Tage gelten; die aktuelle Baseline endet am 2026-08-19;
- Owner und Begründung sind Pflicht. Verlängerung oder Imagewechsel brauchen
  einen neuen Security-Review und einen vollständig grünen Lauf.

Mailpit 1.30.7, Redis, Builder und Basisruntime sind aktuell ohne High/Critical
und bleiben strikt blockierend. Staging-/Produktionsimages dürfen diese
lokale Baseline niemals übernehmen. Eine globale Ignore-Datei oder ein
direkter Workflow-Bypass ist unzulässig.

## Reports und Aufbewahrung

Hochgeladen werden ausschließlich allowgelistete JSON-Dateien:

- CycloneDX-1.7-SBOM des pnpm-Lockfiles;
- redigierbare Dependency-, Dateisystem-, Misconfiguration- und
  Containerberichte;
- je Artefaktgruppe ein Manifest mit Quellrevision, exakter Node-/pnpm-Version,
  Dateigröße und SHA-256.

Vor Upload prüft eine Policy, dass jeder erwartete Report vorhanden, reguläre
JSON-Datei, höchstens 25 MiB groß und frei von bekannten Secretmustern ist. Ein
Report wird nur hochgeladen, wenn diese Prüfung erfolgreich war; ein
Secret-Finding kann dadurch nicht über den Diagnosebericht weiter offengelegt
werden.
Unerwartete oder versteckte Dateien, Dumps, Images, `node_modules`, `.env`,
Caches und Rohlogs werden nicht hochgeladen. Die Artefaktaufbewahrung beträgt
sieben Tage. Laufzeitlogs folgen der Repository-Einstellung und dürfen keine
Payloads oder Secrets enthalten.

## Lokale Verifikation

Mit der in `.node-version` festgelegten Version:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm ci:policy
corepack pnpm dependency:scan
corepack pnpm ci:quality
```

Der vollständige Infrastruktur- und Containernachweis läuft in GitHub CI. Die
lokale Infrastruktur kann separat mit `compose:up`, `compose:health`,
`compose:verify` und `compose:down` geprüft werden. Eine lokale Baseline lässt
sich gegen einen gespeicherten Trivy-JSON-Report reproduzierbar prüfen:

```bash
node tooling/ci/check-vulnerability-report.mjs \
  --report /path/to/trivy-report.json \
  --subject postgres \
  --policy baseline \
  --image 'postgres:18.4-alpine3.23@sha256:…' \
  --baseline tooling/ci/vulnerability-baseline.json
```

## Owner-Schritte vor G1

Der Workflow ist in
[GitHub Actions Run 31616117821](https://github.com/MertDurasi/ai-voice-agent/actions/runs/31616117821)
einschließlich `CI / Merge gate` vollständig grün. Der Workflow allein
verhindert jedoch keinen Merge. Deshalb ist das
[`main`-Ruleset](https://github.com/MertDurasi/ai-voice-agent/rules/20759048)
aktiviert und am 2026-08-12 verifiziert:

- `CI / Merge gate` ist Required Check und der Branch muss aktuell sein;
- keine Admin-/Owner-Umgehung, kein Force-Push und keine Branch-Löschung;
- Actions standardmäßig read-only; vollständige SHA-Referenzen beibehalten;
- GitHub Secret Scanning und Push Protection aktivieren, sofern im
  Repositorytarif verfügbar;
- keine Merge-Freigabe, solange der Required Check fehlt oder übersprungen ist.

Der verlinkte grüne Lauf und der Ruleset-Nachweis schließen `F-005` und `G1`.
