export type Chain =
  | 'BTC'
  | 'ETH'
  | 'TRX'
  | 'BNB'
  | 'SOL'
  | 'MATIC'
  | 'USDT-ERC20'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type InvestigationStatus =
  | 'Tracing'
  | 'Escalated'
  | 'Review'
  | 'Closed'
  | 'Pending'

export type RiskIndicatorType =
  | 'ransomware'
  | 'darknet'
  | 'mixer'
  | 'bridge'
  | 'defi'
  | 'sanctioned'

export type VASPType = 'CEX' | 'Custodian' | 'Exchange'

export type TraceStageStatus = 'pending' | 'active' | 'done'

export type TimelineIconType =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'wallet'
  | 'transaction'

export type ToastVariant = 'default' | 'success' | 'danger' | 'warning' | 'info'

export type Toast = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

export type Metric = {
  id: string
  label: string
  value: string
  delta: string
  icon: string
  trend: 'up' | 'down' | 'flat'
}

export type TrendPoint = {
  week: string
  investigations: number
  traces: number
}

export type TraceStage = {
  id: string
  label: string
  status: TraceStageStatus
}

export type VASP = {
  id: string
  name: string
  logoLetter: string
  jurisdiction: string
  riskScore: number
  hotWallets: string[]
  type: VASPType
}

export type RiskIndicator = {
  id: string
  type: RiskIndicatorType
  label: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  evidence: string
}

export type WalletHop = {
  id: string
  txHash: string
  from: string
  to: string
  amount: number
  amountUsd: number
  block: number
  timestamp: string
  chain: Chain
  labels: string[]
  side: 'in' | 'out'
}

export type Investigation = {
  id: string
  caseId: string
  wallet: string
  chain: Chain
  status: InvestigationStatus
  createdAt: string
  confidence: number
  vaspId: string | null
  riskLevel: RiskLevel
  hops: WalletHop[]
  traceStages: TraceStage[]
  notes: string
}

export type ApiService = {
  id: string
  name: string
  enabled: boolean
  quotaUsed: number
  quotaTotal: number
  lastSynced: string
  description: string
  homepage: string
}

export type TimelineEvent = {
  id: string
  title: string
  description: string
  timestamp: string
  iconType: TimelineIconType
}

export type ThemeMode = 'dark' | 'light'

export type UserRole = 'investigator' | 'admin' | null

export type User = {
  name: string
  email: string
  role: UserRole
}
