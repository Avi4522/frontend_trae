import { useCallback } from 'react'
import { useAppStore } from '../store/appStore'
import { traceService } from '../services/traceService'
import type { TraceStage, WalletHop } from '../services/types'
import { useToast } from './useToast'

export function useTrace() {
  const traceStages = useAppStore((s) => s.investigations.traceStages)
  const currentTraceStage = useAppStore(
    (s) => s.investigations.currentTraceStage,
  )
  const setCurrentTraceStage = useAppStore(
    (s) => s.investigations.setCurrentTraceStage,
  )
  const updateInvestigation = useAppStore(
    (s) => s.investigations.updateInvestigation,
  )
  const currentId = useAppStore((s) => s.investigations.currentId)
  const { success, error } = useToast()

  const loadHops = useCallback(
    async (invId: string): Promise<WalletHop[]> => {
      return traceService.getHops(invId)
    },
    [],
  )

  const loadStages = useCallback(
    async (invId: string): Promise<TraceStage[]> => {
      return traceService.getStages(invId)
    },
    [],
  )

  const runTrace = useCallback(
    async (invId?: string) => {
      const id = invId ?? currentId
      if (!id) {
        error('No active investigation')
        return null
      }
      try {
        const result = await traceService.runTrace(id)
        updateInvestigation(id, {
          hops: result.hops,
          traceStages: result.stages,
          confidence: result.confidence,
        })
        success('Trace completed', `${result.confidence}% confidence`)
        return result
      } catch (e) {
        error('Trace failed', 'Try again in a moment')
        throw e
      }
    },
    [currentId, error, success, updateInvestigation],
  )

  const advance = useCallback(
    async (nextIndex: number, invId?: string) => {
      const id = invId ?? currentId
      if (!id) return null
      const stages = await traceService.advanceStage(id, nextIndex)
      updateInvestigation(id, { traceStages: stages })
      setCurrentTraceStage(nextIndex)
      return stages
    },
    [currentId, setCurrentTraceStage, updateInvestigation],
  )

  return {
    traceStages,
    currentTraceStage,
    setCurrentTraceStage,
    loadHops,
    loadStages,
    runTrace,
    advance,
  }
}
