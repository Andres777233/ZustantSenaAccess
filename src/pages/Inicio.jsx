import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAmbientesStore } from '../store/useAmbientesStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEquiposStore } from '../store/useEquiposStore'
import { useExcusasStore } from '../store/useExcusasStore'
import { useSolicitudesStore } from '../store/useSolicitudesStore'

export default function Inicio() {
  const user = useAuthStore((s) => s.user)

  const ambientes = useAmbientesStore((s) => s.ambientes)
  const fetchAmbientes = useAmbientesStore((s) => s.fetchAmbientes)
  const guardados = useAmbientesStore((s) => s.guardados.length)

  const equipos = useEquiposStore((s) => s.equipos)
  const fetchEquipos = useEquiposStore((s) => s.fetchEquipos)

  const pendientes = useExcusasStore(
    (s) => s.excusas.filter((e) => e.estado === 'pendiente').length,
  )
  const enSolicitud = useSolicitudesStore((s) =>
    s.items.reduce((acc, i) => acc + i.cantidad, 0),
  )

  useEffect(() => {
    fetchAmbientes()
    fetchEquipos()
  }, [fetchAmbientes, fetchEquipos])

  const esPorteria = user?.rol === 'Admin' || user?.rol === 'Superadmin'

  return (
    <section>
      <div className="hero">
        <div>
          <span className="hero-chip">RAP3 · Estado global con Zustand 5</span>
          <h1>
            {user ? `Hola, ${user.nombre.split(' ')[0]}` : 'SenaAccess con Zustand'}
          </h1>
          <p className="subtitulo">
            {user
              ? `Sesión activa como ${user.rol}. Los datos de esta pantalla salen de cuatro stores distintos, sin props.`
              : 'Ambientes, equipos, excusas y sesión viven en stores de Zustand: cualquier componente los lee con un selector.'}
          </p>
          <div className="hero-acciones">
            {user ? (
              <>
                <Link to="/ambientes" className="btn btn-verde">
                  Ver ambientes
                </Link>
                <Link to="/excusas" className="btn btn-fantasma">
                  Crear excusa
                </Link>
                {esPorteria && (
                  <Link to="/porteria" className="btn btn-fantasma">
                    Panel de portería
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-verde">
                  Iniciar sesión
                </Link>
                <Link to="/guia" className="btn btn-fantasma">
                  Ver los stores
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <small>Ambientes</small>
          <strong>{ambientes.length}</strong>
          <span>useAmbientesStore</span>
        </div>
        <div className="kpi">
          <small>Equipos</small>
          <strong>{equipos.length}</strong>
          <span>useEquiposStore</span>
        </div>
        <div className="kpi">
          <small>Excusas pendientes</small>
          <strong>{pendientes}</strong>
          <span>useExcusasStore</span>
        </div>
        <div className="kpi">
          <small>En solicitud</small>
          <strong>{enSolicitud}</strong>
          <span>useSolicitudesStore</span>
        </div>
        <div className="kpi">
          <small>Ambientes guardados</small>
          <strong>{guardados}</strong>
          <span>persist</span>
        </div>
      </div>

      <div className="panel">
        <h2>¿Qué información es global en SenaAccess?</h2>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Dato</th>
                <th>Antes (props)</th>
                <th>Ahora (store)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Usuario y rol</td>
                <td>App → Navbar → ProtectedRoute</td>
                <td>
                  <code>useAuthStore</code>
                </td>
              </tr>
              <tr>
                <td>Ambientes y búsqueda</td>
                <td>App → Ambientes → lista</td>
                <td>
                  <code>useAmbientesStore</code>
                </td>
              </tr>
              <tr>
                <td>Solicitud de equipos</td>
                <td>App → Equipos → panel</td>
                <td>
                  <code>useSolicitudesStore</code>
                </td>
              </tr>
              <tr>
                <td>PIN de excusas</td>
                <td>Excusas → Portería (entre rutas)</td>
                <td>
                  <code>useExcusasStore</code>
                </td>
              </tr>
              <tr>
                <td>Tema claro / oscuro</td>
                <td>App → Navbar → body</td>
                <td>
                  <code>useUiStore</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
