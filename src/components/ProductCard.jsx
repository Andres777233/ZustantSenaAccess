import { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { useFavoritesStore } from '../store/useFavoritesStore'

const precio = (valor) =>
  valor === 0 ? 'Gratis' : `$ ${valor.toLocaleString('es-CO')}`

export default function ProductCard({ product }) {
  // Accion del store: el componente no recibe addItem por props.
  const addItem = useCartStore((s) => s.addItem)

  // Selector booleano: solo se re-renderiza si cambia SU favorito.
  const esFavorito = useFavoritesStore((s) => s.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  // Estado local: solo a esta tarjeta le interesa el "agregado".
  const [agregado, setAgregado] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAgregado(true)
    window.setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <article className="tarjeta">
      <button
        type="button"
        className={`favorito ${esFavorito ? 'activo' : ''}`}
        onClick={() => toggleFavorite(product)}
        aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {esFavorito ? '❤️' : '🤍'}
      </button>

      <div className="tarjeta-icono" aria-hidden="true">
        {product.icon}
      </div>

      <span className="etiqueta">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="precio">{precio(product.price)}</p>

      <div className="tarjeta-pie">
        <small className="stock">Disponibles: {product.stock}</small>
        <button
          type="button"
          className={`btn ${agregado ? 'btn-ok' : 'btn-verde'}`}
          onClick={handleAdd}
        >
          {agregado ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}
