import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  Menu,
  Search,
  Shield,
  LogOut,
  UserCircle,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useTheme } from '../../hooks/useTheme'
import { cn, shortAddress } from '../../utils/cn'
import { ThemeToggle } from './ThemeToggle'
import { Badge } from './Badge'
import { useAppStore } from '../../store/appStore'

type Crumb = { label: string; to?: string }

const pathCrumbs: Record<string, Crumb[]> = {
  '/dashboard': [{ label: 'Dashboard' }],
  '/investigations': [{ label: 'Investigations' }],
  '/wallets': [{ label: 'Wallets' }],
  '/reports': [{ label: 'Reports' }],
  '/settings': [{ label: 'Settings' }],
}

function buildCrumbs(pathname: string): Crumb[] {
  if (pathCrumbs[pathname]) return [{ label: 'Home', to: '/dashboard' }, ...pathCrumbs[pathname]]
  const base: Crumb[] = [{ label: 'Home', to: '/dashboard' }]
  const match = pathname.match(/^\/investigations\/(.+)$/)
  if (match) {
    base.push({ label: 'Investigations', to: '/investigations' })
    base.push({ label: shortAddress(match[1]) })
    return base
  }
  const reportMatch = pathname.match(/^\/reports\/(.+)$/)
  if (reportMatch) {
    base.push({ label: 'Reports', to: '/reports' })
    base.push({ label: `Report ${reportMatch[1]}` })
    return base
  }
  return [...base, { label: pathname }]
}

export function TopNav() {
  const { user, isAdmin, logout } = useCurrentUser()
  const toggleSidebar = useAppStore((s) => s.ui.toggleSidebar)
  const location = useLocation()
  const navigate = useNavigate()
  useTheme()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const crumbs = buildCrumbs(location.pathname)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={() => toggleSidebar(true)}
          aria-label="Open navigation"
          className="rounded-xl border border-border bg-card/80 p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden min-w-0 items-center gap-1 text-sm md:flex">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1
            const content = (
              <span
                className={cn(
                  'rounded-lg px-2.5 py-1 transition',
                  isLast
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {crumb.label}
              </span>
            )
            return (
              <span key={idx} className="flex min-w-0 items-center gap-1">
                {crumb.to && !isLast ? (
                  <Link to={crumb.to}>{content}</Link>
                ) : (
                  content
                )}
                {!isLast ? (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                ) : null}
              </span>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search wallets, cases…"
              className="h-10 w-64 rounded-xl border border-border bg-card/70 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <ThemeToggle size="icon" />

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-card" />
          </button>

          {isAdmin ? (
            <Badge variant="glow" className="hidden sm:inline-flex">
              <Shield className="mr-1 h-3 w-3" /> Admin
            </Badge>
          ) : (
            <Badge variant="info" className="hidden sm:inline-flex">
              <Shield className="mr-1 h-3 w-3" /> Investigator
            </Badge>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="User menu"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 p-1 pr-3 transition hover:bg-muted"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="hidden text-left lg:block">
                <span className="block text-xs font-semibold leading-tight text-foreground">
                  {user?.name ?? 'Guest'}
                </span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {user?.email ?? 'Sign in'}
                </span>
              </span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-glow animate-slide-up">
                <div className="border-b border-border/60 px-3 py-2.5">
                  <div className="text-sm font-semibold">{user?.name ?? 'Guest'}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {user?.email ?? 'Not signed in'}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/settings')
                  }}
                >
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false)
                  }}
                >
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-danger transition hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
