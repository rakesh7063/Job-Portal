const KEY = 'jp.theme'

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    // ignore
  }
  return 'system'
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // ignore
  }
}

