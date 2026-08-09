# Definition of Done und Teststrategie

## Definition of Done je Task

- [ ] Akzeptanzkriterien sind erfüllt und demonstrierbar.
- [ ] TypeScript strict ohne neue Ausnahmen; Python später sauber mit
      Ruff/mypy.
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
| Application Unit | Use Cases mit Fakes | MissedCall → Textback, Retry, Suppression |
| DB Integration | reale PostgreSQL-Eigenschaften | RLS, Constraints, Migration, Outbox, Concurrency |
| Adapter Contract | Providervertrag | Mapping, Signatur, Fehlerklassen |
| API Integration | Auth, Validierung, Fehler | REST, Webhooks, RBAC |
| E2E | kritische Nutzerreise | Onboarding, Textback, Formular, Lead |
| Resilience | Ausfall/Wiederholung | Redis/Worker/Provider/DB, DLQ |
| Performance | SLO/Kapazität | Webhook-Burst, Queue, 10k Leads, später Voice |
| Security | Missbrauch/Isolation | Tenant Escape, IDOR, XSS, CSRF, Replay, SSRF |

## Verbindliche Golden Paths

1. Neuer Tenant → Konfiguration → Test-Call → Testnachricht.
2. Validierter Missed Call → genau eine Nachricht.
3. Duplicate/Out-of-order Webhooks → unveränderter fachlicher Endzustand.
4. Formular → genau ein Lead → Benachrichtigung.
5. Tenant A kann nichts von Tenant B lesen oder verändern.
6. Provider 429/5xx → kontrollierter Retry; permanenter Fehler → Ende/DLQ.
7. Subscription `suspended` → Suppression mit Reason Code.
8. Export/Löschung → vollständig, tenantisoliert und auditierbar.

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
