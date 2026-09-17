import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Wallet,
  FileText,
  Settings,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/investigations', label: 'Cases', icon: Search },
  { to: '/wallets', label: 'Wallets', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/90 backdrop-blur-2xl md:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5 px-1">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="list-none">
            <NavLink
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              <span
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-xl transition',
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? 'bg-primary/15 shadow-glow-primary' : '',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
