import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { vasps, riskIndicators } from '../services/mockData'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Label } from '../components/common/Input'
import { ProgressCircle } from '../components/common/ProgressCircle'
import { EmptyState } from '../components/common/EmptyState'
import { WalletIdentityChip } from '../components/wallet/WalletIdentityChip'
import { cn, formatDate, shortAddress } from '../utils/cn'
import { useToast } from '../hooks/useToast'
import type { Investigation, VASP } from '../services/types'
import {
  ArrowLeft,
  Printer,
  Download,
  FileText,
  FolderKanban,
  Layers,
} from 'lucide-react'

const formatUsd = (n: number) =>
  '$' + (n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })

export default function ReportPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { info, success } = useToast()
  const investigationsMap = useAppStore((s) => s.investigations.list)

  const inv: Investigation | undefined = id ? investigationsMap[id] : undefined
  const matchedVasp: VASP | undefined = inv?.vaspId
    ? vasps.find((v) => v.id === inv.vaspId)
    : undefined

  const today = new Date()
  const reportNumber = `REP-2024-${Math.floor(10000 + Math.random() * 90000)}`

  if (!inv) {
    return (
      <div className="p-8">
        <EmptyState
          icon={FileText}
          title="Report not found"
          description="The report you are looking for does not exist or has been removed."
          action={{
            label: 'Back to Cases',
            onClick: () => navigate('/investigations'),
            variant: 'primary',
          }}
        />
      </div>
    )
  }

  const totalReceived = inv.hops
    .filter((h) => h.to === inv.wallet)
    .reduce((sum, h) => sum + h.amountUsd, 0) || inv.hops[0]?.amountUsd || 0
  const totalSent = inv.hops
    .filter((h) => h.from === inv.wallet)
    .reduce((sum, h) => sum + h.amountUsd, 0) || 0
  const uniqueCounterparties = new Set(
    inv.hops.flatMap((h) => [h.from, h.to]).filter((a) => a !== inv.wallet),
  ).size
  const firstSeen = inv.hops.length > 0 ? inv.hops[inv.hops.length - 1].timestamp : inv.createdAt
  const lastSeen = inv.hops.length > 0 ? inv.hops[0].timestamp : inv.createdAt
  const activityDays = Math.max(
    1,
    Math.ceil(
      (new Date(lastSeen).getTime() - new Date(firstSeen).getTime()) / (1000 * 60 * 60 * 24),
    ),
  )

  const riskFlagsCount = riskIndicators.filter(
    (r) => r.severity === 'high' || r.severity === 'critical',
  ).length

  const evidenceLog = [
    {
      idx: 1,
      timestamp: inv.createdAt,
      event: 'Complaint-linked wallet ingested',
      details: `Target wallet ${shortAddress(inv.wallet)} registered from FIR ${inv.caseId} metadata.`,
      ref: 'EXHIBIT-0001',
    },
    {
      idx: 2,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 10 * 60000).toISOString(),
      event: 'Seed transactions normalized',
      details: `Initial ${inv.hops.length > 0 ? inv.hops[0].amount : 0} ${inv.chain} outflow parsed and tagged.`,
      ref: 'EXHIBIT-0002',
    },
    {
      idx: 3,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 35 * 60000).toISOString(),
      event: 'Peel-chain intermediaries identified',
      details: `Multi-hop peel pattern detected across ${inv.hops.length > 4 ? 2 : 1} networks.`,
      ref: 'EXHIBIT-0014',
    },
    {
      idx: 4,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 90 * 60000).toISOString(),
      event: 'Bridge routing confirmed',
      details: 'Cross-chain hop via Wormhole router contract with 0.003 ETH bridge fee.',
      ref: 'EXHIBIT-0027',
    },
    {
      idx: 5,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 120 * 60000).toISOString(),
      event: 'Deposit signature cluster matched',
      details: `47 collector address confirmations against ${matchedVasp?.name ?? 'VASP'} deposit corpus.`,
      ref: 'EXHIBIT-0041',
    },
    {
      idx: 6,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 155 * 60000).toISOString(),
      event: 'Nearest VASP attribution scored',
      details: `Confidence ${inv.confidence}%. Hot wallet overlap: ${matchedVasp ? matchedVasp.hotWallets.length : 0} matches.`,
      ref: 'EXHIBIT-0052',
    },
    {
      idx: 7,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 210 * 60000).toISOString(),
      event: 'Risk indicators correlated',
      details: `${riskFlagsCount} flags above threshold — mixer exposure + sanctioned secondary flow.`,
      ref: 'EXHIBIT-0063',
    },
    {
      idx: 8,
      timestamp: new Date(new Date(inv.createdAt).getTime() + 340 * 60000).toISOString(),
      event: 'SAHYOG freeze packet drafted',
      details: 'PMLA §12A disclosure request and digital signature manifest generated.',
      ref: 'EXHIBIT-0078',
    },
  ]

  return (
    <div className="p-4 sm:p-8">
      <div className="sticky top-4 z-30 mb-6 flex items-center justify-between rounded-2xl border border-border bg-card/90 p-3 shadow-glow backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Case
          </Button>
          <Link to="/investigations">
            <Button variant="ghost" size="icon" aria-label="All cases">
              <FolderKanban className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">Report Preview · Mock</Badge>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {formatDate(today)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              info('Print dialog opened')
              setTimeout(() => window.print(), 100)
            }}
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              success('PDF queued', 'Report compiled. Print dialog opens as preview.')
              setTimeout(() => window.print(), 150)
            }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </div>

      <div
        className="mx-auto w-full max-w-[210mm] rounded-sm border border-gray-200 bg-white p-10 font-sans text-gray-900 shadow-2xl print:border-0 print:shadow-none"
        style={{ colorScheme: 'light' }}
      >
        <div className="mb-8 border-t-4 border-primary" />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              VASP ATTRIBUTION INVESTIGATION REPORT
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              ChainTrace · Blockchain Intelligence Platform
            </p>
          </div>
          <div className="shrink-0 self-start">
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
              CLASSIFIED · FOR AUTHORIZED LEA USE ONLY
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="mb-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Case ID:</span>
            <span className="font-mono font-medium">{inv.caseId}</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Prepared for:</span>
            <span>Investigator Sharma · FIU-IND Cyber Cell</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Date of Report:</span>
            <span>{formatDate(today)}</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Report Number:</span>
            <span className="font-mono">{reportNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Badge ID:</span>
            <span className="font-mono">DL-4812</span>
          </div>
          <div className="flex">
            <span className="w-32 shrink-0 font-semibold text-gray-500">Agency:</span>
            <span>State Cyber Cell</span>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">1. EXECUTIVE SUMMARY</h2>
          <div className="space-y-3 text-sm leading-relaxed text-gray-700">
            <p>
              This report presents the findings of an automated VASP attribution
              investigation conducted on target wallet{' '}
              <span className="font-mono font-medium">{shortAddress(inv.wallet)}</span> on the{' '}
              <span className="font-semibold">{inv.chain}</span> network.
            </p>
            <div className="flex flex-wrap items-center gap-4 py-2">
              <p className="flex-1 min-w-[200px]">
                Attribution confidence scored at{' '}
                <span className="font-bold text-gray-900">{inv.confidence}%</span>, supported by
                deposit-signature heuristics, hot-wallet overlap, and multi-hop cluster
                correlation.
                {matchedVasp ? (
                  <>
                    {' '}Nearest VASP match: <span className="font-semibold">{matchedVasp.name}</span>{' '}
                    ({matchedVasp.type}, {matchedVasp.jurisdiction}).
                  </>
                ) : (
                  ' No definitive VASP match at this time.'
                )}
              </p>
              <ProgressCircle
                progress={inv.confidence}
                size={90}
                strokeWidth={8}
                color={inv.confidence >= 85 ? 'success' : inv.confidence >= 60 ? 'warning' : 'danger'}
              />
            </div>
            <p>
              Overall risk level:{' '}
              <span
                className={cn(
                  'inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase',
                  inv.riskLevel === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : inv.riskLevel === 'high'
                      ? 'bg-amber-100 text-amber-700'
                      : inv.riskLevel === 'medium'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700',
                )}
              >
                {inv.riskLevel}
              </span>
              , with <span className="font-semibold">{riskFlagsCount}</span> elevated risk flags
              triggered across forensic heuristics.
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">Key Findings</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>8 hops traced across 2 networks</li>
                <li>92% deposit-signature match</li>
                <li>47 collector address confirmations</li>
                <li>Proceeds ultimately swept to VASP hot wallet</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">2. TARGET WALLET SUMMARY</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="font-mono text-base font-semibold">
                <WalletIdentityChip
                  address={inv.wallet}
                  chain={inv.chain}
                  showCopy
                  showExplorer
                  size="lg"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Chain
                </p>
                <p className="mt-1 font-medium">{inv.chain}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  First Seen
                </p>
                <p className="mt-1 font-medium">{formatDate(firstSeen)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Last Active
                </p>
                <p className="mt-1 font-medium">{formatDate(lastSeen)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Activity Window
                </p>
                <p className="mt-1 font-medium">{activityDays} day{activityDays !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total Received
                </p>
                <p className="mt-1 font-medium">{formatUsd(totalReceived)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total Sent
                </p>
                <p className="mt-1 font-medium">{formatUsd(totalSent)}</p>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Unique Counterparties
                </p>
                <p className="mt-1 font-medium">{uniqueCounterparties}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">3. FUND FLOW DIAGRAM</h2>
          <div className="grid h-56 place-items-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500">
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <Layers className="h-10 w-10 text-gray-400" />
              <p className="text-sm font-medium">
                [ Fund Flow Diagram — Full interactive version available in case workspace ]
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs italic text-gray-500">
            Fig 1. 5-node fund-flow topology: Source → Intermediaries → Deposit → VASP Hot Wallet
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">4. NEAREST VASP ATTRIBUTION</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['VASP Name', matchedVasp?.name ?? 'Unattributed'],
                  ['VASP Type', matchedVasp?.type ?? 'N/A'],
                  ['Jurisdiction', matchedVasp?.jurisdiction ?? 'N/A'],
                  ['PMLA Registration Status', matchedVasp?.jurisdiction === 'India' ? 'Registered · PMLA-2002' : 'Foreign Jurisdiction · MLA Channel'],
                  ['Attribution Confidence %', `${inv.confidence}%`],
                  ['Deposit Signature Matches', `${Math.floor(30 + inv.confidence * 0.5)} / 50`],
                  ['Hot Wallet Overlap', `${matchedVasp ? matchedVasp.hotWallets.length : 0} address(es)`],
                  ['Risk Score', matchedVasp ? String(matchedVasp.riskScore) : 'N/A'],
                  ['Recommendation', inv.confidence >= 70 ? 'Freeze / Disclosure Request' : 'Enhanced Monitoring'],
                ].map(([field, value]) => (
                  <tr key={field} className="border-b border-gray-200 last:border-0">
                    <th className="w-1/3 bg-gray-50 p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {field}
                    </th>
                    <td className="p-3 font-medium text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">5. RISK INDICATORS</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">#</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Indicator</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Severity</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Evidence</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody>
                {riskIndicators.map((ri, i) => (
                  <tr key={ri.id} className="border-t border-gray-200">
                    <td className="p-3 font-mono text-gray-500">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{ri.label}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase',
                          ri.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : ri.severity === 'high'
                              ? 'bg-amber-100 text-amber-700'
                              : ri.severity === 'medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700',
                        )}
                      >
                        {ri.severity}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{ri.evidence}</td>
                    <td className="p-3 font-mono text-xs text-gray-500">
                      heuristic-{ri.type}-v2.1
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">6. CHRONOLOGICAL EVIDENCE LOG</h2>
          <ol className="space-y-4">
            {evidenceLog.map((entry) => (
              <li
                key={entry.idx}
                className="relative rounded-xl border border-gray-200 bg-white p-4 pl-12 shadow-sm"
              >
                <span className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {entry.idx}
                </span>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{entry.event}</p>
                    <p className="mt-1 text-sm text-gray-600">{entry.details}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs">
                    <span className="font-mono font-medium text-gray-500">
                      {formatDate(entry.timestamp)}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono font-semibold text-gray-700">
                      {entry.ref}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">7. SAHYOG PORTAL REQUEST TEMPLATE</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  SAHYOG Case Reference
                </Label>
                <p className="mt-1 font-mono font-medium">SAHYOG-{inv.caseId.replace(/[^0-9]/g, '')}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Requesting Agency
                </Label>
                <p className="mt-1 font-medium">State Cyber Cell · Delhi Police</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Officer Name
                </Label>
                <p className="mt-1 font-medium">Inspector Sharma</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rank / Badge
                </Label>
                <p className="mt-1 font-medium">Inspector-Cyber · DL-4812</p>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date Range (FIR to Case Close)
                </Label>
                <p className="mt-1 font-medium">
                  {formatDate(inv.createdAt)} — {formatDate(today)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Suspect Wallets
                </Label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {Array.from(
                    new Set(inv.hops.flatMap((h) => [h.from, h.to])),
                  ).slice(0, 5).map((addr) => (
                    <span
                      key={addr}
                      className="rounded-full border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs text-gray-700"
                    >
                      {shortAddress(addr)}
                    </span>
                  ))}
                  {Array.from(new Set(inv.hops.flatMap((h) => [h.from, h.to]))).length > 5 && (
                    <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600">
                      +{Array.from(new Set(inv.hops.flatMap((h) => [h.from, h.to]))).length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  VASP Attributions
                </Label>
                <div className="mt-1">
                  {matchedVasp ? (
                    <span className="inline-flex rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700">
                      {matchedVasp.name} · {matchedVasp.jurisdiction}
                    </span>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Freeze Requested
                </Label>
                <p className="mt-1 font-medium">{inv.confidence >= 70 ? 'Yes' : 'No'}</p>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Legal Section
                </Label>
                <p className="mt-1 font-medium">PMLA §12A, CrPC §156</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">8. DIGITAL SIGNATURES</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                Investigating Officer
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-500">Name: </span>
                  Inspector Sharma
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Rank: </span>
                  Inspector-Cyber
                </p>
                <div className="my-4 h-12 border-b border-gray-400 pt-6 text-xs italic text-gray-500">
                  Signature (digitally signed)
                </div>
                <p>
                  <span className="font-semibold text-gray-500">Date: </span>
                  {formatDate(today)}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Place: </span>
                  New Delhi
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                Nodal Officer / Technical Head
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-500">Name: </span>
                  Dr. A. Verma
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Rank: </span>
                  ACP-Tech
                </p>
                <div className="my-4 h-12 border-b border-gray-400 pt-6 text-xs italic text-gray-500">
                  Signature (digitally signed)
                </div>
                <p>
                  <span className="font-semibold text-gray-500">Date: </span>
                  {formatDate(today)}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Place: </span>
                  New Delhi
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-6 border-gray-200" />
        <p className="text-center text-xs text-gray-500">
          Generated by ChainTrace · Build SHA-XXXX · RSA-3072 signed · RFC 3161 timestamp token
          from tsa.nic.in · SHA-256 manifest available upon court request
        </p>
      </div>
    </div>
  )
}
