const KEY = 'jp.auth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { token: null, role: null, name: null, email: null }
    const parsed = JSON.parse(raw)
    return {
      token: typeof parsed?.token === 'string' ? parsed.token : null,
      role: typeof parsed?.role === 'string' ? parsed.role : null,
      name: typeof parsed?.name === 'string' ? parsed.name : null,
      email: typeof parsed?.email === 'string' ? parsed.email : null,
    }
  } catch {
    return { token: null, role: null, name: null, email: null }
  }
}

export function setStoredAuth({ token, role, name, email }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ token, role, name, email }))
  } catch {
    // ignore
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

