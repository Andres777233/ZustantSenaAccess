import { useEffect, useMemo } from 'react'
import AmbienteCard from '../components/AmbienteCard'
import { useAmbientesStore } from '../store/useAmbientesStore'

export default function Ambientes() {
  const ambientes = useAmbientesStore((s) => s.ambientes)
  const loading = useAmbientesStore((s) => s.loading)
  const error = useAmbientesStore((s) => s.error)
  const loaded = useAmbientesStore((s) => s.loaded)
  const fetchAmbientes = useAmbientesStore((s) => s.fetchAmbientes)
  const search = useAmbientesStore((s) => s.search)
  const setSearch = useAmbientesStore((s) => s.setSearch)
  const guardados = useAmbientesStore((s) => s.guardados.length)

  useEffect(() => {
    fetchAmbientes()
  }, [fetchAmbientes])

  const filtrados = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ambientes
    return ambientes.filter((a) =>
      [a.nombre, a.instructor, a.sede, a.programa, a.jornada]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [ambientes, search])

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Ambientes</h1>
          <p className="subtitulo">
            {loaded
              ? `${filtrados.length} de ${ambientes.length} ambientes · ${guardados} guardados`
              : 'Cargando ambientes desde el backend…'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-fantasma"
          onClick={() => fetchAmbientes({ force: true })}
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
            placeholder="Buscar por ambiente, instructor, sede o jornada…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar ambientes"
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
          <strong>No se pudieron cargar los ambientes</strong>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => fetchAmbientes({ force: true })}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && ambientes.length === 0 && (
        <div className="esqueletos" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="esqueleto" key={i} />
          ))}
        </div>
      )}

      {!error && loaded && filtrados.length === 0 && (
        <div className="vacio">
          <p className="vacio-icono" aria-hidden="true">
            🔍
          </p>
          <h3>Sin resultados</h3>
          <p>Prueba con otro instructor o sede.</p>
        </div>
      )}

      {filtrados.length > 0 && (
        <div className="grid-productos">
          {filtrados.map((ambiente) => (
            <AmbienteCard key={ambiente.id} ambiente={ambiente} />
          ))}
        </div>
      )}
    </section>
  )
}
