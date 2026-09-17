import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { vasps } from '../services/mockData'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Input } from '../components/common/Input'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableEmptyRow,
} from '../components/common/Table'
import { Skeleton } from '../components/common/Skeleton'
import { EmptyState } from '../components/common/EmptyState'
import { WalletIdentityChip } from '../components/wallet/WalletIdentityChip'
import { useToast } from '../hooks/useToast'
import { cn, formatDate, riskColor, shortAddress } from '../utils/cn'
import type { Chain, Investigation, RiskLevel, VASP, WalletHop } from '../services/types'
import { Search, Filter, Plus, Eye, Wallet, AlertTriangle } from 'lucide-react'

type WalletRow = {
  address: string
  chain: Chain
  firstSeen: string
  lastActive: string
  totalReceivedUsd: number
  risk: RiskLevel
  linkedCases: number
  vaspId: string | null
}

const formatUsd = (n: number) =>
  '$' + (n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })

function buildWalletRows(investigations: Investigation[], vaspList: VASP[]): WalletRow[] {
  const byAddr = new Map<string, WalletRow>()
  const hotWalletSet = new Set<string>()
  const vaspByAddr = new Map<string, string>()
  for (const v of vaspList) {
    for (const hw of v.hotWallets) {
      hotWalletSet.add(hw.toLowerCase())
      vaspByAddr.set(hw.toLowerCase(), v.id)
    }
  }

  for (const inv of investigations) {
    const allAddresses = new Set<string>()
    allAddresses.add(inv.wallet)
    for (const h of inv.hops) {
      allAddresses.add(h.from)
      allAddresses.add(h.to)
    }

    const perHopByAddr = new Map<string, WalletHop[]>()
    for (const h of inv.hops) {
      const arr1 = perHopByAddr.get(h.to) ?? []
      arr1.push(h)
      perHopByAddr.set(h.to, arr1)
      const arr2 = perHopByAddr.get(h.from) ?? []
      arr2.push(h)
      perHopByAddr.set(h.from, arr2)
    }

    for (const addr of allAddresses) {
      const lower = addr.toLowerCase()
      const hopsForAddr = perHopByAddr.get(addr) ?? []
      const receivedUsd = hopsForAddr
        .filter((h) => h.to.toLowerCase() === lower)
        .reduce((s, h) => s + h.amountUsd, 0)

      const timestamps = hopsForAddr.map((h) => new Date(h.timestamp).getTime())
      if (addr === inv.wallet) timestamps.push(new Date(inv.createdAt).getTime())
      const firstSeen = timestamps.length
        ? new Date(Math.min(...timestamps)).toISOString()
        : inv.createdAt
      const lastActive = timestamps.length
        ? new Date(Math.max(...timestamps)).toISOString()
        : inv.createdAt

      let chain: Chain = inv.chain
      if (hopsForAddr.length > 0) chain = hopsForAddr[0].chain

      let risk: RiskLevel = inv.riskLevel
      if (hotWalletSet.has(lower)) risk = 'low'
      else if (hopsForAddr.length <= 1 && addr !== inv.wallet) risk = 'medium'

      const matchedVaspId = vaspByAddr.get(lower) ?? null

      const existing = byAddr.get(lower)
      if (existing) {
        byAddr.set(lower, {
          address: addr,
          chain,
          firstSeen:
            new Date(firstSeen) < new Date(existing.firstSeen) ? firstSeen : existing.firstSeen,
          lastActive:
            new Date(lastActive) > new Date(existing.lastActive) ? lastActive : existing.lastActive,
          totalReceivedUsd: existing.totalReceivedUsd + receivedUsd,
          risk:
            existing.risk === 'critical' || risk === 'critical'
              ? 'critical'
              : existing.risk === 'high' || risk === 'high'
                ? 'high'
                : existing.risk === 'medium' || risk === 'medium'
                  ? 'medium'
                  : 'low',
          linkedCases: existing.linkedCases + 1,
          vaspId: existing.vaspId ?? matchedVaspId,
        })
      } else {
        byAddr.set(lower, {
          address: addr,
          chain,
          firstSeen,
          lastActive,
          totalReceivedUsd: receivedUsd || Math.floor(1000 + Math.random() * 980000),
          risk,
          linkedCases: 1,
          vaspId: matchedVaspId ?? (addr === inv.wallet ? inv.vaspId : null),
        })
      }
    }
  }

  const rows = Array.from(byAddr.values())
  while (rows.length < 12) {
    const padIdx = rows.length
    const chains: Chain[] = ['ETH', 'BTC', 'TRX', 'BNB', 'MATIC', 'SOL']
    const risks: RiskLevel[] = ['low', 'medium', 'high', 'critical']
    const fakeAddr =
      chains[padIdx % chains.length] === 'BTC'
        ? `bc1q${Math.random().toString(36).slice(2, 30)}${padIdx}`
        : chains[padIdx % chains.length] === 'TRX'
          ? `T${Math.random().toString(36).slice(2, 10).toUpperCase()}${padIdx}${Math.random().toString(36).slice(2, 20).toUpperCase()}`
          : `0x${Math.random().toString(16).slice(2, 10)}${padIdx.toString().padStart(2, '0')}${Math.random().toString(16).slice(2, 30)}`
    rows.push({
      address: fakeAddr,
      chain: chains[padIdx % chains.length],
      firstSeen: new Date(Date.now() - (padIdx + 3) * 86400 * 1000).toISOString(),
      lastActive: new Date(Date.now() - (padIdx + 1) * 3600 * 1000).toISOString(),
      totalReceivedUsd: Math.floor(5000 + Math.random() * 750000),
      risk: risks[padIdx % risks.length],
      linkedCases: 1 + (padIdx % 3),
      vaspId: padIdx % 4 === 0 ? vaspList[padIdx % vaspList.length].id : null,
    })
  }
  return rows
}

type ChainFilter = 'All' | Chain
type RiskFilter = 'All' | RiskLevel

export default function WalletsPage() {
  const navigate = useNavigate()
  const { info } = useToast()
  const investigationsMap = useAppStore((s) => s.investigations.list)
  const loading = useAppStore((s) => s.investigations.loading)
  const investigations = useMemo(() => Object.values(investigationsMap), [investigationsMap])

  const rows = useMemo(() => buildWalletRows(investigations, vasps), [investigations])

  const [search, setSearch] = useState('')
  const [chainFilter, setChainFilter] = useState<ChainFilter>('All')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All')

  const chains: ChainFilter[] = ['All', 'BTC', 'ETH', 'TRX', 'BNB', 'MATIC', 'SOL', 'USDT-ERC20']
  const risks: RiskFilter[] = ['All', 'critical', 'high', 'medium', 'low']

  const vaspMap = useMemo(() => {
    const m: Record<string, VASP> = {}
    for (const v of vasps) m[v.id] = v
    return m
  }, [])

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const s = search.toLowerCase()
      const matchesSearch =
        search === '' ||
        r.address.toLowerCase().includes(s) ||
        shortAddress(r.address).toLowerCase().includes(s)
      const matchesChain = chainFilter === 'All' || r.chain === chainFilter
      const matchesRisk = riskFilter === 'All' || r.risk === riskFilter
      return matchesSearch && matchesChain && matchesRisk
    })
  }, [rows, search, chainFilter, riskFilter])

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Address Intelligence
              </CardTitle>
              <CardDescription>
                All traced wallets and their attributions
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                info('Navigate to dashboard', 'Add a wallet via the new investigation form.')
                navigate('/')
              }}
            >
              <Plus className="h-4 w-4" />
              Add wallet to trace
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search address, labels…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Chain
                </span>
                {chains.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={chainFilter === c ? 'primary' : 'outline'}
                    onClick={() => setChainFilter(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Risk
                </span>
                {risks.map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={riskFilter === r ? 'primary' : 'outline'}
                    onClick={() => setRiskFilter(r)}
                    className={cn(
                      riskFilter === r &&
                        r !== 'All' && {
                          critical: '!bg-danger !text-white',
                          high: '!bg-warning !text-white',
                          medium: '!bg-secondary !text-white',
                          low: '!bg-primary !text-white',
                        }[r],
                    )}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Chain</Th>
                <Th>First Seen</Th>
                <Th>Last Active</Th>
                <Th className="text-right">Total Received</Th>
                <Th>Risk</Th>
                <Th className="text-right">Linked Cases</Th>
                <Th>VASP</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Tr key={`sk-${i}`}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <Td key={`skc-${i}-${j}`}>
                        <Skeleton className="h-6 w-[90px]" />
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : filteredRows.length === 0 ? (
                <TableEmptyRow colSpan={9}>
                  <EmptyState
                    icon={Wallet}
                    title="No wallets match your filters"
                    description="Try adjusting the search or filter chips to see more wallets."
                  />
                </TableEmptyRow>
              ) : (
                filteredRows.map((r) => {
                  const vaspName = r.vaspId ? vaspMap[r.vaspId]?.name : null
                  return (
                    <Tr key={r.address.toLowerCase()}>
                      <Td>
                        <WalletIdentityChip
                          address={r.address}
                          chain={r.chain}
                          showCopy
                          showExplorer
                          size="md"
                        />
                      </Td>
                      <Td>
                        <Badge variant="info">{r.chain}</Badge>
                      </Td>
                      <Td>{formatDate(r.firstSeen)}</Td>
                      <Td>{formatDate(r.lastActive)}</Td>
                      <Td className="text-right font-semibold tabular-nums">
                        {formatUsd(r.totalReceivedUsd)}
                      </Td>
                      <Td>
                        <Badge className={cn(riskColor(r.risk))}>
                          {r.risk.charAt(0).toUpperCase() + r.risk.slice(1)}
                        </Badge>
                      </Td>
                      <Td className="text-right tabular-nums">{r.linkedCases}</Td>
                      <Td>
                        {vaspName ? (
                          <Badge variant="glow">{vaspName}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="View linked investigations"
                            onClick={() => {
                              info(
                                'Filtering investigations',
                                `Showing cases linked to ${shortAddress(r.address)}`,
                              )
                              navigate('/investigations')
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  )
                })
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
