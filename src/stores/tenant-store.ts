import { create } from 'zustand'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'trial' | 'basic' | 'full' | 'enterprise'
  subscription_status: string
  max_users: number
  logo_url: string | null
  primary_color: string
  accent_color: string
  agency_type: string | null
  trial_ends_at: string | null
}

interface TenantState {
  tenant: Tenant | null
  loading: boolean
  setTenant: (tenant: Tenant | null) => void
  setLoading: (loading: boolean) => void
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  loading: true,
  setTenant: (tenant) => set({ tenant, loading: false }),
  setLoading: (loading) => set({ loading }),
}))
