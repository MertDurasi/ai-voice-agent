---
id: D-003
title: Datenschutz-, Rechts- und Abuse-Workshop
phase: discovery
status: done
priority: P0
owner: Product/Legal/Security
dependencies: [D-001, D-002]
gate: G0
outputs: [docs/compliance/README.md, docs/compliance/data-flow.md, docs/compliance/purpose-legal-basis.md, docs/compliance/retention-draft.md, docs/security/abuse-cases.md]
completed_at: 2026-08-08
---

# D-003 – Datenschutz-, Rechts- und Abuse-Workshop

## Ziel und Kontext

Die geplanten Textback-MVP-Datenflüsse und die Datenschutzgrenzen einer späteren
Voice-Stufe so klassifizieren, dass Fake-Entwicklung und Realbetrieb klar
getrennt sind. Voice wird risikoseitig erfasst, aber weder technisch noch
providerbezogen vorgeplant. Lies
[Security/Compliance](../../security/security-and-compliance.md) und die
Providerentscheidung aus `D-002`.

## Scope und Lieferobjekte

- Datenflusskarte und Matrix aus Datentyp, Zweck, Owner, Zugriff, Speicherort,
  Rechtsgrundlagen-Hypothese und Löschfrist.
- Retention-Entwurf und offene Rechtsfragen mit Owner und fachlichem Trigger.
- Abuse Cases: falsche/wiederverwendete Nummer, Duplicate, unerwünschte
  Nachricht, Minderjährige, beleidigende Inhalte, Notfall, Export/Löschung,
  Supportzugriff und Providerkompromittierung.
- DSFA-Screening und Rollen-/Subprozessorfragen vorbereiten.
- Voice-Grenzen: kein persistiertes Audio oder Rohtranskript, keine Voiceprints,
  Sprecheridentifikation oder Emotionserkennung; erneute vollständige
  DSFA-/Legal-Prüfung vor jedem Realbetrieb.

## Akzeptanz und Verifikation

- [x] Jeder Datentyp ist vollständig in der Matrix erfasst.
- [x] Prävention, Erkennung, Reaktion und Restrisiko je Abuse Case existieren.
- [x] Juristische Annahmen sind nicht als Freigabe formuliert.
- [x] Product-/Security-Review, Rechtsfragenpaket und Realbetriebsblocker sind
  dokumentiert. Eine qualifizierte Rechtsfreigabe bleibt `PO-004` vorbehalten.

Stop: Keine Rechtsgrundlage oder Retention autonom festlegen. Offenes Recht
blockiert betroffenen Realbetrieb, nicht synthetische Fake-Entwicklung.

## Ergebnisstand für den Review – 2026-08-08

- [Compliance-Index](../../compliance/README.md),
  [Datenfluss/-inventar](../../compliance/data-flow.md),
  [Zweck-/Rollen-/Rechtsmatrix](../../compliance/purpose-legal-basis.md) und
  [Retention-Entwurf](../../compliance/retention-draft.md) bilden Textback-MVP
  und Voice-Grenzen mit stabilen `FLOW-*`, `DATA-*`, `PUR-*` und `RET-*` ab.
- Der [Abuse-Katalog](../../security/abuse-cases.md) enthält 21 MVP- und sieben
  Voice-Fälle mit Prävention, Erkennung, Reaktion, Recovery, Restrisiko, Owner,
  Gate und späterem Test.
- Der synthetische Fake-/Replay-Pfad bleibt erlaubt. Reale Telefonie, SMS, ESP,
  Payment und Voice bleiben fail-closed; `ADR-012` bleibt `proposed`.
- Technische Fristen sind nicht freigegebene Kandidaten. Suppressionsnachweis
  und gesetzlich relevante Abrechnungsunterlagen bleiben bis Legal-/Tax-Prüfung
  ohne festgelegte Produktionsfrist.

## Ausstehender Abnahme-Review

| Review | Prüfpunkte | Status/Entscheid |
|---|---|---|
| Product Owner | Zweckgrenzen, reversible SHK-/SMS-Hypothese, Feldminimum, Notfall-/Minderjährigenpfad und benannte Decision Owner | am 2026-08-08 mit Auftrag zum Entwicklungsstart abgenommen; ausschließlich Fake-/Replay-Baseline |
| Security/Privacy | Trust Boundaries, Datenklassenabdeckung, Abuse-Controls, Recovery, Lösch-/Restoremechanik und Voiceverbote | am 2026-08-08 dokumentarisch geprüft; 37/37 Datenklassen und 28/28 Abuse-Fälle vollständig |
| qualifizierte Rechtsberatung | `LQ-01`–`LQ-11`, insbesondere Erst-SMS, TDDDG/TKG, Rollen, Transparenz, DSFA, Transfers und Retention | separat in `PO-004`; darf als einzige Task `approved_by_legal` setzen |

## Verifikation

- Lokale Markdown-Links: bestanden. `FLOW-*`/`DATA-*`/`PUR-*`/`RET-*`/
  `ABUSE-*`-Abdeckung: bestanden. Abuse-Tabellenstruktur: bestanden.
- Code-, Lint-, Typ-, Integrations- oder E2E-Tests sind nicht ausführbar, weil
  noch keine Toolchain oder Anwendung existiert. Das ist kein stillschweigend
  bestandener Test; `F-001` bleibt hinter `G0` blockiert.
