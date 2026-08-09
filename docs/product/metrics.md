# Kennzahlen und Produkt-Gates

## North Star und Guardrails

| Kennzahl | Definition | Ziel/Gate |
|---|---|---|
| Aktivierung | Tenant verbindet Rufnummer, verarbeitet Testevent und aktiviert Textback | ≥ 70 % gestarteter Onboardings |
| Time-to-Value | Tenant-Erstellung bis erfolgreicher Test-Textback | Median < 20 min |
| Textback-Latenz | `missed_call_detected_v1` bis `textback_provider_accepted_v1` | p95 < 60 s |
| Zustellquote | zugestellte / akzeptierte Nachrichten | messen und providerbereinigt auswerten |
| Lead-Conversion | qualifizierte Formularantworten / zugestellte Textbacks | Pilotbaseline, dann Ziel |
| Fehlerhafte Duplikate | doppelte Nachricht für dasselbe Ereignis | 0 toleriert |
| Tenant-Isolation | erfolgreiche automatisierte Cross-Tenant-Zugriffe | 0 toleriert |
| Supportlast | Supportzeit je aktivem Tenant/Monat | vor Voice < 60 min |
| Bruttomarge | Umsatz minus variable Provider-/AI-Kosten | Textback > 70 % |
| Churn | gekündigte zahlende / aktive Tenants pro Monat | < 5 % bei ausreichender Stichprobe |

## Produkt-Funnel und Events

Die Benennung wurde in `D-001` versioniert festgelegt. Abzubilden sind:

```text
onboarding_started_v1
-> phone_connected_v1
-> test_event_processed_v1
-> test_textback_accepted_v1
-> textback_activated_v1
-> missed_call_detected_v1
-> textback_suppressed_v1 | textback_provider_accepted_v1
-> textback_delivered_v1
-> lead_form_opened_v1
-> lead_submitted_v1
-> lead_qualified_v1
```

Eventdefinitionen sind versioniert, datensparsam und enthalten weder
Telefonnummern noch Nachrichteninhalte.

## Voice-Go-Kriterien

- mindestens zehn zahlende und aktiv nutzende Kunden oder schriftlich
  begründete andere Stichprobe;
- stabiler Textback-Kernpfad ohne ungelöste P0/P1-Sicherheits- oder
  Datenschutzprobleme;
- wiederholte zahlungsbereite Voice-Nachfrage in Interviews;
- positive Unit Economics oder belastbarer Pfad;
- genau ein Gewerk und höchstens drei Voice-Intents.

`P-004` dokumentiert ein Go/No-Go mit Daten. Ein No-Go führt zu weiterer
Textback-Optimierung, nicht zu einem technisch motivierten Voice-Start.
