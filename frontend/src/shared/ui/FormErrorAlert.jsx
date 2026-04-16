import { extractFieldErrors, humanizeFieldError } from './formErrors.js'

export function FormErrorAlert({ error, fallback }) {
  if (!error) return null

  const fields = extractFieldErrors(error)
  const top = typeof error?.message === 'string' ? error.message : fallback || 'Request failed'

  return (
    <div className="error">
      <div style={{ fontWeight: 700, marginBottom: fields ? 6 : 0 }}>{top}</div>
      {fields ? (
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)' }}>
          {fields.map((fe) => (
            <li key={fe.field}>{humanizeFieldError(fe)}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

