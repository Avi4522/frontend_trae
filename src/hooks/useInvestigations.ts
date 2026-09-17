import { useCallback, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { investigationService } from '../services/investigationService'
import type { Investigation } from '../services/types'
import { useToast } from './useToast'

export function useInvestigations() {
  const listMap = useAppStore((s) => s.investigations.list)
  const currentId = useAppStore((s) => s.investigations.currentId)
  const loading = useAppStore((s) => s.investigations.loading)
  const addInvestigation = useAppStore((s) => s.investigations.addInvestigation)
  const setCurrent = useAppStore((s) => s.investigations.setCurrent)
  const updateInvestigation = useAppStore(
    (s) => s.investigations.updateInvestigation,
  )
  const setLoading = useAppStore((s) => s.investigations.setLoading)
  const { success, error } = useToast()

  const list = Object.values(listMap)
  const current: Investigation | null = currentId ? listMap[currentId] ?? null : null

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const arr = await investigationService.list()
      for (const inv of arr) {
        addInvestigation(inv)
      }
    } finally {
      setLoading(false)
    }
  }, [addInvestigation, setLoading])

  useEffect(() => {
    if (list.length === 0) {
      void refresh()
    }
  }, [list.length, refresh])

  const create = useCallback(
    async (input: Parameters<typeof investigationService.create>[0]) => {
      setLoading(true)
      try {
        const created = await investigationService.create(input)
        addInvestigation(created)
        success('Investigation created', created.caseId)
        return created
      } catch (e) {
        error('Failed to create investigation')
        throw e
      } finally {
        setLoading(false)
      }
    },
    [addInvestigation, error, setLoading, success],
  )

  const update = useCallback(
    async (id: string, patch: Partial<Investigation>) => {
      updateInvestigation(id, patch)
      const remote = await investigationService.update(id, patch)
      if (remote) {
        addInvestigation(remote)
      }
      success('Investigation updated')
    },
    [addInvestigation, success, updateInvestigation],
  )

  return {
    list,
    current,
    currentId,
    loading,
    setCurrent,
    refresh,
    create,
    update,
  }
}
