# Beitragen

## Lokales Setup

Voraussetzungen und Befehle stehen im [Root-README](README.md). Änderungen
werden taskweise umgesetzt; `AGENTS.md` und der jeweilige Task-Vertrag sind
verbindlich.

## Commit-Konvention

Commitnachrichten folgen Conventional Commits:

```text
<type>(<optionaler-scope>): <imperativische zusammenfassung>
```

Zulässige Standardtypen sind `feat`, `fix`, `docs`, `refactor`, `test`,
`build`, `ci`, `chore`, `perf` und `revert`. Breaking Changes erhalten `!` oder
einen `BREAKING CHANGE:`-Footer. Beispiele:

```text
build(repo): initialize pnpm workspace
docs(compliance): document textback blockers
```

Eine einzelne Nachricht kann vor dem Commit geprüft werden:

```bash
printf '%s\n' 'build(repo): initialize workspace' | pnpm commitlint
```

Es werden keine Hooks installiert, die lokale Nutzerkonfiguration verändern.
CI kann dieselbe Regel später in `F-005` erzwingen.
