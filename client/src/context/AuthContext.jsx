import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('ecolife_token')
    const storedUser = localStorage.getItem('ecolife_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('ecolife_token', tokenData)
    localStorage.setItem('ecolife_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ecolife_token')
    localStorage.removeItem('ecolife_user')
  }

  // Fetch the latest user from the server and sync state + localStorage.
  // Call this after any action that changes greenScore on the backend.
  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe()
      const freshUser = res.data.user
      setUser(freshUser)
      localStorage.setItem('ecolife_user', JSON.stringify(freshUser))
    } catch {
      // silently ignore — user stays as-is
    }
  }

  const isAdmin = () => user?.role === 'admin'
  const isAuthenticated = () => !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}