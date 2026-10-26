const STORES = [
  {
    hook: 'useAuthStore',
    archivo: 'src/store/useAuthStore.js',
    estado: 'user { id, nombre, correo, rol }, token, loading, error',
    acciones: 'login, logout, isAuthenticated, hasRole',
    middleware: 'persist (user + token)',
    usan: 'Navbar, Login, ProtectedRoute, Portería, Excusas',
  },
  {
    hook: 'useAmbientesStore',
    archivo: 'src/store/useAmbientesStore.js',
    estado: 'ambientes, loading, error, loaded, search, guardados',
    acciones: 'fetchAmbientes, setSearch, toggleGuardado',
    middleware: 'persist (guardados)',
    usan: 'Inicio, Ambientes, AmbienteCard, Excusas, Portería',
  },
  {
    hook: 'useEquiposStore',
    archivo: 'src/store/useEquiposStore.js',
    estado: 'equipos, loading, error, loaded, search',
    acciones: 'fetchEquipos, setSearch',
    middleware: '—',
    usan: 'Inicio, Equipos, Portería',
  },
  {
    hook: 'useSolicitudesStore',
    archivo: 'src/store/useSolicitudesStore.js',
    estado: 'items [{ id, nombre, serial, cantidad }]',
    acciones: 'addEquipo, removeEquipo, updateCantidad, clearSolicitud, totalEquipos',
    middleware: 'persist + devtools + withActionLog',
    usan: 'Navbar, Equipos, SolicitudPanel',
  },
  {
    hook: 'useExcusasStore',
    archivo: 'src/store/useExcusasStore.js',
    estado: 'excusas, loading, error, ultimoPin',
    acciones: 'crearExcusa (async), validarPin (async), limpiarUsadas, pendientes',
    middleware: 'persist (excusas)',
    usan: 'Excusas, Portería, Navbar',
  },
  {
    hook: 'useUiStore',
    archivo: 'src/store/useUiStore.js',
    estado: "theme ('dark' | 'light')",
    acciones: 'toggleTheme, setTheme',
    middleware: 'persist (theme)',
    usan: 'Navbar, App',
  },
  {
    hook: 'useProductStore',
    archivo: 'src/store/useProductStore.js',
    estado: 'products, loading, error, loaded, search, category',
    acciones: 'fetchProducts (async), setSearch, setCategory, clearFilters',
    middleware: '—',
    usan: 'Tienda, ProductFilters, Favoritos',
  },
  {
    hook: 'useCartStore',
    archivo: 'src/store/useCartStore.js',
    estado: 'items [{ id, name, price, qty }]',
    acciones: 'addItem, removeItem, updateQty, clearCart, totalItems, totalPrice',
    middleware: 'persist + devtools + withActionLog',
    usan: 'Navbar, ProductCard, CartPanel',
  },
  {
    hook: 'useFavoritesStore',
    archivo: 'src/store/useFavoritesStore.js',
    estado: 'ids[]',
    acciones: 'toggleFavorite, isFavorite, clearFavorites',
    middleware: 'persist (ids)',
    usan: 'ProductCard, Favoritos',
  },
  {
    hook: 'useCounterStore',
    archivo: 'src/store/useCounterStore.js',
    estado: 'count',
    acciones: 'increment, decrement, incrementBy, reset',
    middleware: '—',
    usan: 'CounterDisplay, CounterButtons',
  },
  {
    hook: 'useActionLogStore',
    archivo: 'src/store/actionLog.js',
    estado: 'entries[]',
    acciones: 'push (lo usa withActionLog), clear',
    middleware: '—',
    usan: 'Devtools',
  },
]

const CHECKLIST = [
  ['Zustand instalado y stores en src/store/', 'ok'],
  ['Mínimo dos stores con nombres tipo hook', 'ok'],
  ['Store de autenticación completo (user, token, login, logout, isAuthenticated)', 'ok'],
  ['Acción asíncrona con loading y error (ambientes, equipos, productos, excusas)', 'ok'],
  ['persist justificado y sin datos sensibles', 'ok'],
  ['Componentes leen el estado con selectores (no el store completo)', 'ok'],
  ['Actualizaciones inmutables (spread, map, filter)', 'ok'],
  ['Prop drilling identificado y eliminado', 'ok'],
  ['Las funcionalidades existentes siguen funcionando', 'ok'],
  ['Rama feature/zustand, commits y PR revisado', 'parcial'],
  ['README con la sección "Manejo de estado"', 'ok'],
  ['Sustentación: cada integrante explica los stores', 'parcial'],
]

const ICONO = { ok: '✓', parcial: '!', no: '✗' }

export default function Guia() {
  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Guía de la práctica</h1>
          <p className="subtitulo">
            Stores del proyecto, lista de chequeo y conceptos de la guía (RAP3 ·
            Zustand).
          </p>
        </div>
      </header>

      <div className="panel">
        <h2>Stores del proyecto</h2>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Hook</th>
                <th>Estado</th>
                <th>Acciones</th>
                <th>Middleware</th>
                <th>Componentes</th>
              </tr>
            </thead>
            <tbody>
              {STORES.map((s) => (
                <tr key={s.hook}>
                  <td>
                    <code>{s.hook}</code>
                    <br />
                    <small>{s.archivo}</small>
                  </td>
                  <td>{s.estado}</td>
                  <td>{s.acciones}</td>
                  <td>{s.middleware}</td>
                  <td>{s.usan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <h2>Lista de chequeo (12 criterios)</h2>
        <ul className="checklist">
          {CHECKLIST.map(([texto, estado]) => (
            <li key={texto}>
              <span className={estado === 'ok' ? 'tick' : estado === 'parcial' ? 'parcial' : 'cruz'}>
                {ICONO[estado]}
              </span>
              {texto}
            </li>
          ))}
        </ul>
        <p className="nota">
          Los criterios marcados con “!” dependen de evidencias externas: el Pull
          Request lo revisa otro integrante y la sustentación es oral. El
          historial de acciones para el ejercicio 6 está en la página DevTools.
        </p>
      </div>

      <div className="panel">
        <h2>Estado local vs. estado global</h2>
        <p>
          <strong>Local (useState):</strong> el texto del formulario de excusas, el
          PIN que se escribe para validar, el aviso “✓ Agregado” de una tarjeta.
          Solo le interesan a un componente.
        </p>
        <p>
          <strong>Global (Zustand):</strong> usuario y rol, token, ambientes,
          búsqueda, solicitud de equipos, excusas con su PIN, tema y el carrito de
          la tienda. Los usan varias ramas del árbol y varios de ellos deben
          sobrevivir a la recarga.
        </p>
        <p>
          Antes, <code>App</code> tenía que pasar el usuario a la Navbar y a cada
          ruta protegida, y el PIN viajaba de Excusas a Portería por props entre
          rutas. Hoy cada componente lee el store con un selector.
        </p>
      </div>

      <div className="panel">
        <h2>Documentos de la entrega</h2>
        <ul className="lista-notas">
          <li>
            <code>docs/respuestas.pdf</code> — reflexión 3.1, diagnóstico 3.2A y
            preguntas 3.3.13.
          </li>
          <li>
            <code>docs/arbol-componentes.md</code> — árbol de componentes.
          </li>
          <li>
            <code>docs/tabla-datos-compartidos.md</code> — tabla de datos
            compartidos.
          </li>
          <li>
            <code>docs/captura-devtools.png</code> — historial de acciones
            (ejercicio 6).
          </li>
          <li>
            <code>README.md</code> — sección “Manejo de estado”.
          </li>
        </ul>
      </div>
    </section>
  )
}
