# Kennzahlen und Produkt-Gates

- Stand: 2026-08-11
- Scope: gemeinsamer Voice-first-/Textback-MVP

## North Star und Guardrails

North Star ist der Anteil eingehender, vom primären Voice-Assistenten oder
seinem kontrollierten Textback-/Human-Fallback als verwertbarer, genau einmal
erzeugter Lead gesicherter Anfragen.

| Kennzahl | Definition | Ziel/Gate |
|---|---|---|
| Aktivierung | Tenant verbindet Nummer, besteht Voice-, Handoff- und Textback-Faketest und aktiviert kombinierte Konfiguration | ≥ 70 % gestarteter Onboardings |
| Time-to-Value | Tenant-Erstellung bis erster erfolgreicher synthetischer Voice- und Textback-Test | Median < 30 min als neue Hypothese; nach `O-004` schärfen |
| Assistant Answer Rate | gestartete Voice-Sessions / technisch zustellbare Inbound Calls im aktiven Routingfenster | Pilotbaseline; technische Fehler separat |
| Disclosure Completion | vollständig erreichter KI-Hinweispfad / gestartete Voice-Sessions | 100 % vor jedem Fachdialog/-tool |
| Voice Task Completion | erlaubter strukturierter Abschluss / Sessions nach Disclosure, getrennt je Intent | Benchmark in `V-001`, Pilotziel danach |
| Human-Handoff Success | angenommene Transfers oder bestätigte Rückrufpfade / angeforderte Handoffs | Pilotbaseline mit null stillem Verlust |
| Textback-Fallback Success | zugestellte erlaubte Fortsetzungen bzw. Fallbacks / positiv entschiedene Textback-Intents | messen; keine ungeplanten Sends |
| Voice Turn-Latenz | Ende Caller-Turn bis hörbarer Beginn Antwort | Benchmarkhypothese Median <1,2 s, p95 <2,0 s; `V-001` validiert |
| Textback-Latenz | positiver Channel-Intent bis `textback_provider_accepted_v1` | p95 <60 s |
| Lead Completion | genau einmal erzeugte Leads mit notwendigen Feldern / erlaubte Voice-/Formabschlüsse | Pilotbaseline, dann Ziel |
| Verbotene Zusagen/Safety-Verstöße | Diagnose, Preis-/Terminversprechen, Tool vor Disclosure oder Automation nach Emergency | 0 toleriert in Golden-/Red-Team-Suite |
| Doppelte Außenwirkung | doppelter Lead, Textback, Handoff- oder Tool-Effekt für denselben bestätigten Intent | 0 toleriert |
| Audio-/Rohtranskript-Leak | Fund in DB, Log, Trace, Crashdump, Backup oder Trainingssink | 0 toleriert |
| Tenant-Isolation | erfolgreiche automatisierte Cross-Tenant-Zugriffe oder Knowledge-Leaks | 0 toleriert |
| Supportlast | Supportzeit je aktivem Tenant/Monat | <60 min als Hypothese; Voice separat ausweisen |
| Variable Kosten | Telefonie + Voice-Komponenten + Messaging je abgeschlossenem Call/Lead | Low/Base/High in `PO-003`; harter Pilot-Cap |
| Bruttomarge | Umsatz minus variable Provider-/AI-Kosten | Ziel >70 %, vor Pricing anhand Voice-Pilot neu bewerten |
| Churn | gekündigte zahlende / aktive Tenants pro Monat | <5 % erst bei ausreichender Stichprobe |

## Gemeinsamer Funnel und Events

```text
onboarding_started_v1
-> phone_connected_v1
-> test_event_processed_v1
-> test_voice_session_completed_v1
-> test_textback_accepted_v1
-> voice_textback_activated_v1
-> voice_session_started_v1
-> ai_disclosure_completed_v1
-> voice_lead_captured_v1
   | voice_handoff_requested_v1
   | textback_suppressed_v1
   | textback_provider_accepted_v1
-> textback_delivered_v1? -> lead_form_opened_v1? -> lead_submitted_v1?
-> lead_qualified_v1
```

Voice- und Formularpfad referenzieren denselben Call-/Contact-Vorgang. Ein
Formular ergänzt den Lead idempotent und erzeugt nicht automatisch einen
zweiten. Produkt-Events sind versioniert, datensparsam und enthalten weder
Telefonnummern noch Audio, Rohtranskript, Prompt, Nachrichten- oder
Formularinhalt.

## MVP-Pilot-Entry

Ein kombinierter Realpilot ist nur zulässig, wenn:

- genau ein Gewerk und höchstens drei Intents durch `PO-001`/`V-001` begründet
  und im synthetischen Golden Set nachgewiesen sind;
- kein ungelöstes P0/P1 bei Isolation, Disclosure, Safety, Handoff,
  Idempotenz, Audio-/Transkript-Leak, Provider oder Retention besteht;
- vollständige DSFA sowie Legal-, Product-, Safety-, Security-, Provider-,
  Budget- und Go-live-Freigaben dokumentiert sind;
- Kosten pro Minute, Call und Lead mit harten Tenant-/Providerlimits messbar
  sind;
- Kill Switch, Restore, Erasure, Incident- und nicht erreichbarer
  Human-Fallback praktisch geprobt wurden.

## Post-Pilot-Entscheidung

`P-004` bereitet nach ausreichenden kombinierten Pilotdaten einen
`stop | continue | scale`-Entscheid vor. `PO-010` nimmt ihn ausdrücklich ab.
Bewertet werden Nutzen, Voice-/Textback-Akzeptanz, Leadqualität, Safety,
Support, Kosten, Marge und Incidentprofil. Ein `stop` beendet reale
Außenwirkungen kontrolliert; ein `continue` behält den engen Scope; ein
`scale` benennt die separat freizugebende nächste Kohorte oder Fähigkeit.
