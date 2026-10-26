import { useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { useProductStore } from '../store/useProductStore'

export default function Tienda() {
  const products = useProductStore((s) => s.products)
  const loading = useProductStore((s) => s.loading)
  const error = useProductStore((s) => s.error)
  const loaded = useProductStore((s) => s.loaded)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const search = useProductStore((s) => s.search)
  const category = useProductStore((s) => s.category)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const categories = useMemo(
    () => ['todas', ...new Set(products.map((p) => p.category))],
    [products],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((p) => {
      const coincideTexto =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      const coincideCategoria = category === 'todas' || p.category === category
      return coincideTexto && coincideCategoria
    })
  }, [products, search, category])

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Tienda SENA</h1>
          <p className="subtitulo">
            Actividad 3.3 · catálogo, carrito, favoritos, tema y filtros con Zustand.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-fantasma"
          onClick={() => fetchProducts({ force: true })}
          disabled={loading}
        >
          {loading ? 'Cargando…' : '↻ Recargar'}
        </button>
      </header>

      <ProductFilters categories={categories} />

      <p className="subtitulo">
        {loaded ? `${filtered.length} de ${products.length} productos` : 'Cargando productos…'}
      </p>

      {error && (
        <div className="aviso error">
          <strong>No se pudo cargar el catálogo</strong>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => fetchProducts({ force: true })}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && products.length === 0 && (
        <div className="esqueletos" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="esqueleto" key={i} />
          ))}
        </div>
      )}

      {!error && loaded && filtered.length === 0 && (
        <div className="vacio">
          <p className="vacio-icono" aria-hidden="true">
            🔍
          </p>
          <h3>Sin resultados</h3>
          <p>Prueba con otro nombre o cambia la categoría.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid-productos">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
