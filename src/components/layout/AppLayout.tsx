import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useSidebarStore } from '@/stores/sidebar-store'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { collapsed } = useSidebarStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-[64px]' : 'ml-[260px]',
        )}
      >
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
