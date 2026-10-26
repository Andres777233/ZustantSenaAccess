import { create } from 'zustand'

/**
 * Primer store del taller (paso 2): contador.
 *
 * Demuestra que dos componentes hermanos comparten el mismo estado sin
 * props y sin Provider, y que set() hace merge del objeto retornado.
 */
export const useCounterStore = create((set) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  incrementBy: (value) => set((state) => ({ count: state.count + Number(value || 0) })),
  reset: () => set({ count: 0 }),
}))
