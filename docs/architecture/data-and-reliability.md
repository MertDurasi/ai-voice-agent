# Datenmodell und zuverlässige Ereignisverarbeitung

## Mandantenbezogene Mindestfelder

```text
id          UUIDv7/UUID
tenant_id   UUID NOT NULL
created_at  timestamptz NOT NULL
updated_at  timestamptz NOT NULL
version     integer NOT NULL
```

PII wird klassifiziert. Telefonnummern werden nach E.164 normalisiert, für
Suche deterministisch gehasht und in Logs maskiert. Ausgewählte Felder werden
nach Threat Model feldverschlüsselt; Schlüssel liegen nicht in derselben DB.

## Zustandsautomaten

```text
Call:             received -> ringing -> answered | missed | failed -> completed
Message:          planned -> queued -> provider_accepted -> delivered | failed | suppressed
TextbackAttempt:  eligible -> scheduled -> sent | suppressed | exhausted
Lead:             new -> contacted -> qualified -> won | lost | archived
Subscription:     trialing -> active -> past_due -> canceled | suspended
ErasureRequest:   requested -> verified -> processing -> completed | rejected
```

Jeder Übergang ist explizit, getestet und über einen Use Case erreichbar.

## PostgreSQL Row-Level Security

- Runtime-Rolle ist weder Tabellenowner noch `BYPASSRLS`.
- Jede Tenant-Tabelle nutzt `ENABLE` und `FORCE ROW LEVEL SECURITY`.
- Request/Job setzt innerhalb einer Transaktion
  `SET LOCAL app.tenant_id = ...`.
- Policies enthalten `USING` und `WITH CHECK`.
- Systemjobs nutzen einen expliziten auditierbaren Pfad, kein stilles Bypass.
- Schema-Linter weist neue Tenant-Tabellen ohne Policy zurück.
- Negativtests decken Read, Insert, Update und Delete über Tenant-Grenzen ab.

## Webhook Inbox

Die Inbox persistiert Provider, Provider-Event-ID oder dokumentierten
deterministischen Ersatzschlüssel, Original-Event-Hash, Empfangszeit,
Validierungs- und Verarbeitungsstatus. Ein Unique Constraint verhindert
doppelte fachliche Verarbeitung. Raw Payloads werden nur nach freigegebener
Datenklassifikation und Retention gespeichert.

## Transactional Outbox

Fachänderung und Outbox-Event entstehen in derselben DB-Transaktion. Der
Dispatcher publiziert nach BullMQ; Consumer sind idempotent. Ein Datensatz wird
erst nach bestätigter Publikation markiert und nach definierter Retention
bereinigt.

Jeder externe Schreibvorgang besitzt einen Idempotency Key. Retries verwenden
exponentielles Backoff mit Jitter. Permanente Fehler gelangen in eine DLQ und
erzeugen einen alarmierten Operations-Fall.

## Verbindliche Zuverlässigkeitseigenschaften

- Mindestens-einmal-Transport darf höchstens-einmal fachliche Außenwirkung
  erzeugen.
- Out-of-order-Events führen deterministisch zum gleichen Endzustand.
- Redis-/Queue-Verlust vernichtet keine fachlichen Source-of-Truth-Daten.
- Replays, Reconciliation und kontrolliertes Requeue sind auditierbar.
