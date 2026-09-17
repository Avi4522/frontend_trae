import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'glow'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClass: Record<BadgeVariant, string> = {
  default:
    'border-border bg-muted text-muted-foreground',
  success:
    'border-success/40 bg-success/10 text-success',
  danger:
    'border-danger/40 bg-danger/10 text-danger',
  warning:
    'border-warning/40 bg-warning/10 text-warning',
  info:
    'border-primary/40 bg-primary/10 text-primary',
  glow:
    'border-primary/60 bg-primary/15 text-primary shadow-glow-primary',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        variantClass[variant],
        className,
      )}
      {...rest}
    />
  ),
)

Badge.displayName = 'Badge'
