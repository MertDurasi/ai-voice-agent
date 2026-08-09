---
id: V-005
title: Barge-in, Latenz und Audioqualität
phase: voice
status: blocked
priority: P1
owner: Engineering
dependencies: [V-002]
gate: G8
outputs: [streaming-partials, endpointing-vad, barge-in, latency-benchmark]
completed_at: null
---

# V-005 – Barge-in, Latenz und Audioqualität

## Ziel und Scope

Streaming Partials, Endpointing/VAD, zuverlässigen TTS-Abbruch, Echo/Noise,
Timeouts und Filler-Vermeidung implementieren. Traces separieren
Telephony/STT/LLM/TTS-Anteile ohne Inhalte.

## Akzeptanz und Verifikation

- [ ] Barge-in stoppt hörbare Ausgabe zuverlässig im definierten Testkorpus.
- [ ] Degradierter/ausgefallener Provider führt zu begrenztem Fallback.
- [ ] TTS Time-to-First-Audio < 250 ms, Turn median < 1,2 s und p95 < 2,0 s
      unter dokumentierter Region/Last oder neu begründete Benchmarkziele.
- [ ] Lärm, Echo, lange Stille, Paketverlust und Parallelität sind getestet.
- [ ] Keine Endlosschleife oder unbegrenzte Sessionkosten.
