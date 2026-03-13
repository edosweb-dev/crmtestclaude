import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/hooks/use-toast'

export function Register() {
  const [agencyName, setAgencyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSupabaseConfigured()) {
      useAuthStore.getState().setAuth(
        { id: 'demo', email } as never,
        { access_token: 'demo' } as never,
      )
      toast({ title: 'Modalita demo', description: 'Configura Supabase per la registrazione completa.' })
      navigate('/dashboard')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { agency_name: agencyName },
      },
    })
    setLoading(false)

    if (error) {
      toast({ title: 'Errore registrazione', description: error.message, variant: 'destructive' })
      return
    }

    if (data.user) {
      toast({ title: 'Registrazione completata', description: 'Controlla la tua email per confermare l\'account.' })
      navigate('/login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mb-4 inline-block text-2xl font-bold text-primary">
            Agency<span className="text-accent">CRM</span>
          </Link>
          <CardTitle className="text-xl">Crea il tuo account</CardTitle>
          <CardDescription>14 giorni di prova gratuita, nessuna carta richiesta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Nome Agenzia</Label>
              <Input
                id="agency"
                placeholder="La tua agenzia"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@agenzia.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimo 8 caratteri"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Registrazione...' : 'Inizia la prova gratuita'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Hai gia un account?{' '}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Accedi
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
