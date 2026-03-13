import { useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Construction } from 'lucide-react'

const pageNames: Record<string, string> = {
  '/clienti': 'Clienti',
  '/offerte': 'Offerte',
  '/progetti': 'Progetti',
  '/ticket': 'Ticket',
  '/finance': 'Finance',
  '/personale': 'Personale',
  '/impostazioni': 'Impostazioni',
}

export function Placeholder() {
  const location = useLocation()
  const name = pageNames[location.pathname] || 'Pagina'

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <Construction className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-xl font-semibold">{name}</h2>
          <p className="mt-2 text-muted-foreground">
            Questo modulo e in fase di sviluppo. Tornera disponibile presto.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
