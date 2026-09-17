import { useState, useEffect, useMemo, useRef } from 'react'
import '@xyflow/react/dist/style.css'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
  Position,
  Handle,
} from '@xyflow/react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from 'framer-motion'
import {
  Search,
  ShieldCheck,
  Building2,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  Network,
  FileText,
  Send,
  ChevronRight,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Printer,
  Download,
  ExternalLink,
  Brain,
  Sparkles,
  Activity,
  Target,
  AlertOctagon,
  Filter,
  BarChart3,
  LineChart,
  FileCog,
  Cpu,
  Database,
  KeyRound,
  List,
  FolderKanban,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useToast } from '../hooks/useToast'
import { useCurrentUser } from '../hooks/useCurrentUser'
import {
  metrics,
  trendPoints,
  vasps,
  riskIndicators,
  defaultTraceStages,
} from '../services/mockData'
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/common/Select'
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
import { ProgressCircle } from '../components/common/ProgressCircle'
import { StatusStepper } from '../components/common/StatusStepper'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '../components/common/Tabs'
import { WalletIdentityChip } from '../components/wallet/WalletIdentityChip'
import {
  cn,
  shortAddress,
  formatDate,
  riskColor,
} from '../utils/cn'
import type {
  Chain,
  InvestigationStatus,
  Investigation,
  TraceStage,
} from '../services/types'

const iconMap: Record<string, typeof Search> = {
  Search,
  ShieldCheck,
  Building2,
  FileCheck,
}

type FlowNodeData = {
  label: string
  sub: string
  kind: 'source' | 'hop' | 'deposit' | 'exchange'
}

function CustomNode(props: NodeProps) {
  const data = props.data as FlowNodeData
  const kindClass =
    data.kind === 'source'
      ? 'border-graph-source shadow-glow-primary'
      : data.kind === 'hop'
        ? 'border-accent/60 shadow-glow'
        : data.kind === 'deposit'
          ? 'border-warning/60 shadow-glow'
          : 'border-graph-exchange/60 shadow-glow-primary'

  const labelClass =
    data.kind === 'source'
      ? 'text-graph-source'
      : data.kind === 'hop'
        ? 'text-accent'
        : data.kind === 'deposit'
          ? 'text-warning'
          : 'text-graph-exchange'

  return (
    <div className="relative">
      {data.kind !== 'source' && (
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
          {data.label}
        </div>
        <div className="mt-0.5 text-xs font-mono text-muted-foreground">
          {data.sub}
        </div>
      </div>
      {data.kind !== 'exchange' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-muted !border-2 !border-border"
        />
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: any = { custom: CustomNode }

function MetricCard({
  metric,
}: {
  metric: (typeof metrics)[number]
}) {
  const IconCmp = iconMap[metric.icon] || Search
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    rounded.on('change', (v) => setDisplay(String(v)))
  }, [rounded])

  useEffect(() => {
    if (!isInView) return
    const target = parseInt(metric.value.replace(/[^0-9]/g, ''), 10) || 0
    const controls = animate(count, target, {
      duration: 1.2,
      ease: 'easeOut',
    })
    return controls.stop
  }, [isInView, count, metric.value])

  const TrendIcon =
    metric.trend === 'up'
      ? TrendingUp
      : metric.trend === 'down'
        ? TrendingDown
        : Minus
  const trendClass =
    metric.trend === 'up'
      ? 'text-success'
      : metric.trend === 'down'
        ? 'text-danger'
        : 'text-muted-foreground'

  return (
    <Card className="shadow-glow hover:shadow-glow-primary/50 transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <IconCmp className="h-5 w-5" />
          </div>
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              trendClass,
              metric.trend === 'up' &&
                'border-success/30 bg-success/10',
              metric.trend === 'down' &&
                'border-danger/30 bg-danger/10',
              metric.trend === 'flat' &&
                'border-border bg-muted',
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {metric.trend === 'up'
              ? 'Up'
              : metric.trend === 'down'
                ? 'Down'
                : 'Flat'}
          </div>
        </div>
        <div ref={ref} className="mt-4">
          <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {display}
          </div>
          <div className="mt-1 text-sm font-medium text-muted-foreground">
            {metric.label}
          </div>
          <div className="mt-2 text-xs text-muted-foreground/80">
            {metric.delta}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CHAIN_OPTIONS: Chain[] = [
  'BTC',
  'ETH',
  'TRX',
  'BNB',
  'SOL',
  'MATIC',
  'USDT-ERC20',
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

function confidenceColor(c: number):
  | 'text-success'
  | 'text-primary'
  | 'text-warning'
  | 'text-danger' {
  if (c > 80) return 'text-success'
  if (c > 60) return 'text-primary'
  if (c > 40) return 'text-warning'
  return 'text-danger'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { success, info, pushToast } = useToast()
  const { user } = useCurrentUser()

  const investigations = useAppStore((s) => s.investigations.list)
  const currentTraceStage = useAppStore(
    (s) => s.investigations.currentTraceStage,
  )
  const setCurrentTraceStage = useAppStore(
    (s) => s.investigations.setCurrentTraceStage,
  )
  const addInvestigation = useAppStore(
    (s) => s.investigations.addInvestigation,
  )
  const updateInvestigation = useAppStore(
    (s) => s.investigations.updateInvestigation,
  )

  const investigationsArr = useMemo(
    () =>
      Object.values(investigations).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [investigations],
  )

  const caseWallet = useMemo(() => {
    const first = investigationsArr[0]
    return first?.wallet || '0x8f2b…7f8a'
  }, [investigationsArr])

  const firstInv = investigationsArr[0]
  const firstInvId = firstInv?.id ?? null
  const firstInvCaseId = firstInv?.caseId ?? '—'

  const nearestVasp = useMemo(() => {
    const invWithVasp = investigationsArr.find((i) => i.vaspId)
    if (invWithVasp?.vaspId) {
      const match = vasps.find((v) => v.id === invWithVasp.vaspId)
      if (match) return match
    }
    return vasps[0] ?? null
  }, [investigationsArr])

  const [formWallet, setFormWallet] = useState('')
  const [formChain, setFormChain] = useState<Chain>('ETH')
  const [formCaseId, setFormCaseId] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [animatedConfidence, setAnimatedConfidence] = useState(87)

  const [trendLoading, setTrendLoading] = useState(true)
  const [graphLoading, setGraphLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setTrendLoading(false), 1200)
    const t2 = setTimeout(() => setGraphLoading(false), 1200)
    const t3 = setTimeout(() => setTableLoading(false), 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  const stagesFromStore: TraceStage[] = useMemo(() => {
    const base =
      (firstInv?.traceStages?.length ? firstInv.traceStages : defaultTraceStages).map(
        (s, idx) => {
          let status: 'pending' | 'active' | 'done' = s.status
          if (idx < currentTraceStage) status = 'done'
          else if (idx === currentTraceStage) status = 'active'
          else status = 'pending'
          return { ...s, status }
        },
      )
    return base
  }, [firstInv, currentTraceStage])

  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'source',
        type: 'custom',
        position: { x: 0, y: 200 },
        data: {
          label: 'Source Wallet',
          sub: shortAddress(caseWallet),
          kind: 'source',
        },
      },
      {
        id: 'hop1',
        type: 'custom',
        position: { x: 250, y: 100 },
        data: {
          label: 'Hop 1 · Peel',
          sub: '0x1234…ABCD',
          kind: 'hop',
        },
      },
      {
        id: 'hop2',
        type: 'custom',
        position: { x: 250, y: 300 },
        data: {
          label: 'Hop 2 · Mixer',
          sub: '0xabcd…1234',
          kind: 'hop',
        },
      },
      {
        id: 'deposit',
        type: 'custom',
        position: { x: 500, y: 200 },
        data: {
          label: 'Deposit Address',
          sub: 'Tagged collector',
          kind: 'deposit',
        },
      },
      {
        id: 'exchange',
        type: 'custom',
        position: { x: 750, y: 200 },
        data: {
          label: nearestVasp ? `${nearestVasp.name} Hot Wallet` : 'Binance Hot Wallet',
          sub: nearestVasp
            ? `${nearestVasp.type} · ${nearestVasp.jurisdiction}`
            : 'CEX · Cayman Islands',
          kind: 'exchange',
        },
      },
    ],
    [caseWallet, nearestVasp],
  )

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-s-h1',
        source: 'source',
        target: 'hop1',
        label: '$182,400',
        animated: true,
        style: {
          strokeWidth: 2,
          strokeDasharray: '5 5',
        },
        labelStyle: { fill: 'rgb(var(--muted-foreground))', fontSize: 11, fontWeight: 600 },
        labelBgStyle: {
          fill: 'rgb(var(--card))',
          fillOpacity: 0.9,
          stroke: 'rgb(var(--border))',
          strokeOpacity: 0.6,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--primary))' },
      },
      {
        id: 'e-s-h2',
        source: 'source',
        target: 'hop2',
        label: '$47,200',
        animated: true,
        style: { strokeWidth: 2, strokeDasharray: '5 5' },
        labelStyle: { fill: 'rgb(var(--muted-foreground))', fontSize: 11, fontWeight: 600 },
        labelBgStyle: {
          fill: 'rgb(var(--card))',
          fillOpacity: 0.9,
          stroke: 'rgb(var(--border))',
          strokeOpacity: 0.6,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--accent))' },
      },
      {
        id: 'e-h1-d',
        source: 'hop1',
        target: 'deposit',
        label: '$165,000',
        animated: true,
        style: { strokeWidth: 2, strokeDasharray: '5 5' },
        labelStyle: { fill: 'rgb(var(--muted-foreground))', fontSize: 11, fontWeight: 600 },
        labelBgStyle: {
          fill: 'rgb(var(--card))',
          fillOpacity: 0.9,
          stroke: 'rgb(var(--border))',
          strokeOpacity: 0.6,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--accent))' },
      },
      {
        id: 'e-h2-d',
        source: 'hop2',
        target: 'deposit',
        label: '$41,800',
        animated: true,
        style: { strokeWidth: 2, strokeDasharray: '5 5' },
        labelStyle: { fill: 'rgb(var(--muted-foreground))', fontSize: 11, fontWeight: 600 },
        labelBgStyle: {
          fill: 'rgb(var(--card))',
          fillOpacity: 0.9,
          stroke: 'rgb(var(--border))',
          strokeOpacity: 0.6,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--warning))' },
      },
      {
        id: 'e-d-ex',
        source: 'deposit',
        target: 'exchange',
        label: '$146,100',
        animated: true,
        style: { strokeWidth: 2, strokeDasharray: '5 5' },
        labelStyle: { fill: 'rgb(var(--muted-foreground))', fontSize: 11, fontWeight: 600 },
        labelBgStyle: {
          fill: 'rgb(var(--card))',
          fillOpacity: 0.9,
          stroke: 'rgb(var(--border))',
          strokeOpacity: 0.6,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--success))' },
      },
    ],
    [],
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = (params: Record<string, unknown>) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          animated: true,
          style: { strokeWidth: 2, strokeDasharray: '5 5' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'rgb(var(--primary))',
          },
        } as Edge,
        eds,
      ),
    )

  const handleStartTrace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formWallet.trim()) {
      pushToast({
        title: 'Wallet address required',
        description: 'Please enter a valid wallet address to begin tracing.',
        variant: 'warning',
      })
      return
    }
    setSubmitLoading(true)
    const newId = `inv-new-${Date.now()}`
    const newTraceStages: TraceStage[] = defaultTraceStages.map((s) => ({
      ...s,
      status: 'pending',
    }))
    const newInv: Investigation = {
      id: newId,
      wallet: formWallet.trim(),
      chain: formChain,
      caseId: formCaseId.trim() || `CASE-${Date.now().toString().slice(-6)}`,
      status: 'Tracing',
      createdAt: new Date().toISOString(),
      confidence: 0,
      vaspId: null,
      riskLevel: 'medium',
      hops: [],
      traceStages: newTraceStages,
      notes: formNotes,
    }
    addInvestigation(newInv)

    setAnimatedConfidence(0)
    let stageIdx = 0
    setCurrentTraceStage(stageIdx)
    const interval = setInterval(() => {
      stageIdx += 1
      if (stageIdx < defaultTraceStages.length) {
        setCurrentTraceStage(stageIdx)
        const progressFrac =
          (stageIdx + 1) / defaultTraceStages.length
        setAnimatedConfidence(Math.round(progressFrac * 92))
      } else {
        setCurrentTraceStage(defaultTraceStages.length - 1)
        setAnimatedConfidence(92)
        clearInterval(interval)
      }
    }, 1000)

    setTimeout(() => {
      setSubmitLoading(false)
      success(
        `Trace initiated · Case ${newInv.caseId}`,
        '6-stage pipeline started. Expect results in ~90 seconds.',
      )
      setFormWallet('')
      setFormCaseId('')
      setFormNotes('')
      setFormChain('ETH')
    }, 6200)
  }

  const handleRouteToSahyog = () => {
    if (!firstInvId) {
      pushToast({
        title: 'No case available',
        description: 'Create or select a case before routing to SAHYOG.',
        variant: 'warning',
      })
      return
    }
    const ok = window.confirm(
      `Submit case ${firstInvCaseId} to SAHYOG Portal for disclosure/freezing request?`,
    )
    if (ok) {
      updateInvestigation(firstInvId, { status: 'Escalated' })
      success(
        'Submitted to SAHYOG Portal',
        'Acknowledgement receipt pending from portal.',
      )
      pushToast({
        title: 'Submitted to SAHYOG Portal',
        description: 'Acknowledgement receipt pending from portal.',
        variant: 'success',
      })
    }
  }

  const handleOpenReport = () => {
    if (!firstInvId) {
      pushToast({
        title: 'No case available',
        description: 'Create or select a case before generating a report.',
        variant: 'warning',
      })
      return
    }
    info('Opening report preview…')
    navigate(`/reports/${firstInvId}`)
  }

  const vaspScoreColor =
    (nearestVasp?.riskScore ?? 50) < 20
      ? 'text-success border-success/40 bg-success/10'
      : (nearestVasp?.riskScore ?? 50) < 40
        ? 'text-primary border-primary/40 bg-primary/10'
        : (nearestVasp?.riskScore ?? 50) < 60
          ? 'text-warning border-warning/40 bg-warning/10'
          : 'text-danger border-danger/40 bg-danger/10'

  const breakdowns = [
    { label: 'Tx Volume', value: 92 },
    { label: 'Hop Depth', value: 78 },
    { label: 'Label Match', value: 91 },
    { label: 'Deposit Signature', value: 89 },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-xl shadow-glow"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-bg-glow opacity-100"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="glow">
              <Sparkles className="h-3.5 w-3.5" />
              Good morning, 3 cases need your attention
            </Badge>
            <Badge variant="success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All services online
            </Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-medium text-muted-foreground">
              Welcome back,{' '}
              <span className="text-foreground font-semibold">
                {user?.name || 'Investigator'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Case Overview Dashboard
            </h1>
            <p className="text-base text-muted-foreground">
              148 open cases · 9 escalated today · SAHYOG backlog 7
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/investigations')}
            >
              <List className="h-4 w-4" />
              Open Case Load
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/reports')}
            >
              <FileText className="h-4 w-4" />
              Reports Queue
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/wallets')}
            >
              <Wallet className="h-4 w-4" />
              Wallet Library
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: 'easeOut' }}
          >
            <MetricCard metric={m} />
          </motion.div>
        ))}
      </div>

      {/* 3. NEW INVESTIGATION FORM */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Start New Trace
            </CardTitle>
            <CardDescription>
              Submit wallet for automated 6-stage VASP attribution pipeline.
            </CardDescription>
          </div>
          <Badge variant="info" className="self-start sm:self-end">
            <Cpu className="h-3.5 w-3.5" />
            6-stage · 90s ETA
          </Badge>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleStartTrace}
            className="grid grid-cols-1 md:grid-cols-12 gap-4"
          >
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x… / bc1… / T…"
                value={formWallet}
                onChange={(e) => setFormWallet(e.target.value)}
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="chain">Chain</Label>
              <Select
                value={formChain}
                onValueChange={(v) => setFormChain(v as Chain)}
              >
                <SelectTrigger id="chain">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {CHAIN_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      <span className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                          {c.charAt(0)}
                        </span>
                        {c}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-4 space-y-2">
              <Label htmlFor="caseId">Case ID</Label>
              <Input
                id="caseId"
                placeholder="FIR-YYYY-ST-XXXX"
                value={formCaseId}
                onChange={(e) => setFormCaseId(e.target.value)}
              />
            </div>
            <div className="md:col-span-12 space-y-2">
              <Label htmlFor="notes">Case Notes</Label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Victim context, complaint reference, officer remarks…"
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
              />
            </div>
            <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                Submissions are logged immutably with officer attribution.
              </div>
              <Button type="submit" loading={submitLoading} size="md">
                {submitLoading ? null : <Send className="h-4 w-4" />}
                Start Trace
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Row: Tracing Status + Confidence */}
      <div className="lg:grid lg:grid-cols-12 gap-4 space-y-4 lg:space-y-0">
        {/* 4. TRACING STATUS CARD */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Trace Pipeline Status
            </CardTitle>
            <CardDescription>
              Queued → Parsing → Chain Lookup → Hop Analysis → VASP Match →
              Complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusStepper
              stages={stagesFromStore}
              currentIndex={Math.max(
                0,
                Math.min(currentTraceStage, stagesFromStore.length - 1),
              )}
              className="pt-2"
            />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Current Stage
                </div>
                <div className="mt-1 font-semibold text-foreground">
                  {stagesFromStore[currentTraceStage]?.label ??
                    stagesFromStore[0]?.label}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Progress
                </div>
                <div className="mt-1 font-semibold text-foreground tabular-nums">
                  {currentTraceStage + 1} / {stagesFromStore.length}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 col-span-2 sm:col-span-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  ETA Remaining
                </div>
                <div className="mt-1 font-semibold text-foreground tabular-nums">
                  {currentTraceStage >= stagesFromStore.length - 1
                    ? 'Complete'
                    : `${(stagesFromStore.length - 1 - currentTraceStage) * 15}s`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. CONFIDENCE SCORE CARD */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Attribution Confidence
            </CardTitle>
            <CardDescription>Weighted 6-factor methodology.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProgressCircle
                size={140}
                progress={animatedConfidence}
                label="VASP Match"
                color={
                  animatedConfidence > 80
                    ? 'success'
                    : animatedConfidence > 60
                      ? 'primary'
                      : animatedConfidence > 40
                        ? 'warning'
                        : 'danger'
                }
              />
              <div className="flex-1 w-full space-y-3">
                {breakdowns.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {b.label}
                      </span>
                      <span className="font-semibold text-muted-foreground tabular-nums">
                        {b.value}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${b.value}%` }}
                        transition={{
                          duration: 1,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row: Nearest VASP + Risk Indicators */}
      <div className="lg:grid lg:grid-cols-12 gap-4 space-y-4 lg:space-y-0">
        {/* 6. NEAREST VASP CARD */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Nearest VASP Identified
            </CardTitle>
            <CardDescription>Closest exchange deposit cluster.</CardDescription>
          </CardHeader>
          <CardContent>
            {nearestVasp ? (
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl border border-primary/30 bg-primary/10 text-3xl font-black text-primary shadow-glow-primary">
                    {nearestVasp.logoLetter}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <Badge variant="info">{nearestVasp.jurisdiction}</Badge>
                    <Badge variant="glow">{nearestVasp.type}</Badge>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold tracking-tight text-foreground">
                        {nearestVasp.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {nearestVasp.type} · Hot wallet corpus of{' '}
                        {nearestVasp.hotWallets.length}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold tabular-nums',
                        vaspScoreColor,
                      )}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Risk {nearestVasp.riskScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                      <div className="text-lg font-bold text-foreground tabular-nums">
                        47
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Deposit Sig Matches
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                      <div className="text-lg font-bold text-foreground tabular-nums">
                        {nearestVasp.hotWallets.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Hot Wallets
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-center">
                      <div className="text-lg font-bold text-foreground truncate">
                        {nearestVasp.jurisdiction.split(' ')[0]}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Jurisdiction
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button size="sm" variant="outline">
                      <Database className="h-3.5 w-3.5" />
                      View {nearestVasp.name} Clusters
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-3.5 w-3.5" />
                      VASP Register
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No VASP matched yet"
                description="Start a trace or wait for the pipeline to complete attribution."
              />
            )}
          </CardContent>
        </Card>

        {/* 7. RISK INDICATORS PANEL */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-danger" />
              Risk Indicators
            </CardTitle>
            <CardDescription>
              Flags from forensic heuristics engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {riskIndicators.map((ri) => (
                <Badge
                  key={ri.id}
                  variant={riskBadgeVariant(ri.severity)}
                  title={ri.evidence}
                  className="cursor-help px-3 py-1 text-xs"
                >
                  {ri.severity === 'critical' ? (
                    <AlertOctagon className="h-3 w-3" />
                  ) : ri.severity === 'high' ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : ri.severity === 'medium' ? (
                    <Activity className="h-3 w-3" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {ri.label}
                </Badge>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Critical', n: 2, cls: 'bg-danger/15 text-danger border-danger/30' },
                { label: 'High', n: 2, cls: 'bg-warning/15 text-warning border-warning/30' },
                { label: 'Medium', n: 1, cls: 'bg-primary/15 text-primary border-primary/30' },
                { label: 'Low', n: 1, cls: 'bg-success/15 text-success border-success/30' },
              ].map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    'rounded-2xl border p-3 text-center',
                    c.cls,
                  )}
                >
                  <div className="text-xl font-bold tabular-nums">{c.n}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 8. FUND FLOW GRAPH */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Fund-Flow Topology
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
            style={{ height: 420 }}
          >
            {graphLoading ? (
              <div className="h-full w-full p-4">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} />
                <Controls
                  className="!rounded-2xl !border !border-border/70 !bg-card/90 !backdrop-blur !shadow-glow [&>button]:!text-foreground [&>button]:!bg-transparent hover:[&>button]:!bg-muted"
                />
                <MiniMap
                  pannable
                  zoomable
                  className="!rounded-2xl !border !border-border/70 !bg-card/90 !backdrop-blur !shadow-glow"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  nodeColor={(n: any) => {
                    const d = n?.data as FlowNodeData | undefined
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
            <LegendItem dot="bg-graph-source" label="Source Wallet" />
            <LegendItem dot="bg-accent" label="Intermediary Hop" />
            <LegendItem dot="bg-warning" label="Deposit Collector" />
            <LegendItem dot="bg-graph-exchange" label="VASP / Exchange" />
          </div>
        </CardContent>
      </Card>

      {/* 9. INVESTIGATIONS TABLE */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Case Load · Open Investigations
            </CardTitle>
            <CardDescription>
              {investigationsArr.length} active cases · filter by status or
              chain.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-end">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search case or wallet…"
                className="pl-9 w-52"
              />
            </div>
            <Button size="md" variant="outline">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => navigate('/investigations/new')}
            >
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tableLoading ? (
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
                  <Th>Case ID</Th>
                  <Th>Wallet</Th>
                  <Th>Chain</Th>
                  <Th>Status</Th>
                  <Th>VASP</Th>
                  <Th>Confidence</Th>
                  <Th>Risk</Th>
                  <Th>Created</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {investigationsArr.length === 0 ? (
                  <TableEmptyRow colSpan={9}>
                    <EmptyState
                      icon={FolderKanban}
                      title="No investigations yet"
                      description="Use the Start New Trace form above to create your first case."
                    />
                  </TableEmptyRow>
                ) : (
                  investigationsArr.map((inv) => {
                    const vaspName =
                      vasps.find((v) => v.id === inv.vaspId)?.name ||
                      'Unattributed'
                    return (
                      <Tr key={inv.id}>
                        <Td>
                          <button
                            onClick={() =>
                              navigate(`/investigations/${inv.id}`)
                            }
                            className="text-left font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {inv.caseId}
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
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
                            {inv.status}
                          </Badge>
                        </Td>
                        <Td>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              inv.vaspId
                                ? 'text-foreground'
                                : 'text-muted-foreground italic',
                            )}
                          >
                            {vaspName}
                          </span>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <ProgressCircle
                              size={36}
                              progress={inv.confidence}
                              strokeWidth={4}
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
                            <span
                              className={cn(
                                'font-semibold tabular-nums',
                                confidenceColor(inv.confidence),
                              )}
                            >
                              {inv.confidence}%
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
                              riskColor(inv.riskLevel),
                            )}
                          >
                            {inv.riskLevel}
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
                              onClick={() => navigate(`/reports/${inv.id}`)}
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

      {/* 10. TREND CHART */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Weekly Case Volume Trend
            </CardTitle>
            <CardDescription>
              Investigations opened + wallet traces executed · Last 8 weeks
            </CardDescription>
          </div>
          <Tabs defaultValue="area" className="self-start sm:self-end">
            <TabsList>
              <TabsTrigger value="area">
                <AreaChartIcon />
                Area
              </TabsTrigger>
              <TabsTrigger value="bars">
                <BarChart3 className="h-4 w-4" />
                Bars
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div style={{ height: 320 }} className="w-full">
            {trendLoading ? (
              <div className="h-full w-full space-y-4 p-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-[calc(100%-3.5rem)] w-full rounded-2xl" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendPoints}
                  margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorInvestigations"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorTraces"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgb(var(--accent))"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgb(var(--accent))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgb(var(--border) / 0.6)"
                  />
                  <XAxis
                    dataKey="week"
                    stroke="rgb(var(--muted-foreground) / 0.8)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgb(var(--muted-foreground) / 0.8)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '1rem',
                      boxShadow: 'var(--tw-shadow, 0 0 #0000)',
                      color: 'rgb(var(--foreground))',
                      fontSize: 12,
                    }}
                    cursor={{
                      stroke: 'rgb(var(--primary) / 0.4)',
                      strokeWidth: 1,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="investigations"
                    stroke="rgb(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInvestigations)"
                    name="Investigations"
                  />
                  <Area
                    type="monotone"
                    dataKey="traces"
                    stroke="rgb(var(--accent))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTraces)"
                    name="Traces"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 12. ACTION RAIL */}
      <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-3 bg-card/80 backdrop-blur-xl rounded-2xl border border-border shadow-glow">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info" className="text-xs">
            <FileCog className="h-3.5 w-3.5" />
            Current case: {firstInvCaseId}
          </Badge>
          {firstInv ? (
            <Badge variant={statusBadgeVariant(firstInv.status)}>
              {firstInv.status}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="primary" onClick={handleOpenReport}>
            <FileText className="h-4 w-4" />
            Generate Investigation Report
          </Button>
          <Button
            variant="outline"
            onClick={handleRouteToSahyog}
            className="!border-success/50 !text-success hover:!bg-success/10"
          >
            <KeyRound className="h-4 w-4" />
            Route to SAHYOG
          </Button>
        </div>
      </div>
    </div>
  )
}

function LegendItem({
  dot,
  label,
}: {
  dot: string
  label: string
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          'inline-block h-2.5 w-2.5 rounded-full',
          dot,
        )}
      />
      <span>{label}</span>
    </div>
  )
}

function AreaChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M3 20h18" />
      <path d="M7 14l4-4 3 3 4-6" />
      <path d="M7 14l4-4 3 3 4-6V4H7z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}
