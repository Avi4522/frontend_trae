import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User,
  ThemeMode,
  Toast,
  Investigation,
  TraceStage,
} from '../services/types'
import {
  investigations as mockInvestigations,
  defaultTraceStages,
} from '../services/mockData'

type ToastVariant = Toast['variant']

type PushToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

type InvestigationsMap = Record<string, Investigation>

type AppState = {
  auth: {
    user: User | null
    login: (user: User) => void
    logout: () => void
  }
  ui: {
    theme: ThemeMode
    sidebarOpen: boolean
    toasts: Toast[]
    pushToast: (input: PushToastInput) => void
    dismissToast: (id: string) => void
    toggleTheme: () => void
    toggleSidebar: (open?: boolean) => void
  }
  investigations: {
    list: InvestigationsMap
    currentId: string | null
    loading: boolean
    traceStages: TraceStage[]
    currentTraceStage: number
    addInvestigation: (inv: Investigation) => void
    setCurrent: (id: string | null) => void
    updateInvestigation: (id: string, patch: Partial<Investigation>) => void
    setLoading: (loading: boolean) => void
    setCurrentTraceStage: (index: number) => void
  }
}

const toastIdCounter = (() => {
  let n = 0
  return () => `toast-${Date.now()}-${++n}`
})()

const investigationListToMap = (arr: Investigation[]): InvestigationsMap => {
  const map: InvestigationsMap = {}
  for (const inv of arr) {
    map[inv.id] = inv
  }
  return map
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      auth: {
        user: null,
        login: (user) =>
          set((s) => ({
            auth: { ...s.auth, user },
          })),
        logout: () =>
          set((s) => ({
            auth: { ...s.auth, user: null },
          })),
      },
      ui: {
        theme: 'dark',
        sidebarOpen: true,
        toasts: [],
        pushToast: ({ title, description, variant = 'default' }) => {
          const id = toastIdCounter()
          const toast: Toast = { id, title, description, variant }
          set((s) => ({
            ui: { ...s.ui, toasts: [...s.ui.toasts, toast] },
          }))
          setTimeout(() => {
            const current = get().ui.toasts
            if (current.some((t) => t.id === id)) {
              set((s) => ({
                ui: {
                  ...s.ui,
                  toasts: s.ui.toasts.filter((t) => t.id !== id),
                },
              }))
            }
          }, 4000)
        },
        dismissToast: (id) =>
          set((s) => ({
            ui: { ...s.ui, toasts: s.ui.toasts.filter((t) => t.id !== id) },
          })),
        toggleTheme: () =>
          set((s) => ({
            ui: {
              ...s.ui,
              theme: s.ui.theme === 'dark' ? 'light' : 'dark',
            },
          })),
        toggleSidebar: (open) =>
          set((s) => ({
            ui: {
              ...s.ui,
              sidebarOpen:
                typeof open === 'boolean' ? open : !s.ui.sidebarOpen,
            },
          })),
      },
      investigations: {
        list: investigationListToMap(mockInvestigations),
        currentId: null,
        loading: false,
        traceStages: defaultTraceStages,
        currentTraceStage: 2,
        addInvestigation: (inv) =>
          set((s) => ({
            investigations: {
              ...s.investigations,
              list: { ...s.investigations.list, [inv.id]: inv },
            },
          })),
        setCurrent: (id) =>
          set((s) => ({
            investigations: { ...s.investigations, currentId: id },
          })),
        updateInvestigation: (id, patch) =>
          set((s) => {
            const existing = s.investigations.list[id]
            if (!existing) return {}
            return {
              investigations: {
                ...s.investigations,
                list: {
                  ...s.investigations.list,
                  [id]: { ...existing, ...patch },
                },
              },
            }
          }),
        setLoading: (loading) =>
          set((s) => ({
            investigations: { ...s.investigations, loading },
          })),
        setCurrentTraceStage: (index) =>
          set((s) => ({
            investigations: {
              ...s.investigations,
              currentTraceStage: index,
            },
          })),
      },
    }),
    {
      name: 'sih-182-app-store',
      partialize: (s) => ({
        ui: { theme: s.ui.theme },
      }),
    },
  ),
)
