---
id: V-002
title: Separater Voice-Agent-Service
phase: voice
status: blocked
priority: P0
owner: Engineering
dependencies: [V-001]
gate: G8
outputs: [voice-service, provider-ports, simulated-pipeline, session-security]
completed_at: null
---

# V-002 – Separater Voice-Agent-Service

## Ziel und Scope

Separaten Python-Service mit Streaming Session, Health/Readiness,
Telephony/STT/LLM/TTS-Ports, Correlation-ID, kurzlebigen Credentials und
Graceful Session Cleanup bauen. Keine Roh-Audio-Persistenz gemäß ADR-008.

## Akzeptanz und Verifikation

- [ ] Simuliertes Audio durchläuft Pipeline ohne externe Produktion.
- [ ] Jeder Provider ist hinter Contract-getestetem Adapter austauschbar.
- [ ] Abbruch/Timeout räumt Session, Buffer und Credentials nachweisbar auf.
- [ ] Audio/Transkript/Prompts fehlen in Logs und Standard-Traces.
- [ ] Readiness reflektiert kritische Abhängigkeiten ohne Secret-Leak.
- [ ] Ruff, mypy, pytest sowie relevante Last-/Leak-Tests sind grün.
