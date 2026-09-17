import type { Investigation, VASP, TimelineEvent } from './types'
import { investigations, vasps, timelineEvents } from './mockData'

const delay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export type ReportPayload = {
  id: string
  investigation: Investigation
  vasp: VASP | null
  timeline: TimelineEvent[]
  generatedAt: string
  officer: string
}

export const reportService = {
  async preview(id: string): Promise<ReportPayload | null> {
    const inv = investigations.find((i) => i.id === id)
    if (!inv) return delay(null)
    const vasp = inv.vaspId ? vasps.find((v) => v.id === inv.vaspId) ?? null : null
    return delay({
      id: `report-${id}`,
      investigation: inv,
      vasp,
      timeline: [...timelineEvents],
      generatedAt: new Date().toISOString(),
      officer: 'Inspector Sharma',
    })
  },

  async generatePdfUrl(id: string): Promise<string> {
    return delay(`/reports/generated/${id}-${Date.now()}.pdf`)
  },

  async submitSahyog(_id: string): Promise<{ ticketId: string; status: string }> {
    return delay({
      ticketId: `SY-${Date.now()}`,
      status: 'Submitted for review',
    })
  },

  async listTimeline(): Promise<TimelineEvent[]> {
    return delay([...timelineEvents])
  },
}
