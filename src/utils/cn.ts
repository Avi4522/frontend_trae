import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Chain, RiskLevel } from '../services/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCrypto(value: number, chain?: Chain): string {
  const num = Number.isFinite(value) ? value : 0
  const abs = Math.abs(num)
  const suffix = chain ? ` ${chain}` : ''
  if (abs >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M${suffix}`
  }
  if (abs >= 1_000) {
    return `${num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}${suffix}`
  }
  return `${num.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  })}${suffix}`
}

export function shortAddress(
  address: string,
  start = 6,
  end = 4,
): string {
  if (!address) return ''
  if (address.length <= start + end + 1) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function riskColor(
  level: RiskLevel,
): string {
  switch (level) {
    case 'critical':
      return 'text-danger border-danger/40 bg-danger/10'
    case 'high':
      return 'text-warning border-warning/40 bg-warning/10'
    case 'medium':
      return 'text-secondary border-secondary/40 bg-secondary/10'
    case 'low':
      return 'text-primary border-primary/40 bg-primary/10'
    default:
      return 'text-muted-foreground border-border bg-muted'
  }
}
