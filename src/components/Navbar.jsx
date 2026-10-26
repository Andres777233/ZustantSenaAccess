import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useCartStore } from '../store/useCartStore'
import { useExcusasStore } from '../store/useExcusasStore'
import { useSolicitudesStore } from '../store/useSolicitudesStore'
import { useUiStore } from '../store/useUiStore'

const COLOR_ROL = {
  Superadmin: 'rol-superadmin',
  Admin: 'rol-admin',
  Instructor: 'rol-instructor',
  Aprendiz: 'rol-aprendiz',
}

export default function Navbar() {
  // Selectores: cada dato se suscribe por separado.
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const totalEquipos = useSolicitudesStore((s) =>
    s.items.reduce((acc, i) => acc + i.cantidad, 0),
  )
  const pendientes = useExcusasStore(
    (s) => s.excusas.filter((e) => e.estado === 'pendiente').length,
  )
  const totalCarrito = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.qty, 0),
  )

  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)

  const navigate = useNavigate()
  const esPorteria = user?.rol === 'Admin' || user?.rol === 'Superadmin'

  const clase = ({ isActive }) => (isActive ? 'enlace activo' : 'enlace')

  const salir = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="barra">
      <div className="barra-interior">
        <Link to="/" className="marca">
          <span className="marca-icono">🎓</span>
          <span className="marca-texto">
            <span>
              Sena<strong>Access</strong>
            </span>
            <small>Zustand</small>
          </span>
        </Link>

        <nav className="menu" aria-label="Navegación principal">
          <NavLink to="/" className={clase} end>
            Inicio
          </NavLink>
          <NavLink to="/ambientes" className={clase}>
            Ambientes
          </NavLink>
          <NavLink to="/equipos" className={clase}>
            Equipos
            {totalEquipos > 0 && <span className="contador">{totalEquipos}</span>}
          </NavLink>
          <NavLink to="/excusas" className={clase}>
            Excusas
            {pendientes > 0 && (
              <span className="contador contador-amarillo">{pendientes}</span>
            )}
          </NavLink>
          {esPorteria && (
            <NavLink to="/porteria" className={clase}>
              Portería
            </NavLink>
          )}
          <NavLink to="/tienda" className={clase}>
            Tienda
            {totalCarrito > 0 && (
              <span className="contador contador-rojo">{totalCarrito}</span>
            )}
          </NavLink>
          <NavLink to="/devtools" className={clase}>
            DevTools
          </NavLink>
          <NavLink to="/guia" className={clase}>
            Guía
          </NavLink>
        </nav>

        <div className="acciones">
          <button
            type="button"
            className="btn-icono"
            onClick={toggleTheme}
            title="Cambiar tema (useUiStore)"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="usuario">
              <span className="avatar" aria-hidden="true">
                {user.nombre.charAt(0)}
              </span>
              <span className="usuario-datos">
                <strong>{user.nombre}</strong>
                <small className={`rol-badge ${COLOR_ROL[user.rol] ?? ''}`}>
                  {user.rol}
                </small>
              </span>
              <button type="button" className="btn btn-fantasma" onClick={salir}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-verde">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
