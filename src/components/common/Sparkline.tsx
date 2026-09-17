import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '../../utils/cn'

type SparklinePoint = { label?: string; value: number }

type SparklineProps = {
  data: SparklinePoint[]
  height?: number
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger'
  showArea?: boolean
  className?: string
  showTooltip?: boolean
}

const strokeMap = {
  primary: '#22d3ee',
  secondary: '#22c55e',
  accent: '#a855f7',
  success: '#22c55e',
  danger: '#ef4444',
}

export function Sparkline({
  data,
  height = 48,
  color = 'primary',
  className,
  showTooltip = false,
}: SparklineProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
          {showTooltip ? (
            <Tooltip
              cursor={{ stroke: strokeMap[color], strokeDasharray: '3 3', strokeWidth: 1 }}
              contentStyle={{
                background: 'rgb(var(--card))',
                border: '1px solid rgb(var(--border) / 0.7)',
                borderRadius: 12,
                fontSize: 12,
                color: 'rgb(var(--foreground))',
                padding: '6px 10px',
              }}
              labelStyle={{ color: 'rgb(var(--muted-foreground))' }}
            />
          ) : null}
          <XAxis hide dataKey="label" />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeMap[color]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, stroke: strokeMap[color], strokeWidth: 0 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
