import { create } from 'zustand'
import { apiFetch } from '../services/api'

/**
 * Store del inventario de equipos (solo lectura para el aprendiz).
 * Acción asíncrona con loading y error, igual que ambientes.
 */
const API = import.meta.env.VITE_API_URL || ''
const SOURCE = API ? `${API}/equipos` : '/data/equipos.json'

export const useEquiposStore = create((set, get) => ({
  equipos: [],
  loading: false,
  error: null,
  loaded: false,
  search: '',

  fetchEquipos: async ({ force = false } = {}) => {
    if (get().loading) return
    if (get().loaded && !force) return

    set({ loading: true, error: null })
    try {
      const res = await apiFetch(SOURCE)
      if (!res.ok) {
        throw new Error(`No fue posible cargar los equipos (HTTP ${res.status})`)
      }
      const data = await res.json()
      set({
        equipos: Array.isArray(data) ? data : (data.equipos ?? []),
        loading: false,
        loaded: true,
      })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  setSearch: (search) => set({ search }),
}))
