# ADR-008 – Gesprächsaufzeichnung standardmäßig aus

- Status: accepted
- Datum: 2026-08-07

## Kontext

Roh-Audio erhöht Datenschutz-, Sicherheits- und Retention-Risiken erheblich.
Seit `ADR-013` ist Voice Teil des MVP, aber weder Aufzeichnung noch dauerhafte
Rohdaten sind für die eng begrenzte Erstaufnahme erforderlich.

## Entscheidung

Gesprächsaufzeichnung sowie Audio- und Rohtranskriptpersistenz sind technisch
verboten. Aktivierung benötigt einen separat freigegebenen Zweck,
Rechtsgrundlage, vollständige DSFA, Risikoentscheid und eine neue ADR.

## Konsequenzen

Voice-Qualität wird zunächst mit synthetischen/freigegebenen Testkorpora und
transienter Verarbeitung geprüft. Queue, Cache, Logs, Traces, APM,
Fehlerartefakte, Review-Samples und Backups dürfen weder Audio noch
Rohtranskripte oder Prompt-/Toolinhalte enthalten; Providertraining ist aus.
