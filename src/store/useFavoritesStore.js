import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de favoritos (ejercicio 3).
 *
 * Estado : ids (arreglo de ids de producto)
 * Acciones: toggleFavorite(product), isFavorite(id), clearFavorites()
 *
 * Se guarda solo el arreglo de ids: los datos del producto ya viven en
 * useProductStore, duplicarlos en localStorage no aporta nada.
 */
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.ids.includes(product.id)
          return {
            ids: exists
              ? state.ids.filter((id) => id !== product.id)
              : [...state.ids, product.id],
          }
        }),

      isFavorite: (id) => get().ids.includes(id),

      clearFavorites: () => set({ ids: [] }),
    }),
    {
      name: 'tienda-sena-favoritos',
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
)
