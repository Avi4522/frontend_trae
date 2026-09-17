import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulseSoft rounded-xl bg-muted',
        className,
      )}
      {...rest}
    />
  ),
)
Skeleton.displayName = 'Skeleton'

export function SkeletonCard({
  className,
  lines = 3,
}: {
  className?: string
  lines?: number
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border/70 bg-card/80 p-6 shadow-glow backdrop-blur-xl',
        className,
      )}
    >
      <Skeleton className="mb-4 h-5 w-2/5" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" style={{
            width: `${70 + Math.round(Math.random() * 30)}%`,
          }} />
        ))}
      </div>
    </div>
  )
}
