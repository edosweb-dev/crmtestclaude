# Sicurezza Piattaforma SaaS — Agency CRM

## Principi di Sicurezza

### 1. Isolamento Tenant (Critical)

- **Row Level Security (RLS)** su TUTTE le tabelle con `tenant_id`
- Nessun accesso cross-tenant possibile a livello database
- Pattern RLS standardizzato con lookup su `tenant_users`
- Test automatici per verificare isolamento

```sql
-- Ogni query passa attraverso RLS
CREATE POLICY "tenant_isolation" ON [table]
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  );
```

### 2. Autenticazione

- Supabase Auth (email + password)
- MFA consigliato per ruoli admin/owner
- Session management con JWT (refresh automatico)
- Rate limiting su tentativi di login

### 3. Autorizzazione

- Ruoli per-tenant: owner, admin, manager, member, viewer, billing
- Matrice permessi configurabile per modulo
- Verifiche server-side (Edge Functions) oltre a client-side

### 4. Dati Sensibili

- **MAI** hardcodare API keys, secrets, o credenziali nel codice
- Secrets gestiti via Supabase Vault o environment variables
- Token M365 e FIC crittografati at-rest
- Rotazione periodica delle chiavi API

### 5. GDPR Compliance

- Consenso esplicito al trattamento dati
- Diritto all'oblio: procedura cancellazione completa tenant
- Export dati su richiesta (JSON/CSV)
- Data Processing Agreement (DPA) disponibile
- Dati residenti in EU (Supabase region: eu-central)

### 6. Edge Functions Security

- Validazione input su ogni endpoint
- CORS configurato per domini autorizzati
- Rate limiting per-tenant
- Logging audit per operazioni sensibili

### 7. Storage

- File upload con validazione tipo e dimensione
- Bucket separati per tenant (o path-based isolation)
- Accesso via signed URLs con scadenza

### 8. Monitoring

- Alerting su tentativi di accesso cross-tenant
- Log delle modifiche a dati critici (audit trail)
- Monitoraggio subscription status per enforcement limiti

## Checklist Pre-Launch

- [ ] RLS attivo su tutte le tabelle
- [ ] Test isolamento cross-tenant superati
- [ ] MFA disponibile per admin
- [ ] Rate limiting configurato
- [ ] GDPR: privacy policy e DPA pronti
- [ ] Backup automatici verificati
- [ ] Procedura disaster recovery documentata
- [ ] Penetration test eseguito
