# ADR-004 – Ports & Adapter für externe Anbieter

- Status: accepted
- Datum: 2026-08-07

## Kontext

Telefonie, Messaging, E-Mail, Storage und Payment sind vertraglich und
technisch wechselanfällig. Providerdetails in Fachlogik würden Wechsel und
deterministische Tests erschweren.

## Entscheidung

Application-Code definiert kleine fachliche Ports. Provider-SDKs, Payloads und
Fehlercodes existieren ausschließlich in Outbound-/Inbound-Adaptern. Für jeden
kritischen Port gibt es Fake-/Replay- und Contract-Tests.

## Konsequenzen

Mapping und Fehlerklassifikation sind explizite Adapteraufgaben. Es entsteht
keine universelle Providerabstraktion; nur tatsächlich benötigte Fähigkeiten
werden modelliert.
