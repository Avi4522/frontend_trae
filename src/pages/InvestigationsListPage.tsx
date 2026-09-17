import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useToast } from '../hooks/useToast'
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
import { Input, Label } from '../components/common/Input'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableEmptyRow,
} from '../components/common/Table'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/common/Skeleton'
import { WalletIdentityChip } from '../components/wallet/WalletIdentityChip'
import {
  cn,
  formatDate,
  riskColor,
} from '../utils/cn'
import type {
  Chain,
  RiskLevel,
  InvestigationStatus,
  Investigation,
} from '../services/types'

const CHAIN_OPTIONS: (Chain | 'All')[] = [
  'All',
  'BTC',
  'ETH',
  'TRX',
  'BNB',
  'SOL',
  'MATIC',
  'USDT-ERC20',
]

type StatusFilter =
  | 'All'
  | 'In Progress'
  | 'Complete'
  | 'High Risk'
  | 'Escalated'
  | 'Review'

const STATUS_FILTERS: StatusFilter[] = [
  'All',
  'In Progress',
  'Complete',
  'High Risk',
  'Escalated',
  'Review',
]

function statusBadgeVariant(
  s: InvestigationStatus,
): 'info' | 'danger' | 'warning' | 'success' | 'default' {
  switch (s) {
    case 'Tracing':
      return 'info'
    case 'Escalated':
      return 'danger'
    case 'Review':
      return 'warning'
    case 'Closed':
      return 'success'
    case 'Pending':
    default:
      return 'default'
  }
}

function StatusIcon({ status }: { status: InvestigationStatus }) {
  if (status === 'Tracing') {
    return (
      <span className="relative inline-flex h-2 w-2 mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
    )
  }
  if (status === 'Closed')
    return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
  if (status === 'Escalated')
    return <XCircle className="h-3.5 w-3.5 mr-1" />
  if (status === 'Review')
    return <AlertTriangle className="h-3.5 w-3.5 mr-1" />
  return <Clock className="h-3.5 w-3.5 mr-1" />
}

function confidenceColor(
  c: number,
): 'text-success' | 'text-primary' | 'text-warning' | 'text-danger' {
  if (c > 80) return 'text-success'
  if (c > 60) return 'text-primary'
  if (c > 40) return 'text-warning'
  return 'text-danger'
}

function matchesStatusFilter(
  inv: Investigation,
  filter: StatusFilter,
): boolean {
  switch (filter) {
    case 'All':
      return true
    case 'In Progress':
      return inv.status === 'Tracing' || inv.status === 'Pending'
    case 'Complete':
      return inv.status === 'Closed'
    case 'High Risk':
      return inv.riskLevel === 'high' || inv.riskLevel === 'critical'
    case 'Escalated':
      return inv.status === 'Escalated'
    case 'Review':
      return inv.status === 'Review'
    default:
      return true
  }
}

export default function InvestigationsListPage() {
  const navigate = useNavigate()
  const { success, info } = useToast()

  const investigationsMap = useAppStore((s) => s.investigations.list)

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [chainFilter, setChainFilter] = useState<Chain | 'All'>('All')
  const [page, setPage] = useState(1)
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const investigationsArr: Investigation[] = useMemo(() => {
    return Object.values(investigationsMap).sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      return sortAsc ? aTime - bTime : bTime - aTime
    })
  }, [investigationsMap, sortAsc])

  const filtered: Investigation[] = useMemo(() => {
    const q = search.trim().toLowerCase()
    return investigationsArr.filter((inv) => {
      if (q) {
        const inCase = inv.caseId.toLowerCase().includes(q)
        const inWallet = inv.wallet.toLowerCase().includes(q)
        const inNotes = inv.notes.toLowerCase().includes(q)
        if (!inCase && !inWallet && !inNotes) return false
      }
      if (!matchesStatusFilter(inv, statusFilter)) return false
      if (chainFilter !== 'All' && inv.chain !== chainFilter) return false
      return true
    })
  }, [investigationsArr, search, statusFilter, chainFilter])

  const perPage = 8
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * perPage
  const endIdx = Math.min(startIdx + perPage, filtered.length)
  const pagedRows = filtered.slice(startIdx, endIdx)

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setChainFilter('All')
    setPage(1)
    info('Filters cleared')
  }

  const handleNewInvestigation = () => {
    info('Navigating to new investigation…')
    navigate('/dashboard')
  }

  const handleViewReport = (inv: Investigation) => {
    success(`Report ${inv.caseId}`, 'Opening report preview…')
    navigate(`/reports/${inv.id}`)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Investigations Case Load
          </CardTitle>
          <CardDescription>
            All your active and closed cases with VASP attribution pipeline
            status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-none sm:w-80 w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search case ID, wallet address, notes…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Label className="text-xs mr-1 text-muted-foreground">
                <Filter className="h-3.5 w-3.5 inline mr-1" />
                Status
              </Label>
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setStatusFilter(active ? 'All' : f)
                      setPage(1)
                    }}
                  >
                    <Badge
                      variant={active ? 'glow' : 'default'}
                      className={cn(
                        'cursor-pointer',
                        !active &&
                          'border-border/60 bg-transparent hover:bg-muted/60',
                      )}
                    >
                      {f}
                    </Badge>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Label className="text-xs mr-1 text-muted-foreground">
                Chain
              </Label>
              {CHAIN_OPTIONS.map((c) => {
                const active = chainFilter === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setChainFilter(active ? 'All' : c)
                      setPage(1)
                    }}
                  >
                    <Badge
                      variant={active ? 'info' : 'default'}
                      className={cn(
                        'cursor-pointer',
                        !active &&
                          'border-border/60 bg-transparent hover:bg-muted/60',
                      )}
                    >
                      {c}
                    </Badge>
                  </button>
                )
              })}
            </div>

            <div className="ml-auto">
              <Button variant="primary" size="md" onClick={handleNewInvestigation}>
                <Plus className="h-4 w-4" />
                New Investigation
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {filtered.length === 0 ? 0 : startIdx + 1}
              </span>
              {' – '}
              <span className="font-semibold text-foreground tabular-nums">
                {endIdx}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {filtered.length}
              </span>{' '}
              cases
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                const active = p === currentPage
                return (
                  <Button
                    key={p}
                    variant={active ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="min-w-[2.25rem]"
                  >
                    {p}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <button
                      type="button"
                      onClick={() => setSortAsc((s) => !s)}
                      className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Case ID
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </Th>
                  <Th>Wallet</Th>
                  <Th>Chain</Th>
                  <Th>Status</Th>
                  <Th>VASP Match</Th>
                  <Th>Confidence</Th>
                  <Th>Risk</Th>
                  <Th>Created</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.length === 0 ? (
                  <TableEmptyRow colSpan={9}>
                    <EmptyState
                      title="No matching investigations"
                      description="Try adjusting your search or filters"
                      action={{
                        label: 'Clear filters',
                        onClick: resetFilters,
                        variant: 'outline',
                      }}
                    />
                  </TableEmptyRow>
                ) : (
                  pagedRows.map((inv) => {
                    const vasp = vasps.find((v) => v.id === inv.vaspId)
                    return (
                      <Tr key={inv.id}>
                        <Td>
                          <button
                            onClick={() =>
                              navigate(`/investigations/${inv.id}`)
                            }
                            className="text-left font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {inv.caseId}
                          </button>
                        </Td>
                        <Td>
                          <WalletIdentityChip
                            address={inv.wallet}
                            chain={inv.chain}
                            showCopy
                            size="sm"
                          />
                        </Td>
                        <Td>
                          <Badge variant="info">{inv.chain}</Badge>
                        </Td>
                        <Td>
                          <Badge variant={statusBadgeVariant(inv.status)}>
                            <StatusIcon status={inv.status} />
                            {inv.status}
                          </Badge>
                        </Td>
                        <Td>
                          {vasp ? (
                            <span className="text-sm font-medium text-foreground">
                              {vasp.name}
                            </span>
                          ) : (
                            <Badge variant="default" className="border-dashed">
                              Unattributed
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          <span
                            className={cn(
                              'font-bold tabular-nums',
                              confidenceColor(inv.confidence),
                            )}
                          >
                            {inv.confidence}%
                          </span>
                        </Td>
                        <Td>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
                              riskColor(inv.riskLevel as RiskLevel),
                            )}
                          >
                            {inv.riskLevel.charAt(0).toUpperCase() +
                              inv.riskLevel.slice(1)}
                          </span>
                        </Td>
                        <Td className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
                          {formatDate(inv.createdAt)}
                        </Td>
                        <Td className="text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="View investigation"
                              onClick={() =>
                                navigate(`/investigations/${inv.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Open report"
                              onClick={() => handleViewReport(inv)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
