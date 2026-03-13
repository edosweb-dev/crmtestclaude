import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Pagina non trovata</p>
      <Link to="/" className="mt-6">
        <Button>Torna alla home</Button>
      </Link>
    </div>
  )
}
