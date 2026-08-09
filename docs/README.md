# Projektdokumentation

Die Dokumentation trennt stabile Leitplanken von veränderlichen Tasks und
Entscheidungen.

## Produkt

- [Vision, Zielgruppe und Scope](product/product-strategy.md)
- [Kennzahlen und Produkt-Gates](product/metrics.md)
- [Product Brief und Pilot-Hypothesen](product/product-brief.md)
- [Discovery Decision Log](product/decision-log.md)
- [Provider- und Kanal-Scorecard](product/provider-scorecard.md)
- [Product-Owner-Backlog](tasks/product-owner/README.md)

## Architektur und Engineering

- [Systemarchitektur und Modulgrenzen](architecture/system-architecture.md)
- [Datenmodell und zuverlässige Ereignisse](architecture/data-and-reliability.md)
- [Technologiestack und Repository-Zielbild](engineering/technology-stack.md)
- [Architecture Decision Records](adr/README.md)

## Qualität, Sicherheit und Betrieb

- [Definition of Done und Teststrategie](quality/quality-and-testing.md)
- [Security und Compliance](security/security-and-compliance.md)
- [D-003 Compliance-Paket](compliance/README.md)
- [Datenflüsse und Dateninventar](compliance/data-flow.md)
- [Zwecke, Rollenhypothesen und Rechtsfragen](compliance/purpose-legal-basis.md)
- [Retention- und Löschentwurf](compliance/retention-draft.md)
- [Abuse Cases und Recovery](security/abuse-cases.md)
- [Observability, Runbooks und Delivery](operations/operations-and-delivery.md)

## Projektsteuerung

- [Arbeitsmodell](project/working-model.md)
- [Roadmap](project/roadmap.md)
- [Gate-Status](project/gate-status.md)
- [Risiken](project/risk-register.md)
- [Zeitachse](project/timeline.md)
- [Alle ausführbaren Tasks](tasks/README.md)
- [Prompt für einen einzelnen Task](templates/task-execution-prompt.md)

## Dokumenttypen

| Typ | Zweck | Änderungskontrolle |
|---|---|---|
| ADR | Verbindliche technische Entscheidung | Neue/ersetzende ADR |
| Referenz | Produkt-, Architektur- und Betriebsleitplanke | Mit betroffenem Task |
| Task | Kleinste freigebbare Arbeitseinheit | Status + Nachweis pflegen |
| Gate | Beweisbarer Phasenabschluss | Product-Owner-/Review-Freigabe |
| Template | Wiederverwendbare Struktur | Rückwärtskompatibel halten |

`master.md` ist nur noch historische Baseline; bei Weiterentwicklung werden die
strukturierten Dokumente gepflegt.
