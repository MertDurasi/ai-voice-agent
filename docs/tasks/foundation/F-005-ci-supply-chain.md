---
id: F-005
title: CI-Baseline und Supply Chain
phase: foundation
status: review
priority: P0
owner: Engineering/Security
dependencies: [F-001, F-002, F-003, F-004]
gate: G1
outputs: [ci-workflow, sbom, scan-policy, artifact-policy]
completed_at: null
---

# F-005 – CI-Baseline und Supply Chain

## Ziel

Jeder Merge wird reproduzierbar auf Qualität, Migration und Supply-Chain-
Risiken geprüft.

## Scope

Workflow für Frozen Install, Lint, Typecheck, Unit/Integration, Build,
Migrationstest, Secret-/Dependency-/Container-Scan, SBOM und begrenzte
Artefaktaufbewahrung. Actions/Images pinnen, minimale CI-Berechtigungen nutzen.

## Akzeptanz und Verifikation

- [x] Defekter Test, Typfehler und Migrationsdrift blockieren Merge.
- [x] Undokumentiertes Critical Finding blockiert Merge.
- [x] CI nutzt Frozen Lockfile, minimale Rechte und gepinnte Referenzen.
- [x] SBOM und relevante Reports sind nachvollziehbare Artefakte ohne Secrets.
- [x] Negativfixtures beweisen die wichtigsten Blockierregeln.

Gate-Nachweis: sauberer Setup-Lauf, alle Apps healthy, CI grün und kein Secret
im Repo. Keine automatische Produktionsauslieferung hinzufügen.

## Lieferobjekte

- [GitHub-Workflow](../../../.github/workflows/ci.yml)
- [ausführbarer CI-/Supply-Chain-Vertrag](../../operations/ci-supply-chain.md)
- `tooling/ci/`: Workflow-, Image-, Migrations-, Finding- und Artefaktpolicy
- `tooling/security/`: gehärteter Secret-Scanner einschließlich
  YAML-, Marker-Bypass- und NUL-Negativfällen
- CycloneDX-1.7-SBOM, Dependency-/Filesystem-/Containerreports und
  SHA-256-Manifeste als kurzlebige CI-Artefakte

## Lokaler Nachweis vom 2026-08-12

Unter Node `24.18.0` und pnpm `11.20.0` sind erfolgreich:

- Frozen Install und Dependency-Audit ohne bekannte Schwachstelle;
- Workflow-/Image-/Migrationspolicy einschließlich Guard-Ausführung;
- 22 CI-/Migrations-/Finding-/Artefakt-Policytests einschließlich exakter,
  ablaufender Local-only-Containerbaseline;
- 7 Secret-Scanner-Tests und Arbeitsbaum-/Git-History-Scan mit genau einem
  synthetischen Canary, ohne unerwartetes Finding;
- vollständiges `ci:quality`: Format, Lint, Typecheck, Unit-/Architektur-/
  OpenAPI-/Runtime-Integrationstests, E2E-Runner und Build;
- native CycloneDX-1.7-SBOM-Erzeugung und Parserprüfung;
- Health- und Persistenzprüfung aller fünf lokalen Infrastrukturservices;
- Mailpit 1.30.7 als Upstream- und finales lokales Image ohne High/Critical;
- PostgreSQL-, Keycloak- und MinIO-Funde exakt inventarisiert, Promotion
  verboten und bis 2026-08-19 befristet. Jeder Drift blockiert.
- Corepack-/pnpm-Auflösung und Lint auf einem frischen Linux-amd64-Runner ohne
  vorinstallierten pnpm-Shim reproduziert.

Der Workflow pusht, publiziert und deployt nichts. Reale Provider-, Voice-,
Textback-, Payment- und Produktionspfade bleiben deaktiviert.

## Reviewgrenze und Owner-Nachweis

Die Implementierung und der gehostete Lauf sind reviewbereit, aber `G1` bleibt
bis zum Repository-Ruleset offen. Der erste Lauf hat die nun kontrollierten
Upstream-Funde sichtbar gemacht; der korrigierte Lauf ist vollständig grün.

- Grüner Nachweis:
  [GitHub Actions Run 31616117821](https://github.com/MertDurasi/ai-voice-agent/actions/runs/31616117821),
  Commit `4de91a9`, einschließlich `CI / Merge gate`.
- Offen: `main`-Ruleset mit `CI / Merge gate` als Required Check und ohne
  Admin-Bypass.

Vor `done` benötigt der Repository-Owner noch:

1. einen `main`-Ruleset mit diesem Required Check, aktuellem Branch, ohne
   Admin-Bypass, Force-Push oder Branch-Löschung;
2. den Link oder Screenshot des aktiven Rulesets als Gate-Nachweis.

Der vorhandene fremde Arbeitsbaumstand in `apps/web/next-env.d.ts` wurde nicht
bereinigt oder als Taskartefakt beansprucht.
