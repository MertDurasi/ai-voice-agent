---
id: O-002
title: Rufnummernkonfiguration
phase: onboarding
status: blocked
priority: P0
owner: Engineering
dependencies: [O-001, D-002]
gate: G3
outputs: [phone-config-domain, verification-port, fake-verification-adapter]
completed_at: null
---

# O-002 – Rufnummernkonfiguration

## Ziel und Scope

E.164-Nummer, pseudonymisierte/verschlüsselte Providerreferenz und Status
`pending_verification | active | suspended` modellieren. Besitz/Routing über
einen kleinen Port und zunächst Fake-Adapter verifizieren; Providerdetails
bleiben im Adapter.

## Akzeptanz und Verifikation

- [ ] Dieselbe Rufnummer ist höchstens einem aktiven Tenant zugeordnet.
- [ ] Aktivierung verlangt erfolgreiche, frische Verifikation.
- [ ] Normalisierung, parallele Aktivierung und Re-Verifikation sind getestet.
- [ ] Änderungen sind RLS-geschützt und auditiert.
- [ ] Logs zeigen nur maskierte Nummern; Suche nutzt keinen Klartextindex.

Stop: Keine echte Nummer provisionieren/portieren oder kostenpflichtige
Provideraktion ohne Freigabe.
