# ADR-011 – Unterstützte Runtime- und Toolchain-Versionen

- Status: accepted
- Datum: 2026-08-09
- Entscheider: Engineering
- Ersetzt: –
- Ersetzt durch: –
- Task: `F-001`

## Kontext

Ein frischer Checkout soll reproduzierbar bauen. Ungeprüfte Major-Upgrades und
offene Versionsbereiche würden Lockfile, CI und lokale Ergebnisse auseinander
laufen lassen. Gleichzeitig müssen Runtime und Frameworks sicherheitsgepflegt
und gegenseitig kompatibel sein.

Am Entscheidungsdatum ist Node.js 24 die aktuelle LTS-Linie. Node 22 ist zwar
noch Maintenance LTS, für ein neues Repository wird aber die längere
Supportperspektive von Node 24 gewählt. TypeScript 7.0.2 ist bereits im Registry
verfügbar, wird jedoch nicht übernommen: `typescript-eslint` 8.66.0 deklariert
TypeScript nur bis `<6.1.0` als kompatibel.

## Entscheidung

| Baustein | gelockte Version | Begründung |
|---|---:|---|
| Node.js | `24.18.0` | aktuelle LTS-Baseline; erfüllt NestJS-, Next.js-, ESLint-, Turbo- und Vitest-Engines |
| pnpm | `11.20.0` | exakter Package-Manager über `packageManager` und Lockfile |
| Turborepo | `2.10.9` | Workspace-Orchestrierung ohne zusätzliche Buildplattform |
| TypeScript | `6.0.3` | aktuellste mit der gelockten TypeScript-ESLint-Linie kompatible Version |
| ESLint / typescript-eslint | `9.39.5` / `8.66.0` | aktuelle gemeinsame Kompatibilitätslinie von Next-Plugins und TypeScript-ESLint; Flat Config |
| Prettier | `3.9.6` | deterministische, vom Linter getrennte Formatierung |
| Vitest | `4.1.10` | ein Test-Runner für TypeScript-Skeletons und Tooling |
| NestJS | `11.1.28` | aktuelle Majorlinie; Node >=20 erforderlich |
| Next.js / React | `16.3.0` / `19.2.8` | App Router und aktuelle stabile React-Linie |
| Tailwind CSS | `4.3.3` | minimale PostCSS-Integration für das Web-Skeleton |

Alle direkten Abhängigkeiten verwenden exakte Versionen. Das
`pnpm-lock.yaml` ist die vollständige transitive Auflösung; Installationen in
Review/CI verwenden `--frozen-lockfile`. `.nvmrc` und `.node-version` pinnen
dieselbe Node-Patchversion, `engines` lehnt andere Majors ab.

## Upgrade-Politik

- Keine ungeprüften Major-Upgrades innerhalb einer Produktphase.
- Security-/Bugfix-Patches werden in einer eigenen Task mit vollständigem
  `lint`, `typecheck`, `test`, `build` und Architekturtest aktualisiert.
- Review spätestens alle acht Wochen, unmittelbar bei Security Advisory sowie
  sechs Monate vor EOL der Node-Linie.
- Jede Änderung aktualisiert ADR, Runtime-Dateien, direkte Paketversionen und
  Lockfile atomar. Automatische Dependency-PRs dürfen keine Gates umgehen.
- TypeScript 7 und ESLint 10 werden erst nach offizieller Kompatibilität aller
  eingesetzten Plugins und grüner Migrationssuite bewertet.

## Konsequenzen

Der Build ist absichtlich strenger als ein beliebiges lokales Node-Setup.
Entwickelnde müssen Node `24.18.0` verwenden. Der Preis der exakten Pins ist ein
regelmäßiger, bewusster Patchprozess; dafür sind Installationen und Fehlerbilder
reproduzierbar.

Die Wahl entscheidet keine Provider-, Datenbank-, Cloud- oder
Realanbieterintegration und ändert `ADR-012` nicht.

## Verifikation und Quellen

- [Node.js Release-Linien und LTS-Status](https://nodejs.org/en/about/previous-releases)
- [Next.js 16 – Installation und Mindestversionen](https://nextjs.org/docs/app/getting-started/installation)
- [NestJS 11 – Migration und Node-Anforderung](https://docs.nestjs.com/migration-guide)
- Exakte Versionen und Engines: öffentliche npm-Registry-Metadaten, abgerufen
  am 2026-08-09; Lockfile ist der maschinenlesbare Nachweis.
