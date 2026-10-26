import { create } from 'zustand'
import { apiFetch } from '../services/api'

/**
 * Store del catalogo.
 *
 * Accion asincrona `fetchProducts` que consume el backend
 * (o public/products.json si no hay VITE_API_URL) con loading y error.
 *
 * Tambien guarda los filtros (search, category) porque el input vive en
 * ProductFilters y la lista en Catalog: son ramas distintas del arbol
 * (ejercicio 5: estado compartido entre ramas).
 */
const API = import.meta.env.VITE_API_URL || ''
const SOURCE = API ? `${API}/products` : '/products.json'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  loaded: false,

  // Filtros globales
  search: '',
  category: 'todas',

  fetchProducts: async ({ force = false } = {}) => {
    if (get().loading) return
    if (get().loaded && !force) return

    set({ loading: true, error: null })
    try {
      const res = await apiFetch(SOURCE)
      if (!res.ok) {
        throw new Error(`No fue posible cargar el catalogo (HTTP ${res.status})`)
      }
      const data = await res.json()
      const products = Array.isArray(data) ? data : (data.products ?? [])
      set({ products, loading: false, loaded: true })
    } catch (err) {
      set({
        error: err.message || 'Error de red al cargar el catalogo',
        loading: false,
      })
    }
  },

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  clearFilters: () => set({ search: '', category: 'todas' }),
}))
