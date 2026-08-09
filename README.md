# KI-Telefonassistent für Handwerksbetriebe

Mandantenfähiger SaaS-Assistent für verpasste Anrufe. Die erste verkaufbare
Ausbaustufe ist bewusst ein zuverlässiger Textback-Workflow; Voice folgt nur
nach nachgewiesener Nachfrage und dem Gate `G7`.

## Einstieg

1. [Projektübersicht](docs/README.md)
2. [Arbeitsmodell für Codex und Menschen](AGENTS.md)
3. [Roadmap und Phasen](docs/project/roadmap.md)
4. [Task-Index](docs/tasks/README.md)
5. [Aktueller Gate-Status](docs/project/gate-status.md)

## Lokales Setup

Voraussetzungen:

- Node.js `24.18.0` gemäß `.nvmrc`/`.node-version`;
- das mit Node ausgelieferte Corepack;
- Git. Ein Remote, Providerkonto oder `.env` ist für `F-001` nicht nötig.

Ein frischer Checkout benötigt genau einen Installationsbefehl:

```bash
corepack pnpm install --frozen-lockfile
```

Danach prüft die vollständige Foundation:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

`corepack pnpm dev` ruft die Entwicklungsbefehle der drei Skeletons auf; die
dauerhaften Health-/Runtime-Verträge folgen in `F-004`. Aktuell existieren
weder reale Provideradapter noch externe Egress-Pfade.
Die Zielbefehle `compose:*` und `db:*` sind bereits als fail-closed Guards
sichtbar und werden erst in `F-002` beziehungsweise `T-003` implementiert.

Aktuell in `Now`: Engineering hat
[F-001 – Repository und Toolchain](docs/tasks/foundation/F-001-repository-toolchain.md)
abgeschlossen und zieht als Nächstes
[F-002 – Lokale Infrastruktur](docs/tasks/foundation/F-002-local-infrastructure.md);
der Product-Owner-Track zieht
[PO-001 – Probleminterviews](docs/tasks/product-owner/PO-001-problem-interviews.md).
`PO-002` und `PO-003` folgen wegen des Product-WIP-Limits nacheinander.

## Verbindliche Produktgrenze

Das Zielbild ist: Ein verpasster Anruf erzeugt nach Kanal-, Rechts- und
Providerfreigabe zuverlässig und höchstens einmal eine minimale Rückmeldung;
der Anrufer kann sein Anliegen datensparsam erfassen und der Betrieb erhält
einen nachvollziehbaren Lead. Bis dahin ist ausschließlich der synthetische
Fake-/Replay-Pfad freigegeben. Provider-, Nachrichten-, Voice-, Zahlungs- und
Produktionsaktionen bleiben deaktiviert.

## Historie

[`master.md`](master.md) ist die ursprüngliche Umsetzungsbaseline v1.0. Die
inhaltlich gepflegte und ausführbare Struktur befindet sich unter `docs/`.
