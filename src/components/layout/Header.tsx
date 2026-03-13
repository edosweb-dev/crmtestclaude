import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { useTenantStore } from '@/stores/tenant-store'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user } = useAuthStore()
  const { tenant } = useTenantStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    useAuthStore.getState().clear()
    navigate('/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        {tenant && (
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">{tenant.name}</h2>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent capitalize">
              {tenant.plan}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {user && (
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user.email}
            </span>
          )}
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  )
}
