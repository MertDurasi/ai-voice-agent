# Retention- und Löschentwurf

- Status: `research_hypothesis`; **keine Produktionsfrist ist rechtlich freigegeben**
- Stand: 2026-08-08
- Owner: Privacy/Legal/Product/Security/Operations
- Task: `D-003`
- Freigabepfad: qualifizierte Prüfung in `PO-004`, technische Umsetzung später in `B-004`

## 1. Geltungsgrenze

Dieses Dokument übersetzt das [Dateninventar](data-flow.md) in technische
Löschklassen. Alle Zeiträume sind bewusst kurze Engineering-Kandidaten für
Datenminimierung und Testbarkeit. Sie sind weder Rechtsberatung noch
Produktionsfreigabe. Bis Zweck, Rollen, Starttrigger, Frist und Ausnahmen je
Klasse versioniert geprüft wurden, bleiben Telefonie-, SMS-, ESP-, Payment- und
Voice-Realflüsse `real_blocker`.

Für synthetische Fake-/Replay-Daten gilt `RET-00`. Echte oder pseudonymisierte
Produktivdaten dürfen nie unter einer Testklassifikation gespeichert oder als
Replay-Fixture verwendet werden. Hashes, stabile pseudonyme IDs,
Auditreferenzen und wiederherstellbare Backups können personenbezogen bleiben
und unterliegen dann weiterhin dem Löschkonzept.

Fehlt für eine reale Datenklasse eine freigegebene Policy, lautet die technische
Wirkung `fail_closed` – nicht unbegrenzte Speicherung.

## 2. Policy-Katalog

| ID | Daten und Starttrigger | Technischer Kandidat, nicht freigegeben | Löschwirkung | Status/offene Freigabe |
|---|---|---|---|---|
| `RET-00` | ausschließlich synthetische Fixtures sowie ephemere Fake-/Replay-/Sessiondaten | ephemere Testdaten nach Testende, spätestens **24 Stunden**; nachweislich synthetische, versionierte Contract-Fixtures im Repo bis Ablösung | Test-DB, Queue und Artefakte leeren; Repo-Fixture nur versioniert ersetzen | `not_applicable`, solange keine reale Person bestimmbar ist; QA belegt Egress `default-deny` und keine Produktivkopie |
| `RET-01` | abgelehnter/ungültiger Webhook | Raw Body **Persistenz 0**; nur inhaltsfreier Reason Code/Hash darf nach `RET-09` verarbeitet werden | Raw Body im Requestspeicher verwerfen; weder DLQ noch Trace enthalten Payload | `real_blocker`: Security/Legal prüfen Notwendigkeit von Hash/IP |
| `RET-02` | gültiger Raw Webhook ab Empfang | nur bis sichere Kanonisierung/Reconciliation, harte Obergrenze **7 Tage** | Raw Body zuerst löschen; getrennte Inboxhülle darf nur IDs, Hash, Status und Fehlercode enthalten | `real_blocker`: TDDDG/TKG, Provider-Replay-/Disputebedarf und Quarantäneprozess |
| `RET-03` | Call/CallEvent/Eligibility ohne erzeugten Lead ab terminalem Zustand | höchstens **30 Tage**; Klarbezug früher entfernen, sobald Idempotenz, Störung und offene Rechteanfrage abgeschlossen sind | E.164 und unnötige Providerreferenzen löschen; nur wirklich anonyme Aggregation darf länger bestehen | `real_blocker`: Verkehrsdatenrolle, Missed-Call-Zweck und `DEC-005` |
| `RET-04` | Capability ab Erzeugung; Public-Form-Session ab letzter Aktivität | Capability höchstens **72 Stunden**, one-time; nach Nutzung/Ablauf Löschung spätestens innerhalb **24 Stunden**; übrige Test-/Sessiondaten höchstens **24 Stunden** | Klartext nur bei Erzeugung/Empfänger; Hash, Session, Rate-Key, IP/User-Agent nach Fenster löschen; keine Referrer-/Analyticskopie | `real_blocker`: `DEC-011`, Missbrauchsabwägung, TDDDG § 25 und DSR-Verifikation |
| `RET-05` | tatsächlich gerenderter SMS-Inhalt | interne separate **Persistenz 0**; Body nur transient zum freigegebenen Provideradapter; Template-/Hinweisversion und Renderhash nach `RET-06` | Body aus Queue, Log, Audit, Trace und Backup ausschließen; Provider-/Endgerätkopie nach `RET-12` behandeln | `real_blocker`: exaktes Legal-Template, Beschwerde-/Nachweisbedarf und Providerdefault |
| `RET-06` | Conversation-/Message-/DLR-/Idempotenzmetadaten ab terminalem Status | höchstens **90 Tage** | Zielnummer, ProviderMessageId, Status und technische Referenzen nach Ablauf löschen; keine Providerkopie als intern gelöscht ausgeben | `real_blocker`: Erst-SMS, Kosten-/Beschwerdebedarf und Providervertrag |
| `RET-07` | Tenant-/Betriebs-/Templatekonfiguration sowie Formular, Lead, Freitext, Workflow und Notification | Lead und Inhaltsdaten maximal **Pilotende plus 90 Tage**; Konfiguration/Account als Kandidat während aktiver Nutzung und höchstens 30 Tage nach Tenantende | Freitext, Name, Nummer und Notizen zuerst; danach Workflow-/Notificationdetail; Version/Aktion ohne Inhalt ggf. nach `RET-08` | `real_blocker`: Feldminimum, Art.-9-/Notfallprozess, Vertragsende und Export |
| `RET-08` | Audit-, Security-, Incident-, Job-/DLQ-/Requeue- und Supportzugriff ab Ereignis/Incidentabschluss | technische Obergrenze **180 Tage**; bestätigter Legal Hold ist einzige dokumentierte Ausnahme | keine Payload behalten; Actor-/Resourcebezug nach Ablauf löschen oder nur nach Anonymitätsnachweis aggregieren | `real_blocker`: Interessenabwägung, Incident-/Nachweispflichten und Supportinformation |
| `RET-09` | PII-arme Ops-Logs/Traces sowie zulässige Security-/Rate-Signale ab Erzeugung | höchstens **14 Tage** | Rohereignis und Korrelationsschlüssel löschen; keine Nummer, E-Mail, Nachricht, Token oder Payload | `research_hypothesis` nur für synthetische Tests; reale Felder, Zweck und Anbieter offen |
| `RET-10` | Exportobjekt/Downloadtoken ab Bereitstellung | höchstens **7 Tage**, bei Widerruf oder erfolgreichem Abschluss früher | Link widerrufen, Schlüssel und Objekt löschen; minimaler inhaltsfreier Request-/Erledigungsnachweis nach `RET-08` | `real_blocker`: Identitätsprüfung, Delivery, Rechteprozess und externe Kopien |
| `RET-11` | Usage, Vertrag, KYC, Billing-/Steuerunterlagen | synthetische Usage nach `RET-00`; für gesetzlich relevante reale Unterlagen **keine Frist festgelegt** | operative Details von später qualifizierten Pflichtunterlagen trennen; nie Karten-/Bankdaten im Produkt | `real_blocker`: Betreiber, Echtgeldmodell und verbindliche Legal-/Tax-Klassifikation fehlen |
| `RET-12` | verschlüsselte Backups ab Snapshot; Provider-/Carrier-/ESP-/IdP-/Observabilitykopien ab Übermittlung | Backupobergrenze **30 Tage**; externer Dienst höchstens Frist der Ursprungsklasse, sofern eine dokumentierte Pflicht nichts anderes verlangt | Providerdelete nachweisen; Backup rollierend altern lassen; nach Restore Tombstones vor Egress erneut anwenden; Endgerät/Postfach als nicht fernlöschbar transparent machen | `real_blocker`: DPA/TIA, Providerdefaults, Lösch-SLA, Subprozessoren und Restore-Design |
| `RET-13` | `CommunicationPermissionEvidence`, Widerspruch und Suppression ab Statusänderung | **keine Frist festgelegt**; getrennt vom Lead und nur minimaler Scope/Kanal/Zweck-Nachweis | Nummer nur verschlüsselt oder als geeigneter Suchwert, kein Profiling/Analytics und keine Reaktivierung für Versand | `real_blocker`: Rechtsgrund, Erasure-Konflikt, Nachweis- und Verjährungsbedarf durch Legal festlegen |
| `RET-14` | Provider-/Vertrags-/KYC-Register ab Vertrags- oder Accountende | **keine Frist festgelegt** | Produktdatenbank bereinigen; qualifizierte Vertrags-/KYC-Unterlagen nur im freigegebenen Register | `real_blocker`: konkrete juristische Einheiten, Providerpflichten und Legal-/Tax-Klassifikation |
| `RET-15` | Secrets, Schlüssel und ephemere Credentials | Sessioncredential nur in Memory bis Sessionende; langlebige Secrets bis Rotation mit eng begrenztem Überlappungsfenster | revoke, rotate und zeroize statt Betroffenenlöschung; nie in Repo, DB, Log, Export oder Backup ohne Kryptokonzept | `research_hypothesis`: Rotation, Schlüsselzugriff und Crypto-/Backupdesign später technisch abnehmen |
| `RET-V00` | Voice-Audioframes, Rohtranskript, inhaltliche Prompts/Outputs/Tooldaten und Sessionbuffer | **Persistenz 0**; nur flüchtig während später freigegebener Session, Cleanup bei Ende/Abbruch/Timeout; Provider vertraglich und technisch No-Retention/No-Training | kein DB-, Object-Store-, Backup-, Log-, Trace-, Crashdump- oder Review-Sample; Buffer und Credential aktiv nullen | `real_blocker`: vollständige DSFA, § 201 StGB/TDDDG, Providervertrag und `V-001`/`V-004` |
| `RET-V01` | erst später freigegebene strukturierte Voice-Summary ab Lead-/Summaryaktivität | keine Speicherung vor Legal-/DSFA-/Productfreigabe; danach höchstens Kandidat `RET-07` | Summary und Korrekturen löschen; keine Audio-/Rohtextquelle rekonstruierbar halten | `real_blocker`: separates Schema, Zweck, Art.-9-Prüfung, Safety-Abnahme und `V-004` |

## 3. Vollständiges `DATA-* -> RET-*`-Mapping

| Datenklasse | Policy | Datenklasse | Policy |
|---|---|---|---|
| `DATA-01` | `RET-07`; Vertrags-/Plandokument ggf. `RET-11` | `DATA-15` | `RET-07`, Backup `RET-12` |
| `DATA-02` | Account `RET-07`; Securityevent `RET-08`/`RET-09`; Secret `RET-15` | `DATA-16` | `RET-07`, Backup `RET-12` |
| `DATA-03` | `RET-07`; Rollenänderung `RET-08` | `DATA-17` | `RET-07`, ESP/Postfach `RET-12` |
| `DATA-04` | `RET-07`, Backup `RET-12` | `DATA-18` | `RET-08` |
| `DATA-05` | Konfiguration `RET-07`; Verifikation/Provider `RET-14`; Backup `RET-12` | `DATA-19` | `RET-09`; Incidentnachweis `RET-08`; externer Sink `RET-12` |
| `DATA-06` | `RET-07`; Aktivierungsaudit `RET-08` | `DATA-20` | synthetisch `RET-00`; real vorerst `real_blocker`, spätere Policy separat festlegen |
| `DATA-07` | `RET-13`; Änderungsaudit `RET-08`; externe Kopie `RET-12` | `DATA-21` | `RET-11`, Providerkopie `RET-12` |
| `DATA-08` | abgelehnt `RET-01`; akzeptiert `RET-02`; Provider/Edge `RET-12` | `DATA-22` | Requestnachweis `RET-08`; Export `RET-10`; Provider/Backup `RET-12`; Hold nach Abschnitt 5 |
| `DATA-09` | `RET-03`, Provider/Backup `RET-12` | `DATA-23` | `RET-08`; Accountbezug `RET-07` |
| `DATA-10` | Eventhülle `RET-02`; Job-/DLQ-Nachweis `RET-08`; transient fake `RET-00` | `DATA-24` | `RET-12` |
| `DATA-11` | `RET-03`; Decision-/Auditnachweis `RET-08` | `DATA-25` | `RET-14`; Abrechnungsbezug `RET-11`; Providerkopie `RET-12` |
| `DATA-12` | Token `RET-04`; Inhalt `RET-05`; Metadaten `RET-06`; Provider/Endgerät `RET-12` | `DATA-26` | `RET-15` |
| `DATA-13` | `RET-06`; Abrechnungsbezug `RET-11`; Provider `RET-12` | `DATA-27` | `RET-00` |
| `DATA-14` | `RET-04`; PII-arme Telemetrie `RET-09` |  |  |

| Voice-Datenklasse | Policy | Besonderheit |
|---|---|---|
| `DATA-V01` | `RET-V00` | Audio-Persistenz 0 |
| `DATA-V02` | `RET-V00` | Rohtranskript-Persistenz 0 |
| `DATA-V03` | Inhalt `RET-V00`; minimale inhaltsfreie Resultmetadaten ggf. `RET-08` | keine Prompt-/Toolinhalte im Audit |
| `DATA-V04` | `RET-08` | nur Hinweisversion, Ergebnis und Zeit; kein Audio/Wortlaut |
| `DATA-V05` | `RET-08` | nur später freigegebene PII-arme Safety-/Handoffmetadaten |
| `DATA-V06` | `RET-V01`, Backup erst nach Freigabe `RET-12` | ausschließlich strukturierte Summary |
| `DATA-V07` | Betrieb `RET-08`/`RET-09`; Usage `RET-11`; Provider `RET-12` | keine Audio-/Textinhalte |
| `DATA-V08` | `RET-V00`/`RET-15` | Buffer/Credential aktiv nullen |
| `DATA-V09` | `RET-00` | keine Produktivgespräche als Testkorpus |
| `DATA-V10` | `RET-V00` | Erhebung/Ableitung/Persistenz verboten |

## 4. Lösch-Lifecycle

1. **Klassifizieren:** Jeder persistierte Datensatz trägt eine bekannte
   `data_class`, `retention_policy_version`, `created_at`, den fachlichen
   Starttrigger und ein daraus berechnetes `expires_at`. Raw-/Freitext darf nie
   still in eine Metadatenklasse fallen.
2. **Ablauf berechnen:** Trigger sind beispielsweise terminaler Providerstatus,
   letzte Leadaktivität, Pilot-/Tenantende, Abschluss einer Anfrage oder
   Sessionende – nicht pauschal Tabellenanlage.
3. **Sofort sperren:** Bei Erasure/Tenantende zuerst Capabilitys, Sessions,
   Versand und neue Verarbeitung deaktivieren. Inbox-/Outbox-Invarianten bleiben
   erhalten, ohne neue Außenwirkung zuzulassen.
4. **Primärdaten löschen:** Ein täglicher idempotenter Job löscht zuerst Raw-
   und Inhaltsdaten, danach Identifikatoren und zuletzt fällige Metadaten.
   Crash, Retry und bereits gelöschter Zustand führen zum selben Ergebnis.
5. **Tombstone minimieren:** Nur ein belegbar erforderlicher
   Idempotenz-/Suppression-/Pflichtnachweis verbleibt unter eigener Policy. Er
   darf weder neue Kontaktaufnahme noch Profiling ermöglichen.
6. **Externe Kopien nachführen:** Providerauftrag mit Scope, Request-ID,
   erwartetem Abschluss und Ergebnis führen. Unbestätigte Löschung bleibt
   `provider_pending`, nicht `completed`.
7. **Backups altern lassen:** Selektive Sofortlöschung wird nicht behauptet. Ein
   Erasure-Tombstone bleibt bis `backup_aged_out_at` des letzten betroffenen
   Snapshots erhalten.
8. **Restore nachlöschen:** Restore läuft isoliert ohne Egress. Tombstones,
   Sperren und inzwischen abgelaufene Policies werden vor Worker-/Trafficstart
   erneut angewendet und reconciliiert.
9. **Abschluss belegen:** Audit speichert Request-/Policy-ID, Datenklassen,
   Systeme, Status und Zeiten, aber keinen gelöschten Inhalt. Workflow:
   `requested -> verified -> processing -> provider_pending -> backup_pending -> completed | rejected`.
10. **Anonymisierung prüfen:** Nur ein dokumentierter Reidentifikationstest
    erlaubt längere anonyme Aggregate. Hashing oder Pseudonymisierung stoppt die
    Retention nicht.

## 5. Legal Hold

Ein Legal Hold ist eine enge, freizugebende Ausnahme und kein unbegrenzter
Papierkorb. Er benötigt vor Aktivierung:

- benannten rechtlichen/fachlichen Grund und Legal-Owner;
- expliziten Actor und engsten Datenklassen-/Datensatzscope statt ganzen Tenant;
- Start, feste Ablauf- oder Reviewzeit und dokumentierte Aufhebungsbedingung;
- getrennte Zugriffsliste und unveränderliches inhaltsfreies Audit.

Der Hold pausiert nur die Löschung des notwendigen Scopes. Nicht betroffene
Felder und Kopien werden regulär gelöscht. Nach Aufhebung läuft die ursprüngliche
Policy weiter; ist sie bereits fällig, erfolgt die Löschung unverzüglich. Ein
Hold darf weder still verlängert noch für Analytics, normalen Support oder
Providertraining zweckentfremdet werden.

## 6. Externe Kopien und Kontrollgrenzen

| System/Kopie | Vor Realbetrieb nachzuweisen | Löschsemantik |
|---|---|---|
| Telephony-/Messaging-Provider und Carrier | Content-/Log-/Fraud-/Billingdefaults, Region, Subprozessoren, Supportzugriff, Lösch-API/Ticket/Account-Close | Ursprungspolicy soweit möglich konfigurieren; rechtlich verbleibende Providerkopie separat dokumentieren |
| Identity/Keycloak | Session-, Event-, Account- und Backupfristen | Session sofort widerrufen; Account/Event/Backup nach `RET-07`/`RET-08`/`RET-12` |
| ESP und Empfängerpostfach | Content-/Bounce-/Logfristen, DPA/TIA, Datenminimum | ESP-Löschung nachweisen; fremdes Postfach/Endgerät als nicht technisch kontrollierbar benennen |
| Observability/Analytics | Feld-Allowlist, Region, Delete-API und Backups | `RET-09`; niemals Rawpayload, Token, Text oder direkte PII einspeisen |
| Object Store/Export | Verschlüsselung, TTL, Zugriffsaudit, Linkwiderruf | Objekt/Schlüssel nach `RET-10` löschen |
| Backup | Verschlüsselung, getrennte Schlüssel, Snapshotkatalog, maximale Kette | rollierend höchstens 30 Tage als Kandidat; Restore-Nachlöschung zwingend |
| Browser/SMS/Endgerät | Cache-/Referrer-/Drittressourcen vermeiden | Token widerrufen; zugestellte SMS/Browserkopie nie als fernlöschbar behaupten |

Interne Löschung ist erst fachlich abgeschlossen, wenn aktive Systeme bereinigt,
externe Aufträge dokumentiert und der letzte betroffene Backup-Snapshot gealtert
ist. Gesetzliche Antwortfristen werden separat überwacht und nicht durch
technische Backupalterung still verlängert.

## 7. Spätere technische Nachweise für `B-004`

- Policyzuordnung für jede `DATA-*`-/`DATA-V*`-Klasse; neue Klasse ohne Policy
  blockiert CI und jeden Realmodus.
- Systemweites Lookup eines synthetischen Betroffenen in PostgreSQL,
  Inbox/Outbox/DLQ, Redis, Object Store, Audit, Analytics, Identity,
  Provider-Fake und Backups.
- deterministische TTL-, Tagesjob-, Crash-/Retry-, Concurrent-Erasure-,
  Already-Deleted- und Legal-Hold-Tests mit Fake Clock.
- Export-/Erasure-Negativtests für fremden Tenant, schwache Verifikation,
  manipulierten Scope und abgelaufenen Download.
- Restore-Drill: Tombstones/Sperren gelten vor Egress und Workerstart; gelöschte
  Datensätze werden nicht reaktiviert.
- Provider-Contracttests für `requested`, `provider_pending`, Erfolg, Timeout,
  Ablehnung und dokumentierte nicht löschbare Pflichtkopie.
- Voice-Leak-Test findet Audio, Rohtranskript, Prompt-/Toolinhalt in keinem
  Store, Log, Trace, Crashdump oder Backup und beweist Cleanup bei Sessionende.

## 8. Freigabe- und Reviewregister

| Entscheidung | Owner | Trigger | blockiert |
|---|---|---|---|
| Zweck-/Rollen-/Retentionfreigabe je `RET-*` | Product/Privacy/Legal | `PO-004`, vor Realdaten | alle Realflüsse |
| TDDDG/TKG-Fristen für Call/Webhook/Message | Legal/Provider | vor `FLOW-03`/`FLOW-04` | Telefonie/SMS |
| Lead-/Freitext-/Notfallfrist | Product/Privacy/Legal/Safety | vor `M-005` real | Formular/Lead |
| Billing-/Tax-Dokumentklassifikation | Legal/Finance/Tax | vor Echtgeld | `RET-11` |
| Provider-/Subprozessor-/Backupfristen | Legal/Security/Ops | vor Anbieterfreigabe | externe Realdaten |
| Legal-Hold-Autorität und Verfahren | Legal/Privacy/Security | vor Pilot | Erasure-Abschluss |
| Voice No-Retention/No-Training, DSFA und Summaryfrist | Legal/Product/Safety/Security | nach `G7`, vor Realanruf | alle Voiceflüsse |

Review-Trigger sind eine neue Datenklasse oder ein neuer Zweck, Anbieter,
Subprozessor, Region, Kanal, Nummerntopologie, Gesetzesänderung,
Securityvorfall, Restoreproblem sowie der Übergang zu Echtgeld oder Voice. Bis
zur dokumentierten Freigabe bleibt die Entwicklungsbaseline synthetisch und
providerfrei.
