import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '@xyflow/react/dist/style.css'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Position,
  Handle,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import {
  ArrowLeft,
  ChevronRight,
  Home,
  FolderKanban,
  Eye,
  FileText,
  Copy,
  ExternalLink,
  Wallet,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  AlertOctagon,
  Calendar,
  User,
  Building2,
  ShieldCheck,
  Target,
  Layers,
  Activity,
  Clock,
  BadgeCheck,
  Printer,
  Download,
  Search,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useToast } from '../hooks/useToast'
import { vasps, riskIndicators, timelineEvents as baseTimeline } from '../services/mockData'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Badge } from '../components/common/Badge'
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
import { ProgressCircle } from '../components/common/ProgressCircle'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/common/Tabs'
import { Skeleton } from '../components/common/Skeleton'
import { WalletIdentityChip } from '../components/wallet/WalletIdentityChip'
import {
  cn,
  formatCrypto,
  formatDate,
  riskColor,
  shortAddress,
} from '../utils/cn'
import type {
  Chain,
  RiskLevel,
  InvestigationStatus,
  Investigation,
  TimelineEvent,
  TimelineIconType,
  RiskIndicator,
  VASP,
} from '../services/types'

const formatUsd = (n: number): string =>
  '$' + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })

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

function riskBadgeVariant(
  severity: 'low' | 'medium' | 'high' | 'critical',
): 'success' | 'info' | 'warning' | 'danger' {
  switch (severity) {
    case 'critical':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
      return 'success'
  }
}

function confidenceColor(
  c: number,
): 'text-success' | 'text-primary' | 'text-warning' | 'text-danger' {
  if (c > 80) return 'text-success'
  if (c > 60) return 'text-primary'
  if (c > 40) return 'text-warning'
  return 'text-danger'
}

const nodeTypes = {
  custom: (props: NodeProps) => {
    const d = props.data as {
      label: string
      sub: string
      kind: 'source' | 'hop' | 'deposit' | 'exchange'
    }
    const kindClass =
      d.kind === 'source'
        ? 'border-graph-source shadow-glow-primary'
        : d.kind === 'hop'
          ? 'border-accent/60 shadow-glow'
          : d.kind === 'deposit'
            ? 'border-warning/60 shadow-glow'
            : 'border-graph-exchange/60 shadow-glow-primary'
    const labelClass =
      d.kind === 'source'
        ? 'text-graph-source'
        : d.kind === 'hop'
          ? 'text-accent'
          : d.kind === 'deposit'
            ? 'text-warning'
            : 'text-graph-exchange'
    return (
      <div className="relative">
        {d.kind !== 'source' && (
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-muted !border-2 !border-border"
          />
        )}
        <div
          className={cn(
            'rounded-xl border bg-card p-3 backdrop-blur-xl min-w-[140px]',
            kindClass,
          )}
        >
          <div className={cn('text-sm font-semibold', labelClass)}>
            {d.label}
          </div>
          <div className="mt-0.5 text-xs font-mono text-muted-foreground">
            {d.sub}
          </div>
        </div>
        {d.kind !== 'exchange' && (
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-muted !border-2 !border-border"
          />
        )}
      </div>
    )
  },
}

function IconBubble({
  iconType,
  children,
}: {
  iconType: TimelineIconType
  children: React.ReactNode
}) {
  const cls =
    iconType === 'info'
      ? 'bg-primary/15 text-primary'
      : iconType === 'success'
        ? 'bg-success/20 text-success'
        : iconType === 'warning'
          ? 'bg-warning/20 text-warning'
          : iconType === 'danger'
            ? 'bg-danger/20 text-danger'
            : iconType === 'wallet'
              ? 'bg-accent/20 text-accent'
              : 'bg-secondary/20 text-secondary'
  return (
    <div
      className={cn(
        'z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/70 backdrop-blur',
        cls,
      )}
    >
      {children}
    </div>
  )
}

function timelineIconFor(type: TimelineIconType) {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5" />
    case 'success':
      return <CheckCircle2 className="h-5 w-5" />
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />
    case 'danger':
      return <AlertOctagon className="h-5 w-5" />
    case 'wallet':
      return <Wallet className="h-5 w-5" />
    case 'transaction':
      return <ArrowLeftRight className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

function buildTimeline(inv: Investigation): TimelineEvent[] {
  const created = new Date(inv.createdAt).getTime()
  const mk = (
    id: string,
    title: string,
    description: string,
    offsetMin: number,
    iconType: TimelineIconType,
  ): TimelineEvent => ({
    id,
    title,
    description,
    timestamp: new Date(created + offsetMin * 60000).toISOString(),
    iconType,
  })
  const synthesized: TimelineEvent[] = [
    mk(
      `${inv.id}-tl-0`,
      'Complaint-linked wallet ingested',
      'Wallet and seed transactions normalized from FIR metadata and victim evidence package.',
      0,
      'wallet',
    ),
    mk(
      `${inv.id}-tl-1`,
      'Raw explorer responses cached',
      `Full block history pulled for ${inv.chain} chain via integrated explorer APIs.`,
      8,
      'info',
    ),
    mk(
      `${inv.id}-tl-2`,
      'Two-hop peel chain identified',
      'Automated heuristics flagged rapid fan-out into fresh intermediary wallets with short dwell times.',
      22,
      'warning',
    ),
    mk(
      `${inv.id}-tl-3`,
      'Deposit-signature heuristic crossed threshold 0.70',
      'Address clustering and output-shape signatures matched known VASP deposit corpus patterns.',
      41,
      'success',
    ),
    mk(
      `${inv.id}-tl-4`,
      'Nearest VASP deposit cluster matched',
      `Confidence crossed the 85% threshold — ${
        vasps.find((v) => v.id === inv.vaspId)?.name || 'Unattributed VASP'
      } hot-wallet corpus intersection.`,
      63,
      'success',
    ),
    mk(
      `${inv.id}-tl-5`,
      'Confidence re-scored after post-mixer temporal match',
      'Temporal-cohort analysis refined attribution score after chain-crossing mixer exit matched.',
      118,
      'info',
    ),
    mk(
      `${inv.id}-tl-6`,
      'Case packet prepared for officer review',
      'SAHYOG-ready report preview, blockchain screenshots, and freeze recommendation generated.',
      185,
      'success',
    ),
    mk(
      `${inv.id}-tl-7`,
      'SAHYOG packet template drafted for officer sign-off',
      '65B certificate, SHA manifest, and disclosure request forms templated with case metadata.',
      240,
      'transaction',
    ),
  ]
  const merged = [...baseTimeline, ...synthesized]
  const dedup = new Map<string, TimelineEvent>()
  for (const ev of merged) dedup.set(ev.id, ev)
  return Array.from(dedup.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
}

function buildFlowNodesEdges(
  inv: Investigation,
  vasp: VASP | null,
): { nodes: Node[]; edges: Edge[] } {
  const hops = inv.hops
  const srcAddr = shortAddress(inv.wallet)

  const nodes: Node<{
    label: string
    sub: string
    kind: 'source' | 'hop' | 'deposit' | 'exchange'
  }>[] = [
    {
      id: 'source',
      type: 'custom',
      position: { x: 0, y: 160 },
      data: { label: 'Source Wallet', sub: srcAddr, kind: 'source' },
    },
  ]

  if (hops.length >= 2) {
    nodes.push({
      id: 'hop1',
      type: 'custom',
      position: { x: 240, y: 80 },
      data: {
        label: 'Hop 1 · Peel',
        sub: shortAddress(hops[0].to),
        kind: 'hop',
      },
    })
    nodes.push({
      id: 'hop2',
      type: 'custom',
      position: { x: 240, y: 240 },
      data: {
        label: 'Hop 2 · Mixer',
        sub: shortAddress(hops[1]?.to || hops[0].to),
        kind: 'hop',
      },
    })
  } else {
    nodes.push({
      id: 'hop1',
      type: 'custom',
      position: { x: 240, y: 160 },
      data: {
        label: 'Hop 1 · Peel',
        sub: hops[0] ? shortAddress(hops[0].to) : 'Intermediary',
        kind: 'hop',
      },
    })
  }

  const depositTo =
    hops.find((h) => h.labels.some((l) => l.includes('deposit')))?.to ||
    hops[Math.floor(hops.length / 2)]?.to ||
    'Tagged collector'

  nodes.push({
    id: 'deposit',
    type: 'custom',
    position: { x: 500, y: 160 },
    data: {
      label: 'Deposit Address',
      sub: shortAddress(depositTo) || 'Tagged collector',
      kind: 'deposit',
    },
  })

  nodes.push({
    id: 'exchange',
    type: 'custom',
    position: { x: 760, y: 160 },
    data: {
      label: vasp ? `${vasp.name} Hot Wallet` : 'VASP Cluster',
      sub: vasp ? `${vasp.type} · ${vasp.jurisdiction}` : 'Unattributed',
      kind: 'exchange',
    },
  })

  const edgeStyle = { strokeWidth: 2, strokeDasharray: '5 5' }
  const labelStyle = {
    fill: 'rgb(var(--muted-foreground))',
    fontSize: 11,
    fontWeight: 600,
  }
  const labelBgStyle = {
    fill: 'rgb(var(--card))',
    fillOpacity: 0.9,
    stroke: 'rgb(var(--border))',
    strokeOpacity: 0.6,
  }

  const edges: Edge[] = []
  if (hops.length >= 2) {
    edges.push({
      id: 'e-s-h1',
      source: 'source',
      target: 'hop1',
      label: formatUsd(hops[0]?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--primary))',
      },
    })
    edges.push({
      id: 'e-s-h2',
      source: 'source',
      target: 'hop2',
      label: formatUsd(hops[1]?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--accent))',
      },
    })
    edges.push({
      id: 'e-h1-d',
      source: 'hop1',
      target: 'deposit',
      label: formatUsd((hops[2] || hops[0])?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--accent))',
      },
    })
    edges.push({
      id: 'e-h2-d',
      source: 'hop2',
      target: 'deposit',
      label: formatUsd((hops[3] || hops[1])?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--warning))',
      },
    })
  } else {
    edges.push({
      id: 'e-s-h1',
      source: 'source',
      target: 'hop1',
      label: formatUsd(hops[0]?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--accent))',
      },
    })
    edges.push({
      id: 'e-h1-d',
      source: 'hop1',
      target: 'deposit',
      label: formatUsd(hops[0]?.amountUsd || 0),
      animated: true,
      style: edgeStyle,
      labelStyle,
      labelBgStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgb(var(--warning))',
      },
    })
  }

  const depSum =
    hops.length > 0
      ? hops[hops.length - 1]?.amountUsd || hops[0].amountUsd
      : 0
  edges.push({
    id: 'e-d-ex',
    source: 'deposit',
    target: 'exchange',
    label: formatUsd(depSum),
    animated: true,
    style: edgeStyle,
    labelStyle,
    labelBgStyle,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'rgb(var(--success))',
    },
  })

  return { nodes, edges }
}

const CONFIDENCE_BREAKDOWN = [
  { label: 'Deposit Signature', value: 92 },
  { label: 'Label Match', value: 91 },
  { label: 'Tx Volume', value: 88 },
  { label: 'Hop Depth', value: 78 },
  { label: 'Temporal', value: 85 },
  { label: 'Hot Wallet', value: 80 },
]

function riskIconFor(ri: RiskIndicator) {
  if (ri.severity === 'critical')
    return <AlertOctagon className="h-4 w-4" />
  if (ri.severity === 'high') return <AlertTriangle className="h-4 w-4" />
  if (ri.severity === 'medium') return <ShieldAlert className="h-4 w-4" />
  return <CheckCircle2 className="h-4 w-4" />
}

export default function InvestigationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, info, pushToast } = useToast()

  const investigationsList = useAppStore((s) => s.investigations.list)
  const updateInvestigation = useAppStore(
    (s) => s.investigations.updateInvestigation,
  )

  const inv: Investigation | undefined = useMemo(
    () => Object.values(investigationsList).find((x) => x.id === id),
    [investigationsList, id],
  )

  const [hopSearch, setHopSearch] = useState('')
  const [hopSide, setHopSide] = useState<'All' | 'in' | 'out'>('All')
  const [hopChain, setHopChain] = useState<Chain | 'All'>('All')
  const [graphLoading] = useState(false)
  const vasp = vasps.find((v) => v.id === inv?.vaspId) || null
  const totalReceived = useMemo(
    () => inv?.hops.filter((h) => h.side === 'in').reduce((a, b) => a + b.amountUsd, 0) ?? 0,
    [inv?.hops],
  )
  const totalSent = useMemo(
    () => inv?.hops.filter((h) => h.side === 'out').reduce((a, b) => a + b.amountUsd, 0) ?? 0,
    [inv?.hops],
  )
  const filteredHops = useMemo(() => {
    const q = hopSearch.trim().toLowerCase()
    return [...(inv?.hops ?? [])]
      .sort((a, b) => a.block - b.block)
      .filter((h) => {
        if (q) {
          const inFrom = h.from.toLowerCase().includes(q)
          const inTo = h.to.toLowerCase().includes(q)
          const inTx = h.txHash.toLowerCase().includes(q)
          if (!inFrom && !inTo && !inTx) return false
        }
        if (hopSide !== 'All' && h.side !== hopSide) return false
        if (hopChain !== 'All' && h.chain !== hopChain) return false
        return true
      })
  }, [inv?.hops, hopSearch, hopSide, hopChain])
  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () => inv ? buildFlowNodesEdges(inv, vasp) : { nodes: [], edges: [] },
    [inv, vasp],
  )

  if (!inv) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <EmptyState
          icon={FolderKanban}
          title="Case not found"
          description={`Investigation ID "${
            id ?? 'unknown'
          }" does not exist in your case load.`}
          action={{
            label: 'Back to investigations',
            onClick: () => navigate('/investigations'),
            variant: 'outline',
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Home className="h-3.5 w-3.5" />
              Dashboard Home
            </Button>
          </div>
        </EmptyState>
      </div>
    )
  }

  const timeline = buildTimeline(inv)

  const handleRouteToSahyog = () => {
    const ok = window.confirm(
      `Submit case ${inv.caseId} to SAHYOG Portal for disclosure/freezing request?\n\nOfficer sign-off and DSC are required before submission.`,
    )
    if (!ok) return
    updateInvestigation(inv.id, { status: 'Escalated' })
    success(
      'Submitted to SAHYOG Portal',
      'Acknowledgement receipt pending from portal. Case status updated to Escalated.',
    )
    pushToast({
      title: 'Submitted to SAHYOG Portal',
      description:
        'Acknowledgement receipt pending from portal. Case status updated to Escalated.',
      variant: 'success',
    })
  }

  const handleGenerateReport = () => {
    info('Opening report preview…', 'Generating SAHYOG-ready PDF preview.')
    navigate(`/reports/${inv.id}`)
  }

  const handleViewEvidence = () => {
    info('Viewing evidence gallery', 'Switching to Evidence tab with all exhibits.')
  }

  const handleCopySha = (sha: string) => {
    navigator.clipboard
      .writeText(sha)
      .then(() => success('SHA-256 copied', sha))
      .catch(() => success('SHA-256 copied', sha))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <Link
          to="/investigations"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <FolderKanban className="h-3.5 w-3.5" />
          Investigations
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-bold text-foreground">{inv.caseId}</span>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/investigations')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to list
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                Case {inv.caseId}
              </CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                {inv.notes || 'No officer notes recorded for this case.'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <WalletIdentityChip
                address={inv.wallet}
                chain={inv.chain}
                showCopy
                showExplorer
                size="md"
              />
              <Badge variant="info">{inv.chain}</Badge>
              <Badge variant={statusBadgeVariant(inv.status)}>
                {inv.status}
              </Badge>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 px-3 py-2">
                <ProgressCircle
                  size={72}
                  progress={inv.confidence}
                  label="Confidence"
                  color={
                    inv.confidence > 80
                      ? 'success'
                      : inv.confidence > 60
                        ? 'primary'
                        : inv.confidence > 40
                          ? 'warning'
                          : 'danger'
                  }
                />
                <div className="text-sm">
                  <div className="font-bold text-foreground tabular-nums">
                    {inv.confidence}% Attribution
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Weighted 6-factor methodology
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[320px]">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                VASP Match
              </div>
              <div className="mt-1">
                {vasp ? (
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    {vasp.name}
                  </span>
                ) : (
                  <Badge variant="default" className="border-dashed">
                    Unattributed
                  </Badge>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Risk Level
              </div>
              <div className="mt-1">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
                    riskColor(inv.riskLevel as RiskLevel),
                  )}
                >
                  {inv.riskLevel.charAt(0).toUpperCase() + inv.riskLevel.slice(1)}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Hops Traced
              </div>
              <div className="mt-1 font-bold text-foreground tabular-nums flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-accent" />
                {inv.hops.length} hops
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Created
              </div>
              <div className="mt-1 font-bold text-foreground text-xs tabular-nums whitespace-nowrap flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDate(inv.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-wrap items-end justify-end gap-2 border-t border-border/50 mt-2 pt-5">
          <Button variant="outline" size="md" onClick={handleViewEvidence}>
            <Printer className="h-4 w-4" />
            View Evidence
          </Button>
          <Button variant="outline" size="md" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleRouteToSahyog}
            className="!bg-success/90 !text-success-foreground hover:!bg-success shadow-glow-success"
          >
            <ShieldCheck className="h-4 w-4" />
            Route to SAHYOG
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex-wrap overflow-x-auto whitespace-nowrap w-full h-auto py-1.5">
          <TabsTrigger value="overview">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="hops">
            <ArrowLeftRight className="h-4 w-4" />
            Hops
          </TabsTrigger>
          <TabsTrigger value="evidence">
            <Eye className="h-4 w-4" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileText className="h-4 w-4" />
            Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Target Wallet Summary
                </CardTitle>
                <CardDescription>
                  Address intelligence and on-chain activity snapshot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Address
                  </span>
                  <WalletIdentityChip
                    address={inv.wallet}
                    chain={inv.chain}
                    showCopy
                    showExplorer
                    size="sm"
                    className="w-full sm:w-auto"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Chain
                  </span>
                  <Badge variant="info">{inv.chain}</Badge>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    First Seen
                  </span>
                  <span className="font-semibold text-foreground text-sm tabular-nums">
                    {inv.hops.length > 0
                      ? formatDate(
                          [...inv.hops].sort(
                            (a, b) =>
                              new Date(a.timestamp).getTime() -
                              new Date(b.timestamp).getTime(),
                          )[0].timestamp,
                        )
                      : formatDate(inv.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </span>
                  <span className="font-semibold text-foreground text-sm tabular-nums">
                    {inv.hops.length > 0
                      ? formatDate(
                          [...inv.hops].sort(
                            (a, b) =>
                              new Date(b.timestamp).getTime() -
                              new Date(a.timestamp).getTime(),
                          )[0].timestamp,
                        )
                      : formatDate(inv.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Received
                  </span>
                  <span className="font-bold text-success tabular-nums">
                    {formatUsd(totalReceived)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Sent
                  </span>
                  <span className="font-bold text-danger tabular-nums">
                    {formatUsd(totalSent)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Linked Cases
                  </span>
                  <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    1 case
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Nearest VASP Attribution
                </CardTitle>
                <CardDescription>
                  Closest exchange deposit cluster and attribution confidence.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                      className={cn(
                        'grid h-20 w-20 place-items-center rounded-3xl border text-3xl font-black shadow-glow-primary',
                        vasp
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {vasp ? vasp.logoLetter : '?'}
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-xl font-bold tracking-tight text-foreground">
                        {vasp ? vasp.name : 'Unattributed VASP'}
                      </div>
                      {vasp?.jurisdiction && (
                        <Badge variant="info">{vasp.jurisdiction}</Badge>
                      )}
                      {vasp?.type && <Badge variant="glow">{vasp.type}</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <ProgressCircle
                        size={80}
                        progress={92}
                        label="Attribution"
                        color="success"
                      />
                      <div className="text-sm text-muted-foreground">
                        Combined score across signature, label, and temporal
                        cohorts.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                    <div className="text-lg font-bold text-foreground tabular-nums">
                      47
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Deposit Sig
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                    <div className="text-lg font-bold text-foreground tabular-nums">
                      2/5
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Hot Wallet
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                    <div className="text-lg font-bold text-foreground truncate">
                      {vasp?.jurisdiction.split(' ')[0] || '—'}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Jurisdiction
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                    <div
                      className={cn(
                        'text-sm font-bold tabular-nums',
                        confidenceColor(vasp?.riskScore ?? 50),
                      )}
                    >
                      {vasp?.riskScore ?? '—'}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Risk Score
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-sm text-muted-foreground flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  PMLA §12A registered · Disclosure requests routed through
                  FIU-IND nodal officer.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Attribution Confidence · Factors
                </CardTitle>
                <CardDescription>
                  Six-factor weighted scoring methodology breakdown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {CONFIDENCE_BREAKDOWN.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {b.label}
                      </span>
                      <span
                        className={cn(
                          'font-bold tabular-nums',
                          confidenceColor(b.value),
                        )}
                      >
                        {b.value}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${b.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-danger" />
                  Risk Indicators · {riskIndicators.length} Flags
                </CardTitle>
                <CardDescription>
                  Flags from forensic heuristics engine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {riskIndicators.map((ri) => (
                    <div
                      key={ri.id}
                      className="rounded-2xl border border-border/70 bg-muted/30 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'grid h-8 w-8 place-items-center rounded-xl',
                              ri.severity === 'critical'
                                ? 'bg-danger/15 text-danger'
                                : ri.severity === 'high'
                                  ? 'bg-warning/15 text-warning'
                                  : ri.severity === 'medium'
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-success/15 text-success',
                            )}
                          >
                            {riskIconFor(ri)}
                          </span>
                          <div className="text-sm font-semibold text-foreground">
                            {ri.label}
                          </div>
                        </div>
                        <Badge variant={riskBadgeVariant(ri.severity)}>
                          {ri.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ri.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Compact Fund-Flow Graph
                </CardTitle>
                <CardDescription>
                  Interactive transaction hop graph · React Flow
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 self-start sm:self-end">
                <Button size="sm" variant="outline">
                  <Printer className="h-3.5 w-3.5" />
                  Print Graph
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-3.5 w-3.5" />
                  Export PNG
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="w-full overflow-hidden rounded-2xl border border-border/70 bg-background/40"
                style={{ height: 320 }}
              >
                {graphLoading ? (
                  <div className="h-full w-full p-4">
                    <Skeleton className="h-full w-full rounded-2xl" />
                  </div>
                ) : (
                  <ReactFlow
                    nodes={flowNodes}
                    edges={flowEdges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background
                      variant={BackgroundVariant.Dots}
                      gap={18}
                      size={1.2}
                    />
                    <Controls className="!rounded-2xl !border !border-border/70 !bg-card/90 !backdrop-blur !shadow-glow [&>button]:!text-foreground [&>button]:!bg-transparent hover:[&>button]:!bg-muted" />
                    <MiniMap
                      pannable
                      zoomable
                      className="!rounded-2xl !border !border-border/70 !bg-card/90 !backdrop-blur !shadow-glow"
                      nodeColor={(n) => {
                        const d = n?.data as
                          | { kind: 'source' | 'hop' | 'deposit' | 'exchange' }
                          | undefined
                        if (!d) return 'rgb(var(--muted-foreground))'
                        if (d.kind === 'source')
                          return 'rgb(var(--graph-source))'
                        if (d.kind === 'hop') return 'rgb(var(--accent))'
                        if (d.kind === 'deposit')
                          return 'rgb(var(--warning))'
                        return 'rgb(var(--graph-exchange))'
                      }}
                      maskColor="rgb(var(--background) / 0.6)"
                    />
                  </ReactFlow>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <LegendItemDot dot="bg-graph-source" label="Source Wallet" />
                <LegendItemDot dot="bg-accent" label="Intermediary Hop" />
                <LegendItemDot dot="bg-warning" label="Deposit Collector" />
                <LegendItemDot dot="bg-graph-exchange" label="VASP / Exchange" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Investigation Timeline · Chronological Events
              </CardTitle>
              <CardDescription>
                Automated pipeline events + investigator actions, ordered by
                wall-clock timestamp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-2 pr-1">
                <div className="absolute left-[1.25rem] top-2 bottom-2 w-px bg-border/80" />
                <div className="space-y-5">
                  {timeline.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-4 relative">
                      <IconBubble iconType={ev.iconType}>
                        {timelineIconFor(ev.iconType)}
                      </IconBubble>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur p-4 shadow-glow/50">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-bold text-foreground">
                              {ev.title}
                            </div>
                            <Badge variant={
                              ev.iconType === 'success'
                                ? 'success'
                                : ev.iconType === 'warning'
                                  ? 'warning'
                                  : ev.iconType === 'danger'
                                    ? 'danger'
                                    : ev.iconType === 'wallet' || ev.iconType === 'transaction'
                                      ? 'glow'
                                      : 'info'
                            }>
                              {ev.iconType.charAt(0).toUpperCase() +
                                ev.iconType.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(ev.timestamp)}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {ev.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hops">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Wallet Hop Trace · Transaction Graph
              </CardTitle>
              <CardDescription>
                Directed edges from source wallet through peel chain to VASP
                deposit cluster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:flex-none sm:w-80 w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search address, tx hash…"
                    value={hopSearch}
                    onChange={(e) => setHopSearch(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={hopSide === 'All' ? 'info' : 'default'}
                    className="cursor-pointer border-border/60 hover:bg-muted/60"
                    onClick={() => setHopSide('All')}
                  >
                    Side: All
                  </Badge>
                  <Badge
                    variant={hopSide === 'in' ? 'success' : 'default'}
                    className="cursor-pointer border-border/60 hover:bg-muted/60"
                    onClick={() => setHopSide(hopSide === 'in' ? 'All' : 'in')}
                  >
                    In
                  </Badge>
                  <Badge
                    variant={hopSide === 'out' ? 'danger' : 'default'}
                    className="cursor-pointer border-border/60 hover:bg-muted/60"
                    onClick={() => setHopSide(hopSide === 'out' ? 'All' : 'out')}
                  >
                    Out
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={hopChain === 'All' ? 'glow' : 'default'}
                    className="cursor-pointer border-border/60 hover:bg-muted/60"
                    onClick={() => setHopChain('All')}
                  >
                    All Chains
                  </Badge>
                  {(['BTC', 'ETH', 'TRX', 'BNB', 'SOL', 'MATIC', 'USDT-ERC20'] as const).map(
                    (c) => {
                      const active = hopChain === c
                      return (
                        <Badge
                          key={c}
                          variant={active ? 'info' : 'default'}
                          className="cursor-pointer border-border/60 hover:bg-muted/60"
                          onClick={() => setHopChain(active ? 'All' : c)}
                        >
                          {c}
                        </Badge>
                      )
                    },
                  )}
                </div>
              </div>

              {inv.hops.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title="No hop data available for this case yet"
                  description="Trace pipeline is still running or wallet has no linked transactions. Check back once the 6-stage pipeline completes."
                />
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>From</Th>
                      <Th>To</Th>
                      <Th>Amount</Th>
                      <Th>USD Value</Th>
                      <Th>Block</Th>
                      <Th>Timestamp</Th>
                      <Th>Chain</Th>
                      <Th>Labels</Th>
                      <Th>Side</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredHops.length === 0 ? (
                      <TableEmptyRow colSpan={10}>
                        <EmptyState
                          title="No hops match filters"
                          description="Try clearing the search or filter chips above."
                          action={{
                            label: 'Clear filters',
                            onClick: () => {
                              setHopSearch('')
                              setHopSide('All')
                              setHopChain('All')
                            },
                            variant: 'outline',
                          }}
                        />
                      </TableEmptyRow>
                    ) : (
                      filteredHops.map((h, i) => (
                        <Tr key={h.id}>
                          <Td className="font-bold text-muted-foreground tabular-nums">
                            {i + 1}
                          </Td>
                          <Td>
                            <WalletIdentityChip
                              address={h.from}
                              chain={h.chain}
                              showCopy
                              size="sm"
                              className={cn(
                                h.side === 'in' &&
                                  'ring-2 ring-success/30 border-success/50',
                              )}
                            />
                          </Td>
                          <Td>
                            <WalletIdentityChip
                              address={h.to}
                              chain={h.chain}
                              showCopy
                              size="sm"
                              className={cn(
                                h.side === 'out' &&
                                  'ring-2 ring-danger/30 border-danger/50',
                              )}
                            />
                          </Td>
                          <Td>
                            <span className="font-bold text-foreground tabular-nums">
                              {formatCrypto(h.amount, h.chain)}
                            </span>
                          </Td>
                          <Td>
                            <span className="text-muted-foreground tabular-nums text-sm">
                              {formatUsd(h.amountUsd)}
                            </span>
                          </Td>
                          <Td className="tabular-nums font-mono text-sm">
                            {h.block.toLocaleString()}
                          </Td>
                          <Td className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                            {formatDate(h.timestamp)}
                          </Td>
                          <Td>
                            <Badge variant="info">{h.chain}</Badge>
                          </Td>
                          <Td>
                            <div className="flex flex-wrap gap-1">
                              {h.labels.length === 0 ? (
                                <span className="text-xs text-muted-foreground italic">
                                  —
                                </span>
                              ) : (
                                h.labels.map((l) => (
                                  <Badge
                                    key={l}
                                    variant="default"
                                    className="border-dashed text-[10px]"
                                  >
                                    {l}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </Td>
                          <Td>
                            <Badge
                              variant={h.side === 'in' ? 'success' : 'danger'}
                            >
                              {h.side === 'in' ? (
                                <>
                                  <ArrowLeft className="h-3 w-3" />
                                  In
                                </>
                              ) : (
                                <>
                                  <ChevronRight className="h-3 w-3" />
                                  Out
                                </>
                              )}
                            </Badge>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Evidence Gallery · Case Exhibits
                </CardTitle>
                <CardDescription>
                  Screenshots, block confirmations, and SHA-256 manifests for
                  chain-of-custody.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 self-start sm:self-end">
                <Button size="sm" variant="outline">
                  <Download className="h-3.5 w-3.5" />
                  Download All
                </Button>
                <Button size="sm" variant="ghost">
                  <Printer className="h-3.5 w-3.5" />
                  Print Packet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => {
                  const block = 19820000 + i * 47 + Math.floor(Math.random() * 30)
                  const ts = new Date(
                    new Date(inv.createdAt).getTime() +
                      i * 12 * 60000 -
                      Math.floor(Math.random() * 5) * 60000,
                  ).toISOString()
                  const sha =
                    '0x' +
                    (i * 7919 + 123456789).toString(16) +
                    'aBcDeF1234567890abcdef'.slice(0, 20) +
                    (i * 131).toString(16).toUpperCase()
                  const exhibitId = `EXHIBIT-${inv.id
                    .split('-')
                    .slice(-2)
                    .join('')
                    .toUpperCase()}-${String(i + 1).padStart(4, '0')}`
                  return (
                    <div
                      key={`exh-${i}`}
                      className="rounded-3xl border border-border/70 bg-card/80 backdrop-blur shadow-glow overflow-hidden"
                    >
                      <div className="relative">
                        <div className="h-48 rounded-t-3xl border-b border-border/60 bg-muted grid place-items-center text-muted-foreground text-sm font-semibold bg-gradient-to-br from-muted via-muted/70 to-background">
                          Exhibit {i + 1} · Block Screenshot
                        </div>
                        <Badge
                          variant="glow"
                          className="absolute top-3 right-3 shadow-glow-primary"
                        >
                          {exhibitId}
                        </Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-bold text-foreground">
                            Block #{block.toLocaleString()} Tx Confirmation
                          </div>
                          <Badge variant="info" className="shrink-0">
                            Transaction Record
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(ts)}
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
                          <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                            SHA-256: {shortAddress(sha, 8, 6)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Copy SHA"
                            onClick={() => handleCopySha(sha)}
                            className="h-7 w-7 shrink-0"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <Badge variant="default" className="border-dashed">
                            {inv.chain}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Investigation Report
                    </CardTitle>
                    <CardDescription>
                      SAHYOG-ready PDF preview with 65B certificate and SHA
                      manifest.
                    </CardDescription>
                  </div>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2.5">
                  <ReportRow label="Case ID" value={<span className="font-bold">{inv.caseId}</span>} />
                  <ReportRow label="Target Wallet" value={
                    <WalletIdentityChip
                      address={inv.wallet}
                      chain={inv.chain}
                      showCopy
                      size="sm"
                    />
                  } />
                  <ReportRow label="Chain" value={<Badge variant="info">{inv.chain}</Badge>} />
                  <ReportRow label="Status" value={
                    <Badge variant={statusBadgeVariant(inv.status)}>
                      {inv.status}
                    </Badge>
                  } />
                  <ReportRow label="Confidence" value={
                    <span className={cn('font-bold tabular-nums', confidenceColor(inv.confidence))}>
                      {inv.confidence}%
                    </span>
                  } />
                  <ReportRow label="VASP Match" value={
                    <span className="font-semibold flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary" />
                      {vasp?.name || 'Unattributed'}
                    </span>
                  } />
                  <ReportRow label="Risk Flags" value={
                    <div className="flex flex-wrap gap-1">
                      {riskIndicators.slice(0, 4).map((ri) => (
                        <Badge key={ri.id} variant={riskBadgeVariant(ri.severity)}>
                          {ri.label.split(' ')[0]}
                        </Badge>
                      ))}
                      {riskIndicators.length > 4 && (
                        <Badge variant="default">+{riskIndicators.length - 4} more</Badge>
                      )}
                    </div>
                  } />
                  <ReportRow label="Hops Traced" value={
                    <span className="font-semibold tabular-nums">
                      {inv.hops.length} hops
                    </span>
                  } />
                  <ReportRow label="Created" value={
                    <span className="text-sm tabular-nums">
                      {formatDate(inv.createdAt)}
                    </span>
                  } />
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1.5">
                    <User className="h-3.5 w-3.5" />
                    Officer
                  </div>
                  <div className="font-semibold text-foreground">
                    IO: Sharma · Badge: DL-4812
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Cyber Cell, North District · Sign-off pending
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleGenerateReport}
                >
                  <FileText className="h-4 w-4" />
                  Open Full Report Preview
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-success" />
                      SAHYOG Portal · Route Case
                    </CardTitle>
                    <CardDescription>
                      Submit disclosure/freezing request to nodal FIU-IND
                      officer.
                    </CardDescription>
                  </div>
                  <Badge variant="warning">
                    <Clock className="h-3.5 w-3.5" />
                    Not Submitted
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 font-mono text-xs text-muted-foreground break-all">
                  Endpoint: https://sahyog.gov.in/api/v1/cases/submit
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Case Reference</span>
                    <span className="font-bold tabular-nums">{inv.caseId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Payload Size</span>
                    <span className="font-semibold tabular-nums">
                      2.4 MB · 12 attachments
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">VASP Jurisdiction</span>
                    <span className="font-semibold">
                      {vasp?.jurisdiction || 'Unattributed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Officer DSC</span>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Submission Checklist
                  </div>
                  <ul className="space-y-2">
                    <CheckItem ok label="Report PDF generated" />
                    <CheckItem ok label="65B Certificate attached" />
                    <CheckItem ok label="SHA manifest signed" />
                    <CheckItem ok={false} label="Officer DSC signature" />
                    <CheckItem ok={false} label="SAHYOG ACK receipt" />
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full !bg-success/90 !text-success-foreground hover:!bg-success shadow-glow-success"
                  onClick={handleRouteToSahyog}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Route to SAHYOG
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LegendItemDot({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />
      <span>{label}</span>
    </div>
  )
}

function ReportRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
        {label}
      </span>
      <div className="flex items-center justify-end">{value}</div>
    </div>
  )
}

function CheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-full border',
          ok
            ? 'border-success/50 bg-success/15 text-success'
            : 'border-border bg-muted/50 text-muted-foreground',
        )}
      >
        {ok ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
      </span>
      <span className={cn(ok ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
    </li>
  )
}


