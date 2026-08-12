---
id: O-002
title: Rufnummern-, Voice-Routing- und Handoff-Konfiguration
phase: onboarding
status: blocked
priority: P0
owner: Engineering
dependencies: [O-001, V-001]
gate: G3
outputs: [phone-config-domain, routing-policy, verification-port, fake-routing-adapter]
completed_at: null
---

# O-002 – Rufnummern-, Routing- und Handoff-Konfiguration

## Ziel und Scope

E.164-Nummer, pseudonymisierte/verschlüsselte Providerreferenz und Status
`pending_verification | test_ready | active | suspended` modellieren. Eine
versionierte Routing-Policy macht Voice zum primären Anrufpfad und beschreibt
erreichbaren Menschen/Rückruf sowie erlaubte Textback-Degradation. Besitz und
Routing werden über kleine Ports ausschließlich mit Fake-Adaptern verifiziert;
Providerdetails bleiben außen.

## Akzeptanz und Verifikation

- [ ] Dieselbe Rufnummer ist höchstens einem aktiven Tenant zugeordnet.
- [ ] `active` verlangt frische Verifikation, vollständige Handoff-Policy und
      expliziten Aktivierungsentscheid; Fake-Test nutzt `test_ready`.
- [ ] Normalisierung, parallele Aktivierung, Re-Verifikation und unvollständige
      Fallbackkonfiguration sind getestet.
- [ ] Änderungen sind RLS-geschützt, versioniert und auditiert.
- [ ] Logs zeigen nur maskierte Nummern; Suche nutzt keinen Klartextindex.

Stop: Keine echte Nummer provisionieren, portieren, routen oder kostenpflichtige
Provideraktion ohne separate Freigabe.
