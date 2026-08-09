---
id: F-005
title: CI-Baseline und Supply Chain
phase: foundation
status: blocked
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

- [ ] Defekter Test, Typfehler und Migrationsdrift blockieren Merge.
- [ ] Undokumentiertes Critical Finding blockiert Merge.
- [ ] CI nutzt Frozen Lockfile, minimale Rechte und gepinnte Referenzen.
- [ ] SBOM und relevante Reports sind nachvollziehbare Artefakte ohne Secrets.
- [ ] Negativfixtures beweisen die wichtigsten Blockierregeln.

Gate-Nachweis: sauberer Setup-Lauf, alle Apps healthy, CI grün und kein Secret
im Repo. Keine automatische Produktionsauslieferung hinzufügen.
