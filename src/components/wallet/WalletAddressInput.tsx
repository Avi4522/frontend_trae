import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { ClipboardPaste, QrCode } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useToast } from '../../hooks/useToast'
import type { Chain } from '../../services/types'
import { Input } from '../common/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select'
import { Button } from '../common/Button'

export type WalletAddressInputProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  onChange: (v: string) => void
  selectedChain: Chain
  onChainChange: (c: Chain) => void
  placeholder?: string
  className?: string
  error?: string
}

const CHAINS: Chain[] = ['BTC', 'ETH', 'TRX', 'BNB', 'SOL', 'MATIC', 'USDT-ERC20']

function isValidLooking(chain: Chain, address: string): boolean {
  if (!address) return false
  const trimmed = address.trim()
  if (trimmed.length < 10) return false
  switch (chain) {
    case 'BTC':
      return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,61}$/.test(trimmed)
    case 'ETH':
    case 'BNB':
    case 'MATIC':
    case 'USDT-ERC20':
      return /^0x[a-fA-F0-9]{40}$/.test(trimmed)
    case 'TRX':
      return /^T[a-zA-Z0-9]{33}$/.test(trimmed)
    case 'SOL':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)
    default:
      return trimmed.length >= 20
  }
}

export const WalletAddressInput = forwardRef<HTMLDivElement, WalletAddressInputProps>(
  (
    {
      value,
      onChange,
      selectedChain,
      onChainChange,
      placeholder = 'Enter wallet address…',
      className,
      error,
      ...rest
    },
    ref,
  ) => {
    const { info } = useToast()

    const looksValid = useMemo(
      () => isValidLooking(selectedChain, value),
      [selectedChain, value],
    )

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const trimmed = raw.replace(/\s/g, '')
      onChange(trimmed)
    }

    const handlePaste = async () => {
      try {
        const text = await navigator.clipboard.readText()
        const cleaned = text.trim().replace(/\s/g, '')
        onChange(cleaned)
        info('Pasted from clipboard')
      } catch {
        info('Clipboard access denied — paste manually')
      }
    }

    const handleScan = () => {
      info('QR scanner coming in Phase 2')
    }

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)} {...rest}>
        <div
          className={cn(
            'flex w-full items-stretch gap-2 rounded-2xl border border-input bg-background p-1.5 transition-all duration-200',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
            looksValid && !error && 'border-primary/70 shadow-[0_0_0_1px_rgba(var(--primary),0.2)]',
            error && 'border-danger focus-within:ring-danger',
          )}
        >
          <Select
            value={selectedChain}
            onValueChange={(v) => onChainChange(v as Chain)}
            className="w-auto shrink-0"
          >
            <SelectTrigger className="w-[120px] h-9 rounded-xl border-0 bg-muted/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-3">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                  {selectedChain.charAt(0)}
                </span>
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c} value={c}>
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                      {c.charAt(0)}
                    </span>
                    {c}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-0">
            <Input
              value={value}
              onChange={handleAddressChange}
              placeholder={placeholder}
              maxLength={128}
              className={cn(
                'h-9 rounded-xl border-0 bg-transparent px-2 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0',
                error && 'text-danger',
              )}
              aria-invalid={!!error}
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Paste from clipboard"
              onClick={handlePaste}
              className="h-9 w-9 rounded-xl"
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Scan QR code"
              onClick={handleScan}
              className="h-9 w-9 rounded-xl"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error ? (
          <p className="px-1 text-xs text-danger">{error}</p>
        ) : null}
      </div>
    )
  },
)

WalletAddressInput.displayName = 'WalletAddressInput'

export default WalletAddressInput
