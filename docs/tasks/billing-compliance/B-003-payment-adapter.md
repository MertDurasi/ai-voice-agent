---
id: B-003
title: PaymentPort/Stripe-Adapter im Testmodus
phase: billing-compliance
status: blocked
priority: P1
owner: Engineering/Finance
dependencies: [B-001, B-002, provider-approval]
gate: G6
outputs: [payment-port, testmode-adapter, payment-inbox, reconciliation-job]
completed_at: null
---

# B-003 – PaymentPort/Stripe-Adapter im Testmodus

## Ziel und Scope

Nach expliziter Anbieterfreigabe Customer-/Subscription-Mapping,
Checkout/Portal, signierte Webhooks via Inbox, Idempotenz und täglichen
Zustandsabgleich ausschließlich im Testmodus umsetzen. Kartendaten gelangen nie
in das System.

## Akzeptanz und Verifikation

- [ ] Erfolg, fehlgeschlagene Zahlung, verspäteter/doppelter Webhook,
      Kündigung und Reaktivierung sind als Testfälle grün.
- [ ] Reconciliation meldet Drift ohne unkontrollierte Zustandskorrektur.
- [ ] Tenant-Mapping, Signatur, Replay und RBAC sind negativ getestet.
- [ ] Logs/Audit enthalten keine Tokens oder Zahlungsdaten.
- [ ] Produktionsschlüssel und Live-Modus werden technisch fail-closed blockiert.

Stop: Anbieter, Account und jede Echtgeld-Umschaltung benötigen Freigabe.
