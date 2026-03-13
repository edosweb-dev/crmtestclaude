import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Leads } from '@/pages/Leads'
import { Placeholder } from '@/pages/Placeholder'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registrazione" element={<Register />} />

      {/* App routes (con layout) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/clienti" element={<Placeholder />} />
        <Route path="/offerte" element={<Placeholder />} />
        <Route path="/progetti" element={<Placeholder />} />
        <Route path="/ticket" element={<Placeholder />} />
        <Route path="/finance" element={<Placeholder />} />
        <Route path="/personale" element={<Placeholder />} />
        <Route path="/impostazioni" element={<Placeholder />} />
      </Route>

      {/* Fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
