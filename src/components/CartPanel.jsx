import { Link } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'

const precio = (valor) => `$ ${valor.toLocaleString('es-CO')}`

export default function CartPanel() {
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  // Valores derivados calculados con selector (se recalculan al cambiar items).
  const totalItems = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.qty, 0),
  )
  const totalPrice = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.price * i.qty, 0),
  )

  if (items.length === 0) {
    return (
      <div className="vacio">
        <p className="vacio-icono" aria-hidden="true">
          🧺
        </p>
        <h3>Tu carrito esta vacio</h3>
        <p>Agrega productos desde el catalogo para verlos aqui.</p>
        <Link to="/" className="btn btn-verde">
          Ir al catalogo
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
              <strong>{item.name}</strong>
              <small>
                {precio(item.price)} · {item.category}
              </small>
            </div>

            <div className="cantidad" role="group" aria-label={`Cantidad de ${item.name}`}>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.qty - 1)}
                aria-label="Quitar una unidad"
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.qty + 1)}
                aria-label="Agregar una unidad"
              >
                +
              </button>
            </div>

            <span className="carrito-subtotal">{precio(item.price * item.qty)}</span>

            <button
              type="button"
              className="btn-icono peligro"
              onClick={() => removeItem(item.id)}
              aria-label={`Eliminar ${item.name}`}
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <aside className="carrito-resumen">
        <h3>Resumen</h3>
        <div className="linea">
          <span>Productos</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="linea">
          <span>Envio</span>
          <strong>Gratis</strong>
        </div>
        <div className="linea total">
          <span>Total</span>
          <strong>{precio(totalPrice)}</strong>
        </div>

        <button type="button" className="btn btn-verde btn-bloque">
          Finalizar compra
        </button>
        <button
          type="button"
          className="btn btn-fantasma btn-bloque"
          onClick={clearCart}
        >
          Vaciar carrito
        </button>

        <p className="nota">
          Recarga la pagina: el carrito sigue ahi gracias a{' '}
          <code>persist</code> (localStorage → <code>tienda-sena-cart</code>).
        </p>
      </aside>
    </div>
  )
}
