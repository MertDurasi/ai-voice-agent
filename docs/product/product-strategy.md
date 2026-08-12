# Produktvision, Zielgruppe und Scope

- Stand: 2026-08-11
- Strategie: Voice-first mit integriertem Textback
- Verbindlicher Entscheid: [ADR-013](../adr/ADR-013-voice-first-combined-mvp.md)

## Problem

Kleine und mittlere Handwerksbetriebe verlieren Aufträge, weil Anrufe während
Einsätzen nicht angenommen werden. Rückrufe erfolgen zu spät, Informationen
fehlen und Leads werden nicht strukturiert verfolgt.

## MVP-Nutzenversprechen

Ein Handwerksbetrieb verbindet nach separater Freigabe eine Rufnummer. Ein klar
als KI erkennbarer, begrenzter Voice-Agent beantwortet eingehende Anrufe als
primärer Assistent, erfasst das Anliegen strukturiert und erzeugt einen
nachvollziehbaren Lead. Er kann in einen freigegebenen menschlichen
Handoff-/Rückrufpfad wechseln. Textback setzt denselben Vorgang nur nach
positiver Eligibility und Kommunikationsfreigabe schriftlich fort, etwa für
einen sicheren Formularlink, oder dient als Fallback bei einem nicht
abgeschlossenen Voice-Pfad.

Voice, Textback, Lead, Audit, Usage und Löschung bilden einen gemeinsamen
tenantgebundenen Vorgang. Provider-Replays, Retries oder Kanalwechsel erzeugen
weder doppelte Leads noch unkoordinierte Nachrichten. Aktuell wird dieses
Zielbild ausschließlich synthetisch über Fake-/Replay-Adapter geprüft.

SHK ist die reversible Discovery-Kohorte; Bedarf und Segment-Fit sind noch
nicht durch Interviews validiert. Voice-Akzeptanz, höchstens drei konkrete
Intents, Textback-Kanal, Provider, Rufnummerntopologie und Angebot bleiben
prüfbare Hypothesen. Kein Gate behauptet vor `PO-004` und den späteren
Safety-/Security-/Go-live-Nachweisen einen zulässigen Realbetrieb.

## Primäre Zielgruppe

- Betriebe mit 2–30 Mitarbeitenden
- zunächst SHK als reversible Discovery-Kohorte; Elektro bleibt Pivotoption
- hoher Anteil eingehender mobiler Anfragen
- kein oder nur einfaches CRM
- Deutschland als erster Markt; Oberfläche und Dialoge zunächst Deutsch

## Jobs-to-be-done

- Betriebsinhaber: Jeden relevanten Anruf professionell erstaufnehmen, ohne die
  Arbeit beim Kunden zu unterbrechen.
- Anrufer: Sofort eine klare, ehrliche und sichere Erstaufnahme erhalten und
  bei Bedarf schriftlich oder mit einem Menschen fortfahren.
- Büro/Disposition: Anfragen mit Herkunft, Dringlichkeit, Unsicherheit und
  Kontaktdaten zentral sehen und bearbeiten.

## MVP-Scope

- Multi-Tenant-Onboarding, Benutzer und Rollen
- eine verbundene Rufnummer pro Tenant; Datenmodell später erweiterbar
- providerneutraler Telefonie-/Voice-Vertrag mit Fake-/Replay-Referenz
- Voice als primärer Anrufpfad mit nicht überspringbarer KI-Transparenz
- genau ein Gewerk und höchstens drei nach `PO-001`/`V-001` validierte Intents
- strukturierte Erstaufnahme, freigegebene Fakten und Human-/Rückruf-Handoff
- SMS nur als zu prüfender Textback-Kandidat; kein Realversand, stiller
  Dual-Send oder WhatsApp-Fallback ohne separate Freigabe
- deterministische Channel-Eligibility und versionierte Textback-Templates
- öffentliches tokenisiertes Kurzformular als optionale Fortsetzung
- gemeinsame Lead-Inbox, Detailansicht, Status und interne Notizen
- E-Mail-Benachrichtigung an den Betrieb
- Plan/Subscription und belastbares Usage-Ledger für Telefonie, Voice und
  Messaging; echte Abrechnung nur nach Freigabe
- Audit, Löschung, Export, Basis-Observability und Backups

## Explizite Nicht-Ziele des MVP

- unbeschränkter autonomer Rezeptionist oder beliebige freie Intents
- Gesprächsaufzeichnung, persistiertes Audio oder Rohtranskript
- Voiceprints, Sprecheridentifikation, Emotionserkennung oder Providertraining
  mit Gesprächsdaten
- technische/medizinische Diagnose oder generative Notfallberatung
- verbindliche Preis-, Einsatz-, Termin- oder Verfügbarkeitszusage
- beliebige Tool-/URL-Aufrufe, Zahlung oder Kalender-Schreibzugriff
- native Mobile App, Mehrsprachigkeit oder vollständiges CRM
- Kubernetes, vorzeitige Microservices oder mandantenspezifische Deployments

## Unveränderliche Voice-/Textback-Grenzen

- KI-Hinweis vor fachlicher Datenerhebung; Human-/Rückrufalternative
- Safety-Pfad beendet normale Automation ohne generative Verzögerung
- Voice-Audio und Rohtranskript nur flüchtig mit Persistenz `0`
- nur separat freigegebene strukturierte Summary darf gespeichert werden
- Textback ausschließlich nach positiver, versionierter Eligibility
- alle Anbieter und realen Außenwirkungen bleiben bis zu ihren Gates aus
- ein Gewerk und maximal drei Intents; Erweiterung nur mit neuer Evidenz
