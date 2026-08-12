# Definition of Done und Teststrategie

## Definition of Done je Task

- [ ] Akzeptanzkriterien sind erfüllt und demonstrierbar.
- [ ] TypeScript strict ohne neue Ausnahmen; eine durch `V-001` gewählte andere
      Voice-Runtime nutzt ihre äquivalenten Format-, Typ- und Testgates.
- [ ] Domain-/Application-Unit- und relevante Integrationstests existieren.
- [ ] Daten-/API-Änderungen besitzen Cross-Tenant- und Autorisierungstests.
- [ ] Migration ist vorwärts getestet; Rückwärtsstrategie ist dokumentiert.
- [ ] Keine High/Critical Findings oder explizit akzeptierte, befristete
      Ausnahme.
- [ ] Logs enthalten keine Payloads, Tokens, unmaskierte Telefonnummern oder
      E-Mail-Adressen.
- [ ] Kritische Pfade besitzen Metriken und Correlation-/Trace-ID.
- [ ] README, OpenAPI, Runbook und ADR sind bei Betroffenheit aktualisiert.
- [ ] Lint, Typprüfung, Tests und relevante E2E-Prüfungen sind grün.
- [ ] Keine reale Provideraktion ohne ausdrückliche Freigabe.

## Testpyramide

| Ebene | Zweck | Beispiele |
|---|---|---|
| Domain Unit | Regeln/Zustände | Eligibility, Öffnungszeiten, Transitions, Pricing |
| Application Unit | Use Cases mit Fakes | VoiceOutcome → Lead/Handoff/Textback, Retry, Suppression |
| DB Integration | reale PostgreSQL-Eigenschaften | RLS, Constraints, Migration, Outbox, Concurrency |
| Adapter Contract | Providervertrag | Mapping, Signatur, Fehlerklassen |
| API Integration | Auth, Validierung, Fehler | REST, Webhooks, RBAC |
| E2E | kritische Nutzerreise | Onboarding, synthetische Voice-Session, Handoff, Textback, Formular, gemeinsamer Lead |
| Resilience | Ausfall/Wiederholung | Redis/Worker/Provider/DB, DLQ |
| Performance | SLO/Kapazität | Webhook-Burst, Queue, Leads, Voice-Latenz/Parallelität/Kostenlimits |
| Security | Missbrauch/Isolation | Tenant Escape, IDOR, XSS, CSRF, Replay, SSRF, Prompt-/Tool-Injection, Media-Leak |

## Verbindliche Golden Paths

1. Neuer Tenant → Konfiguration → synthetischer Voice-/Handoff-Test →
   Fake-Textback.
2. Inbound Call → KI-Hinweis → begrenzter Dialog → genau ein Lead.
3. Caller-/Policy-Handoff → sicherer Transfer oder expliziter Rückrufpfad.
4. Angeforderte/erlaubte Textfortsetzung → genau eine Nachricht; Formular
   ergänzt denselben Lead.
5. Duplicate/Out-of-order Webhooks/Commands → unveränderter fachlicher
   Endzustand und keine doppelte Außenwirkung.
6. Emergency-Trigger → kein normaler Dialog/Tool mehr; nichtgenerativer
   Safety-/Humanpfad.
7. Tenant A kann weder Daten noch Knowledge-/Promptkontext von Tenant B lesen.
8. Provider/Runtime/Tool-Ausfall → begrenzter Fallback, kein Endlosdialog und
   kein rekonstruierter Rohinhalt.
9. Audio-/Rohtranskript-/Prompt-Leak-Test → kein Fund in Store, Log, Trace,
   Crashdump, Backup oder Trainingssink.
10. Subscription `suspended` → Text-/Toolwirkung mit Reason Code unterdrückt.
11. Export/Löschung → Summary, Disclosure, Handoff und Usage vollständig,
    tenantisoliert und auditierbar.

## Testdaten

- ausschließlich synthetische Personen und eindeutig fiktive Testnummern;
- Providerverträge ausschließlich mit synthetisch erzeugten Fixtures testen;
  keine echten oder nur pseudonymisierten Providerpayloads committen;
- Zeit über injizierte Clock kontrollieren;
- Zufall deterministisch seeden;
- keine produktiven Dumps in Entwicklung oder CI.

## Testentwurf pro Task

Vor Implementierung werden Happy Path, relevante Negativfälle,
Autorisierung/Tenant-Isolation, Idempotenz/Nebenläufigkeit und
Fehler-/Recovery-Verhalten notiert. Akzeptanztests prüfen beobachtbares
Verhalten, keine privaten Implementierungsdetails.
