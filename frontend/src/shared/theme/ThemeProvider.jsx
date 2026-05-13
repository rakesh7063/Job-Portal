import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getStoredTheme, setStoredTheme } from './themeStorage.js'

const ThemeContext = createContext(null)

function resolveTheme(mode) {
  if (mode === 'light' || mode === 'dark') return mode
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => getStoredTheme())

  useEffect(() => {
    setStoredTheme(mode)
  }, [mode])

  useEffect(() => {
    const apply = () => {
      const t = resolveTheme(mode)
      const root = document.documentElement
      if (t === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    apply()

    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [mode])

  const value = useMemo(() => ({ mode, setMode }), [mode])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

