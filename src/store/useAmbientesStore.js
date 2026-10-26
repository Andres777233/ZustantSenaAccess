import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch } from '../services/api'

/**
 * Store de ambientes (aulas / salones de formación).
 *
 * - fetchAmbientes: acción asíncrona contra el backend con loading y error.
 * - search: filtro compartido entre el input (Ambientes.jsx) y la lista.
 * - guardados: ambientes marcados por el usuario; se persisten porque deben
 *   sobrevivir a la recarga (justificación de persist).
 */
const API = import.meta.env.VITE_API_URL || ''
const SOURCE = API ? `${API}/ambientes` : '/data/ambientes.json'

export const useAmbientesStore = create(
  persist(
    (set, get) => ({
      ambientes: [],
      loading: false,
      error: null,
      loaded: false,
      search: '',
      guardados: [],

      fetchAmbientes: async ({ force = false } = {}) => {
        if (get().loading) return
        if (get().loaded && !force) return

        set({ loading: true, error: null })
        try {
          const res = await apiFetch(SOURCE)
          if (!res.ok) {
            throw new Error(`No fue posible cargar los ambientes (HTTP ${res.status})`)
          }
          const data = await res.json()
          set({
            ambientes: Array.isArray(data) ? data : (data.ambientes ?? []),
            loading: false,
            loaded: true,
          })
        } catch (err) {
          set({
            error: err.message || 'Error de red al cargar los ambientes',
            loading: false,
          })
        }
      },

      setSearch: (search) => set({ search }),

      toggleGuardado: (id) =>
        set((state) => ({
          guardados: state.guardados.includes(id)
            ? state.guardados.filter((g) => g !== id)
            : [...state.guardados, id],
        })),
    }),
    {
      name: 'senaaccess-ambientes',
      partialize: (state) => ({ guardados: state.guardados }),
    },
  ),
)
