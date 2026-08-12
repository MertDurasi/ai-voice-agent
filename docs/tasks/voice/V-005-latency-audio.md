---
id: V-005
title: Barge-in, Realtime-Latenz und Audioqualität
phase: voice
status: blocked
priority: P1
owner: Engineering
dependencies: [V-002]
gate: G4
outputs: [streaming-partials, endpointing-vad, barge-in, latency-benchmark]
completed_at: null
---

# V-005 – Barge-in, Realtime-Latenz und Audioqualität

## Ziel und Scope

Auf der in `V-001` gewählten Runtime Streaming Partials, Endpointing/VAD,
zuverlässigen Ausgabeabbruch, Echo/Noise, Timeouts und Filler-Vermeidung mit
synthetischem Audio umsetzen. Metriken separieren Telephony-/Runtime-/Modell-/
TTS-Anteile ohne Gesprächsinhalt.

## Akzeptanz und Verifikation

- [ ] Barge-in stoppt hörbare Ausgabe zuverlässig im versionierten Testkorpus.
- [ ] Degradierte/ausgefallene Komponenten führen zu begrenztem Handoff oder
      erlaubter Textback-Option, nie zu Endlosschleife.
- [ ] Die in `V-001` festgelegten Latenzbudgets sind unter dokumentierter
      Region, Last und Netzwerkannahme nachgewiesen oder lösen eine Stopregel aus.
- [ ] Lärm, Echo, lange Stille, Paketverlust, Backpressure und Parallelität
      sind getestet.
- [ ] Sessiondauer/-kosten sind hart begrenzt; Audio und Rohtranskript fehlen
      in Telemetrie und Persistenz.
