---
id: F-003
title: Konfigurations- und Secret-Management
phase: foundation
status: done
priority: P0
owner: Engineering/Security
dependencies: [F-001]
gate: G1
outputs: [typed-config, env-example, rotation-guide, secret-scan-fixture]
completed_at: 2026-08-09
---

# F-003 – Konfigurations- und Secret-Management

## Ziel

Jede App startet nur mit valider, umgebungsspezifischer Konfiguration und leakt
bei Fehlern keine Secrets.

## Scope

Typisierte Env-Schemas pro App, Fail-fast-Validierung, `.env.example`, Trennung
dev/test/staging/prod, Klassifikation sensibler Werte und Rotationshinweise.
CI-Testfixture mit eindeutig synthetischem Canary-Key für den Secret Scanner.

## Akzeptanz und Verifikation

- [x] Fehlende/ungültige Variablen verhindern Start mit verständlicher,
      geheimnisfreier Meldung.
- [x] Unbekannte Produktionsdefaults werden abgelehnt.
- [x] Beispielkonfiguration enthält keine Geheimnisse und ist vollständig.
- [x] Secret Scan erkennt das ausschließlich im Test erwartete Canary-Fixture.
- [x] Logs/Snapshots maskieren sensible Konfigurationswerte.

Nicht im Scope: produktiver Secret Store oder echte Schlüsselrotation.

## Testentwurf vor Implementierung

- Happy Path: API, Worker und Web erhalten je Umgebung eine vollständige,
  typisierte Konfiguration; Secret-Werte sind nur über einen expliziten
  Reveal-Schritt nutzbar.
- Negativfälle: fehlende, leere, unbekannte oder syntaktisch ungültige Werte
  stoppen den Start mit Variablennamen und sicherem Reason Code, nie mit dem
  gelieferten Wert.
- Umgebungsgrenze: `NODE_ENV` und Anwendungsumgebung dürfen sich nicht
  widersprechen; Staging/Produktion lehnen lokale Hosts, Beispielwerte und
  bekannte unsichere Defaults ab.
- Leak-Schutz: Fehler, JSON, Stringdarstellung und Test-Snapshots maskieren
  sensible Werte; öffentliche Web-Konfiguration kann keine serverseitigen
  Secret-Felder deklarieren.
- Supply-Chain-Negativfall: Der Repository-Scan erkennt genau das ausdrücklich
  erlaubte synthetische Canary-Fixture und scheitert bei einem zusätzlichen
  Credential-/Private-Key-Muster.
- Vollständigkeit: Jede von einer App verlangte Variable steht genau einmal in
  `.env.example`; Beispiele lassen sich als `development` validieren und
  enthalten keine realen Zugangsdaten.

## Abschlussnachweis

- `@voice-ai/config` liefert getrennte, typisierte Loader für API, Worker und
  Web sowie einen explizit redigierenden `SecretValue`.
- API und Worker validieren vor NestJS; der Web-Wrapper validiert vor dem
  Öffnen eines Next.js-Listeners. Der Integrationstest startet alle drei
  gebauten Prozesse ohne Konfiguration und erwartet einen inhaltsfreien
  Exit-Code `1`.
- `.env.example` wird gegen den gemeinsamen Variablenkatalog geprüft.
  `development`/`test` bleiben von `staging`/`production` getrennt; lokale
  Platzhalter und unsichere öffentliche Transporte scheitern außerhalb lokaler
  Umgebungen.
- `pnpm test` enthält den Secret-Scan. Genau ein synthetisches Canary-Fixture
  ist erwartet; weitere Canary-Orte, strukturierte Credentialmuster,
  Private-Key-Header und verdächtige Env-/YAML-Zuweisungen brechen ab.
- Erfolgreich am 2026-08-09: Format, Lint, Typecheck, Unit-/Architektur-/
  Commit-/Secret-Tests, Build und drei Startup-Integrationstests. Die E2E-Stufe
  ist grün mit `passWithNoTests`, da fachliche Runtimes erst in `F-004`
  entstehen.
- Keine echten Secrets, Providerkonten, Realdaten, Nachrichten oder
  Deployments wurden verwendet. Ein produktiver Secret Store und echte
  Rotation bleiben ausdrücklich außerhalb des Taskscopes.
