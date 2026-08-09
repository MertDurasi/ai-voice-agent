# ADR-008 – Gesprächsaufzeichnung standardmäßig aus

- Status: accepted
- Datum: 2026-08-07

## Kontext

Roh-Audio erhöht Datenschutz-, Sicherheits- und Retention-Risiken erheblich und
ist für den Textback-MVP nicht erforderlich.

## Entscheidung

Gesprächsaufzeichnung und Roh-Audio-Persistenz sind technisch standardmäßig
deaktiviert. Aktivierung benötigt einen separat freigegebenen Zweck,
Rechtsgrundlage, Risikoentscheid und eine neue ADR.

## Konsequenzen

Voice-Qualität wird zunächst mit synthetischen/freigegebenen Testkorpora und
transienter Verarbeitung geprüft. Logs, Traces und Fehlerartefakte dürfen kein
Audio enthalten.
