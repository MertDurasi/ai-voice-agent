# Produktvision, Zielgruppe und Scope

## Problem

Kleine und mittlere Handwerksbetriebe verlieren Aufträge, weil Anrufe während
Einsätzen nicht angenommen werden. Rückrufe erfolgen zu spät, Informationen
fehlen und Leads werden nicht strukturiert verfolgt.

## MVP-Nutzenversprechen

Ein Handwerksbetrieb verbindet nach separater Freigabe eine Rufnummer. Ein
verpasster Anruf soll zuverlässig und höchstens einmal eine minimale,
freigegebene Text-Rückmeldung auslösen. Der Anrufer erfasst sein Anliegen
datensparsam. Der Betrieb sieht einen strukturierten Lead und wird
benachrichtigt. Nutzung, Zustellung, Rechtsgrundlage und Löschfristen bleiben
nachvollziehbar. Aktuell wird dieses Zielbild ausschließlich synthetisch über
Fake-/Replay-Adapter geprüft.

SHK ist die reversible Discovery-Kohorte; Bedarf und Segment-Fit sind noch
nicht durch Interviews validiert. Angebot und SMS als Primärkanal bleiben
reversible Hypothesen. `G0` bestätigt nur diese Lernrichtung und einen
realistischen Replay-Pfad, keinen Realversand.

## Primäre Zielgruppe

- Betriebe mit 2–30 Mitarbeitenden
- zunächst SHK als reversible Discovery-Kohorte; Elektro bleibt Pivotoption
- hoher Anteil eingehender mobiler Anfragen
- kein oder nur einfaches CRM
- Deutschland als erster Markt; Oberfläche und Dialoge zunächst Deutsch

## Jobs-to-be-done

- Betriebsinhaber: Nach einem verpassten Anruf sofort seriös reagieren, bevor
  der Auftrag verloren geht.
- Anrufer: Sofort erfahren, wie es weitergeht, ohne eine App installieren zu
  müssen.
- Büro/Disposition: Anfragen mit Dringlichkeit und Kontaktdaten zentral sehen
  und bearbeiten.

## MVP-Scope

- Multi-Tenant-Onboarding, Benutzer und Rollen
- eine verbundene Rufnummer pro Tenant; Datenmodell später erweiterbar
- ein Telefonieadapter und Webhooks für verpasste Anrufe
- SMS nur als zu prüfende Primärkanalhypothese; kein Realversand und kein
  stiller WhatsApp-/Dual-Send-Fallback ohne separate Freigabe
- regel-/templatebasierter Textback ohne generative KI im Versandpfad
- öffentliches tokenisiertes Kurzformular
- Lead-Inbox, Detailansicht, Status und interne Notizen
- E-Mail-Benachrichtigung an den Betrieb
- Plan/Subscription und belastbares Usage-Ledger; echte Abrechnung nur nach
  Freigabe
- Audit, Löschung, Export, Basis-Observability und Backups

## Explizite Nicht-Ziele des MVP

- vollständiger Voice-Agent oder Gesprächsaufzeichnungen
- generative freie Antworten an Endkunden
- native Mobile App
- Kubernetes oder eine Microservice-Landschaft
- mandantenspezifische Custom-Deployments
- vollständiges CRM, Angebots- oder Rechnungswesen
- Mehrsprachigkeit
- Kalender-Schreibzugriff vor validiertem Lead-Fluss und Bedarf

## Produktgrenze für Voice

Voice beginnt erst nach einem datengestützten Go in `P-004`/`G7`. Der Scope ist
dann auf ein Gewerk und höchstens drei Intents begrenzt. Das System ist kein
Notrufdienst; lebensbedrohliche Situationen dürfen nicht durch generative
Beratung verzögert werden.
