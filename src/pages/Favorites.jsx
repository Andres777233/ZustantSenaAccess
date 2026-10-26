import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { useProductStore } from '../store/useProductStore'

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids)
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites)
  const products = useProductStore((s) => s.products)
  const loading = useProductStore((s) => s.loading)
  const fetchProducts = useProductStore((s) => s.fetchProducts)

  // Dos stores combinados: favoritos (ids) + catálogo (productos).
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const favoritos = useMemo(
    () => products.filter((p) => ids.includes(p.id)),
    [products, ids],
  )

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Favoritos · Tienda SENA</h1>
          <p className="subtitulo">
            Ruta protegida: solo se entra con sesión en <code>useAuthStore</code>.
          </p>
        </div>
        {favoritos.length > 0 && (
          <button type="button" className="btn btn-fantasma" onClick={clearFavorites}>
            Vaciar favoritos
          </button>
        )}
      </header>

      {loading && products.length === 0 && <p className="subtitulo">Cargando…</p>}

      {favoritos.length === 0 && !loading && (
        <div className="vacio">
          <p className="vacio-icono" aria-hidden="true">
            🤍
          </p>
          <h3>Todavía no tienes favoritos</h3>
          <p>Toca el corazón de cualquier producto del catálogo.</p>
          <Link to="/tienda" className="btn btn-verde">
            Ver catálogo
          </Link>
        </div>
      )}

      {favoritos.length > 0 && (
        <div className="grid-productos">
          {favoritos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
