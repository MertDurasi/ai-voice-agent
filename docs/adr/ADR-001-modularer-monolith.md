# ADR-001 – Modularer Monolith

- Status: accepted
- Datum: 2026-08-07

## Kontext

Ein Solo-/Kleinteam muss schnell einen zuverlässigen mandantenfähigen Kern
liefern. Verteilte Systeme würden frühe Betriebs- und Transaktionskomplexität
erzeugen. Voice ist seit `ADR-013` Teil des MVP, darf aber erst nach dem
Voice-first-Rebaseline-Gate `G0V` und ausschließlich synthetisch vorbereitet
werden.

## Entscheidung

API und Worker bilden zunächst einen gemeinsam versionierten modularen
Monolithen. Module besitzen klare Domain-/Application-/Adapter-Grenzen.
Persistierte Events entkoppeln Nebenwirkungen.

## Konsequenzen

Einfachere lokale Entwicklung, atomare Transaktionen und weniger Betriebslast.
Boundary-Tests müssen logische Kopplung verhindern. Extraktion erfolgt nur nach
den messbaren Kriterien aus Phase C, nicht vorsorglich.

## Aktuelle Einordnung durch ADR-013

[ADR-013](ADR-013-voice-first-combined-mvp.md) ändert den Zeitpunkt von Voice,
nicht die Entscheidung für einen modularen Control Plane. Eine ephemere
Realtime-Media-Runtime darf wegen Laufzeit-, Ressourcen- oder
Sicherheitsgrenzen separat sein, wenn `V-001` dies begründet; sie besitzt keine
eigene unkontrollierte Fachlogik oder persistente Source of Truth.
