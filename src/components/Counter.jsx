import { useCounterStore } from '../store/useCounterStore'

/**
 * Paso 2 de la guia: dos componentes hermanos, sin props entre ellos,
 * comparten el mismo valor del store.
 */
export function CounterDisplay() {
  const count = useCounterStore((s) => s.count)
  return (
    <div className="contador-valor">
      <small>Valor actual</small>
      <strong>{count}</strong>
    </div>
  )
}

export function CounterButtons() {
  // Solo selecciona funciones: este componente NO se re-renderiza
  // cuando cambia count.
  const increment = useCounterStore((s) => s.increment)
  const decrement = useCounterStore((s) => s.decrement)
  const incrementBy = useCounterStore((s) => s.incrementBy)
  const reset = useCounterStore((s) => s.reset)

  return (
    <div className="contador-botones">
      <button type="button" className="btn btn-fantasma" onClick={() => decrement()}>
        − 1
      </button>
      <button type="button" className="btn btn-verde" onClick={() => increment()}>
        + 1
      </button>
      <button type="button" className="btn btn-fantasma" onClick={() => incrementBy(10)}>
        + 10
      </button>
      <button type="button" className="btn btn-fantasma" onClick={() => reset()}>
        Reiniciar
      </button>
    </div>
  )
}
