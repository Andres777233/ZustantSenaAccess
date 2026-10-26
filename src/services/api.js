import { useAuthStore } from '../store/useAuthStore'

/**
 * Paso 8 de la guia: usar el store fuera de los componentes.
 *
 * apiFetch lee el token con getState() (no es un hook), agrega el header
 * Authorization y, si el backend responde 401, cierra la sesion con
 * logout() sin necesidad de un componente.
 */
export async function apiFetch(path, options = {}) {
  const token = useAuthStore.getState().token
  const base = import.meta.env.VITE_API_URL || ''
  const url = path.startsWith('http') ? path : `${base}${path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    useAuthStore.getState().logout()
  }

  return res
}
