import { Link } from 'react-router-dom'
import CartPanel from '../components/CartPanel'

export default function Cart() {
  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Carrito · Tienda SENA</h1>
          <p className="subtitulo">
            Estado global de <code>useCartStore</code> (persist + devtools).
          </p>
        </div>
        <Link to="/tienda" className="btn btn-fantasma">
          ← Seguir comprando
        </Link>
      </header>

      <CartPanel />
    </section>
  )
}
