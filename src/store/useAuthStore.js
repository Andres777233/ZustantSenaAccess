import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginRequest } from '../data/mockApi'

/**
 * Store de autenticación de SenaAccess.
 *
 * Estado : user { id, nombre, correo, rol, documento }, token, loading, error
 * Acciones: login(correo, password), logout(), isAuthenticated(), hasRole(...)
 *
 * persist con partialize guarda SOLO user y token (nunca la contraseña).
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (correo, password) => {
        set({ loading: true, error: null })
        try {
          const data = await loginRequest({ email: correo, password })
          set({ user: data.user, token: data.token, loading: false })
          return true
        } catch (err) {
          set({ error: err.message, loading: false })
          return false
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      isAuthenticated: () => Boolean(get().token),

      // Usado por ProtectedRoute y por la Navbar para mostrar el menú del rol.
      hasRole: (...roles) => {
        const rol = get().user?.rol
        return Boolean(rol) && roles.includes(rol)
      },
    }),
    {
      name: 'senaaccess-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
