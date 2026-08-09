---
id: F-001
title: Repository und Toolchain initialisieren
phase: foundation
status: done
priority: P0
owner: Engineering
dependencies: [G0, F-000]
gate: G1
outputs: [workspace-skeleton, lockfile, ADR-011, architecture-tests]
completed_at: 2026-08-09
---

# F-001 – Repository und Toolchain initialisieren

## Ziel und Kontext

Ein reproduzierbares Monorepo-Skelett für API, Web und Worker schaffen. Lies
[Stack/Zielstruktur](../../engineering/technology-stack.md),
[Systemarchitektur](../../architecture/system-architecture.md) und ADR-001/004.

## Scope

Git/.gitignore, EditorConfig, pnpm/Turbo, Node-Version, TypeScript strict,
Formatter, ESLint, Commit-Konvention, Root-Skripte, App-Skeletons,
ADR-/Task-Regeln sowie Boundary-/Architekturtests. Unterstützte Versionen in
`ADR-011` begründen und locken.

Nicht im Scope: Fachmodule, echte Provider, Voice-Service, Deployment.

## Akzeptanz und Verifikation

- [x] Frischer Checkout benötigt nur dokumentierte Voraussetzungen und einen
      Setup-Befehl; Lockfile ist committed.
- [x] Leere API-/Web-/Worker-Skeletons bauen reproduzierbar.
- [x] `lint`, `typecheck`, `test`, `build` und Boundary-Tests sind grün.
- [x] Verbotene Domain→Framework-/Provider-Imports werden testweise erkannt.

Stop: Erst nach dokumentiert freigegebenem `G0` und abgeschlossenem `F-000`
umsetzen. Bestehende
Nutzeränderungen nicht überschreiben.

## Ergebnisstand für den Review – 2026-08-09

- Das pnpm-/Turborepo-Workspace enthält getrennte Skeletons für
  [`api`](../../../apps/api/package.json),
  [`web`](../../../apps/web/package.json) und
  [`worker`](../../../apps/worker/package.json). Direkte Abhängigkeiten sind
  exakt gepinnt; Node `24.18.0` und pnpm `11.20.0` sind in
  [ADR-011](../../adr/ADR-011-supported-versions.md) begründet.
- `corepack pnpm install --frozen-lockfile` ist der einzige Setup-Befehl nach
  Installation der dokumentierten Runtime. `pnpm-lock.yaml` ist vorhanden und
  mit pnpm `11.20.0` reproduzierbar; erlaubte Install-Skripte sind auf die
  beiden exakt aufgelösten Build-Abhängigkeiten begrenzt.
- `format:check`, `lint`, `typecheck`, Unit-/Tooling-Tests, `build`,
  Frozen-Lockfile-Installation, Peer-Dependency-Prüfung und
  Production-/Gesamt-Audit sind grün. Für
  Integration und E2E existiert in `F-001` bewusst noch kein fachlicher oder
  infrastruktureller Testgegenstand; die Runner melden deshalb explizit
  `No test files found` statt fiktiver Testabdeckung.
- Der [Boundary-Checker](../../../tooling/architecture/check-boundaries.mjs)
  läuft gegen den Workspace. Seine Negativfixture beweist, dass ein
  Domain-Import von `@nestjs/common` als `DOMAIN_FRAMEWORK_IMPORT` scheitert.
- `compose:*` und `db:*` sind fail-closed Guards für `F-002` beziehungsweise
  `T-003`. Es wurden keine Provideradapter, Providerkonten, externen
  Nachrichten, Datenbanken oder Egress-Pfade aktiviert.

## Abschluss

Der Owner hat `MertDurasi` und `mert@durasi.de` für die ausschließlich lokale
Repository-Konfiguration bereitgestellt. Die Baseline wird als lokaler
Initial-Commit abgeschlossen. Der konfigurierte GitHub-Push ist ein externer
Synchronisationsschritt und keine Voraussetzung für die technische
Reproduzierbarkeit von `F-001`.
