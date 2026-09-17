import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { MobileBottomNav } from './MobileBottomNav'
import { ToastContainer } from './Toast'
import { cn } from '../../utils/cn'

export function AppShell() {
  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          'pb-20 md:pb-0',
        )}
      >
        <TopNav />
        <main className="flex-1 min-w-0">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
      </div>
      <ToastContainer />
    </div>
  )
}
