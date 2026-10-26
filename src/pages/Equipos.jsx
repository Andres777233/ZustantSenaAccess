import { useEffect, useMemo } from 'react'
import SolicitudPanel from '../components/SolicitudPanel'
import { useEquiposStore } from '../store/useEquiposStore'
import { useSolicitudesStore } from '../store/useSolicitudesStore'

export default function Equipos() {
  const equipos = useEquiposStore((s) => s.equipos)
  const loading = useEquiposStore((s) => s.loading)
  const error = useEquiposStore((s) => s.error)
  const fetchEquipos = useEquiposStore((s) => s.fetchEquipos)
  const search = useEquiposStore((s) => s.search)
  const setSearch = useEquiposStore((s) => s.setSearch)

  const addEquipo = useSolicitudesStore((s) => s.addEquipo)
  const items = useSolicitudesStore((s) => s.items)

  useEffect(() => {
    fetchEquipos()
  }, [fetchEquipos])

  const filtrados = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return equipos
    return equipos.filter((e) =>
      [e.nombre, e.serial, e.categoria, e.estado]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [equipos, search])

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Equipos</h1>
          <p className="subtitulo">
            Inventario del centro de formación y solicitud en curso (se guarda con{' '}
            <code>persist</code>).
          </p>
        </div>
        <button
          type="button"
          className="btn btn-fantasma"
          onClick={() => fetchEquipos({ force: true })}
          disabled={loading}
        >
          {loading ? 'Cargando…' : '↻ Recargar'}
        </button>
      </header>

      <div className="filtros">
        <div className="campo-busqueda">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            placeholder="Buscar por nombre, serial o categoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar equipos"
          />
        </div>
        {search && (
          <button
            type="button"
            className="btn btn-fantasma"
            onClick={() => setSearch('')}
          >
            Limpiar
          </button>
        )}
      </div>

      {error && (
        <div className="aviso error">
          <strong>No se pudieron cargar los equipos</strong>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => fetchEquipos({ force: true })}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="equipos-layout">
        <div>
          {loading && equipos.length === 0 && (
            <div className="esqueletos" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="esqueleto" key={i} />
              ))}
            </div>
          )}

          <div className="grid-productos">
            {filtrados.map((equipo) => {
              const enSolicitud = items.some((i) => i.id === equipo.id)
              return (
                <article className="tarjeta" key={equipo.id}>
                  <div className="tarjeta-icono" aria-hidden="true">
                    {equipo.icon}
                  </div>
                  <span className="etiqueta">{equipo.categoria}</span>
                  <h3>{equipo.nombre}</h3>
                  <div className="tarjeta-datos">
                    <span>🔖 {equipo.serial}</span>
                    <span>👤 {equipo.propietario}</span>
                  </div>
                  <div className="tarjeta-pie">
                    <small className="stock">{equipo.estado}</small>
                    <button
                      type="button"
                      className={`btn ${enSolicitud ? 'btn-ok' : 'btn-verde'}`}
                      onClick={() => addEquipo(equipo)}
                    >
                      {enSolicitud ? '✓ En la solicitud' : 'Agregar'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {!loading && filtrados.length === 0 && (
            <div className="vacio">
              <p className="vacio-icono" aria-hidden="true">
                🔍
              </p>
              <h3>Sin resultados</h3>
              <p>Prueba con otro serial o categoría.</p>
            </div>
          )}
        </div>

        <div className="equipos-panel">
          <h2>Solicitud</h2>
          <SolicitudPanel />
        </div>
      </div>
    </section>
  )
}
