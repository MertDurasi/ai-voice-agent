---
id: D-002
title: Provider- und Machbarkeits-Spike
phase: discovery
status: done
priority: P0
owner: Product/Engineering
dependencies: [D-001]
gate: G0
outputs: [docs/product/provider-scorecard.md, docs/adr/ADR-012-provider-channel.md]
completed_at: 2026-08-08
---

# D-002 – Provider- und Machbarkeits-Spike

## Ziel und Kontext

Zwei Telefonieanbieter und zwei Messagingwege anhand identischer, belegter
Kriterien vergleichen. Beachte [ADR-004](../../adr/ADR-004-ports-adapters.md),
[ADR-010](../../adr/ADR-010-pragmatic-provider-neutrality.md) und die
[Security-Leitplanken](../../security/security-and-compliance.md).

## Scope und Lieferobjekte

- Bewerten: deutsche Nummern, Missed-Call-Webhook, Signatur, Event-IDs,
  Sandbox, Portierung, SMS/WhatsApp, EU-Datenfluss, AVV, Preis, Support,
  SIP/Media-Streaming und Exit.
- Anonymisierte Beispielpayloads und Signaturverfahren dokumentieren.
- Kosten je 100 Missed Calls und je aktivem Tenant modellieren.
- Pilotprovider und Primärkanal als `ADR-012` vorschlagen; Fake-/Replay-Pfad
  unabhängig davon festlegen.

## Akzeptanz und Verifikation

- [x] Scorecard nutzt belastbare Quellen, Abrufdatum und eine identische,
  ausdrücklich als `not_run` gekennzeichnete Account-Testmatrix.
- [x] Preise, Datenregion und Vertragsoffenheiten sind sichtbar.
- [x] Votum, Trade-offs, Exit und offene Risiken sind nachvollziehbar.
- [x] Product Owner hat den Fake-/Replay-Betrieb ausdrücklich freigegeben;
  Provider, Kanal und Nummerntopologie bleiben bedingte Testhypothesen.

Stop: Keine Accounts, Verträge, Nummern oder kostenpflichtigen Tests ohne
Freigabe. Bei fehlender Anbieterentscheidung mit Fake-/Replay-Adaptern planen.

## Arbeitsstand 2026-08-08

- Desk-Scorecard und Kostenmodell erstellt.
- Anonymisierte, aus öffentlichen Schemata abgeleitete Contract-Fixtures
  dokumentiert.
- Identische Account-Testmatrix definiert; mangels freigegebenem Account,
  Budget, Domain und Testnummer noch nicht ausgeführt.
- `ADR-012` mit Twilio/SMS/Conditional-Forwarding als bedingter Empfehlung auf
  `proposed` angelegt.
- Product-Owner-Abnahme am 2026-08-08: Fake-/Replay-Betrieb gilt, während
  Twilio/SMS/Conditional-Forwarding nur Testhypothese bleibt. Eine bindende
  Providerwahl, Accounttests und Realbetrieb behalten ihre separaten Stop-
  Regeln und Freigaben.
