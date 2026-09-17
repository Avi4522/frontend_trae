import { useAppStore } from '../store/appStore'
import type { User } from '../services/types'

export function useCurrentUser(): {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (user: User) => void
  logout: () => void
} {
  const user = useAppStore((s) => s.auth.user)
  const login = useAppStore((s) => s.auth.login)
  const logout = useAppStore((s) => s.auth.logout)

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  }
}
