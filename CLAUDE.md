# CLAUDE.md — Agency CRM SaaS Project

Questo file viene letto automaticamente da Claude Code all'avvio. Contiene tutto il contesto necessario per lavorare sul progetto Agency CRM.

## PROGETTO

Agency CRM è la trasformazione di CRM Edos (sistema single-tenant 100% completo, in produzione su crm.edos.it) in una piattaforma SaaS multi-tenant per agenzie B2B italiane.

- **Founder**: Giuseppe Famiani (Edos Digital Solutions, Milano)
- **Repo base**: Lovable.ai project "CRM Edos" → da trasformare con Lovable Remix
- **Produzione attuale**: crm.edos.it (React 18 + Supabase + Resend + Fatture in Cloud)

## STACK TECNOLOGICO

### Frontend

- React 18.3.1 + TypeScript 5.8.3
- Tailwind CSS + shadcn/ui
- TanStack Query v5 (data fetching)
- Zustand (state management)
- nuqs (URL state / filter persistence)
- React Hook Form + Zod (validazione)
- Recharts (grafici)
- TipTap (rich text editor)
- Lucide React (icone)

### Backend

- Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- Row Level Security (RLS) su tutte le tabelle
- Edge Functions scritte in Deno/TypeScript
- pg_cron per job schedulati

### Servizi Esterni

- Resend (email transazionali, dominio: crm.edos.it)
- Fatture in Cloud API v2 (e-invoicing italiano, TypeScript SDK)
- Microsoft Graph API (OAuth 2.0 → email, calendario, OneDrive)
- Notion API (wiki progetti, note sync, webhook)
- Anthropic Claude API (AI agents: CFO, Commerciale, LinkedIn)
- Stripe (billing SaaS — da implementare)

### Design System

- Primary: `#1e3a5f` (Navy Blue)
- Accent: `#d97706` (Amber Gold)
- Sidebar: 260px espansa / 64px collassata
- Font: Inter
- Lingua UI: 100% Italiano

## ARCHITETTURA ATTUALE (Single-Tenant)

### Moduli Completati al 100%

| Modulo | Note |
|--------|------|
| Lead (inbound + outbound) | `lead_companies` table, `source_type` field, filtri persistiti |
| Clienti | CRUD, contatti multipli, dati SDI/PEC, 6 tab |
| Offerte/Preventivi | Line items, margini, versioning, firma OTP |
| Progetti | Task Kanban, time tracking, T&M workflow |
| Personale/HR | Staff, ferie, permessi, calcolo costo orario |
| Finance | Fatture attive/passive, riconciliazione FIC, dashboard KPI |
| Ticket/Supporto | CRUD, SLA, consuntivazione, PDF |
| Portale Cliente | Login OTP, dashboard, ticket, progetti, fatture, offerte |
| Sistema Permessi | 6 ruoli, matrice configurabile, RLS |
| Email System | 16 template, Resend + M365, tracking pixel |
| Sales Sequences | Multi-canale con automazione |
| Integrazioni | FIC 100%, M365 100%, Notion 100% |

### Metriche Database

- 70+ tabelle PostgreSQL
- 17+ Edge Functions (Deno)
- 6 trigger database
- 2 cron jobs (pg_cron)
- 60+ pagine/route
- 180+ componenti custom
- 60+ hook custom

### Tabelle Core (reference rapido)

```
lead_companies          → leads con source_type (inbound/outbound)
clients                 → clienti con dati SDI/PEC
offers                  → offerte, anno_competenza (integer), status
projects                → progetti, project_type (standard/tm)
ticket_monthly_billing  → consuntivazione T&M (billing_year, billing_month)
billing_schedules       → piano fatturazione (planned/to_invoice/invoiced/paid)
fic_invoices_out        → fatture emesse FIC (source of truth)
fic_invoices_in         → fatture passive FIC
staff                   → personale (dipendenti + collaboratori)
microsoft365_tokens     → token OAuth M365 con auto-refresh
settings                → configurazioni (revenue_targets in JSONB)
```

### Edge Functions esistenti

```
send-email              → Resend transazionale
m365-auth               → OAuth callback M365
m365-send-email         → Graph API email
m365-calendar           → Calendario M365
fic-api                 → Fatture in Cloud (multi-action)
client-auth             → Auth portale cliente
client-portal           → API portale cliente
notion-api              → CRUD Notion
notion-webhook          → Webhook receiver
send-signature-request  → Richiesta firma OTP
request-signature-otp   → Genera OTP
verify-signature-otp    → Verifica OTP
outbound-email-processor → Sequences (cron)
```

### Hooks/Pattern Chiave

```typescript
// Filter persistence (22 pagine list)
useFilterStore.ts       → Zustand store filtri
useUrlFilters.ts        → Sync URL con nuqs
// sessionStorage clears on tab close

// Revenue year field (NON approved_at — è NULL su record migrati)
anno_competenza         → integer (2025, 2026...)

// FIC payment status
reversed = paid         // autofatture reverse charge
payments_list[]         // source of truth, NON payment_sum
```

## OBIETTIVO: TRASFORMAZIONE SAAS MULTI-TENANT

### Vision

Trasformare CRM Edos in **Agency CRM**: piattaforma SaaS verticale per agenzie B2B italiane (marketing, web, creative, consulenza).

### Architettura Target

Schema condiviso con `tenant_id` + RLS (non schema separato per tenant):

```sql
-- Ogni tabella esistente riceve:
ALTER TABLE [table] ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- RLS policy pattern:
CREATE POLICY "tenant_isolation" ON [table]
  USING (tenant_id = (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));
```

### Tabella tenants (da creare)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Stripe
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing',
  plan TEXT DEFAULT 'trial', -- trial | basic | full | enterprise
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),

  -- Limiti piano
  max_users INTEGER DEFAULT 3,

  -- Personalizzazione
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1e3a5f',
  accent_color TEXT DEFAULT '#d97706',

  -- Custom domain
  custom_domain TEXT,
  custom_domain_status TEXT DEFAULT 'none',

  -- Configurazione
  agency_type TEXT, -- web | marketing | seo | creative | consulting
  timezone TEXT DEFAULT 'Europe/Rome',

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Pricing

| Piano | Prezzo/Seat/Mese | Setup Fee |
|-------|------------------|-----------|
| Trial | €0 (14 giorni, 3 seat max) | - |
| Basic | €7.99/seat | €99 |
| Full | €15.99/seat | €199 |
| Enterprise | On-premise | €1.999 + €7.99/seat |

### Add-on Premium (per tenant)

- Microsoft 365: €49/mese
- Fatture in Cloud: €29/mese
- Custom Domain: €19/mese
- Firma Digitale OTP: €39/mese
- Sales Sequences: €29/mese

### Roadmap Fasi SaaS

1. **Fase 1**: Multi-tenant core (database + RLS + tenant context)
2. **Fase 2**: Stripe billing (products, checkout, webhooks)
3. **Fase 3**: User management (inviti, ruoli, permessi per-tenant)
4. **Fase 4**: Custom domains (DNS verification, SSL)
5. **Fase 5**: Lead capture forms (embeddable, analytics)
6. **Fase 6**: Premium integrations toggle (FIC, M365, Notion per-tenant)
7. **Fase 7**: Super Admin panel + testing + launch

## METODOLOGIA DI SVILUPPO

### Regola #1: Chat Mode prima di Agent Mode

SEMPRE analizzare il codice/schema esistente in Chat Mode prima di eseguire modifiche in Agent Mode. Questo previene regressioni e duplicazioni di componenti UI.

### Regola #2: Un prompt = un task

Ogni prompt Lovable deve avere uno scope preciso. Mai implementare multiple feature in un singolo prompt.

### Regola #3: Schema-first debugging

Verificare nomi colonne e struttura tabelle via SQL query in Supabase PRIMA di scrivere codice.

```sql
-- Verifica struttura tabella
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = '[table_name]'
ORDER BY ordinal_position;

-- Verifica RLS policies
SELECT * FROM pg_policies WHERE tablename = '[table_name]';

-- Verifica foreign keys
SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '[table_name]';
```

### Regola #4: PIN dopo ogni milestone

Salvare checkpoint Lovable dopo ogni feature verificata e funzionante.

### Regola #5: Backend dopo frontend stabile

Non collegare Supabase finché l'UI non è verificata con dati statici.

### Regola #6: Riutilizzare, non ricostruire

Usare componenti, navigator e hook esistenti. Non creare duplicati.

## PATTERN DA RISPETTARE

### RLS Policies

```sql
-- Preferire DROP + CREATE invece di ALTER
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "policy_name" ON table_name
  FOR ALL USING (user_id = auth.uid());

-- Con tenant isolation (SaaS):
CREATE POLICY "tenant_isolation" ON table_name
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  );
```

### Eliminazione con Foreign Keys

Sempre verificare dipendenze prima di DELETE. Il messaggio di errore indica quale tabella pulire prima.

### URL State con nuqs

```typescript
// Pattern consolidato per filter persistence
import { useQueryState } from 'nuqs';
// + useFilterStore.ts (Zustand) + sessionStorage cleanup on tab close
```

### Console.log in produzione

Configurato `drop_console: true` in `vite.config.ts` via Terser. Non aggiungere `console.log`.

## STRUTTURA PROMPT LOVABLE

### Template standard

```
[Task in 1-2 frasi chiare]

🔍 Scope:
- Pagina/Componente: [specifica]
- Modifica SOLO: [file specifici]
- NON toccare: [file da preservare]

🎨 Design:
- Rispettare design system esistente (#1e3a5f primary, #d97706 accent)
- Font: Inter, lingua: Italiano

✅ Expected:
- [Criterio di successo misurabile]
- [Come testare]
```

### Workflow per nuova feature

1. **CHAT MODE**: "Analizza il codice esistente per [area]. Identifica file coinvolti e possibili conflitti."
2. **CHAT MODE**: "Proponi il piano di implementazione step-by-step."
3. **AGENT MODE**: "Implementa step 1: [task specifico]"
4. **TEST**: Verificare funzionamento
5. **PIN**
6. Ripetere per step successivi

## DEBUG WORKFLOW

### Errore → Chat Mode first

```
Errore: [messaggio console]
File: [se noto]

Analizza SENZA modificare codice:
1. Root cause?
2. File coinvolti?
3. Tre soluzioni ordinate per impatto/rischio?
```

### Dopo 2-3 tentativi falliti

```
Ho già provato [N] fix. I tentativi erano: [lista].
Considera un approccio architetturalmente diverso.
Se necessario, suggerisci revert al PIN precedente.
```

### SQL debug utili

```sql
-- Log Edge Functions (ultimi errori)
SELECT * FROM supabase_functions.hooks ORDER BY created_at DESC LIMIT 20;

-- Cron jobs status
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Verifica trigger attivi
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers WHERE trigger_schema = 'public';
```

## REGOLE ASSOLUTE

### ✅ SEMPRE

- Leggere questo file prima di iniziare qualsiasi sessione
- Verificare schema DB via SQL prima di scrivere codice
- Usare `anno_competenza` (integer) per anno fiscale offerte, NON `approved_at`
- Per FIC payment status: `reversed` = trattare come `paid`
- Testo UI sempre in italiano
- Aggiornare documentazione dopo ogni milestone

### ❌ MAI

- Hardcodare API keys, secrets, o credenziali
- Multiple feature in un prompt
- Modificare file di migrazione già applicati
- Assumere nomi colonne senza verificarli prima su Supabase
- Usare Legacy Mode su Lovable
- Aggiungere `console.log` (Terser li rimuove in prod ma sporcano il codice)

## PERSONE

| Nome | Ruolo |
|------|-------|
| Giuseppe Famiani (Edos) | Founder, decisore |
| Luca Soldatich | Project Manager / collaboratore |
| Enrico Monzeglio | Collaboratore |

## FILE DOCUMENTAZIONE PROGETTO

Nella cartella `/docs/` sono disponibili i documenti di riferimento:

| File | Contenuto |
|------|-----------|
| `CRM-EDOS-MASTER-DOCUMENT.md` | Stato completo CRM Edos (100% completato) |
| `agency-crm-saas-project-plan.md` | Piano SaaS (~219 prompt, 14 settimane) |
| `crm-database-schema.sql` | Schema database completo |
| `fic-integration-complete-spec-v2.md` | Spec integrazione Fatture in Cloud |
| `sicurezza-piattaforma-saas.md` | Guida security SaaS (GDPR, MFA, RLS) |
| `agency-crm-integrations-roadmap-plan.md` | Roadmap integrazioni SaaS |

---

**CLAUDE.md — Agency CRM SaaS**
Ultima modifica: Marzo 2026
Questo file è il punto di riferimento unico per Claude Code.
