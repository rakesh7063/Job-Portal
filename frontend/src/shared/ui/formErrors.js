export function extractFieldErrors(err) {
  const data = err?.data
  const fieldErrors = data?.fieldErrors
  if (!fieldErrors || typeof fieldErrors !== 'object') return null

  const entries = Object.entries(fieldErrors)
    .filter(([k, v]) => typeof k === 'string' && k.length > 0 && typeof v === 'string' && v.length > 0)
    .map(([field, message]) => ({ field, message }))

  return entries.length ? entries : null
}

export function humanizeFieldError({ field, message }) {
  const label = field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()

  let nice = message
  if (message === 'must not be blank' || message === 'must not be null') nice = 'is required'
  if (message === 'must be greater than or equal to 0') nice = 'must be 0 or greater'

  return `${label} ${nice}`
}

