import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { withActionLog } from './actionLog'

/**
 * Store de la solicitud de equipos (antes "carrito" de la tienda).
 *
 * - persist  : la solicitud no se pierde al recargar.
 * - devtools : historial en Redux DevTools con nombres solicitud/*.
 * - withActionLog: además guarda el historial dentro de la app (/devtools).
 */
export const useSolicitudesStore = create(
  withActionLog(
    devtools(
      persist(
        (set, get) => ({
          items: [],

          addEquipo: (equipo) =>
            set(
              (state) => {
                const existe = state.items.find((i) => i.id === equipo.id)
                if (existe) {
                  return {
                    items: state.items.map((i) =>
                      i.id === equipo.id ? { ...i, cantidad: i.cantidad + 1 } : i,
                    ),
                  }
                }
                return {
                  items: [...state.items, { ...equipo, cantidad: 1 }],
                }
              },
              false,
              'solicitud/addEquipo',
            ),

          removeEquipo: (id) =>
            set(
              (state) => ({ items: state.items.filter((i) => i.id !== id) }),
              false,
              'solicitud/removeEquipo',
            ),

          updateCantidad: (id, cantidad) =>
            set(
              (state) => ({
                items: state.items
                  .map((i) =>
                    i.id === id ? { ...i, cantidad: Number(cantidad) || 0 } : i,
                  )
                  .filter((i) => i.cantidad > 0),
              }),
              false,
              'solicitud/updateCantidad',
            ),

          clearSolicitud: () =>
            set({ items: [] }, false, 'solicitud/clear'),

          totalEquipos: () =>
            get().items.reduce((acc, i) => acc + i.cantidad, 0),
        }),
        {
          name: 'senaaccess-solicitud',
          partialize: (state) => ({ items: state.items }),
        },
      ),
      { name: 'SolicitudesStore' },
    ),
  ),
)
