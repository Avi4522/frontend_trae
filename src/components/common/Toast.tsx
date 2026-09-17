import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X, XCircle, TriangleAlert } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { cn } from '../../utils/cn'
import type { Toast, ToastVariant } from '../../services/types'

const variantStyle: Record<ToastVariant, {
  container: string
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
}> = {
  default: {
    container:
      'border-border bg-card text-foreground',
    icon: Info,
    iconClass: 'text-muted-foreground',
  },
  success: {
    container:
      'border-success/40 bg-success/10 text-foreground',
    icon: CheckCircle2,
    iconClass: 'text-success',
  },
  danger: {
    container:
      'border-danger/40 bg-danger/10 text-foreground',
    icon: XCircle,
    iconClass: 'text-danger',
  },
  warning: {
    container:
      'border-warning/40 bg-warning/10 text-foreground',
    icon: TriangleAlert,
    iconClass: 'text-warning',
  },
  info: {
    container:
      'border-primary/40 bg-primary/10 text-foreground',
    icon: AlertCircle,
    iconClass: 'text-primary',
  },
}

type ToastItemProps = { toast: Toast; onClose: () => void }

function ToastItem({ toast, onClose }: ToastItemProps) {
  const v = variantStyle[toast.variant]
  const Icon = v.icon
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className={cn(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-2xl border px-4 py-3 shadow-glow backdrop-blur-xl',
        v.container,
      )}
    >
      <div className="mt-0.5 shrink-0">
        <Icon className={cn('h-5 w-5', v.iconClass)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-tight">{toast.title}</div>
        {toast.description ? (
          <div className="mt-0.5 text-xs text-muted-foreground">{toast.description}</div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-3"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => dismissToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export { ToastItem as Toast }
