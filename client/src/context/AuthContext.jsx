import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService.js'
import { AUTH_TOKEN_KEY } from '../utils/constants.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await authService.fetchCurrentUser()
      setUser(data.user ?? data)
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const login = useCallback(async (credentials) => {
    setError(null)
    const data = await authService.login(credentials)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    setError(null)
    const data = await authService.register(payload)
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const data = await authService.updateProfile(payload)
    setUser(data.user ?? data)
    return data
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, error, login, register, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
