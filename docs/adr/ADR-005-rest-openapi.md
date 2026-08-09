# ADR-005 – REST `/api/v1`, OpenAPI und separate Webhooks

- Status: accepted
- Datum: 2026-08-07

## Kontext

Frontend und Integrationen benötigen stabile versionierte Verträge, während
Provider-Webhooks andere Authentifizierungs- und Latenzanforderungen besitzen.

## Entscheidung

Die Produkt-API ist REST unter `/api/v1`, beschrieben durch OpenAPI. Der
Webclient nutzt generierte TypeScript-Verträge. Webhooks liegen an separaten
Endpunkten und folgen providerbezogenen Contract-/Security-Tests.

## Konsequenzen

Breaking Changes werden in CI erkannt. Fehlerformate und Versionierung bleiben
stabil; Webhook-Raw-Body-Verarbeitung beeinflusst die Produkt-API nicht.
