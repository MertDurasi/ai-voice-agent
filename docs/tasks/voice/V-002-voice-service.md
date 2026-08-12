---
id: V-002
title: Voice-Runtime und simulierte Streaming-Pipeline
phase: voice
status: blocked
priority: P0
owner: Engineering
dependencies: [G3]
gate: G4
outputs: [voice-runtime, provider-ports, simulated-pipeline, session-security]
completed_at: null
---

# V-002 – Voice-Runtime und simulierte Streaming-Pipeline

## Ziel und Scope

Die in `V-001` per ADR begründete kleinste Runtime-Form umsetzen: Streaming-
Session, Health/Readiness, Telephony-/STT-/LLM-/TTS- beziehungsweise
Managed-Runtime-Ports, Correlation-ID, kurzlebige Credentials und sicheres
Session-Cleanup. Die Pipeline läuft zunächst ausschließlich mit Simulationen
und persistiert weder Audio noch Rohtranskript.

## Akzeptanz und Verifikation

- [ ] Simuliertes Audio durchläuft den gewählten Pipelinepfad ohne externe
      Produktion oder echte Kontakte.
- [ ] Providerfähigkeiten bleiben hinter Contract-getesteten Outbound-Adaptern;
      Domain/Application importiert kein SDK.
- [ ] Abbruch, Timeout, Backpressure und Prozessende räumen Session, Buffer und
      Credentials nachweislich auf.
- [ ] Audio, Rohtranskript, Prompts und Gesprächsinhalte fehlen in Persistenz,
      Logs, Standard-Traces und Crashartefakten.
- [ ] Readiness reflektiert kritische Abhängigkeiten ohne Secret-Leak.
- [ ] Die für die gewählte Runtime dokumentierten Lint-, Typ-, Unit-, Last- und
      Leak-Checks sind grün; keine Sprachtoolchain wird pauschal vorausgesetzt.

Nicht im Scope: produktive Providerverbindung oder Dialog-/Toolautonomie.
