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
import { useToast } from '../hooks/useToast'
import { cn, formatDate } from '../utils/cn'
import type { Investigation, VASP } from '../services/types'
import { Search, Filter, Eye, Download, FileText, Plus } from 'lucide-react'

type ReportStatus = 'Draft' | 'Submitted' | 'Acknowledged' | 'Rejected'

type GeneratedReport = {
  id: string
  reportId: string
  investigationId: string
  caseId: string
  generatedAt: string
  status: ReportStatus
  investigator: string
  confidence: number
  vaspId: string | null
}

const statusBadgeVariant: Record<ReportStatus, 'default' | 'info' | 'success' | 'danger'> = {
  Draft: 'default',
  Submitted: 'info',
  Acknowledged: 'success',
  Rejected: 'danger',
}

const investigators = [
  'Inspector Sharma',
  'SI Patel',
  'Inspector Khan',
  'SI Reddy',
  'ACP Verma',
]

function buildReports(investigations: Investigation[]): GeneratedReport[] {
  const statusCycle: ReportStatus[] = ['Acknowledged', 'Submitted', 'Draft', 'Submitted', 'Acknowledged', 'Rejected', 'Draft', 'Submitted']
  return investigations.slice(0, 8).map((inv, i) => ({
    id: `rep-${inv.id}`,
    reportId: `REP-2024-${String(1000 + i * 137).padStart(4, '0')}`,
    investigationId: inv.id,
    caseId: inv.caseId,
    generatedAt: new Date(new Date(inv.createdAt).getTime() + (i + 2) * 3600 * 1000 * (i + 1)).toISOString(),
    status: statusCycle[i % statusCycle.length],
    investigator: investigators[i % investigators.length],
    confidence: inv.confidence,
    vaspId: inv.vaspId,
  }))
}

export default function ReportsListPage() {
  const navigate = useNavigate()
  const { success, info } = useToast()
  const investigationsMap = useAppStore((s) => s.investigations.list)
  const loading = useAppStore((s) => s.investigations.loading)
  const investigations = useMemo(() => Object.values(investigationsMap), [investigationsMap])

  const reports = useMemo(() => buildReports(investigations), [investigations])

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | ReportStatus>('All')

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        search === '' ||
        r.reportId.toLowerCase().includes(search.toLowerCase()) ||
        r.caseId.toLowerCase().includes(search.toLowerCase()) ||
        r.investigator.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || r.status === filter
      return matchesSearch && matchesFilter
    })
  }, [reports, search, filter])

  const vaspMap = useMemo(() => {
    const m: Record<string, VASP> = {}
    for (const v of vasps) m[v.id] = v
    return m
  }, [])

  const filters: Array<'All' | ReportStatus> = ['All', 'Draft', 'Submitted', 'Acknowledged', 'Rejected']

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generated Reports
              </CardTitle>
              <CardDescription>
                SAHYOG-ready evidence packets for submitted cases
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                info('Navigate to dashboard', 'Start a new investigation to generate a report.')
                navigate('/')
              }}
            >
              <Plus className="h-4 w-4" />
              Generate new report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search report ID, case ID, investigator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {filters.map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? 'primary' : 'outline'}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <Thead>
              <Tr>
                <Th>Report ID</Th>
                <Th>Case ID</Th>
                <Th>Generated At</Th>
                <Th>Status</Th>
                <Th>Investigator</Th>
                <Th>Confidence</Th>
                <Th>VASP Match</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Tr key={`sk-${i}`}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <Td key={`skc-${i}-${j}`}>
                        <Skeleton className="h-5 w-[80px]" />
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : filteredReports.length === 0 ? (
                <TableEmptyRow colSpan={8}>
                  <EmptyState
                    icon={FileText}
                    title="No reports match your filters"
                    description="Try adjusting the search or filter chips to see more results."
                  />
                </TableEmptyRow>
              ) : (
                filteredReports.map((r) => {
                  const vaspName = r.vaspId ? vaspMap[r.vaspId]?.name : null
                  return (
                    <Tr key={r.id}>
                      <Td className="font-mono font-semibold">
                        <button
                          onClick={() => navigate(`/reports/${r.investigationId}`)}
                          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                          {r.reportId}
                        </button>
                      </Td>
                      <Td className="font-mono text-muted-foreground">{r.caseId}</Td>
                      <Td>{formatDate(r.generatedAt)}</Td>
                      <Td>
                        <Badge variant={statusBadgeVariant[r.status]}>{r.status}</Badge>
                      </Td>
                      <Td>{r.investigator}</Td>
                      <Td>
                        <span
                          className={cn(
                            'font-semibold tabular-nums',
                            r.confidence >= 85
                              ? 'text-success'
                              : r.confidence >= 60
                                ? 'text-warning'
                                : 'text-danger',
                          )}
                        >
                          {r.confidence}%
                        </span>
                      </Td>
                      <Td>
                        {vaspName ? (
                          <Badge variant="info">{vaspName}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="View report"
                            onClick={() => navigate(`/reports/${r.investigationId}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Download report"
                            onClick={() =>
                              success(
                                'Download initiated',
                                `Report ${r.reportId} will be available in downloads.`,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
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
