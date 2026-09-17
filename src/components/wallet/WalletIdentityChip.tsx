import { forwardRef, type HTMLAttributes } from 'react'
import { Copy, ExternalLink } from 'lucide-react'
import { cn, shortAddress } from '../../utils/cn'
import { useToast } from '../../hooks/useToast'
import type { Chain } from '../../services/types'
import { Button } from '../common/Button'

export type WalletIdentityChipProps = HTMLAttributes<HTMLDivElement> & {
  address: string
  chain?: Chain
  showCopy?: boolean
  showExplorer?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 pl-1.5 pr-1.5 gap-1.5 text-xs',
  md: 'h-10 pl-2 pr-1.5 gap-2 text-sm',
  lg: 'h-12 pl-2.5 pr-2 gap-2.5 text-base',
}

const chainBadgeSize: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-5 w-5 text-[10px] rounded-md',
  md: 'h-7 w-7 text-xs rounded-lg',
  lg: 'h-8 w-8 text-sm rounded-lg',
}

const iconButtonSize: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
}

function splitAddressDisplay(address: string) {
  const shortened = shortAddress(address)
  const parts = shortened.split('...')
  if (parts.length !== 2) return { start: shortened, middle: '', end: '' }
  return { start: parts[0], middle: '...', end: parts[1] }
}

export const WalletIdentityChip = forwardRef<HTMLDivElement, WalletIdentityChipProps>(
  (
    {
      address,
      chain,
      showCopy = false,
      showExplorer = false,
      className,
      size = 'md',
      ...rest
    },
    ref,
  ) => {
    const { success } = useToast()
    const { start, middle, end } = splitAddressDisplay(address)

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(address)
        success('Address copied')
      } catch {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = address
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        success('Address copied')
      }
    }

    const handleExplorer = () => {
      window.open('#', '_blank', 'noopener,noreferrer')
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border border-border/60 bg-background/60 backdrop-blur-sm',
          'transition-all duration-200 hover:border-primary/50 hover:shadow-glow-primary/40',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
          sizeClasses[size],
          className,
        )}
        {...rest}
      >
        {chain ? (
          <span
            className={cn(
              'inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold uppercase tracking-tight',
              chainBadgeSize[size],
            )}
            title={chain}
          >
            {chain.charAt(0)}
          </span>
        ) : null}

        <span className="font-mono select-all" title={address}>
          <span className="text-foreground">{start}</span>
          <span className="text-muted-foreground/70">{middle}</span>
          <span className="text-foreground">{end}</span>
        </span>

        {showCopy ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Copy address"
            onClick={handleCopy}
            className={cn(iconButtonSize[size], 'rounded-full shrink-0')}
          >
            <Copy className={cn(size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
          </Button>
        ) : null}

        {showExplorer ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="View on explorer"
            onClick={handleExplorer}
            className={cn(iconButtonSize[size], 'rounded-full shrink-0')}
          >
            <ExternalLink className={cn(size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
          </Button>
        ) : null}
      </div>
    )
  },
)

WalletIdentityChip.displayName = 'WalletIdentityChip'

export default WalletIdentityChip
