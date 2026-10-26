import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { crearExcusaRequest, validarExcusaRequest } from '../data/mockApi'

/**
 * Store de excusas con PIN.
 *
 * Estado : excusas [{ id, motivo, pin, ambiente, estado, creada, expira }],
 *          loading, error, ultimoPin
 * Acciones: crearExcusa(motivo, ambiente), validarPin(pin), limpiarUsadas()
 *
 * persist se justifica porque los PIN pendientes duran 15 minutos y deben
 * sobrevivir a una recarga (solo se guardan las excusas, no el loading).
 */
export const useExcusasStore = create(
  persist(
    (set, get) => ({
      excusas: [],
      loading: false,
      error: null,
      ultimoPin: null,

      crearExcusa: async ({ motivo, ambiente }) => {
        set({ loading: true, error: null })
        try {
          const data = await crearExcusaRequest({ motivo })
          set((state) => ({
            excusas: [
              {
                ...data,
                ambiente: ambiente || 'Sin ambiente',
                estado: 'pendiente',
              },
              ...state.excusas,
            ],
            loading: false,
            ultimoPin: data.pin,
          }))
          return data.pin
        } catch (err) {
          set({ error: err.message, loading: false })
          return null
        }
      },

      validarPin: async (pin) => {
        set({ loading: true, error: null })
        try {
          await validarExcusaRequest({ pin })

          const excusa = get().excusas.find((e) => e.pin === String(pin))
          if (!excusa) throw new Error('No existe una excusa con ese PIN')
          if (excusa.estado !== 'pendiente') {
            throw new Error('Esa excusa ya fue usada o anulada')
          }
          if (new Date(excusa.expira).getTime() < Date.now()) {
            throw new Error('El PIN expiró (dura 15 minutos)')
          }

          set((state) => ({
            excusas: state.excusas.map((e) =>
              e.pin === String(pin) ? { ...e, estado: 'usada' } : e,
            ),
            loading: false,
          }))
          return excusa
        } catch (err) {
          set({ error: err.message, loading: false })
          return null
        }
      },

      limpiarUsadas: () =>
        set((state) => ({
          excusas: state.excusas.filter((e) => e.estado === 'pendiente'),
        })),

      pendientes: () =>
        get().excusas.filter((e) => e.estado === 'pendiente').length,
    }),
    {
      name: 'senaaccess-excusas',
      partialize: (state) => ({ excusas: state.excusas }),
    },
  ),
)
