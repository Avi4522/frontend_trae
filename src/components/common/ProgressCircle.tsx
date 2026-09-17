import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

type ProgressCircleProps = {
  size?: number
  strokeWidth?: number
  progress: number
  label?: string
  className?: string
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
}

const colorMap = {
  primary: 'stroke-primary',
  secondary: 'stroke-secondary',
  danger: 'stroke-danger',
  warning: 'stroke-warning',
  success: 'stroke-success',
}

export function ProgressCircle({
  size = 120,
  strokeWidth = 10,
  progress,
  label,
  className,
  color = 'primary',
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn('fill-none', colorMap[color])}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' as const }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {Math.round(clamped)}%
        </span>
        {label ? (
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        ) : null}
      </div>
    </div>
  )
}
