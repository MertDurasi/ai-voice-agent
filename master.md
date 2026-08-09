Codex-Ausführungsroadmap – KI-Telefonassistent für Handwerksbetriebe

> **Historische Baseline v1.0:** Dieses Dokument bleibt als unveränderte
> inhaltliche Ausgangsquelle erhalten. Die gepflegte Projektstruktur beginnt in
> [`README.md`](README.md), die ausführbaren Einzelaufgaben stehen in
> [`docs/tasks/README.md`](docs/tasks/README.md), und der verbindliche aktuelle
> Gate-Status steht in
> [`docs/project/gate-status.md`](docs/project/gate-status.md).

Dokumentstatus: Umsetzungsbaseline v1.0Stand: 07.08.2026Arbeitsmodell: Solo-/Kleinteam, ca. 20 Stunden pro WocheProduktstrategie: Textback zuerst, Voice erst nach belegter NachfrageArchitekturstrategie: Mandantenfähiger modularer Monolith, eventgetriebene Nebenläufigkeit, später selektiv extrahierbare Services

0. Zweck dieses Dokuments

Diese Roadmap ist die verbindliche Arbeitsanweisung für Codex. Sie übersetzt die vorhandene Architekturidee in kleine, prüfbare und sequenziell ausführbare Arbeitspakete. Codex soll nicht „die ganze Anwendung auf einmal“ erzeugen, sondern immer genau das nächste freigegebene Arbeitspaket implementieren, testen, dokumentieren und erst danach fortfahren.

Das erste verkaufbare Produkt ist kein vollständiger Voice-Agent, sondern folgende vertikale Scheibe:

Ein Handwerksbetrieb verbindet eine Rufnummer. Ein verpasster Anruf erzeugt zuverlässig und genau einmal eine zulässige WhatsApp- oder SMS-Rückmeldung. Der Anrufer kann sein Anliegen datensparsam erfassen. Der Betrieb sieht daraus einen Lead und wird benachrichtigt. Nutzung, Zustellung, Einwilligungs-/Rechtsgrundlage und Löschfristen sind nachvollziehbar.

0.1 Was Codex bei jeder Aufgabe tun muss

AGENTS.md, dieses Dokument, relevante ADRs und den aktuellen Git-Status lesen.

Nur Aufgaben mit erfüllten Abhängigkeiten bearbeiten.

Vor Änderungen betroffene Module, Datenflüsse und Risiken benennen.

Erst Tests bzw. Akzeptanzfälle festlegen, dann implementieren.

Keine fremden Provider-APIs direkt in Domänenlogik importieren.

Keine Secrets, echten Telefonnummern oder personenbezogenen Testdaten einchecken.

Lint, Typprüfung, Unit- und relevante Integrationstests ausführen.

Dokumentation, OpenAPI-Spezifikation, Migrationen und Beispielkonfiguration gemeinsam mit dem Code aktualisieren.

Ergebnis, ausgeführte Prüfungen, offene Risiken und den nächsten Task berichten.

Nicht automatisch nach Produktion deployen, keine Zahlungen auslösen und keine echten Nachrichten versenden, sofern dies nicht ausdrücklich freigegeben wurde.

0.2 Stop-Regeln

Codex stoppt und fragt nach einer Entscheidung, wenn mindestens einer dieser Fälle eintritt:

Ein Anbieter, Tarif, Datenstandort oder Vertragsmodell muss verbindlich ausgewählt werden.

Ein echter Account, API-Key, eine Rufnummer, Domain oder Zahlungsart wird benötigt.

Eine Änderung könnte reale Kunden kontaktieren, Kosten erzeugen oder Daten löschen.

Die Rechtsgrundlage, Einwilligungslogik oder Aufbewahrungsfrist ist nicht fachlich freigegeben.

Eine Migration ist destruktiv oder nicht sicher rückwärtskompatibel.

Ein Akzeptanzkriterium widerspricht einem ADR oder einer Sicherheitsleitplanke.

1. Produktvision, Zielgruppe und Erfolgskriterien

1.1 Problem

Kleine und mittlere Handwerksbetriebe verlieren Aufträge, weil Anrufe während Einsätzen nicht angenommen werden. Rückrufe erfolgen zu spät, Informationen fehlen und Leads werden nicht strukturiert verfolgt.

1.2 Primäre Zielgruppe für den MVP

Betriebe mit 2–30 Mitarbeitenden

Start mit genau einem Gewerk, bevorzugt SHK oder Elektro

Hoher Anteil eingehender mobiler Anfragen

Kein oder nur einfaches CRM

Deutschland als erster Markt, Oberfläche und Dialoge zunächst Deutsch

1.3 Kern-Jobs-to-be-done

Betriebsinhaber: „Wenn ich einen Anruf verpasse, möchte ich automatisch und seriös reagieren, damit der Auftrag nicht zur Konkurrenz geht.“

Anrufer: „Wenn niemand erreichbar ist, möchte ich sofort wissen, wie es weitergeht, ohne eine App installieren zu müssen.“

Büro/Disposition: „Ich möchte alle Anfragen mit Dringlichkeit und Kontaktdaten an einer Stelle sehen und bearbeiten.“

1.4 North-Star- und Guardrail-Kennzahlen

Kennzahl

Definition

MVP-Ziel / Gate

Aktivierung

Tenant hat Rufnummer verbunden, Testereignis verarbeitet und Textback aktiviert

≥ 70 % der gestarteten Onboardings

Time-to-Value

Zeit von Tenant-Erstellung bis erfolgreichem Test-Textback

Median < 20 Minuten

Textback-Latenz

missed_call_received bis Provider-Accept

p95 < 60 Sekunden

Zustellquote

zugestellte Nachrichten / akzeptierte Nachrichten

messen; providerbereinigt auswerten

Lead-Conversion

qualifizierte Formularantworten / zugestellte Textbacks

Pilotbaseline erheben, danach Ziel festlegen

Fehlerhafte Duplikate

doppelte Nachricht für dasselbe Ereignis

0 toleriert

Tenant-Isolation

automatisierte Cross-Tenant-Zugriffe

0 toleriert

Supportlast

Supportzeit je aktivem Tenant und Monat

vor Voice < 60 Minuten

Bruttomarge

Umsatz minus variable Provider-/AI-Kosten

Textback-Ziel > 70 %

Churn

gekündigte zahlende Tenants / aktive Tenants pro Monat

Gate < 5 %, erst bei sinnvoller Stichprobe

1.5 MVP-In-Scope

Multi-Tenant-Onboarding, Benutzer und Rollen

Eine verbundene Rufnummer pro Tenant, später mehrere

Ein Telefonieadapter und dessen Webhooks für verpasste Anrufe

WhatsApp oder SMS als Primärkanal, zweiter Kanal nur als kontrollierter Fallback

Regel-/Template-basierter Textback ohne generative KI im kritischen Versandpfad

Öffentliches, tokenisiertes Kurzformular

Lead-Inbox, Detailansicht, Status und interne Notizen

E-Mail-Benachrichtigung an den Betrieb

Plan/Subscription und belastbares Usage-Ledger; echte Abrechnung erst nach Freigabe

Audit, Löschung, Export, Basis-Observability und Backups

1.6 Explizit nicht im MVP

Vollständiger Voice-Agent

Gesprächsaufzeichnungen

Generative freie Antworten an Endkunden

Mobile Native App

Kubernetes oder Microservice-Landschaft

Mandantenspezifische Custom-Deployments

Vollständiges CRM, Angebots- oder Rechnungswesen

Mehrsprachigkeit

Kalender-Schreibzugriff, bevor Lead-Fluss und Nachfrage validiert sind

2. Verbindliche Architekturentscheidungen

Jede Änderung an diesen Punkten benötigt ein ADR unter docs/adr/.

ADR

Entscheidung

Konsequenz

ADR-001

Modularer Monolith für API und Worker

Domänenmodule sind logisch getrennt, werden aber zunächst gemeinsam versioniert und deployt.

ADR-002

tenant_id plus PostgreSQL Row-Level Security

Isolation wird in Anwendung und Datenbank erzwungen.

ADR-003

Transactional Outbox und Webhook Inbox

Kein wichtiges Event verlässt sich nur auf In-Memory-Events oder „best effort“.

ADR-004

Ports & Adapter für alle externen Anbieter

Provider-SDKs dürfen nur in Adapterpaketen vorkommen.

ADR-005

REST /api/v1 plus OpenAPI; Webhooks separat

Frontend und Integrationen nutzen versionierte Verträge.

ADR-006

Keycloak via OIDC als Identity Provider

Keine selbst entwickelte Passwortspeicherung; MFA für privilegierte Rollen.

ADR-007

PostgreSQL als Source of Truth, Redis nur transient

Queue-/Cache-Verlust darf keine fachlichen Datensätze vernichten.

ADR-008

Aufzeichnung standardmäßig aus

Roh-Audio wird ohne separat freigegebenen Zweck und Rechtsgrundlage nicht gespeichert.

ADR-009

Textback vor Voice

Voice-Arbeiten beginnen erst nach Gate G6.

ADR-010

Cloud-/Provider-Neutralität nur an sinnvollen Ports

Keine abstrakte „Universalplattform“; abstrahiert werden reale Wechselrisiken.

2.1 Korrektur einer wichtigen Compliance-Annahme

Sprachaufnahme ist personenbezogen, aber nicht automatisch eine besondere Kategorie „biometrischer Daten“ nach Art. 9 DSGVO. Biometrische Daten setzen eine spezifische technische Verarbeitung körperlicher, physiologischer oder verhaltensbezogener Merkmale voraus; Art. 9 greift insbesondere bei biometrischen Daten zur eindeutigen Identifizierung. Für normale Transkription und Dialogverarbeitung bleiben dennoch Rechtsgrundlage, Transparenz, Datenminimierung, Auftragsverarbeitung, Löschung und gegebenenfalls eine Datenschutz-Folgenabschätzung zu prüfen. Das Produkt darf keine Sprecheridentifikation, Voiceprints oder Emotionserkennung einführen, ohne einen neuen Rechts-, Risiko- und Architekturentscheid.

2.2 Modulgrenzen

Modul

Besitzt

Darf nicht besitzen

Identity/Tenancy

Tenant, Membership, Rolle, Tenant-Kontext

Provider-Accounts, Leads

Onboarding/Config

Betriebsprofil, Öffnungszeiten, Rufnummerkonfiguration, Templates

Zustellstatus, Abrechnung

Telephony

Call, CallEvent, Telefonie-Port

Nachrichtenversand

Textback

Triggerregeln, TextbackAttempt, Auswahl des Kommunikationskanals

Provider-SDK

Conversations

Conversation, Message, Zustellzustand

Tenant-Authentifizierung

Leads

Lead, Status, Notiz, Assignment

Telefonie-Webhookvalidierung

Notifications

E-Mail-/Messaging-Ports und Versandorchestrierung

Lead-Fachregeln

Billing

Plan, Subscription, UsageRecord, Preis-Snapshot

Stripe-SDK außerhalb Adapter

Compliance

ConsentEvidence, RetentionPolicy, ErasureRequest, AuditEvent

Beliebige Providerlogik

Admin/Ops

Supportzugriff, Feature Flags, Betriebsaktionen

Umgehung von Audit und Tenant-Isolation

2.3 Erlaubte Kommunikation

Synchron innerhalb eines Use Cases: explizite Application-Service-Ports.

Asynchron für Nebenwirkungen: persistierte Domain Events über Outbox → BullMQ.

Keine direkten Repository-Aufrufe über Modulgrenzen.

Keine zyklischen Modulabhängigkeiten.

Gemeinsame Pakete enthalten nur technische Querschnittsfunktionen oder stabile Verträge, keine „shared business logic“-Ablage.

3. Ziel-Technologiestack

Versionen werden bei Initialisierung auf aktuelle, unterstützte Releases festgelegt, gelockt und in docs/adr/ADR-011-version-policy.md dokumentiert. Keine ungeprüften Major-Upgrades während einer Produktphase.

Bereich

Festlegung

Monorepo

pnpm Workspaces + Turborepo

API

Node.js LTS, TypeScript strict, NestJS, REST/OpenAPI

Web

Next.js App Router, React, Tailwind, zugängliche Komponentenbibliothek

Worker

NestJS Standalone Application Context + BullMQ

Datenbank

PostgreSQL, Drizzle ORM für typisierte Queries, SQL-Migrationen für RLS/Policies

Queue/Cache

Redis + BullMQ

Identity

Keycloak, OIDC Authorization Code + PKCE

Objektablage

S3-kompatibel; MinIO lokal/VPS, EU Object Storage später

E-Mail

EmailPort, lokaler Mailpit-Adapter, später ausgewählter EU-ESP

Telefonie

TelephonyPort, Fake-/Replay-Adapter, danach genau ein Pilotprovider

Messaging

MessagingPort, Fake-Adapter, danach WhatsApp-BSP oder SMS-Anbieter

API-Verträge

OpenAPI als Quelle; generierter TypeScript-Client für Web

Tests TS

Vitest, Testcontainers, Supertest, Playwright, MSW

Observability

OpenTelemetry, Prometheus-kompatible Metriken, strukturierte JSON-Logs, Sentry optional

Proxy/Deploy

Caddy, Docker Compose, OCI Images

IaC

Terraform erst für Staging/Cloud; kein Kubernetes im MVP

Voice später

Python 3.x, uv, Ruff, mypy, pytest, LiveKit Agents oder Pipecat nach Spike

3.1 Ziel-Repository

.
├── AGENTS.md
├── README.md
├── CODEX_ROADMAP_KI_TELEFONASSISTENT.md
├── apps/
│   ├── api/
│   │   └── src/modules/{tenancy,onboarding,telephony,textback,conversations,leads,notifications,billing,compliance,admin}/
│   ├── worker/
│   ├── web/
│   └── voice-agent/                 # erst Phase V1
├── packages/
│   ├── config/
│   ├── contracts/
│   ├── db/
│   ├── observability/
│   ├── testing/
│   └── ui/
├── infra/
│   ├── compose/
│   ├── caddy/
│   ├── monitoring/
│   └── terraform/                   # ab Staging
├── docs/
│   ├── adr/
│   ├── architecture/
│   ├── compliance/
│   ├── product/
│   └── runbooks/
├── scripts/
└── .github/workflows/

3.2 Modulinterne Struktur

<module>/
├── domain/          # Aggregate, Value Objects, Domain Events; frameworkfrei
├── application/     # Use Cases, Ports, Commands/Queries
├── adapters/
│   ├── inbound/     # REST, Webhook, Queue Consumer
│   └── outbound/    # DB, Provider, Queue Producer
└── module.ts        # NestJS-Komposition

Domänen- und Application-Code importieren weder NestJS-Controller noch ORM-Modelle oder Provider-SDKs. ESLint Boundary Rules und Architekturtests erzwingen das.

4. Fachliche Daten- und Zustandsmodelle

4.1 Mindestspalten jeder mandantenbezogenen Tabelle

id UUIDv7/UUID
tenant_id UUID NOT NULL
created_at timestamptz NOT NULL
updated_at timestamptz NOT NULL
version integer NOT NULL              # optimistische Nebenläufigkeit, wo relevant

PII-Felder werden klassifiziert. Telefonnummern werden normalisiert (E.164), für Suche deterministisch gehasht und in Logs maskiert. Verschlüsselung auf Feldebene wird für ausgewählte Inhalte nach Threat Model umgesetzt; Schlüssel liegen nicht in derselben Datenbank.

4.2 Verbindliche Zustandsautomaten

Call: received → ringing → answered | missed | failed → completedMessage: planned → queued → provider_accepted → delivered | failed | suppressedTextbackAttempt: eligible → scheduled → sent | suppressed | exhaustedLead: new → contacted → qualified → won | lost | archivedSubscription: trialing → active → past_due → canceled | suspendedErasureRequest: requested → verified → processing → completed | rejected

Zustandswechsel erfolgen nur über Use Cases. Unzulässige Übergänge liefern einen stabilen Domain Error und erzeugen keinen Seiteneffekt.

4.3 Tenant-RLS-Muster

Anwendung verbindet sich mit einer DB-Rolle, die weder Tabellen-Owner noch BYPASSRLS ist.

Auf jeder Tenant-Tabelle: ENABLE ROW LEVEL SECURITY und FORCE ROW LEVEL SECURITY.

Pro Request/Job wird innerhalb einer DB-Transaktion SET LOCAL app.tenant_id = ... gesetzt.

Policies verwenden USING und WITH CHECK.

Systemjobs benötigen einen expliziten, auditierbaren Systempfad; kein globales stilles Bypass-Flag.

Migrationen testen automatisch, dass neue Tenant-Tabellen eine Policy besitzen.

Negativtests versuchen Lesen, Schreiben, Updaten und Löschen über Tenant-Grenzen hinweg.

4.4 Zuverlässige Ereignisverarbeitung

Webhook Inbox: Original-Event-Hash, Provider, Provider-Event-ID, Empfangszeit, Validierungsstatus und Verarbeitungsstatus. Eindeutiger Constraint auf (provider, provider_event_id) oder auf einen dokumentierten deterministischen Ersatzschlüssel.

Transactional Outbox: Fachänderung und Outbox-Event werden in derselben DB-Transaktion persistiert. Dispatcher publiziert in BullMQ; Consumer sind idempotent. Outbox-Datensätze werden erst nach bestätigter Publikation markiert und nach Retention bereinigt.

Idempotency: Jeder externe Schreibvorgang besitzt einen Idempotency Key. Retries nutzen exponentielles Backoff plus Jitter; permanente Fehler gehen in eine Dead-Letter Queue und erzeugen Alarm/Operations-Fall.

5. Globale Qualitäts-, Sicherheits- und Betriebsanforderungen

5.1 Definition of Done für jedes Arbeitspaket

Akzeptanzkriterien erfüllt und demonstrierbar

TypeScript strict ohne neue Ausnahmen; Python später mit Ruff/mypy sauber

Unit- und relevante Integrationstests vorhanden

Cross-Tenant- und Autorisierungstests bei Daten-/API-Änderungen

Migration vorwärts getestet; Rückwärtsstrategie dokumentiert

Keine High/Critical Findings im Dependency-/Container-Scan oder dokumentierte Ausnahme

Logs ohne Payloads, Tokens, unmaskierte Telefonnummern oder E-Mail-Adressen

Metriken und Correlation-/Trace-ID an neuen kritischen Pfaden

README/OpenAPI/Runbook/ADR aktualisiert

pnpm lint, pnpm typecheck, pnpm test, relevante E2E-Tests grün

Keine realen Provideraktionen ohne explizite Freigabe

5.2 Serviceziele für den gehärteten Textback

SLI

Ziel

API-Verfügbarkeit

99,5 % pro Monat im Pilot, später 99,9 %

Webhook-Annahme

p95 < 500 ms; Verarbeitung asynchron

Textback-Auslösung

p95 < 60 s nach validiertem Missed-Call-Event

Recovery Point Objective

≤ 24 h im internen Test, ≤ 1 h vor zahlendem Go-live

Recovery Time Objective

≤ 4 h im Pilot, später ≤ 1 h

Queue-Alter

Alarm bei ältestem Job > 2 min

5.3 Security Baseline

Secure/HttpOnly/SameSite-Cookies oder korrekt validierte Bearer Tokens; kein Token in Local Storage.

CSRF-Schutz für cookie-authentifizierte Mutationen.

CSP, HSTS, Referrer Policy, X-Content-Type-Options und restriktive CORS-Allowlist.

DTO-/Schema-Validierung mit Ablehnung unbekannter Felder.

Rate Limits je IP, Tenant und sensibler Operation.

Webhook-Signatur, Timestamp-/Replay-Prüfung und Raw-Body-Verifikation.

Kein öffentliches sequenzielles Lead-ID-Schema; Formularzugriff über kurzlebiges, gehasht gespeichertes Capability Token.

Least-Privilege-DB-Rollen, getrennte Migrations- und Runtime-Rollen.

SBOM, Secret Scan, Dependency Scan und Container Scan in CI.

Backupverschlüsselung und quartalsweiser Restore-Test; vor Go-live monatlich.

5.4 Datenschutz-/AI-Act-Arbeitspunkte

Dies ist eine technische Roadmap, keine Rechtsberatung. Vor dem Pilot sind Rechtsgrundlagen, Telekommunikations-/Direktmarketingregeln, WhatsApp-Opt-in, AV-Verträge und konkrete Ansagetexte fachanwaltlich bzw. durch Datenschutzberatung zu prüfen.

Verzeichnis der Verarbeitungstätigkeiten und Datenflusskarte

Rollenklärung Verantwortlicher/Auftragsverarbeiter je Datenfluss

Rechtsgrundlage je Zweck, nicht pauschal „Consent“

Datenschutz-Folgenabschätzungs-Screening, vor Voice erneut durchführen

Subprozessorregister, Datenstandort, Lösch- und Transfermechanismen

Transparenzhinweis bei direkter Interaktion mit einem KI-System

AI-Literacy-/Betriebsunterweisung für Personen, die das System betreiben

Keine Emotionserkennung, biometrische Kategorisierung oder Sprecheridentifikation ohne neue Freigabe

Aufzeichnung aus; Transkript und Nachrichteninhalt mit konfigurierbarer kurzer Retention

6. Ausführungsphasen und Arbeitspakete

Zeitangaben sind Netto-Entwicklungsaufwand bei etwa 20 h/Woche, keine Liefergarantien. Codex arbeitet strikt nach IDs und Abhängigkeiten.

Phase D – Discovery und verbindliche Entscheidungen (1–2 Wochen)

D-001 – Product Brief und Pilot-Hypothesen

Abhängigkeiten: keineErgebnis: docs/product/product-brief.md

Umsetzen:

Primäres Gewerk auswählen; SHK ist Default-Hypothese, aber keine automatische Festlegung.

Entscheider, Nutzer, Anrufer und Supportrolle beschreiben.

Top-5-Anrufgründe und Top-5-Not-/Dringlichkeitsfälle erfassen.

MVP-Funnel und Eventnamen festlegen.

Pilotangebot, Trial, Kündigung und Supportgrenzen als Hypothesen notieren.

Nicht-Ziele und manuelle Backoffice-Schritte explizit machen.

Akzeptanz: Product Brief enthält messbare Problem-, Segment-, Nutzen- und Pricing-Hypothesen sowie mindestens zehn Interviewfragen. Ungeklärte Punkte stehen in einer Decision Log und werden nicht als Fakten formuliert.

D-002 – Provider- und Machbarkeits-Spike

Abhängigkeiten: D-001Ergebnis: docs/product/provider-scorecard.md, ADR-012

Bewertungskriterien: deutsche Rufnummern, Missed-Call-Webhook, Signaturprüfung, Event-IDs, Sandbox, Portierung, SMS/WhatsApp, EU-Datenfluss, AVV, Preise, Support, SIP/Media-Streaming für spätere Voice-Nutzung, Exit-Möglichkeit.

Umsetzen:

Zwei Telefonieanbieter und zwei Messagingwege anhand derselben Tests vergleichen.

Beispielpayloads und Signaturverfahren dokumentieren, aber keine Secrets speichern.

Variable Kosten pro 100 verpassten Anrufen und pro aktivem Tenant modellieren.

Einen Pilotprovider und einen Messaging-Primärkanal als ADR vorschlagen.

Bei fehlender Freigabe mit Fake-/Replay-Adaptern weiterarbeiten.

Akzeptanz: Scorecard enthält belastbare Quellen, Preise mit Datum, Datenregion/Vertragsoffenheiten und ein nachvollziehbares Votum. Providerwahl wird vom Product Owner freigegeben.

D-003 – Datenschutz-, Rechts- und Abuse-Workshop

Abhängigkeiten: D-001, D-002Ergebnis: Datenflusskarte, Zweck-/Rechtsgrundlagenmatrix, Retention-Entwurf, Abuse Cases

Mindestszenarien: falsche Nummer, wiederverwendete Rufnummer, wiederholte Webhooks, unerwünschte Werbenachricht, Minderjährige, beleidigende Inhalte, Notfallmeldung, Auskunft/Löschung, Supportzugriff, Providerkompromittierung.

Akzeptanz: Jeder Datentyp hat Zweck, Owner, Zugriff, Speicherort und Löschfrist. Offene juristische Punkte blockieren nur den betroffenen Realbetrieb, nicht Fake-Adapter-Entwicklung.

Gate G0 – Discovery freigegeben

Gewerk, Pilotangebot und primärer Textback-Kanal sind entschieden.

Provider kann technisch die Kernereignisse liefern oder ein realistischer Replay-Datensatz liegt vor.

Keine ungeklärte Annahme wird als Rechtsfreigabe behandelt.

Phase F – Engineering-Fundament (2–3 Wochen)

F-001 – Repository und Toolchain initialisieren

Abhängigkeiten: G0Umsetzen: Git initialisieren, .gitignore, .editorconfig, pnpm/Turbo, Node-Version, TypeScript strict, Formatter, ESLint, Commit-Konvention, Workspace-Skripte, AGENTS.md, ADR-Template und Architekturtests.

Root-Skripte: dev, build, lint, typecheck, test, test:integration, test:e2e, db:migrate, db:seed, compose:up, compose:down.

Akzeptanz: Frischer Checkout benötigt nur dokumentierte Voraussetzungen und einen Setup-Befehl. Leeres API-/Web-/Worker-Skelett baut reproduzierbar. Lockfile ist committed.

F-002 – Lokale Infrastruktur

Abhängigkeiten: F-001Umsetzen: Compose für PostgreSQL, Redis, Keycloak, MinIO, Mailpit; Healthchecks; persistente benannte Volumes; isolierte Netze; Beispielkonfiguration; keine Default-Passwörter in Produktionsprofilen.

Akzeptanz: docker compose up wird healthy; Healthcheck-Skript prüft jede Abhängigkeit; Neustart verliert keine DB-Daten; Mailpit empfängt eine Testmail.

F-003 – Konfigurations- und Secret-Management

Abhängigkeiten: F-001Umsetzen: typisierte Env-Schemas pro App, Fail-fast bei fehlenden Variablen, .env.example ohne Geheimnisse, Trennung dev/test/staging/prod, Rotationshinweise.

Akzeptanz: Ungültige oder fehlende Konfiguration verhindert Start mit verständlicher, geheimnisfreier Meldung. Secret Scan erkennt absichtlich eingebrachten Canary-Key im CI-Testfixture.

F-004 – API-, Web- und Worker-Basis

Abhängigkeiten: F-002, F-003Umsetzen: /health/live, /health/ready, /api/v1; globale Fehlerstruktur; Request-ID; OpenAPI; Web-Shell; Worker-Bootstrap; Graceful Shutdown; UTC intern, Europe/Berlin nur Darstellung/Fachregeln.

Fehlervertrag: code, message, status, requestId, optionale validierte details; keine Stacktraces im Client.

Akzeptanz: Readiness reagiert auf DB/Redis-Ausfall; OpenAPI wird im CI auf Breaking Changes geprüft; SIGTERM beendet ohne neue Jobs anzunehmen.

F-005 – CI-Baseline und Supply Chain

Abhängigkeiten: F-001–F-004Umsetzen: Workflow für Install mit Frozen Lockfile, Lint, Typecheck, Unit, Integration, Build, Migrationstest, Secret-/Dependency-/Container-Scan, SBOM und Artefaktaufbewahrung.

Akzeptanz: Defekter Test, Typfehler, Drift in Migration oder Critical Finding blockiert Merge. CI verwendet minimale Berechtigungen und gepinnte Actions.

Gate G1 – Reproduzierbares Skelett

Setup auf sauberer Umgebung erfolgreich.

Alle Apps healthy, CI grün, keine Secrets im Repo.

Noch keine echte Providerkommunikation.

Phase T – Identity, Tenancy und Datenbasis (2–3 Wochen)

T-001 – Keycloak/OIDC integrieren

Abhängigkeiten: G1Umsetzen: Realm-/Client-Konfiguration als versionierbarer Export ohne Secrets, Authorization Code + PKCE, API JWT Validation, Web-Session, Rollen tenant_owner, tenant_admin, agent, viewer, interne support_admin separat.

Akzeptanz: Login/Logout/Refresh funktionieren; abgelaufene, falsch signierte und für falsche Audience ausgestellte Tokens werden abgelehnt; privilegierte Rolle kann MFA erzwingen.

T-002 – Tenant, Membership und Tenant-Kontext

Abhängigkeiten: T-001Umsetzen: Tenant-/Membership-Schema, Tenant-Auswahl, Guards, Context Propagation in HTTP und Jobs, unveränderliche Tenant-ID im Use Case.

Akzeptanz: Nutzer ohne Membership erhält 403; Tenant kann nicht über Header/Body manipuliert werden; jeder Logeintrag besitzt maskierte Actor- und Tenant-Korrelation.

T-003 – RLS-Baseline und DB-Rollen

Abhängigkeiten: T-002Umsetzen: Runtime-/Migration-Rollen, SET LOCAL, ENABLE/FORCE RLS, Policies, Testhelper und Schema-Linter.

Akzeptanztests:

Tenant A kann Datensätze von B weder lesen noch erraten.

Inserts mit fremder tenant_id schlagen fehl.

Updates/Deletes über Tenantgrenze schlagen fehl.

Connection-Pool-Leak-Test beweist, dass Tenant-Kontext nicht auf nächste Anfrage übergeht.

Tabellenowner- und Runtime-Rolle sind verschieden.

T-004 – Audit-Grundlage

Abhängigkeiten: T-002Umsetzen: append-only-orientiertes Audit Event mit Actor, Tenant, Aktion, Ressourcentyp/-ID, Zeit, Request-ID, Ergebnis; Payload-Allowlist statt Vollobjekt.

Akzeptanz: Rollenänderung, Login-relevante Adminaktion und Supportzugriff sind auditierbar; PII/Secrets fehlen; normale Tenant-Nutzer können Auditdatensätze nicht verändern.

Gate G2 – Isolation bewiesen

Automatisierte Cross-Tenant-Negativsuite grün.

Rollen-/Rechtematrix dokumentiert.

Security Review bestätigt, dass kein Client tenant_id autoritativ festlegt.

Phase O – Onboarding und Konfiguration (2 Wochen)

O-001 – Betriebsprofil und Geschäftszeiten

Abhängigkeiten: G2Umsetzen: Betriebsname, Gewerk, Kontaktkanäle, Zeitzone, Wochenplan, Ausnahmen/Feiertage, Eskalationskontakt; Value Objects und Validierung.

Akzeptanz: Öffnungsstatus ist für DST-Wechsel, Mitternacht, überlappende Intervalle und Feiertagsausnahme getestet.

O-002 – Rufnummernkonfiguration

Abhängigkeiten: O-001, D-002Umsetzen: Nummer E.164, Providerreferenz verschlüsselt/pseudonymisiert, Status pending_verification/active/suspended, Besitz-/Routing-Verifikation über Adapter.

Akzeptanz: Dieselbe Rufnummer kann nicht mehreren aktiven Tenants zugeordnet werden; Aktivierung benötigt erfolgreiche Verifikation; Änderungen werden auditiert.

O-003 – Nachrichten-Templates und Regeln

Abhängigkeiten: O-001Umsetzen: versionierte Templates, freigegebene Variablen, Vorschau, Längen-/Kanalvalidierung, Aktivierung, Sprache de-DE, Ruhezeiten und Suppression Rules.

Akzeptanz: Unbekannte Variablen oder unfreigegebene Templates werden nicht versendet; gerenderte Nachricht ist deterministisch und gegen Injection/Linkmanipulation abgesichert.

O-004 – Geführtes Onboarding

Abhängigkeiten: O-002, O-003Umsetzen: Schrittfolge Betrieb → Rufnummer → Nachricht → Test → Aktivierung; speicherbarer Fortschritt; verständliche Fehler und sichere Wiederaufnahme.

Akzeptanz: Neuer Tenant erreicht mit Fake-Adaptern in unter 10 Minuten einen erfolgreichen Test; unvollständiges Setup kann Textback nicht aktivieren.

Gate G3 – Tenant konfigurierbar

Onboarding-E2E erfolgreich.

Konfiguration ist versioniert, validiert und auditierbar.

Phase E – Telephony Event Ingestion (2–3 Wochen)

E-001 – TelephonyPort und Contract Fixtures

Abhängigkeiten: G3Umsetzen: kanonische Events CallStarted, CallAnswered, CallMissed, CallCompleted; Provider-Mapping; gespeicherte anonymisierte Fixtures; Fake-/Replay-Adapter.

Akzeptanz: Domänenmodul kennt kein Provider-SDK; Contract Tests laufen mit Fixtures; unbekannte Eventtypen werden sicher geparkt statt verworfen.

E-002 – Sicherer Webhook Endpoint

Abhängigkeiten: E-001Umsetzen: Raw Body, Signatur und Timestamp prüfen; IP-Allowlist nur als Zusatz; Größenlimit; schnelles 2xx nach persistenter Inbox-Aufnahme; Rate Limit; Replay-Schutz.

Akzeptanz: manipulierte, alte, zu große und doppelte Requests werden korrekt behandelt; Geheimnisse/Payloads erscheinen nicht in Logs; p95-Annahme im Integrationstest < 500 ms.

E-003 – Inbox, Call-Aggregat und Reihenfolge

Abhängigkeiten: E-002Umsetzen: Webhook Inbox; Upsert/State Machine für Call; Out-of-order-Events; Unique Constraints; Outbox MissedCallDetected.

Akzeptanz: 100 Wiederholungen desselben Events erzeugen genau einen Call und ein fachliches Event. completed vor missed sowie verspätete Events sind deterministisch getestet.

E-004 – Worker, Retries und DLQ

Abhängigkeiten: E-003Umsetzen: Outbox Dispatcher, Queue, Consumer Lease/Lock, Backoff/Jitter, maximale Versuche, Dead-Letter-Prozess, Requeue-Operationsbefehl mit Audit.

Akzeptanz: Prozessabbruch an jeder definierten Fehlerstelle verliert kein Event und erzeugt keine doppelte fachliche Wirkung; DLQ löst Alarm aus.

Gate G4 – Missed Call zuverlässig erkannt

Replay von mindestens 1.000 Fixtures ohne Duplikat oder Verlust.

Anbieterfehler, Redis-Neustart und Worker-Neustart getestet.

Phase M – Textback, Conversation und Lead (3–4 Wochen)

M-001 – Eligibility Engine

Abhängigkeiten: G4, O-003Umsetzen: Regeln für aktiven Tenant, Rufnummer, verpassten/kurzen Anruf, Geschäftszeit, Ruhe-/Cooldown-Zeit, Blockliste, gültiges Template, zulässigen Kanal und Subscription-Status.

Akzeptanz: Decision Table mit Positiv-/Negativfällen; jede Unterdrückung besitzt maschinenlesbaren Reason Code; gleiche Eingabe ergibt gleiche Entscheidung.

M-002 – MessagingPort und Fake-Adapter

Abhängigkeiten: M-001Umsetzen: sendTemplate, Statuscallback, ProviderMessageId, Idempotency Key; Fake-Adapter mit planbaren Fehlern; Contract-Test-Suite für reale Adapter.

Akzeptanz: Timeout, 429, 4xx permanent, 5xx transient und Provider-Accept werden korrekt klassifiziert; Retry sendet keine Duplikate.

M-003 – Textback-Orchestrierung

Abhängigkeiten: M-002Umsetzen: MissedCallDetected → Eligibility → Conversation → Message → Versandjob → Usage Intent; Kanal-Fallback nur nach dokumentierter Fehlerklasse; maximal eine Endkundenreaktion pro Regelzeitfenster.

Akzeptanz: End-to-End mit Fake-Adapter; Double-Delivery-Test; p95 unter Lastziel; fachlicher Audit-Trail vom Call bis Message.

M-004 – Status-Webhooks und Conversation Timeline

Abhängigkeiten: M-003Umsetzen: signierte Statuscallbacks, Zustandsautomat, unveränderliche Timeline, Zustellzeitpunkte, Fehlergründe und manuelle Retry-Grenzen.

Akzeptanz: Zustandsrückschritte werden ignoriert/auditiert; unbekannte ProviderMessageId wird geparkt; Timeline zeigt keine internen Secrets.

M-005 – Öffentliches Kurzformular

Abhängigkeiten: M-003Umsetzen: Capability Token gehasht, Ablauf/Einmaligkeit, Felder Name optional, Rückrufzeit, Kategorie, Freitext mit Grenzen, Datenschutzlink; Bot-/Rate-Schutz; barrierearme mobile Ansicht.

Akzeptanz: Token ist nicht erratbar, nicht in Serverlogs und nach Ablauf unbrauchbar; Formular funktioniert mobil und per Tastatur; XSS/CSRF/Spam-Tests grün.

M-006 – Lead-Aggregat und Inbox

Abhängigkeiten: M-005Umsetzen: idempotente Lead-Erstellung, Statusautomat, Notizen, Filter, Pagination, optimistische Nebenläufigkeit, API und Dashboard.

Akzeptanz: Zwei parallele Einsendungen erzeugen keinen doppelten Lead; Rechte pro Rolle getestet; Inbox lädt mit 10.000 synthetischen Leads performant; keine PII in Telemetrie.

M-007 – Betriebsbenachrichtigung

Abhängigkeiten: M-006Umsetzen: EmailPort, Mailpit und Produktionsadapter nach Freigabe, sichere Zusammenfassung mit Dashboard-Link, Retry/Suppression, Benachrichtigungseinstellungen.

Akzeptanz: fehlgeschlagene E-Mail blockiert Lead nicht; Links sind tenantgebunden; E-Mail enthält nur freigegebene Mindestdaten.

Gate G5 – End-to-End Textback MVP

Verpasster Anruf → genau eine Nachricht → Formular → Lead → Betriebsbenachrichtigung.

Vollständiger Audit-/Trace-Pfad mit Correlation-ID.

24-Stunden-Soak-Test ohne Eventverlust; Chaosfälle dokumentiert.

Noch kein Echtgeld- oder echter Massenversand ohne Freigabe.

Phase B – Billing, Compliance und Produktreife (3–5 Wochen)

B-001 – Plan, Subscription und Entitlements

Abhängigkeiten: G5Umsetzen: Planversionen, Preis-Snapshot, Trial, Limits, Entitlements, Subscription-State-Machine; Fachlogik providerneutral.

Akzeptanz: Planänderung verändert historische Preise nicht; abgelaufene/suspendierte Subscription unterdrückt Versand nachvollziehbar; Zeitzonen-/Periodengrenzen getestet.

B-002 – Append-only Usage Ledger

Abhängigkeiten: B-001, M-003Umsetzen: usage_record mit Source Event, Einheit, Menge, occurredAt, pricingPeriod, eindeutigem Idempotency Key; Korrekturen als Gegenbuchung, nicht Update.

Akzeptanz: Replay und Concurrent Consumer verändern Summe nicht; Reconciliation rekonstruiert Nutzung aus fachlichen Ereignissen.

B-003 – PaymentPort/Stripe-Adapter im Testmodus

Abhängigkeiten: B-001, B-002, explizite AnbieterfreigabeUmsetzen: Customer-/Subscription-Mapping, Checkout/Portal, signierte Webhooks via Inbox, Idempotency, Zustandsabgleich, keine Kartendaten im System.

Akzeptanz: Stripe-Testfälle für Erfolg, fehlgeschlagene Zahlung, verspäteten Webhook, Doppelwebhook, Kündigung und Reaktivierung; täglicher Reconciliation Job meldet Drift.

B-004 – Datenschutzfunktionen

Abhängigkeiten: D-003, G5Umsetzen: Retention Policies pro Datenklasse, täglicher Löschjob, Tenant-Export, Betroffenenexport, verifizierter Erasure-Workflow, Legal Hold als explizite Ausnahme, Backup-Retention dokumentieren.

Akzeptanz: synthetischer Datensatz wird über alle Tabellen/Objekte gefunden; Löschung ist idempotent; Audit enthält Nachweis ohne gelöschte Inhalte; Export ist tenantisoliert.

B-005 – Supportzugriff und Impersonation-Schutz

Abhängigkeiten: T-004Umsetzen: zeitlich begrenzter, begründeter Supportzugriff, Step-up Auth/MFA, sichtbares Banner, Audit, standardmäßig read-only.

Akzeptanz: kein verstecktes Tenant-Impersonation; jeder Zugriff hat Ticket/Grund, Actor und Ablaufzeit; Tenant kann Supportzugriff deaktivieren, sofern Betriebsmodell erlaubt.

B-006 – Analytics Events und KPI-Dashboard

Abhängigkeiten: G5, B-002Umsetzen: datensparsame Produkt-Events, Funnel, Zustell-/Latenzmetriken, Aktivierung, Leads, Kosten; interne und Tenant-Metriken trennen.

Akzeptanz: KPI-Definitionen sind versioniert; Events enthalten keine Nachrichtentexte oder Telefonnummern; Dashboardzahlen lassen sich gegen SQL-Stichprobe abgleichen.

Gate G6 – Pilotbereit

Datenschutz-/Security-Review und externe rechtliche Freigaben für den konkreten Kanal dokumentiert.

Backup-Restore in isolierter Umgebung erfolgreich.

Incident-, Provider-Ausfall-, Queue-Stau- und DB-voll-Runbooks getestet.

Billing im Testmodus reconciled; Produktionsumschaltung separat freigegeben.

Fünf Designpartner können onboarden; Support- und Feedbackprozess steht.

Phase P – Kontrollierter Pilot und Textback Product-Market-Fit (mindestens 6–12 Wochen Messzeit)

P-001 – Staging und Produktionsgrundlage

Abhängigkeiten: G6Umsetzen: getrennte Accounts/Secrets/Netze, Caddy TLS, immutable Images, DB Migration Job, Rolling-/Blue-Green-Plan soweit Compose erlaubt, Offsite-Backup, Monitoring und Alarmrouting.

Akzeptanz: Staging entspricht Produktionsform; Restore, Rollback und Secret-Rotation sind geprobt; keine Managementports öffentlich.

P-002 – Pilot-Rollout in Kohorten

Abhängigkeiten: P-001, explizite Go-live-FreigabeKohorten: intern → 1 Designpartner → 3 → 5–10. Jede Erweiterung benötigt sieben stabile Tage oder dokumentierte Ausnahme.

Akzeptanz: Pro Tenant Kill Switch; Providerbudget/Rate Limits; tägliche KPI-/Fehlerprüfung; Einwilligungen/Verträge dokumentiert; kein unkontrollierter Bulk-Onboarding.

P-003 – Operations und Feedback Loop

Abhängigkeiten: P-002Umsetzen: Support-Taxonomie, Incident Severity, Postmortem-Template, wöchentliche Interviewauswertung, Backlog-Triage nach Wirkung/Risiko/Aufwand.

Akzeptanz: Jeder Fehler und Featurewunsch ist einer Funnelstufe/KPI zugeordnet; kritische Incidents erhalten blameless Postmortem und Präventionsaufgabe.

P-004 – PMF-/Voice-Entscheidung

Abhängigkeiten: ausreichende PilotdatenVoice-Go-Kriterien:

Mindestens zehn zahlende und aktiv nutzende Kunden oder bewusst begründete abweichende Stichprobe.

Textback-Kernpfad stabil; keine ungelösten P0/P1-Sicherheits-/Datenschutzprobleme.

Wiederholte, zahlungsbereite Voice-Nachfrage in Interviews.

Unit Economics inklusive Providerkosten positiv oder klarer Pfad dorthin.

Voice Use Cases auf ein Gewerk und maximal drei Intents begrenzt.

Akzeptanz: schriftliches Go/No-Go mit Daten. Bei No-Go wird Textback optimiert; Voice beginnt nicht aus technischem Interesse.

Gate G7 – Voice freigegeben oder bewusst vertagt

Phase V – Voice-Modul (12–18 Wochen nach G7)

V-001 – Voice Discovery, Risikoanalyse und Benchmark

Abhängigkeiten: G7 = GoUmsetzen: genau ein Gewerk; Intents FAQ, Rückruf/Terminwunsch, Weiterleitung; Testkorpus mit Dialekten, Fachbegriffen, Adressen, Stille, DTMF und Störungen; erneutes DSFA-Screening; Build-vs-Buy-Scorecard.

Metriken: Turn-Latenz, Word Error Rate auf eigenem Korpus, Task Completion, Transfer Success, Halluzinations-/Policy-Verstoßrate, Kosten/Minute.

Akzeptanz: Anbieter und Orchestrierung per ADR entschieden; keine Produktion anhand einer Demoqualität.

V-002 – Separater Voice-Agent-Service

Abhängigkeiten: V-001Umsetzen: Python-Service, Streaming Session, Health/Readiness, Telephony/STT/LLM/TTS Ports, Correlation-ID, kurzlebige Credentials, keine Roh-Audio-Persistenz.

Akzeptanz: simuliertes Audio durchläuft Pipeline; Provider kann per Adapter ersetzt werden; Abbruch räumt Sessions/Secrets auf; keine Audioinhalte in Logs.

V-003 – Dialog State Machine und Tool Gateway

Abhängigkeiten: V-002Umsetzen: explizite Zustände, begrenzte Intents, strukturierte Tool Calls mit JSON Schema, serverseitige Autorisierung, Timeout, Bestätigung vor Schreibaktion, Gesprächsbudget.

Akzeptanz: LLM kann keine beliebigen URLs/Tools ausführen; ungültige Tool Calls werden abgelehnt; Termin-/Lead-Änderung benötigt bestätigte Daten; Prompt-Injection-Korpus grün.

V-004 – Transparenz, Consent und Datenminimierung

Abhängigkeiten: V-001, rechtliche FreigabeUmsetzen: vor Interaktion klare KI-Transparenzansage, Alternativweg zum Menschen/Rückruf, Nachweis des Ansageereignisses, konfigurierbare Transkript-/Summary-Retention, Recording technisch deaktiviert.

Akzeptanz: Dialog startet fachlich erst nach Ansagepfad; bei Ablehnung folgt freigegebener Fallback; Retention-/Erasure-Tests decken Voice-Daten ab.

V-005 – Barge-in, Latenz und Audioqualität

Abhängigkeiten: V-002Umsetzen: Streaming partials, Endpointing, VAD, TTS-Abbruch, Echo-/Noise-Fälle, Timeouts und Filler-Vermeidung.

Zielbudget: TTS Time-to-First-Audio < 250 ms, mediane wahrgenommene Turn-Latenz < 1,2 s und p95 < 2,0 s unter definierter Testregion; endgültige Ziele nach Benchmark.

Akzeptanz: Lasttest und Trace zeigen STT-/LLM-/TTS-Anteile; Barge-in stoppt Ausgabe zuverlässig; degradierter Provider führt zu Fallback statt Endlosschleife.

V-006 – Emergency und Human Handoff

Abhängigkeiten: V-003Umsetzen: konservative regel- plus modellgestützte Klassifikation, sofortiger Transfer, DTMF-/Sprachfallback, nicht erreichbarer Mensch, Disclaimertexte, Events und Runbook.

Wichtige Produktgrenze: Das System ist kein Notrufdienst. Lebensbedrohliche Situationen dürfen nicht durch generative Beratung verzögert werden.

Akzeptanz: freigegebenes Golden Dataset mit hoher Sensitivität; Transfer-E2E inklusive Nichtannahme; kein Termin- oder FAQ-Dialog nach kritischer Klassifikation.

V-007 – Voice Summary und Usage Metering

Abhängigkeiten: V-003–V-006Umsetzen: strukturierte Zusammenfassung mit Unsicherheitsmarkierung, menschlich prüfbar; Voice-Minuten aus Provider-/Sessiondaten reconciled; Kosten je STT/LLM/TTS-Komponente.

Akzeptanz: keine erfundenen Pflichtfelder; Summary verweist auf Quelle/Segment, soweit gespeichert; Nutzungsabweichungen über Schwellwert alarmieren.

V-008 – Voice Red Team und Pilot

Abhängigkeiten: V-007Testfelder: Prompt Injection, Social Engineering, beleidigende Anrufer, personenbezogene Geheimnisse, Halluzination, Dialekt, Straßennamen, Lärm, lange Stille, Providerverlust, Parallelität, Transferfehler.

Akzeptanz: alle kritischen Guardrails grün; manuelle Review-Stichprobe; Kill Switch; Rollout 1 → 3 → 5 Kunden; Kosten- und Qualitätsgate je Kohorte.

Gate G8 – Voice produktionsreif

Recht, Qualität, Latenz, Sicherheit, Handoff und Marge unabhängig abgenommen.

Kein ungelöstes kritisches Szenario im Golden/Red-Team-Dataset.

Phase C – Cloud-Migration und selektive Skalierung

Diese Phase wird durch Messwerte ausgelöst, nicht durch Kalenderdatum.

C-001 – Terraform und Managed Services

Trigger: zahlender Go-live, RPO/RTO oder Betriebsaufwand auf VPS nicht mehr ausreichend.Umsetzen: EU-Region, Netzwerksegmente, Managed Postgres/Redis/Object Storage, Secret Store, zentrale Logs, Backup Policies, Budgetalarme.

C-002 – Hochverfügbarkeit und Disaster Recovery

Umsetzen: redundante App/Worker/Voice-Instanzen, Multi-AZ wo wirtschaftlich, Provider-Failover nach Business Case, dokumentiertes Failover, quartalsweiser DR-Test.

C-003 – Service-Extraktion nur nach Kriterien

Ein Modul wird nur extrahiert, wenn mindestens eines gilt:

unabhängiges Skalierungsprofil verursacht messbare Engpässe,

eigenes Verfügbarkeits-/Sicherheitsniveau ist erforderlich,

Deploy-Kopplung verursacht wiederholt Incidents,

Teamownership rechtfertigt separate Lebenszyklen.

Erste Kandidaten: Voice-Agent, Telephony Gateway, Worker/Messaging. Billing wird nicht allein wegen „Enterprise“ extrahiert.

7. Teststrategie

7.1 Testpyramide

Ebene

Zweck

Beispiele

Domain Unit

Regeln und Zustandsautomaten

Eligibility, Öffnungszeiten, Lead-/Message-Transitions, Pricing

Application Unit

Use Cases mit Fake Ports

MissedCall → Textback; Retry/Suppression

DB Integration

reale PostgreSQL-Features

RLS, Constraints, Migration, Outbox, Concurrency

Adapter Contract

Providervertrag

Payload-Mapping, Signatur, Fehlerklassifikation

API Integration

Auth/Validation/Fehler

REST, Webhooks, RBAC

E2E

kritische Nutzerreise

Onboarding, Textback, Formular, Lead

Resilience

Ausfälle/Wiederholung

Redis/Worker/Provider/DB Restart, DLQ

Performance

SLO/Kapazität

Webhook Burst, Queue, 10k Leads; später Voice

Security

Missbrauch/Isolation

Tenant Escape, IDOR, XSS, CSRF, Replay, SSRF

7.2 Verbindliche Golden Paths

Neuer Tenant → Konfiguration → Test-Call → Testnachricht.

Validierter Missed Call → genau eine Nachricht.

Duplicate/Out-of-order Webhooks → unveränderter fachlicher Endzustand.

Formular → genau ein Lead → Benachrichtigung.

Tenant A kann keine Ressource von Tenant B sehen oder verändern.

Provider 429/5xx → kontrollierter Retry; permanenter Fehler → keine Endlosschleife.

Subscription suspended → Textback suppressed mit Reason Code.

Export/Löschung → vollständig, tenantisoliert, auditierbar.

7.3 Testdaten

Nur synthetische Personen, Telefonnummern aus reservierten Testbereichen bzw. eindeutig fiktiv.

Providerpayloads vor Commit anonymisieren.

Zeit über injizierte Clock kontrollieren.

Zufall deterministisch seeden.

Keine produktiven Dumps in Entwicklung oder CI.

8. Observability und Runbooks

8.1 Pflichttelemetrie

Logs: JSON, timestamp, level, service, environment, requestId, traceId, optional gehashte tenantRef, Event-/Jobtyp, stabiler Error Code. Keine Inhalte/PII.

Metriken:

Webhook requests nach Provider/Result

Inbox processing lag

Outbox unpublished age

Queue depth, oldest job, retry, DLQ

Textback eligibility/suppression nach Reason

Message accepted/delivered/failed

End-to-end Textback-Latenz

Lead conversion

Billing reconciliation drift

DB connections/locks/storage, Redis memory

später Voice Turn/STT/LLM/TTS-Latenz und Kosten/Minute

Tracing: Webhook → Inbox → Call → Outbox → Queue → Message → Callback → Lead. Providerpayloads und Prompts nicht als Span Attributes speichern.

8.2 Pflicht-Runbooks vor Pilot

Telefonieprovider liefert keine Webhooks

Signaturprüfung schlägt flächig fehl

Nachrichtenprovider down oder 429

Queue wächst / DLQ enthält Jobs

Outbox hängt

PostgreSQL Speicher/Connections erschöpft

Redis-Neustart

Zertifikat/Domainproblem

Backup Restore

Secret kompromittiert/Rotation

Tenant fordert Export/Löschung

Falsche oder doppelte Nachricht gesendet

Jedes Runbook enthält Symptom, Alarm, Diagnose, sichere Sofortmaßnahme, Recovery, Datenkorrektur, Kommunikationsweg und Postmortem-Trigger.

9. CI/CD- und Release-Strategie

9.1 Branch-/Release-Modell

Trunk-based mit kleinen Branches und Pull Requests.

Ein Arbeitspaket oder eine kohärente vertikale Teilscheibe pro PR.

Conventional Commits; Codex schlägt Commit vor, pusht/deployt aber nur bei Autorisierung.

Feature Flags für reale Provider, Billing und Voice.

Keine langlebigen Environment-Branches.

9.2 Deployment-Reihenfolge

CI-Checks und Images bauen.

SBOM/Scan und signierte Image-Digests.

Staging-Backup/Readiness prüfen.

Rückwärtskompatible Expand-Migration.

App/Worker deployen, Smoke Tests.

Feature Flag kontrolliert aktivieren.

Contract-/Golden-Path-Probe.

Erst später Contract-Migration zum Entfernen alter Spalten.

9.3 Rollback

Anwendung auf vorherigen Image-Digest zurück.

DB-Migrationen grundsätzlich expand/contract; destruktive Down-Migration nicht als Standard-Rettung.

Queue-Nachrichten und Eventverträge mindestens eine Releasegeneration kompatibel.

Feature Kill Switch pro Tenant und Provider.

10. Business- und Product-Owner-Backlog

Technischer Fortschritt ohne diese Aufgaben ergibt kein verkaufbares Produkt.

ID

Aufgabe

Spätestens bis

PO-001

10 Probleminterviews in einem Gewerk

vor G0

PO-002

Pilotangebot und messbares Nutzenversprechen

vor G0

PO-003

Providerkosten-/Preis-Sensitivitätsmodell

vor G0

PO-004

Datenschutz-/AVV-/Kommunikationsrechtsprüfung

vor G6

PO-005

Supportkanal, Reaktionszeiten und Betriebszeiten

vor G6

PO-006

5 Designpartner und Pilotvereinbarung

vor G6

PO-007

Pricing: Grundpreis, inkludierte Nutzung, Mehrverbrauch

vor Echtgeld-Billing

PO-008

Kündigung, Erstattung, Zahlungsverzug, Datenexport

vor Echtgeld-Billing

PO-009

Wöchentliche KPI-/Interviewreview

ab P-002

PO-010

Datengestütztes Voice Go/No-Go

P-004

10.1 Priorisierung

Jedes Backlog Item erhält:

erwartete KPI-Wirkung,

betroffene Nutzergruppe,

Risiko bei Nichtumsetzung,

Aufwandsspanne,

Abhängigkeiten,

Messplan,

Reversibilität.

Priorität = zuerst Sicherheit/Recht/Betrieb, dann Aktivierung und Kernzuverlässigkeit, dann Conversion, dann Komfort. Featurewünsche einzelner Pilotkunden werden nicht automatisch Plattformfunktionen.

11. Risikoregister

Risiko

Frühindikator

Gegenmaßnahme

Owner

WhatsApp/SMS rechtlich oder vertraglich unzulässig

fehlender Opt-in/Templatefreigabe

Kanal-/Rechtsprüfung, SMS/Callback-Link-Alternative, Suppression

Product/Legal

Provider liefert uneindeutige Events

keine stabile Event-ID, Reihenfolgefehler

Inbox, deterministischer Hash, Reconciliation, Providerwechsel-Port

Engineering

Doppelte Endkundennachrichten

Retry-/Webhookduplikate

Unique Constraints, Idempotency Keys, Cooldown

Engineering

Tenant-Datenleck

IDOR/RLS-Lücke

FORCE RLS, Negativsuite, separate Rollen, Review

Security/Engineering

Schlechte Aktivierung

Setup dauert, Rufnummernportierung

geführter Wizard, Concierge Onboarding, Testmodus

Product

Unwirtschaftliche variable Kosten

Kosten/Lead steigen

Usage Ledger, Limits, Pricing Snapshot, Providerbenchmark

Product/Finance

Voice halluziniert/übersieht Notfall

Golden Tests/Incidents

Intentbegrenzung, konservativer Handoff, Kill Switch

Product/Safety

Solo-Operator überlastet

Alerts/Supportstunden steigen

Managed Services, Runbooks, SLOs, Kohortenrollout

Operations

VPS-Ausfall

RPO/RTO verfehlt

Offsite-Backup, Restore Drill, Cloud-Trigger

Operations

Scope Creep

Kalender/CRM/Voice vor stabilem Kern

harte Gates und Nicht-Ziele

Product Owner

12. Realistische Zeitachse bei 20 h/Woche

Zeitraum

Ziel

Woche 1–2

Discovery, Provider-/Rechts-Spikes, Product Brief

Woche 3–5

Repo, lokale Infrastruktur, CI, API/Web/Worker

Woche 6–8

Identity, Tenancy, RLS, Audit

Woche 9–10

Onboarding und Konfiguration

Woche 11–13

Telephony Ingestion, Inbox/Outbox, Worker

Woche 14–17

Textback, Formular, Conversation, Lead Inbox

Woche 18–22

Billing-Basis, Compliance, Observability, Pilot-Härtung

Woche 23+

kontrollierter Pilot und Messphase

nach Voice-Go

zusätzlich ca. 12–18 Wochen für begrenztes Voice-Modul

Die erste interne Textback-Demo ist früher möglich. Ein rechtlich, betrieblich und finanziell kontrollierter Pilot ist bewusst später angesetzt. Termindruck darf Tenant-Isolation, Idempotenz, Löschung oder Provider-Signaturprüfung nicht entfernen.

13. Erste Codex-Arbeitsreihenfolge

Codex soll nach Freigabe exakt so starten:

D-001: Product-Brief-Template und offene Entscheidungen anlegen.

D-002: Provider-Scorecard als ausfüllbare Matrix erstellen; bis zur Wahl Fake-Adapter vorsehen.

D-003: Datenfluss-/Retention-/Abuse-Templates anlegen.

Nach Product-Owner-Freigabe von G0: F-001 Repository initialisieren.

Danach F-002 → F-003 → F-004 → F-005.

Erst nach grünem G1 mit T-001 beginnen.

Prompt für den jeweils nächsten Codex-Lauf

Lies AGENTS.md, CODEX_ROADMAP_KI_TELEFONASSISTENT.md und alle relevanten ADRs vollständig.
Bearbeite ausschließlich Task <TASK-ID>. Prüfe zuerst seine Abhängigkeiten und den Git-Status.
Lege vor der Implementierung die betroffenen Dateien, Risiken und konkreten Akzeptanztests fest.
Implementiere die kleinste vollständige Lösung, führe alle relevanten Checks aus und aktualisiere
Dokumentation sowie Roadmap-Status. Nimm keine echte Provider-, Zahlungs- oder Produktionsaktion vor.
Berichte anschließend: Änderungen, Tests mit Ergebnis, offene Punkte, Risiken und empfohlener nächster Task.

14. Quellen und fachliche Referenzpunkte

DSGVO – konsolidierter Text, insbesondere Art. 4 und 9

EU AI Act – Verordnung (EU) 2024/1689

Europäische Kommission: AI-Act-Regelungsrahmen und zeitliche Anwendung

PostgreSQL: Row Security Policies

PostgreSQL: CREATE POLICY mit USING und WITH CHECK

NestJS: Monorepo Workspaces

Die Referenzen begründen Leitplanken, ersetzen aber keine Prüfung des konkreten Geschäftsmodells, der Providerverträge und des tatsächlichen Kommunikationsflusses.

15. Roadmap-Status

Gate

Status

Freigabe/Datum

Nachweis

G0 Discovery

offen

–

–

G1 Skelett

blockiert durch G0

–

–

G2 Isolation

blockiert durch G1

–

–

G3 Konfiguration

blockiert durch G2

–

–

G4 Call Ingestion

blockiert durch G3

–

–

G5 Textback MVP

blockiert durch G4

–

–

G6 Pilotbereit

blockiert durch G5

–

–

G7 Voice Go/No-Go

blockiert durch Pilotdaten

–

–

G8 Voice produktionsreif

blockiert durch G7

–

–

Nächster zulässiger Task: D-001
