# Risikoregister

| ID | Risiko | Frühindikator | Gegenmaßnahme | Owner | Review |
|---|---|---|---|---|---|
| R-001 | Textback ist rechtlich/vertraglich unzulässig oder ungeplant | fehlende Kommunikationsbefugnis, nicht angeforderte Nachricht | versionierte Eligibility, Suppression, qualifizierte Kanal-/Rechtsprüfung, kein stiller Dual-Send | Product/Legal | G3, G6, G7 |
| R-002 | Provider-/Runtimeoption erfüllt Voice-Qualität, Datenregion oder Exitfähigkeit nicht | instabile Events/Media, unklare Subprozessoren, Lock-in, Benchmark verfehlt | `V-001` vor Implementierungsfestlegung, Ports/Contracttests, Exitplan und harte Stopregel | Engineering/Product | G3, G4, G6 |
| R-003 | doppelte oder widersprüchliche Außenwirkung über Voice, Handoff und Textback | Retry-/Webhookduplikat, zwei Leads oder Nachricht nach erfolgreichem Handoff | gemeinsamer Vorgang, Inbox/Outbox, Idempotency Keys, Outcome-Decision-Table und Combined-E2E | Engineering | G4, G5, G7 |
| R-004 | Tenant-Daten- oder Knowledge-Leak | IDOR-/RLS-Lücke oder fremder Kontext im Dialog/Tool | FORCE RLS, serverseitiger Tenantkontext, Negativsuite, getrennte Rollen und Tool-Autorisierung | Security/Engineering | G2, G5, G6 |
| R-005 | schlechte Aktivierung des kombinierten Assistenten | Setup dauert, Routing/Handoff/Faketest scheitert | geführtes Voice+Text-Onboarding, Testmodus, Concierge und Drop-off-Messung | Product | G3, G7 |
| R-006 | variable Voice-/Text-Kosten sind unwirtschaftlich | Kosten je Session/Lead steigen, Sessions laufen ungebremst | Benchmark, Usage Ledger, Session-/Tenantlimits, Budget-Kill-Switch und Kostenreconciliation | Product/Finance | G3, G5, G6, G8 |
| R-007 | Voice halluziniert, macht verbotene Zusagen oder übersieht Safety-/Handoffbedarf | Golden-/Red-Team-Fehler, unautorisierter Tool Call, fehlgeschlagener Transfer | höchstens drei Intents, explizite Zustände, fail-closed Tools, konservativer Handoff und Kill Switch | Product/Safety | G5, G6, G7 |
| R-008 | Audio, Rohtranskript oder Gesprächsinhalt wird persistiert oder in Telemetrie/Review kopiert | Inhalt in DB, Log, Trace, Crashdump, Ticket oder Reviewartefakt | Persistenz `0`, Content-Leak-Tests, synthetische Korpora; Produktivreview nur separat transparent und rechtlich freigegeben | Privacy/Security | G4, G5, G6, G7 |
| R-009 | Realtime-Latenz, Lärm oder Providerverlust macht den Assistenten unbrauchbar | Turn-p95/Abbruchrate steigt, Barge-in scheitert | `V-001`-Baseline, degradierter Human-/Textpfad, Sessionbudget und Last-/Störungstests | Engineering/Operations | G3, G4, G7 |
| R-010 | Scope wächst zu Rezeption, Diagnose, Disposition oder autonomer Aktion | vierter Intent, freie Tools, Preis-/Terminversprechen, CRM/Payment vor Evidenz | ein Gewerk, höchstens drei Intents, explizite Nicht-Ziele, WIP-Limits und Gate-Review | Product Owner | G0V, laufend |
| R-011 | Solo-Operator ist durch Voice-Incidents und Reviewaufwand überlastet | Alerts, Support- oder manuelle Reviewstunden steigen | Runbooks, SLOs, Kohortengrenzen, transparente Reviewpolicy, Kill Switch und Stopkriterium | Operations | G6, G7, G8 |
| R-012 | Infrastruktur-/Restorefehler verletzt RPO/RTO | Restore-, Secret-Rotation- oder Verfügbarkeitsnachweis scheitert | Offsite-Backup, Restore Drill, immutable Images und Cloud-Aktivierungstrigger | Operations | G6, G7 |

## Pflege

Bei jeder Gate-Review werden Eintrittswahrscheinlichkeit, Auswirkung,
Maßnahmenstatus und Owner bestätigt. Neue Risiken erhalten eine ID und werden
mit dem verursachenden oder mitigierenden Task verlinkt. Akzeptierte Restrisiken
benötigen Entscheider, Begründung und Ablauf-/Reviewdatum.
