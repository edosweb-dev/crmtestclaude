import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  FolderKanban,
  Ticket,
  TrendingUp,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar-store'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Lead', icon: Users, path: '/leads' },
  { label: 'Clienti', icon: Building2, path: '/clienti' },
  { label: 'Offerte', icon: FileText, path: '/offerte' },
  { label: 'Progetti', icon: FolderKanban, path: '/progetti' },
  { label: 'Ticket', icon: Ticket, path: '/ticket' },
  { label: 'Finance', icon: TrendingUp, path: '/finance' },
  { label: 'Personale', icon: UserCircle, path: '/personale' },
  { label: 'Impostazioni', icon: Settings, path: '/impostazioni' },
]

export function Sidebar() {
  const location = useLocation()
  const { collapsed, toggle } = useSidebarStore()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link to="/dashboard" className="text-lg font-bold tracking-tight">
              Agency<span className="text-accent">CRM</span>
            </Link>
          )}
          <button
            onClick={toggle}
            className="rounded-md p-1.5 hover:bg-sidebar-hover transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            const link = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-hover text-white'
                    : 'text-white/70 hover:bg-sidebar-hover hover:text-white',
                  collapsed && 'justify-center px-0',
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return link
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          {!collapsed && (
            <p className="text-xs text-white/40">Agency CRM v0.1.0</p>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
