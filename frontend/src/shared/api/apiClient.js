import { getStoredAuth } from '../auth/authStorage.js'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function parseBody(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return await res.json()
  const text = await res.text()
  return text
}

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const auth = getStoredAuth()
  const effectiveToken = token ?? auth.token

  const res = await fetch(path.startsWith('http') ? path : path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let data
  try {
    data = await parseBody(res)
  } catch {
    data = null
  }

  if (!res.ok) {
    const msg =
      (typeof data === 'object' && data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${res.status})`
    throw new ApiError(msg, { status: res.status, data })
  }

  return data
}

