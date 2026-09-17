import type { Investigation, Chain, RiskLevel } from './types'
import { investigations as mockInvestigations } from './mockData'

const delay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export type CreateInvestigationInput = {
  caseId: string
  wallet: string
  chain: Chain
  riskLevel?: RiskLevel
  notes?: string
}

export const investigationService = {
  async list(): Promise<Investigation[]> {
    return delay([...mockInvestigations])
  },

  async getById(id: string): Promise<Investigation | null> {
    const found = mockInvestigations.find((i) => i.id === id) ?? null
    return delay(found)
  },

  async create(input: CreateInvestigationInput): Promise<Investigation> {
    const inv: Investigation = {
      id: `inv-${Date.now()}`,
      caseId: input.caseId,
      wallet: input.wallet,
      chain: input.chain,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      confidence: 0,
      vaspId: null,
      riskLevel: input.riskLevel ?? 'medium',
      hops: [],
      traceStages: [
        { id: 'ts-1', label: 'Wallet Ingestion', status: 'active' },
        { id: 'ts-2', label: 'Initial Peeling', status: 'pending' },
        { id: 'ts-3', label: 'Multi-Hop Trace', status: 'pending' },
        { id: 'ts-4', label: 'VASP Attribution', status: 'pending' },
        { id: 'ts-5', label: 'Cluster Analysis', status: 'pending' },
        { id: 'ts-6', label: 'Report Generation', status: 'pending' },
      ],
      notes: input.notes ?? '',
    }
    return delay(inv)
  },

  async update(
    id: string,
    patch: Partial<Investigation>,
  ): Promise<Investigation | null> {
    const idx = mockInvestigations.findIndex((i) => i.id === id)
    if (idx === -1) return delay(null)
    const updated: Investigation = { ...mockInvestigations[idx], ...patch }
    return delay(updated)
  },

  async delete(id: string): Promise<boolean> {
    const found = mockInvestigations.some((i) => i.id === id)
    return delay(found)
  },
}
