# ADR-001 – Modularer Monolith

- Status: accepted
- Datum: 2026-08-07

## Kontext

Ein Solo-/Kleinteam muss schnell einen zuverlässigen mandantenfähigen Kern
liefern. Verteilte Systeme würden frühe Betriebs- und Transaktionskomplexität
erzeugen, während Voice erst nach einem Produkt-Gate relevant wird.

## Entscheidung

API und Worker bilden zunächst einen gemeinsam versionierten modularen
Monolithen. Module besitzen klare Domain-/Application-/Adapter-Grenzen.
Persistierte Events entkoppeln Nebenwirkungen.

## Konsequenzen

Einfachere lokale Entwicklung, atomare Transaktionen und weniger Betriebslast.
Boundary-Tests müssen logische Kopplung verhindern. Extraktion erfolgt nur nach
den messbaren Kriterien aus Phase C, nicht vorsorglich.
