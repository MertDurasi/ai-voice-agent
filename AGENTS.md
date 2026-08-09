# Arbeitsanweisung für dieses Repository

Diese Datei gilt für das gesamte Repository. Sie operationalisiert die
Projektbaseline, ersetzt aber keine fachliche, rechtliche oder Go-live-Freigabe.

## 1. Vor jedem Task

1. `git status --short --branch` prüfen und fremde Änderungen erhalten.
2. Genau eine Task-Datei unter `docs/tasks/` vollständig lesen.
3. Abhängigkeiten und das vorangehende Gate in
   `docs/project/gate-status.md` prüfen.
4. Die in der Task-Datei genannten Referenzen und alle betroffenen ADRs lesen.
5. Betroffene Module, Datenflüsse, Risiken und konkrete Akzeptanztests vor der
   Implementierung benennen.

Ein Task mit unerfüllter Abhängigkeit darf analysiert oder vorbereitet, aber
nicht als implementiert oder abgeschlossen markiert werden.

## 2. Ausführungsstandard

- Die kleinste vollständige Lösung für den freigegebenen Task liefern; keine
  vorgezogenen Features aus späteren Phasen.
- Zuerst Akzeptanzfälle und Tests festlegen, dann implementieren.
- Domänen- und Application-Code bleiben framework- und providerunabhängig.
- Provider-SDKs sind ausschließlich in Outbound-Adaptern erlaubt.
- Keine direkten Repository-Aufrufe über Modulgrenzen und keine zyklischen
  Modulabhängigkeiten.
- Keine Secrets, realen Telefonnummern oder personenbezogenen Testdaten
  einchecken. Logs und Telemetrie enthalten keine Payloads oder PII.
- Code, Tests, OpenAPI, Migrationen, Beispielkonfiguration und betroffene
  Dokumentation werden atomar aktualisiert.
- Keine echten Nachrichten, Zahlungen, Provideränderungen oder Deployments ohne
  ausdrückliche Freigabe.

## 3. Verifikation und Definition of Done

Die vollständige Definition of Done steht in
`docs/quality/quality-and-testing.md`. Mindestens ausführen, soweit im aktuellen
Repository vorhanden:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
```

Hinzu kommen taskbezogene E2E-, Security-, Migrations-, Architektur- oder
Resilience-Tests. Nicht ausführbare Prüfungen werden mit Grund berichtet und
nicht stillschweigend als erfolgreich gewertet.

Nach erfolgreicher Arbeit:

1. `status` der Task-Datei auf `done` setzen und `completed_at` ergänzen.
2. `docs/tasks/README.md` und bei Gate-Abschluss
   `docs/project/gate-status.md` aktualisieren.
3. Änderungen, Prüfungen mit Ergebnis, offene Risiken und den empfohlenen
   nächsten Task berichten.

Zulässige Task-Statuswerte: `blocked`, `ready`, `in_progress`, `review`, `done`.

## 4. Stop-Regeln

Stoppen und eine konkrete Entscheidung anfordern, wenn:

- Anbieter, Tarif, Datenstandort oder Vertragsmodell verbindlich gewählt werden
  muss;
- echte Accounts, API-Keys, Rufnummern, Domains oder Zahlungsarten nötig sind;
- reale Kontakte, Kosten oder Datenlöschung ausgelöst werden könnten;
- Rechtsgrundlage, Einwilligung oder Aufbewahrungsfrist nicht freigegeben ist;
- eine Migration destruktiv oder nicht sicher rückwärtskompatibel ist;
- ein Akzeptanzkriterium einem ADR oder einer Security-Leitplanke widerspricht.

Fake-, Replay- und Testmodus-Arbeit darf weitergehen, sofern sie den blockierten
Realbetrieb nicht berührt.

## 5. Priorität bei Widersprüchen

1. Recht, Sicherheit, Datenschutz und ausdrückliche Nutzerfreigaben
2. Akzeptierte ADRs
3. Task-Akzeptanzkriterien
4. Architektur- und Qualitätsdokumentation
5. Roadmap und ursprüngliche Baseline `master.md`

Widersprüche werden nicht durch Annahmen aufgelöst, sondern dokumentiert und
eskaliert.
