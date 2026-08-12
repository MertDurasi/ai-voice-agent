# KI-Telefonassistent für Handwerksbetriebe

Mandantenfähiger Voice-first-SaaS-Assistent für eingehende Anrufe. Der
begrenzte Voice-Agent nimmt als primärer Pfad ab, macht sich zu Beginn als KI
erkennbar, bearbeitet höchstens drei validierte Intents und übergibt sicher an
einen Menschen. Textback gehört zum selben MVP und dient nur als ausdrücklich
freigegebene Fortsetzung oder als kontrollierter Fallback.

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
- Git. Ein Providerkonto ist nicht nötig.

Ein frischer Checkout benötigt genau einen Installationsbefehl:

```bash
corepack pnpm install --frozen-lockfile
cp .env.example .env
```

Danach prüft die vollständige Foundation:

```bash
corepack pnpm ci:policy
corepack pnpm dependency:scan
corepack pnpm ci:quality
```

Die Details zu Required Check, SBOM, Scans, Migrations-Guard und kurzlebigen
CI-Artefakten stehen im
[CI- und Supply-Chain-Vertrag](docs/operations/ci-supply-chain.md). Der erste
GitHub-Lauf und der verpflichtende Branch-Ruleset bleiben Owner-Schritte; der
Workflow selbst deployt nichts.

`corepack pnpm dev` startet die drei providerfreien App-Basen. API-Vertrag,
Health-Endpunkte, OpenAPI, Request-ID, Worker-Readiness und Shutdown sind in der
[Application-Runtime](docs/operations/application-runtime.md) dokumentiert.
Aktuell existieren weder reale Provideradapter noch externe Egress-Pfade.
Die Konfiguration wird pro App typisiert und fail-fast geprüft; lokale Werte
bleiben synthetisch. Klassifikation und spätere Rotation sind im
[Secret-Leitfaden](docs/security/configuration-and-secrets.md) dokumentiert.
Die `db:*`-Befehle bleiben bis `T-003` als fail-closed Guards sichtbar. Die
lokale Infrastruktur ist unter
[infra/compose](infra/compose/README.md) dokumentiert; Datenbankmigrationen und
Seeds bleiben bis `T-003` fail-closed. Runtime-Smokes laufen mit kurzlebigen
synthetischen Loopback-Abhängigkeiten und benötigen keine geöffneten
Containerports.

Aktuell in `Now`: Engineering hat
[F-005 – CI und Supply Chain](docs/tasks/foundation/F-005-ci-supply-chain.md)
lokal umgesetzt; der erste grüne GitHub-Lauf und der Required Ruleset stehen im
Review noch aus. Der Product-Owner-Track zieht
[PO-001 – Probleminterviews](docs/tasks/product-owner/PO-001-problem-interviews.md).
`PO-002` und `PO-003` folgen wegen des Product-WIP-Limits nacheinander.

## Verbindliche Produktgrenze

Das Zielbild ist: Der Assistent beantwortet einen eingehenden Anruf transparent,
erledigt einen eng begrenzten Auftrag oder übergibt sicher an einen Menschen.
Wenn der Anrufer es ausdrücklich wünscht und der Kanal separat freigegeben ist,
setzt Textback denselben Vorgang fort. Voice, Formular und Textback erzeugen
idempotent höchstens einen nachvollziehbaren Lead. Bis zu den jeweiligen Gates
ist ausschließlich der synthetische Fake-/Replay-Pfad erlaubt; Providerkonten,
echte Calls/Nachrichten, Zahlungen und Produktion bleiben deaktiviert.

## Historie

[`master.md`](master.md) ist die ursprüngliche Umsetzungsbaseline v1.0. Die
inhaltlich gepflegte und ausführbare Struktur befindet sich unter `docs/`.
