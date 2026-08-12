# Technologiestack und Repository-Zielbild

Versionen sind in
[ADR-011](../adr/ADR-011-supported-versions.md) auf unterstützte, miteinander
kompatible Releases festgelegt und werden im Lockfile reproduzierbar
aufgelöst. Während einer Produktphase finden keine ungeprüften Major-Upgrades
statt.

## Zielstack

| Bereich | Festlegung |
|---|---|
| Monorepo | pnpm Workspaces + Turborepo |
| API | Node.js LTS, TypeScript strict, NestJS, REST/OpenAPI |
| Web | Next.js App Router, React, Tailwind, zugängliche Komponenten |
| Worker | NestJS Standalone Application Context + BullMQ |
| Datenbank | PostgreSQL, Drizzle ORM, SQL-Migrationen für RLS/Policies |
| Queue/Cache | Redis + BullMQ; ausschließlich transient |
| Identity | Keycloak, OIDC Authorization Code + PKCE |
| Objektablage | S3-kompatibel; MinIO lokal/VPS, EU-Speicher später |
| E-Mail | EmailPort, Mailpit lokal, später freigegebener EU-ESP |
| Telefonie | TelephonyPort, Fake/Replay, danach ein Pilotprovider |
| Voice Runtime | Ports für Call Control/Media, STT, DialogModel und TTS; Build-vs-Buy, Prozessgrenze, Sprache und Framework erst durch `V-001`/ADR |
| Messaging | MessagingPort, Fake, danach WhatsApp-BSP oder SMS-Anbieter |
| Verträge | OpenAPI als Quelle, generierter TS-Webclient |
| Tests | Vitest, Testcontainers, Supertest, Playwright, MSW |
| Observability | OpenTelemetry, Prometheus-Metriken, JSON-Logs, Sentry optional |
| Deploy | Caddy, Docker Compose, OCI Images |
| IaC | Terraform ab Staging/Cloud; kein Kubernetes im MVP |

## Zielstruktur

```text
.
├── AGENTS.md
├── README.md
├── apps/
│   ├── api/src/modules/{tenancy,onboarding,telephony,textback,
│   │                    conversations,leads,notifications,billing,
│   │                    compliance,admin}/
│   ├── worker/
│   ├── web/
│   └── <voice-runtime?>/           # nur falls V-001 eine getrennte Runtime begründet
├── packages/{config,contracts,db,observability,testing,ui}/
├── infra/{compose,caddy,monitoring,terraform}/
├── docs/
├── scripts/
└── .github/workflows/
```

`F-001` erzeugt nur die zu diesem Zeitpunkt benötigten Skeletons. Leere
Zukunftsmodule werden nicht als vermeintliche Implementierung angelegt.
`ADR-013` entscheidet Voice-first, aber weder Python noch einen separaten
Service. `V-001` muss Laufzeit, Anbieter, Exitplan und Contract-Suite zuerst
reproduzierbar begründen.

## Root-Skripte

```text
dev, build, lint, typecheck, test, test:integration, test:e2e,
db:migrate, db:seed, compose:up, compose:down
```

Ein frischer Checkout benötigt nur dokumentierte Voraussetzungen und einen
Setup-Befehl. Lockfile, Runtime-Version und Konfiguration sind reproduzierbar.
