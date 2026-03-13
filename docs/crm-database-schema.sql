-- ============================================================
-- Agency CRM — Database Schema Reference
-- ============================================================
-- Questo file documenta lo schema database del CRM Edos
-- e le tabelle da creare per la trasformazione SaaS.
-- ============================================================

-- ===================
-- TABELLE SAAS (NUOVE)
-- ===================

-- Tenant principale
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
  custom_domain_status TEXT DEFAULT 'none', -- none | pending | verified | active

  -- Configurazione
  agency_type TEXT, -- web | marketing | seo | creative | consulting
  timezone TEXT DEFAULT 'Europe/Rome',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relazione utente-tenant
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner | admin | manager | member | viewer | billing
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- active | invited | suspended
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Feature flags per tenant (add-on premium)
CREATE TABLE tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL, -- m365 | fic | custom_domain | otp_signature | sales_sequences
  enabled BOOLEAN DEFAULT false,
  enabled_at TIMESTAMPTZ,
  stripe_subscription_item_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key)
);

-- ===================
-- TABELLE CORE ESISTENTI (Reference)
-- ===================

-- Lead companies (inbound + outbound)
-- lead_companies: id, company_name, source_type, status, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Clienti
-- clients: id, company_name, vat_number, sdi_code, pec, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Offerte/Preventivi
-- offers: id, client_id, offer_number, anno_competenza (integer!), status, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Progetti
-- projects: id, client_id, project_type (standard/tm), status, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Consuntivazione T&M
-- ticket_monthly_billing: id, project_id, billing_year, billing_month, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Piano fatturazione
-- billing_schedules: id, project_id, status (planned/to_invoice/invoiced/paid), ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Fatture emesse (source of truth da FIC)
-- fic_invoices_out: id, fic_id, client_id, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Fatture passive
-- fic_invoices_in: id, fic_id, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Personale
-- staff: id, first_name, last_name, type (dipendente/collaboratore), ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Token M365
-- microsoft365_tokens: id, user_id, access_token, refresh_token, ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- Configurazioni
-- settings: id, key, value (JSONB), ...
-- Riceverà: tenant_id UUID REFERENCES tenants(id)

-- ===================
-- RLS POLICY PATTERN
-- ===================

-- Pattern per ogni tabella con tenant_id:
-- DROP POLICY IF EXISTS "tenant_isolation" ON [table_name];
-- CREATE POLICY "tenant_isolation" ON [table_name]
--   FOR ALL USING (
--     tenant_id IN (
--       SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
--     )
--   );

-- ===================
-- INDEXES
-- ===================

CREATE INDEX idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_stripe_customer ON tenants(stripe_customer_id);
CREATE INDEX idx_tenant_features_tenant ON tenant_features(tenant_id);
