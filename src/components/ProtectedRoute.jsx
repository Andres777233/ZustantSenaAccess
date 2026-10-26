import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

/**
 * Ruta protegida (requisito 6).
 *
 * - Sin token → /login guardando el destino.
 * - Con token pero sin el rol permitido → / (403 amable).
 *
 * La sesión se lee del store con selectores: no recibe props.
 */
export default function ProtectedRoute({ roles }) {
  const token = useAuthStore((s) => s.token)
  const rol = useAuthStore((s) => s.user?.rol)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(rol)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
