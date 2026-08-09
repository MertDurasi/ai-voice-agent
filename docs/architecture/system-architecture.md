# Systemarchitektur und Modulgrenzen

## Architekturform

Die Anwendung startet als mandantenfähiger modularer Monolith. API und Worker
werden gemeinsam versioniert, die Domänenmodule bleiben jedoch explizit
getrennt. Persistierte Events entkoppeln Nebenwirkungen. Services werden nur
bei nachgewiesenem Skalierungs-, Sicherheits-, Verfügbarkeits- oder
Teamownership-Bedarf extrahiert.

Verbindliche Entscheidungen stehen in [den ADRs](../adr/README.md).

## Module

| Modul | Besitzt | Darf nicht besitzen |
|---|---|---|
| Identity/Tenancy | Tenant, Membership, Rollen, Tenant-Kontext | Provider-Accounts, Leads |
| Onboarding/Config | Betriebsprofil, Öffnungszeiten, Nummernkonfiguration, Templates | Zustellstatus, Abrechnung |
| Telephony | Call, CallEvent, TelephonyPort | Nachrichtenversand |
| Textback | Triggerregeln, TextbackAttempt, Kanalauswahl | Provider-SDK |
| Conversations | Conversation, Message, Zustellzustand | Tenant-Authentifizierung |
| Leads | Lead, Status, Notiz, Assignment | Webhookvalidierung |
| Notifications | E-Mail-/Messaging-Ports, Versandorchestrierung | Lead-Fachregeln |
| Billing | Plan, Subscription, UsageRecord, Preis-Snapshot | Payment-SDK außerhalb Adapter |
| Compliance | CommunicationPermissionEvidence, RetentionPolicy, ErasureRequest, AuditEvent | beliebige Providerlogik |
| Admin/Ops | Supportzugriff, Feature Flags, Betriebsaktionen | Umgehung von Audit/RLS |

## Kommunikationsregeln

- Synchron innerhalb eines Use Cases über explizite Application-Service-Ports.
- Asynchron für Nebenwirkungen über Transactional Outbox und Queue.
- Keine direkten Repository-Aufrufe über Modulgrenzen.
- Keine zyklischen Modulabhängigkeiten.
- Gemeinsame Pakete enthalten technische Querschnittsfunktionen oder stabile
  Verträge, keine Ablage für geteilte Geschäftslogik.

## Modulinterne Struktur

```text
<module>/
├── domain/          # Aggregate, Value Objects, Domain Events; frameworkfrei
├── application/     # Use Cases, Ports, Commands/Queries
├── adapters/
│   ├── inbound/     # REST, Webhook, Queue Consumer
│   └── outbound/    # DB, Provider, Queue Producer
└── module.ts        # NestJS-Komposition
```

Domain und Application importieren keine NestJS-Controller, ORM-Modelle oder
Provider-SDKs. Boundary-Regeln und Architekturtests erzwingen dies.

## API-Grenzen

- Produkt-API unter `/api/v1`, vertraglich durch OpenAPI.
- Provider-Webhooks haben getrennte Endpunkte und Sicherheitsanforderungen.
- Web nutzt einen aus OpenAPI generierten TypeScript-Client.
- Zustandsänderungen erfolgen nur über Use Cases; ungültige Übergänge liefern
  stabile Domain Errors ohne Seiteneffekt.
