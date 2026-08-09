# Prompt für einen einzelnen Task

```text
Lies AGENTS.md und die Task-Datei <TASK-PATH> vollständig. Prüfe den Git-Status,
alle in der Task genannten Abhängigkeiten, den Gate-Status, Referenzdokumente
und betroffene ADRs. Wenn eine Abhängigkeit nicht erfüllt ist, implementiere
nicht und berichte den konkreten fehlenden Nachweis.

Bearbeite ausschließlich <TASK-ID>. Benenne vor der Implementierung betroffene
Module, Datenflüsse, Risiken und konkrete Akzeptanztests. Implementiere die
kleinste vollständige Lösung. Aktualisiere Tests, OpenAPI, Migrationen,
Beispielkonfiguration, Dokumentation und Task-/Gate-Status, soweit betroffen.
Nimm keine echte Provider-, Zahlungs-, Datenlösch- oder Produktionsaktion vor.

Führe alle relevanten Checks aus. Berichte danach Änderungen, Testbefehle und
Ergebnisse, offene Punkte/Risiken, Entscheidungen und den empfohlenen nächsten
zulässigen Task.
```
