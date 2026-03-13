import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Users,
  FileText,
  FolderKanban,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Check,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Gestione Lead',
    description: 'Lead inbound e outbound con pipeline personalizzabile e filtri avanzati.',
  },
  {
    icon: FileText,
    title: 'Offerte e Preventivi',
    description: 'Creazione preventivi con margini, versioning e firma digitale OTP.',
  },
  {
    icon: FolderKanban,
    title: 'Progetti e Task',
    description: 'Kanban board, time tracking, workflow T&M con consuntivazione.',
  },
  {
    icon: TrendingUp,
    title: 'Finance e Fatturazione',
    description: 'Integrazione Fatture in Cloud, riconciliazione automatica, KPI.',
  },
  {
    icon: Shield,
    title: 'Portale Cliente',
    description: 'Accesso dedicato per i clienti: ticket, progetti, fatture, offerte.',
  },
  {
    icon: Zap,
    title: 'Automazioni',
    description: 'Sales sequences multi-canale, email tracking, integrazioni M365.',
  },
]

const plans = [
  {
    name: 'Trial',
    price: 'Gratis',
    period: '14 giorni',
    features: ['3 utenti max', 'Tutti i moduli core', 'Supporto email'],
    cta: 'Inizia Gratis',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '€7,99',
    period: '/utente/mese',
    features: ['Utenti illimitati', 'Lead, Clienti, Offerte', 'Progetti e Ticket', 'Finance base', 'Setup: €99'],
    cta: 'Scegli Basic',
    highlighted: false,
  },
  {
    name: 'Full',
    price: '€15,99',
    period: '/utente/mese',
    features: ['Tutto di Basic', 'Sales Sequences', 'Portale Cliente', 'Integrazioni premium', 'AI Assistant', 'Setup: €199'],
    cta: 'Scegli Full',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'on-premise',
    features: ['Installazione dedicata', 'Personalizzazioni', 'SLA garantito', 'Account manager'],
    cta: 'Contattaci',
    highlighted: false,
  },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-xl font-bold text-primary">
            Agency<span className="text-accent">CRM</span>
          </span>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Accedi</Button>
            </Link>
            <Link to="/registrazione">
              <Button variant="accent">Prova Gratuita</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Il CRM pensato per le
          <br />
          <span className="text-accent">agenzie B2B italiane</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Lead, offerte, progetti, fatturazione, portale cliente e automazioni.
          Tutto in un'unica piattaforma, con integrazioni native per Fatture in Cloud e Microsoft 365.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/registrazione">
            <Button size="lg" variant="accent" className="gap-2">
              Inizia la prova gratuita <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="#pricing">
            <Button size="lg" variant="outline">
              Vedi i piani
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-primary">
            Tutto quello che serve alla tua agenzia
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Moduli integrati per gestire l'intero ciclo di vita del cliente, dal primo contatto alla fatturazione.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-background p-6">
                <feature.icon className="h-10 w-10 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-primary">Piani e prezzi</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Scegli il piano adatto alla tua agenzia. Upgrade e downgrade in qualsiasi momento.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-lg border p-6 ${
                  plan.highlighted
                    ? 'border-accent bg-accent/5 ring-2 ring-accent'
                    : 'bg-background'
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/registrazione" className="mt-6">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'accent' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-primary py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-white/60">
            &copy; 2026 Agency CRM — Edos Digital Solutions, Milano.
          </p>
        </div>
      </footer>
    </div>
  )
}
