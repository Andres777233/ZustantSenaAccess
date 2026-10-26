import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useActionLogStore } from '../store/actionLog'
import { useCartStore } from '../store/useCartStore'
import { useSolicitudesStore } from '../store/useSolicitudesStore'

const PRODUCTO_A = {
  id: 1,
  name: 'Portátil Lenovo ThinkPad E14',
  price: 2890000,
  icon: '💻',
  category: 'Tecnología',
}
const PRODUCTO_B = {
  id: 2,
  name: 'Mouse inalámbrico Logitech M170',
  price: 65000,
  icon: '🖱️',
  category: 'Accesorios',
}
const EQUIPO_DEMO = {
  id: 7,
  nombre: 'Proyector Epson PowerLite',
  serial: 'SENA-PR-0009',
  categoria: 'Audiovisual',
  icon: '📽️',
}

/**
 * Historial de acciones de los stores (evidencia del ejercicio 6).
 *
 * Con la extensión Redux DevTools instalada se ve lo mismo en su pestaña
 * "Redux"; esta página muestra el log equivalente dentro de la app para poder
 * capturarlo. Abrir /devtools?demo=1 ejecuta acciones de ejemplo.
 */
export default function Devtools() {
  const entries = useActionLogStore((s) => s.entries)
  const clear = useActionLogStore((s) => s.clear)
  const [params] = useSearchParams()
  const ejecutado = useRef(false)

  useEffect(() => {
    if (params.get('demo') !== '1') return
    if (ejecutado.current) return
    ejecutado.current = true

    const cart = useCartStore.getState()
    const solicitud = useSolicitudesStore.getState()

    cart.addItem(PRODUCTO_A)
    cart.addItem(PRODUCTO_A)
    cart.addItem(PRODUCTO_B)
    cart.updateQty(PRODUCTO_A.id, 3)
    cart.removeItem(PRODUCTO_B.id)
    solicitud.addEquipo(EQUIPO_DEMO)
    solicitud.updateCantidad(EQUIPO_DEMO.id, 2)
    solicitud.clearSolicitud()
  }, [params])

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Historial de acciones</h1>
          <p className="subtitulo">
            Middleware <code>devtools</code> + middleware propio{' '}
            <code>withActionLog</code> sobre <code>useCartStore</code> y{' '}
            <code>useSolicitudesStore</code>.
          </p>
        </div>
        <div className="acciones">
          <Link to="/devtools?demo=1" className="btn btn-verde">
            Ejecutar demo
          </Link>
          <button type="button" className="btn btn-fantasma" onClick={clear}>
            Limpiar
          </button>
        </div>
      </header>

      <div className="panel">
        <div className="panel-cabecera">
          <span className="punto-verde" aria-hidden="true" />
          <strong>SenaAccess Stores</strong>
          <small>{entries.length} acciones registradas</small>
        </div>

        {entries.length === 0 ? (
          <p className="subtitulo">
            Aún no hay acciones. Agrega productos en la tienda, equipos en la
            solicitud o pulsa “Ejecutar demo”.
          </p>
        ) : (
          <ul className="devtools-log">
            {entries.map((e) => (
              <li key={e.id}>
                <code>{e.nombre}</code>
                <span className="devtools-hora">{e.hora}</span>
                <span className="devtools-resumen">{e.resumen}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h2>Cómo verlo en Redux DevTools</h2>
        <ol className="lista-notas">
          <li>Instalar la extensión Redux DevTools en Chrome o Edge.</li>
          <li>
            Abrir la app con <kbd>F12</kbd> → pestaña <strong>Redux</strong>.
          </li>
          <li>
            Agregar productos: aparecen <code>cart/addItem</code>,{' '}
            <code>cart/updateQty</code>, <code>cart/removeItem</code> y{' '}
            <code>cart/clear</code> en el store <code>CartStore</code>.
          </li>
          <li>
            La misma lista se ve aquí porque <code>withActionLog</code> guarda
            cada acción en <code>useActionLogStore</code>.
          </li>
        </ol>
      </div>
    </section>
  )
}
