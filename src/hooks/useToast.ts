import { useAppStore } from '../store/appStore'
import type { Toast, ToastVariant } from '../services/types'

type PushToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

export function useToast(): {
  toasts: Toast[]
  pushToast: (input: PushToastInput) => void
  dismissToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
} {
  const toasts = useAppStore((s) => s.ui.toasts)
  const pushToast = useAppStore((s) => s.ui.pushToast)
  const dismissToast = useAppStore((s) => s.ui.dismissToast)

  return {
    toasts,
    pushToast,
    dismissToast,
    success: (title, description) =>
      pushToast({ title, description, variant: 'success' }),
    error: (title, description) =>
      pushToast({ title, description, variant: 'danger' }),
    warning: (title, description) =>
      pushToast({ title, description, variant: 'warning' }),
    info: (title, description) =>
      pushToast({ title, description, variant: 'info' }),
  }
}
