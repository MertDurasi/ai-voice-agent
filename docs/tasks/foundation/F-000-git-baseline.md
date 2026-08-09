---
id: F-000
title: Minimale lokale Git-Basis
phase: foundation
status: done
priority: P0
owner: Engineering
dependencies: []
gate: pre-G0-administrative
outputs: [.gitignore, local-git-repository]
completed_at: 2026-08-08
---

# F-000 – Minimale lokale Git-Basis

## Ziel und Nutzen

Vor weiteren Discovery-Änderungen eine lokale Vergleichsbasis schaffen, damit
die in `AGENTS.md` geforderte Statusprüfung ausführbar ist. Diese administrative
Task zieht keine Toolchain oder Anwendungsteile aus `F-001` vor.

## Scope

- lokales Git-Repository mit Branch `main` initialisieren;
- Ignore-Regeln für Betriebssystem, IDE, Secrets, Node.js, Python, Builds,
  lokale Datenbanken, Service-Volumes, Logs und temporäre Dateien anlegen;
- globale Git-Konfiguration unverändert lassen;
- noch keinen Commit erzeugen, solange keine persönliche `user.email`
  festgelegt ist.

## Nicht im Scope

- Remote, Commit, Push oder Branch-Protection;
- pnpm, Turborepo, Apps, CI, Runtime-Versionen oder Architekturtests;
- Secrets, echte Umgebungsdateien oder lokale Daten erzeugen.

## Akzeptanz und Verifikation

- [x] `git rev-parse --is-inside-work-tree` liefert `true`.
- [x] `HEAD` zeigt auf `main`.
- [x] Es existiert noch kein Commit.
- [x] `.gitignore` deckt alle im Scope genannten Artefaktklassen ab.
- [x] Keine lokale oder globale Git-E-Mail wurde erfunden oder verändert.

## Abschlussnachweis

- `git rev-parse --is-inside-work-tree`: `true`
- symbolischer `HEAD`: `main`
- Commitanzahl: `0`
- Ignore-Proben für `.env`, `node_modules`, `.venv`, PostgreSQL-Daten, Logs und
  Cache: alle wirksam
- kein Remote, Commit sowie keine lokale oder globale `user.email` angelegt
