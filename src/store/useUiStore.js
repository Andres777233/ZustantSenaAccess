import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de interfaz (ejercicio 4): tema claro / oscuro.
 *
 * persist con partialize guarda solo `theme`. App.jsx aplica la clase
 * al <body> cada vez que cambia.
 */
export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',

      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'tienda-sena-ui',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
