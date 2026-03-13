# Agency CRM — Piano Progetto SaaS

## Overview

Trasformazione di CRM Edos (single-tenant, 100% completo) in Agency CRM: piattaforma SaaS multi-tenant per agenzie B2B italiane.

## Fasi di Implementazione

### Fase 1: Multi-tenant Core (~4 settimane)

**Obiettivo**: Aggiungere isolamento multi-tenant a livello database e applicazione.

#### Database

1. Creare tabella `tenants` con configurazione piano, branding, e limiti
2. Creare tabella `tenant_users` (relazione utente-tenant con ruolo)
3. Aggiungere colonna `tenant_id` a tutte le tabelle esistenti (70+)
4. Migrare dati Edos esistenti come tenant seed
5. Aggiornare tutte le RLS policies con filtro `tenant_id`

#### Frontend

6. Creare `TenantProvider` (React Context) che carica tenant da sessione utente
7. Aggiornare tutti i hook di data fetching per includere `tenant_id`
8. Creare pagina di onboarding tenant (registrazione + setup iniziale)
9. Aggiornare sidebar e header con branding tenant (logo, colori)

### Fase 2: Stripe Billing (~2 settimane)

1. Configurare Stripe Products: Trial, Basic (€7.99/seat), Full (€15.99/seat)
2. Implementare Checkout Session per upgrade piano
3. Edge Function `stripe-webhook` per gestire eventi subscription
4. Customer Portal per gestione autonoma abbonamento
5. Enforcement limiti piano (max users, feature gating)

### Fase 3: User Management (~2 settimane)

1. Sistema inviti via email (con token + scadenza)
2. Ruoli per-tenant (owner, admin, manager, member, viewer)
3. Pagina gestione team (invita, modifica ruolo, rimuovi)
4. Permessi granulari per-modulo configurabili da admin tenant

### Fase 4: Custom Domains (~1 settimana)

1. UI per inserimento dominio custom
2. Verifica DNS (CNAME check)
3. Provisioning SSL automatico
4. Routing basato su hostname

### Fase 5: Lead Capture Forms (~2 settimane)

1. Form builder drag & drop
2. Snippet embeddabile (iframe/JS)
3. Analytics submissions
4. Webhook notifica nuovo lead

### Fase 6: Premium Integrations Toggle (~1 settimana)

1. Feature flags per-tenant per integrazioni premium
2. UI toggle in settings tenant
3. Verifica subscription prima di attivare
4. Integrazioni: FIC, M365, Notion, Firma OTP, Sales Sequences

### Fase 7: Super Admin Panel + Launch (~2 settimane)

1. Dashboard super admin (metriche globali)
2. Gestione tenant (view, suspend, delete)
3. Monitoring (errori, usage, billing)
4. Landing page + documentazione
5. Beta testing con 3-5 agenzie pilota

## Stima Totale

- ~219 prompt Lovable stimati
- ~14 settimane di sviluppo
- Testing e QA inclusi in ogni fase

## Pricing Recap

| Piano | Prezzo/Seat/Mese | Setup Fee | Limiti |
|-------|------------------|-----------|--------|
| Trial | €0 | - | 14 giorni, 3 seat max |
| Basic | €7.99/seat | €99 | Moduli core |
| Full | €15.99/seat | €199 | Tutti i moduli |
| Enterprise | On-premise | €1.999 + €7.99/seat | Personalizzato |

### Add-on Premium

- Microsoft 365: €49/mese
- Fatture in Cloud: €29/mese
- Custom Domain: €19/mese
- Firma Digitale OTP: €39/mese
- Sales Sequences: €29/mese
