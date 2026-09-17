import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { TraceStage } from '../../services/types'

type StatusStepperProps = {
  stages: TraceStage[]
  currentIndex: number
  className?: string
}

export function StatusStepper({ stages, currentIndex, className }: StatusStepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex items-start justify-between gap-2">
        <div className="pointer-events-none absolute left-4 right-4 top-5 h-0.5 bg-muted" />
        <motion.div
          className="pointer-events-none absolute left-4 top-5 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{
            width: `calc(${(Math.max(0, currentIndex) / Math.max(stages.length - 1, 1)) * 100}% - 2rem)`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          style={{ right: 'auto' }}
        />
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'done' || idx < currentIndex
          const isActive = stage.status === 'active' || idx === currentIndex
          return (
            <div key={stage.id} className="relative flex flex-1 flex-col items-center">
              <div
                className={cn(
                  'relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all',
                  isDone &&
                    'border-primary/60 bg-primary/15 text-primary',
                  isActive &&
                    !isDone &&
                    'border-primary/80 bg-card text-primary shadow-glow-primary',
                  !isDone &&
                    !isActive &&
                    'border-border bg-card text-muted-foreground',
                )}
              >
                {isDone ? (
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-sm font-semibold tabular-nums">{idx + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-xs font-semibold',
                    isDone || isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {stage.label}
                </div>
                <div
                  className={cn(
                    'mt-0.5 text-[10px] uppercase tracking-wider',
                    isDone && 'text-primary',
                    isActive && !isDone && 'text-accent',
                    !isDone && !isActive && 'text-muted-foreground',
                  )}
                >
                  {stage.status}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
