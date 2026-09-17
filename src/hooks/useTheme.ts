import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import type { ThemeMode } from '../services/types'

export function useTheme(): {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (t: ThemeMode) => void
} {
  const theme = useAppStore((s) => s.ui.theme)
  const toggleTheme = useAppStore((s) => s.ui.toggleTheme)

  const setTheme = (t: ThemeMode) => {
    const current = useAppStore.getState().ui.theme
    if (current !== t) {
      toggleTheme()
    }
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, toggleTheme, setTheme }
}
