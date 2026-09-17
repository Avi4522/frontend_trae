import type { ApiService } from './types'
import { apiServices } from './mockData'

const delay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export type SetKeyInput = {
  serviceId: string
  apiKey: string
  enabled?: boolean
}

export const apiKeyService = {
  async list(): Promise<ApiService[]> {
    return delay([...apiServices])
  },

  async getById(id: string): Promise<ApiService | null> {
    const found = apiServices.find((s) => s.id === id) ?? null
    return delay(found)
  },

  async setKey({
    serviceId,
    apiKey,
    enabled,
  }: SetKeyInput): Promise<ApiService | null> {
    const idx = apiServices.findIndex((s) => s.id === serviceId)
    if (idx === -1) return delay(null)
    const base = apiServices[idx]
    const updated: ApiService = {
      ...base,
      enabled: typeof enabled === 'boolean' ? enabled : base.enabled,
      lastSynced: new Date().toISOString(),
      description: apiKey
        ? `${base.description} (key configured)`
        : base.description,
    }
    return delay(updated)
  },

  async toggle(serviceId: string, enabled: boolean): Promise<ApiService | null> {
    const idx = apiServices.findIndex((s) => s.id === serviceId)
    if (idx === -1) return delay(null)
    const updated: ApiService = {
      ...apiServices[idx],
      enabled,
      lastSynced: new Date().toISOString(),
    }
    return delay(updated)
  },

  async sync(serviceId: string): Promise<{ lastSynced: string; quotaUsed: number }> {
    const svc = apiServices.find((s) => s.id === serviceId)
    if (!svc) return delay({ lastSynced: new Date().toISOString(), quotaUsed: 0 })
    return delay({
      lastSynced: new Date().toISOString(),
      quotaUsed: Math.min(svc.quotaTotal, svc.quotaUsed + 42),
    })
  },
}
