import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useSolicitudesStore } from '../store/useSolicitudesStore'

export default function SolicitudPanel() {
  const items = useSolicitudesStore((s) => s.items)
  const updateCantidad = useSolicitudesStore((s) => s.updateCantidad)
  const removeEquipo = useSolicitudesStore((s) => s.removeEquipo)
  const clearSolicitud = useSolicitudesStore((s) => s.clearSolicitud)
  const totalEquipos = useSolicitudesStore((s) =>
    s.items.reduce((acc, i) => acc + i.cantidad, 0),
  )
  const token = useAuthStore((s) => s.token)

  if (items.length === 0) {
    return (
      <div className="vacio">
        <p className="vacio-icono" aria-hidden="true">
          🎒
        </p>
        <h3>No has agregado equipos</h3>
        <p>Selecciona equipos del inventario para armar la solicitud.</p>
        <Link to="/equipos" className="btn btn-verde">
          Ver inventario
        </Link>
      </div>
    )
  }

  return (
    <div className="carrito">
      <div className="carrito-lista">
        {items.map((item) => (
          <div className="carrito-item" key={item.id}>
            <span className="carrito-icono" aria-hidden="true">
              {item.icon}
            </span>

            <div className="carrito-datos">
              <strong>{item.nombre}</strong>
              <small>
                {item.serial} · {item.categoria}
              </small>
            </div>

            <div
              className="cantidad"
              role="group"
              aria-label={`Cantidad de ${item.nombre}`}
            >
              <button
                type="button"
                onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                aria-label="Quitar una unidad"
              >
                −
              </button>
              <span>{item.cantidad}</span>
              <button
                type="button"
                onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                aria-label="Agregar una unidad"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-icono peligro"
              onClick={() => removeEquipo(item.id)}
              aria-label={`Quitar ${item.nombre}`}
              title="Quitar"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <aside className="carrito-resumen">
        <h3>Resumen de la solicitud</h3>
        <div className="linea">
          <span>Equipos</span>
          <strong>{totalEquipos}</strong>
        </div>
        <div className="linea">
          <span>Líneas</span>
          <strong>{items.length}</strong>
        </div>
        <div className="linea total">
          <span>Total</span>
          <strong>{totalEquipos} und</strong>
        </div>

        {token ? (
          <button type="button" className="btn btn-verde btn-bloque">
            Enviar solicitud
          </button>
        ) : (
          <Link to="/login" className="btn btn-verde btn-bloque">
            Inicia sesión para enviar
          </Link>
        )}
        <button
          type="button"
          className="btn btn-fantasma btn-bloque"
          onClick={clearSolicitud}
        >
          Vaciar solicitud
        </button>

        <p className="nota">
          Recarga la página: la solicitud sigue aquí gracias a{' '}
          <code>persist</code> (localStorage → <code>senaaccess-solicitud</code>).
        </p>
      </aside>
    </div>
  )
}
