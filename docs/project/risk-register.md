# Risikoregister

| ID | Risiko | Frühindikator | Gegenmaßnahme | Owner | Review |
|---|---|---|---|---|---|
| R-001 | WhatsApp/SMS rechtlich oder vertraglich unzulässig | fehlender Opt-in/Templatefreigabe | Kanal-/Rechtsprüfung, SMS/Callback-Link-Alternative, Suppression | Product/Legal | G0, G6 |
| R-002 | Provider liefert uneindeutige Events | keine stabile Event-ID, Reihenfolgefehler | Inbox, Hash, Reconciliation, Provider-Port | Engineering | D-002, G4 |
| R-003 | doppelte Endkundennachrichten | Retry-/Webhookduplikate | Unique Constraints, Idempotency Keys, Cooldown | Engineering | G4, G5 |
| R-004 | Tenant-Datenleck | IDOR-/RLS-Lücke | FORCE RLS, Negativsuite, getrennte Rollen | Security/Engineering | G2, G6 |
| R-005 | schlechte Aktivierung | Setup dauert, Portierung scheitert | Wizard, Concierge-Onboarding, Testmodus | Product | G3, Pilot |
| R-006 | variable Kosten unwirtschaftlich | Kosten je Lead steigen | Usage Ledger, Limits, Preis-Snapshot, Benchmark | Product/Finance | G0, G6 |
| R-007 | Voice halluziniert oder übersieht Notfall | Golden-Test-/Pilotfehler | Intentbegrenzung, konservativer Handoff, Kill Switch | Product/Safety | G7, G8 |
| R-008 | Solo-Operator überlastet | Alerts/Supportstunden steigen | Managed Services, Runbooks, SLOs, Kohorten | Operations | G6, Pilot |
| R-009 | VPS-Ausfall verletzt RPO/RTO | Restore-/Verfügbarkeitsfehler | Offsite-Backup, Restore Drill, Cloud-Trigger | Operations | G6, P-001 |
| R-010 | Scope Creep | Kalender/CRM/Voice vor stabilem Kern | harte Gates und Nicht-Ziele | Product Owner | laufend |

## Pflege

Bei jeder Gate-Review werden Eintrittswahrscheinlichkeit, Auswirkung,
Maßnahmenstatus und Owner bestätigt. Neue Risiken erhalten eine ID und werden
mit dem verursachenden oder mitigierenden Task verlinkt. Akzeptierte Restrisiken
benötigen Entscheider, Begründung und Ablauf-/Reviewdatum.
