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
| `Container <id>` | jedes externe Runtime-, Tool- und Dockerfile-Basisimage am exakten Digest | High/Critical, ungepinntem oder nicht erfasstem Image, Scannerfehler |
| `Local infrastructure and final images` | kompletter Compose-Vertrag einschließlich Tools-Profil, Build, Health, synthetische Persistenz sowie Scan der finalen MinIO-/Mailpit-Images | Build-/Health-/Persistenzfehler, High/Critical oder Scannerfehler |
| `Merge gate` | alle vorherigen Jobs enden mit `success` | fehlgeschlagenem, abgebrochenem oder übersprungenem Pflichtjob |

Der stabile Required-Check heißt in GitHub `CI / Merge gate`. Änderungen an
internen Jobs dürfen diesen Vertrag nicht still umgehen. Der Workflow läuft
für Pull Requests, `main` und manuell, besitzt nur `contents: read`, referenziert
keine Repository-Secrets und enthält weder Publish- noch Deploymentpfade.

## Reproduzierbarkeit und Rechte

- Node `24.18.0` kommt ausschließlich aus `.node-version`; pnpm `11.20.0`
  ausschließlich aus `packageManager`.
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
  veröffentlicht keine Host-Ports und verwendet nur synthetische Werte.

## Migrationen vor und ab T-003

Die Check-ID bleibt stabil, obwohl `T-003` noch nicht umgesetzt ist:

1. Im aktuellen Modus `guarded` müssen `db:migrate` und `db:seed` exakt auf den
   `T-003`-Guard zeigen. Beide Guards werden ausgeführt und müssen mit Exitcode
   `1` sowie dem stabilen Grund „intentionally unavailable“ enden. Jede echte
   Migration außerhalb von Dokumentation oder CI-Fixtures blockiert.
2. `T-003` schaltet Manifest und Runner in derselben Änderung auf `active`.
   Dann werden Dateimenge und SHA-256 bestehender Migrationen unveränderlich
   geprüft. Der aktive Runner muss zusätzlich Clean-DB-Anwendung, zweiten
   No-op-Lauf, Schema-/RLS-Lint und Driftvergleich implementieren.

Dadurch zieht `F-005` kein Datenbankschema vor, lässt aber auch keinen stillen
Migrationspfad am Gate vorbei zu.

## Findings und Ausnahmen

High und Critical blockieren Dependencies, Dateisystem und Container. Ein
Scanner-/Datenbankfehler gilt ebenfalls als Fehler, nicht als „kein Finding“.
`ignore-unfixed` ist deaktiviert.

Der produktive Workflow besitzt absichtlich **keine Finding-Ausnahme**. Die
Policy-Negativtests definieren bereits den Mindestvertrag für eine spätere,
separat gereviewte Ausnahme: exakte Finding-ID, benannter Owner, konkrete
Begründung und nicht überschrittenes Ablaufdatum. Eine pauschale Ignore-Datei
oder ein direkter Workflow-Bypass ist unzulässig.

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
`compose:verify` und `compose:down` geprüft werden.

## Owner-Schritte vor G1

Der Workflow allein verhindert keinen Merge. Der Repository-Owner muss nach
dem ersten grünen Lauf einen Ruleset für `main` aktivieren:

- `CI / Merge gate` ist Required Check und der Branch muss aktuell sein;
- keine Admin-/Owner-Umgehung, kein Force-Push und keine Branch-Löschung;
- Actions standardmäßig read-only; vollständige SHA-Referenzen beibehalten;
- GitHub Secret Scanning und Push Protection aktivieren, sofern im
  Repositorytarif verfügbar;
- keine Merge-Freigabe, solange der Required Check fehlt oder übersprungen ist.

`G1` bleibt bis zum verlinkten grünen GitHub-Lauf und diesem Ruleset-Nachweis
offen. Erst danach kann `F-005` von `review` nach `done` wechseln.
