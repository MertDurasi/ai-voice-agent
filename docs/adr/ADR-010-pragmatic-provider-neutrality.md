# ADR-010 – Pragmatische Providerneutralität

- Status: accepted
- Datum: 2026-08-07

## Kontext

Vollständige Universalabstraktionen erzeugen vor Kenntnis realer Provider
unnötige Komplexität. Direkte Kopplung erzeugt andererseits Lock-in.

## Entscheidung

Abstrahiert werden reale Wechselrisiken an Telephony-, Messaging-, Email-,
Payment- und Storage-Ports. Pro Fähigkeit wird zunächst genau ein
Produktionsadapter gewählt; Fake-/Replay-Adapter bleiben Referenzvertrag.

## Konsequenzen

Der kanonische Vertrag ist klein und fachlich. Provider-Sonderfunktionen werden
nur aufgenommen, wenn Produktnutzen und Portabilitätskosten dokumentiert sind.
