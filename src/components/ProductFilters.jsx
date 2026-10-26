import { useShallow } from 'zustand/react/shallow'
import { useProductStore } from '../store/useProductStore'

/**
 * Los filtros viven en useProductStore, no en Catalog.
 * Este componente y la lista de productos son ramas distintas del arbol:
 * se comunican por el store, sin props ni prop drilling (ejercicio 5).
 *
 * useShallow: se piden varios valores a la vez. Sin el, el selector
 * devolveria un objeto nuevo en cada render y Zustand 5 podria entrar en
 * un ciclo infinito de renderizados.
 */
export default function ProductFilters({ categories = [] }) {
  const { search, category, setSearch, setCategory, clearFilters } =
    useProductStore(
      useShallow((s) => ({
        search: s.search,
        category: s.category,
        setSearch: s.setSearch,
        setCategory: s.setCategory,
        clearFilters: s.clearFilters,
      })),
    )

  const hayFiltros = search !== '' || category !== 'todas'

  return (
    <div className="filtros">
      <div className="campo-busqueda">
        <span aria-hidden="true">🔎</span>
        <input
          type="search"
          placeholder="Buscar por nombre o categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filtrar por categoria"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === 'todas' ? 'Todas las categorias' : c}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-fantasma"
        onClick={clearFilters}
        disabled={!hayFiltros}
      >
        Limpiar
      </button>
    </div>
  )
}
