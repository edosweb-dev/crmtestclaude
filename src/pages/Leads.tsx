import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react'

const demoLeads = [
  { id: '1', company: 'Tech Solutions Srl', contact: 'Marco Rossi', email: 'marco@techsol.it', phone: '+39 02 1234567', source: 'inbound', status: 'nuovo', value: 15000 },
  { id: '2', company: 'Digital Agency Roma', contact: 'Laura Bianchi', email: 'laura@dagency.it', phone: '+39 06 7654321', source: 'outbound', status: 'contattato', value: 28000 },
  { id: '3', company: 'E-Commerce Plus', contact: 'Andrea Verdi', email: 'andrea@ecomplus.it', phone: '+39 02 9876543', source: 'inbound', status: 'qualificato', value: 45000 },
  { id: '4', company: 'Studio Legale Neri', contact: 'Giulia Neri', email: 'giulia@slneri.it', phone: '+39 02 1112233', source: 'outbound', status: 'proposta', value: 8500 },
  { id: '5', company: 'Farmacia Online Srl', contact: 'Paolo Gialli', email: 'paolo@farmaonline.it', phone: '+39 02 4445566', source: 'inbound', status: 'nuovo', value: 22000 },
]

const statusColors: Record<string, string> = {
  nuovo: 'bg-blue-100 text-blue-800',
  contattato: 'bg-yellow-100 text-yellow-800',
  qualificato: 'bg-green-100 text-green-800',
  proposta: 'bg-purple-100 text-purple-800',
}

export function Leads() {
  const [search, setSearch] = useState('')

  const filtered = demoLeads.filter(
    (l) =>
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead</h1>
          <p className="text-sm text-muted-foreground">Gestisci i tuoi lead inbound e outbound</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus size={16} /> Nuovo Lead
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca lead..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((lead) => (
          <Card key={lead.id} className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{lead.company}</p>
                  <p className="text-sm text-muted-foreground">{lead.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {lead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {lead.phone}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent capitalize">
                  {lead.source}
                </span>
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(lead.value)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
