import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Search,
  Wallet,
  FileText,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { cn } from '../../utils/cn'

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/investigations', label: 'Investigations', icon: Search },
  { to: '/wallets', label: 'Wallets', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.ui.sidebarOpen)
  const toggleSidebar = useAppStore((s) => s.ui.toggleSidebar)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      toggleSidebar(false)
    }
  }, [location.pathname, toggleSidebar])

  const mobileOpen = sidebarOpen

  return (
    <>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleSidebar(false)}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 272 : 80,
          x: sidebarOpen || window.innerWidth >= 768 ? 0 : -280,
        }}
        transition={{
          type: reduceMotion ? 'tween' : 'spring',
          stiffness: 280,
          damping: 30,
          duration: reduceMotion ? 0.1 : undefined,
        }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/70 bg-card/90 backdrop-blur-2xl',
          'md:sticky md:top-0 md:z-20',
          !sidebarOpen && 'md:items-center',
        )}
        style={{ minHeight: '100vh' }}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-2 border-b border-border/60',
            sidebarOpen ? 'px-5 py-4' : 'justify-center px-2 py-4',
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary shadow-glow-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {sidebarOpen ? (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0 flex-1"
                >
                  <div className="truncate text-sm font-bold tracking-wide text-foreground">
                    SAHYOG Trace
                  </div>
                  <div className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Crypto Intelligence
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleSidebar(false)}
              aria-label="Close sidebar"
              className={cn(
                'rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground',
                'md:hidden',
              )}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => toggleSidebar()}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className={cn(
                'hidden rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground',
                'md:inline-flex',
              )}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 overflow-y-auto py-4',
            sidebarOpen ? 'px-3' : 'flex flex-col items-center px-2',
          )}
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-xl transition-all',
                  sidebarOpen ? 'px-3 py-2.5' : 'grid h-11 w-11 place-items-center',
                  isActive
                    ? 'bg-primary/15 text-primary shadow-glow-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen ? (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="min-w-0 flex-1 truncate text-sm"
                  >
                    {label}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <div
          className={cn(
            'border-t border-border/60 p-3',
            sidebarOpen ? 'px-5' : 'flex justify-center px-2',
          )}
        >
          <div
            className={cn(
              'rounded-2xl border border-primary/20 bg-primary/5 p-3',
              !sidebarOpen && 'flex flex-col items-center text-center',
            )}
          >
            <div
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.2em] text-primary',
                !sidebarOpen && 'hidden',
              )}
            >
              Officer Mode
            </div>
            <div
              className={cn(
                'mt-1 text-xs font-semibold text-foreground',
                sidebarOpen ? 'block' : 'sr-only',
              )}
            >
              Cyber Cell Unit 7
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
