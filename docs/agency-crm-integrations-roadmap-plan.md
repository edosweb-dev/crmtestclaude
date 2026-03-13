# Agency CRM — Roadmap Integrazioni SaaS

## Integrazioni Esistenti (da CRM Edos)

### Fatture in Cloud (FIC) — 100% Completata

- **Tipo**: API v2 REST + TypeScript SDK
- **Funzionalità**: Sync fatture emesse/passive, riconciliazione automatica, creazione fatture
- **Edge Function**: `fic-api` (multi-action)
- **SaaS**: Add-on premium €29/mese per tenant
- **Note**: `payment_status: reversed` = trattare come `paid` (autofatture reverse charge)

### Microsoft 365 — 100% Completata

- **Tipo**: Graph API con OAuth 2.0
- **Funzionalità**: Email (send/receive), Calendario, OneDrive
- **Edge Functions**: `m365-auth`, `m365-send-email`, `m365-calendar`
- **SaaS**: Add-on premium €49/mese per tenant
- **Token**: Auto-refresh gestito, storage in `microsoft365_tokens`

### Notion — 100% Completata

- **Tipo**: API REST + Webhook
- **Funzionalità**: Wiki progetti, note sync bidirezionale
- **Edge Functions**: `notion-api`, `notion-webhook`
- **SaaS**: Incluso nel piano Full

### Resend (Email) — 100% Completata

- **Tipo**: API REST
- **Funzionalità**: 16 template email transazionali, tracking pixel
- **Edge Function**: `send-email`
- **SaaS**: Incluso in tutti i piani (con limiti volume per piano)

## Integrazioni da Implementare per SaaS

### Stripe Billing — Fase 2

- **Priorità**: Alta (prerequisito per monetizzazione)
- **Tipo**: API + Webhooks
- **Funzionalità**:
  - Checkout Session per nuovi tenant
  - Customer Portal per gestione abbonamento
  - Webhook handler per eventi subscription
  - Metered billing per add-on
- **Edge Function**: `stripe-webhook` (da creare)

### Anthropic Claude API — Esistente, da multi-tenantizzare

- **Tipo**: API REST
- **Funzionalità**: AI agents (CFO analysis, Commerciale assistant, LinkedIn content)
- **SaaS**: Add-on premium o incluso in piano Full
- **Note**: Usage metering per-tenant per controllo costi

## Feature Gating per Piano

| Integrazione | Trial | Basic | Full | Enterprise |
|-------------|-------|-------|------|------------|
| Resend Email | ✅ (100/mese) | ✅ (1000/mese) | ✅ (illimitato) | ✅ |
| Notion | ❌ | ❌ | ✅ | ✅ |
| FIC | ❌ | Add-on €29 | Add-on €29 | ✅ |
| M365 | ❌ | Add-on €49 | Add-on €49 | ✅ |
| Firma OTP | ❌ | Add-on €39 | Add-on €39 | ✅ |
| Sales Sequences | ❌ | ❌ | Add-on €29 | ✅ |
| Claude AI | ❌ | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | Add-on €19 | Add-on €19 | ✅ |

## Implementazione Multi-Tenant per Integrazioni

Ogni integrazione deve:

1. Verificare `tenant_features.enabled` prima dell'uso
2. Utilizzare credenziali/token per-tenant (non globali)
3. Rispettare rate limits per-tenant
4. Loggare usage per billing metered
5. Gestire gracefully la disattivazione (dati preservati ma accesso bloccato)
