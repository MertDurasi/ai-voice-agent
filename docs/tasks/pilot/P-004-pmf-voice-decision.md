---
id: P-004
title: PMF- und Voice-Entscheidung
phase: pilot
status: blocked
priority: P0
owner: Product/Engineering/Safety
dependencies: [sufficient-pilot-data]
gate: G7
outputs: [docs/product/voice-go-no-go.md]
completed_at: null
---

# P-004 – PMF- und Voice-Entscheidung

## Ziel und Scope

Schriftliches Go/No-Go auf Basis der
[Voice-Go-Kriterien](../../product/metrics.md): aktive Zahlkunden/Stichprobe,
Kernstabilität, zahlungsbereite Nachfrage, Unit Economics sowie Begrenzung auf
ein Gewerk und höchstens drei Intents. Datenzeitraum und Unsicherheit angeben.

## Akzeptanz und Verifikation

- [ ] Jede Aussage ist auf KPI, Interviewevidenz oder Incidentdaten rückführbar.
- [ ] Offene P0/P1 Security/Privacy/Safety-Probleme verhindern ein Go.
- [ ] Kostenmodell enthält Telephony, Messaging, STT/LLM/TTS und Support.
- [ ] Go nennt Scope, Guardrails und Reviewdatum; No-Go nennt Textback-Fokus.
- [ ] Product, Engineering und Safety haben den Entscheid abgezeichnet.

Stop: Voice nie aus technischer Neugier oder ohne ausreichende Pilotdaten
freigeben. Nur ein explizites `G7 = Go` entsperrt V-001.
