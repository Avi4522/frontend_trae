import type { WalletHop, TraceStage, RiskIndicator, VASP } from './types'
import {
  investigations,
  defaultTraceStages,
  vasps,
  riskIndicators,
} from './mockData'

const delay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export type TraceRunResult = {
  stages: TraceStage[]
  hops: WalletHop[]
  nearestVasp: VASP | null
  indicators: RiskIndicator[]
  confidence: number
}

export const traceService = {
  async getHops(investigationId: string): Promise<WalletHop[]> {
    const inv = investigations.find((i) => i.id === investigationId)
    return delay(inv ? [...inv.hops] : [])
  },

  async getStages(investigationId: string): Promise<TraceStage[]> {
    const inv = investigations.find((i) => i.id === investigationId)
    return delay(inv ? [...inv.traceStages] : [...defaultTraceStages])
  },

  async runTrace(investigationId: string): Promise<TraceRunResult> {
    const inv = investigations.find((i) => i.id === investigationId)
    const stages = inv ? [...inv.traceStages] : [...defaultTraceStages]
    const stagesActive = stages.map<TraceStage>((s, idx) => ({
      ...s,
      status: idx < 3 ? 'done' : idx === 3 ? 'active' : 'pending',
    }))
    const nearestVaspId = inv?.vaspId ?? null
    const nearestVasp = nearestVaspId
      ? vasps.find((v) => v.id === nearestVaspId) ?? null
      : null
    return delay({
      stages: stagesActive,
      hops: inv ? [...inv.hops] : [],
      nearestVasp,
      indicators: [...riskIndicators].slice(0, 3),
      confidence: inv?.confidence ?? 60,
    })
  },

  async advanceStage(
    investigationId: string,
    nextIndex: number,
  ): Promise<TraceStage[]> {
    const inv = investigations.find((i) => i.id === investigationId)
    const base = inv ? [...inv.traceStages] : [...defaultTraceStages]
    const updated = base.map<TraceStage>((s, idx) => {
      if (idx < nextIndex) return { ...s, status: 'done' as const }
      if (idx === nextIndex) return { ...s, status: 'active' as const }
      return { ...s, status: 'pending' as const }
    })
    return delay(updated)
  },
}
