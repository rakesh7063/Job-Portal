import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from './authStorage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAuth().token)
  const [role, setRole] = useState(() => getStoredAuth().role)
  const [name, setName] = useState(() => getStoredAuth().name)
  const [email, setEmail] = useState(() => getStoredAuth().email)

  useEffect(() => {
    if (token) setStoredAuth({ token, role, name, email })
    else clearStoredAuth()
  }, [token, role, name, email])

  const value = useMemo(
    () => ({
      token,
      role,
      name,
      email,
      isAuthed: Boolean(token),
      setAuth: (next) => {
        setToken(next?.token ?? null)
        setRole(next?.role ?? null)
        setName(next?.name ?? null)
        setEmail(next?.email ?? null)
      },
      logout: () => {
        setToken(null)
        setRole(null)
        setName(null)
        setEmail(null)
      },
    }),
    [token, role, name, email],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

