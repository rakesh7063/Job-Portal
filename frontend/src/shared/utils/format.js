export function formatInstant(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return String(iso)
  }
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

