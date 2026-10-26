import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { withActionLog } from './actionLog'

/**
 * Store del carrito de la práctica "Tienda SENA" (actividad 3.3).
 *
 * - persist  : guarda los items en localStorage (clave "tienda-sena-cart").
 * - devtools : historial en Redux DevTools con nombres cart/*.
 * - withActionLog: historial visible dentro de la app (/devtools).
 */
export const useCartStore = create(
  withActionLog(
    devtools(
      persist(
        (set, get) => ({
          items: [],

          addItem: (product) =>
            set(
              (state) => {
                const exists = state.items.find((i) => i.id === product.id)
                if (exists) {
                  return {
                    items: state.items.map((i) =>
                      i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
                    ),
                  }
                }
                return { items: [...state.items, { ...product, qty: 1 }] }
              },
              false,
              'cart/addItem',
            ),

          removeItem: (id) =>
            set(
              (state) => ({ items: state.items.filter((i) => i.id !== id) }),
              false,
              'cart/removeItem',
            ),

          updateQty: (id, qty) =>
            set(
              (state) => ({
                items: state.items
                  .map((i) => (i.id === id ? { ...i, qty: Number(qty) || 0 } : i))
                  .filter((i) => i.qty > 0),
              }),
              false,
              'cart/updateQty',
            ),

          clearCart: () => set({ items: [] }, false, 'cart/clear'),

          totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),
          totalPrice: () =>
            get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
        }),
        {
          name: 'tienda-sena-cart',
          partialize: (state) => ({ items: state.items }),
        },
      ),
      { name: 'CartStore' },
    ),
  ),
)
