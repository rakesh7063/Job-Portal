import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

export function RequireAuth({ allow, children }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(auth.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

