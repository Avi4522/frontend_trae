import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

type SelectContextValue = {
  open: boolean
  setOpen: (o: boolean) => void
  value: string
  setValue: (v: string) => void
  placeholder?: string
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectCtx() {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error('Select components used outside provider')
  return ctx
}

export type SelectProps = HTMLAttributes<HTMLDivElement> & {
  value?: string
  onValueChange?: (v: string) => void
  defaultValue?: string
  placeholder?: string
  children?: ReactNode
}

export function Select({
  value: controlledValue,
  onValueChange,
  defaultValue,
  placeholder,
  className,
  children,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = typeof controlledValue === 'string'
  const value = isControlled ? controlledValue : internalValue

  const setValue = (v: string) => {
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
    setOpen(false)
  }

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ open, setOpen, value, setValue, placeholder }}>
      <div
        ref={ref}
        className={cn('relative inline-block w-full', className)}
        {...rest}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, children, ...rest }, ref) => {
  const { open, setOpen } = useSelectCtx()
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
        className,
      )}
      aria-expanded={open}
      {...rest}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')}
      />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, placeholder: ctxPlaceholder } = useSelectCtx()
  const finalPlaceholder = placeholder ?? ctxPlaceholder ?? 'Select...'
  return (
    <span className={cn(!value && 'text-muted-foreground')}>
      {value || finalPlaceholder}
    </span>
  )
}

export const SelectContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => {
    const { open } = useSelectCtx()
    if (!open) return null
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 mt-2 w-full min-w-[180px] overflow-hidden rounded-2xl border border-border bg-popover p-1 text-popover-foreground shadow-glow animate-slide-up',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
SelectContent.displayName = 'SelectContent'

export type SelectItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  disabled?: boolean
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled, ...rest }, ref) => {
    const { value: selected, setValue } = useSelectCtx()
    const isSelected = selected === value
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={() => !disabled && setValue(value)}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
          'hover:bg-muted focus:bg-muted',
          isSelected && 'bg-muted/80 font-medium',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...rest}
      >
        <span className={cn('mr-auto truncate')}>{children}</span>
        {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
      </div>
    )
  },
)
SelectItem.displayName = 'SelectItem'
