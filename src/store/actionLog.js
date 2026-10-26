import { create } from 'zustand'

/**
 * Log de acciones de los stores.
 *
 * Sirve como evidencia del ejercicio 6 (depuración): muestra el historial de
 * acciones igual que la pestaña Redux de las DevTools, pero dentro de la app
 * (así se puede capturar la pantalla sin instalar la extensión).
 */
export const useActionLogStore = create((set) => ({
  entries: [],
  push: (entry) =>
    set((state) => ({
      entries: [
        { ...entry, id: (state.entries[0]?.id ?? 0) + 1 },
        ...state.entries,
      ].slice(0, 60),
    })),
  clear: () => set({ entries: [] }),
}))

const resumen = (state) => {
  if (!state || !Array.isArray(state.items)) return ''
  const unidades = state.items.reduce(
    (acc, i) => acc + (i.qty ?? i.cantidad ?? 0),
    0,
  )
  return `${state.items.length} línea(s) · ${unidades} unidad(es)`
}

/**
 * Middleware propio: envuelve set() y registra cada acción con nombre.
 * Se puede combinar con devtools y persist (el orden importa).
 */
export const withActionLog =
  (config) => (set, get, api) => {
    const setConLog = (partial, replace, actionName) => {
      set(partial, replace, actionName)
      if (!actionName) return
      useActionLogStore.getState().push({
        nombre: actionName,
        resumen: resumen(get()),
        hora: new Date().toLocaleTimeString('es-CO', { hour12: false }),
      })
    }
    return config(setConLog, get, api)
  }
