import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../utils/cn'

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsCtx(component: string) {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error(`${component} must be used within Tabs`)
  }
  return ctx
}

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  children?: ReactNode
}

export function Tabs({
  defaultValue = '',
  value: controlled,
  onValueChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = typeof controlled === 'string'
  const value = isControlled ? controlled : internal
  const setValue = (v: string) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('w-full', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex h-11 items-center gap-1 rounded-2xl border border-border/70 bg-muted/40 p-1',
        className,
      )}
      {...rest}
    />
  ),
)
TabsList.displayName = 'TabsList'

export type TabsTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  value: string
  disabled?: boolean
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, ...rest }, ref) => {
    const { value: current, setValue } = useTabsCtx('TabsTrigger')
    const isActive = current === value
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        className={cn(
          'inline-flex h-full items-center justify-center gap-2 rounded-xl px-4 py-1.5 text-sm font-semibold transition-all',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-card text-foreground shadow-glow'
            : 'text-muted-foreground hover:text-foreground',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  forceMount?: boolean
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, forceMount, ...rest }, ref) => {
    const { value: current } = useTabsCtx('TabsContent')
    const isActive = current === value
    if (!isActive && !forceMount) return null
    return (
      <div
        ref={ref}
        role="tabpanel"
        hidden={!isActive}
        className={cn(
          'mt-4 w-full animate-fade-in',
          isActive ? 'block' : 'hidden',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = 'TabsContent'
