import { Link } from 'react-router-dom'
import { CounterButtons, CounterDisplay } from '../components/Counter'

export default function CounterPage() {
  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Contador</h1>
          <p className="subtitulo">
            Primer store del taller: <code>useCounterStore</code>. Sin Provider y
            sin props entre los dos componentes.
          </p>
        </div>
        <Link to="/devtools" className="btn btn-fantasma">
          Ver historial de acciones
        </Link>
      </header>

      <div className="panel">
        <CounterDisplay />
        <CounterButtons />
        <ul className="lista-notas">
          <li>
            <code>set((state) =&gt; ...)</code> se usa cuando el nuevo valor depende
            del anterior.
          </li>
          <li>
            <code>CounterButtons</code> solo selecciona funciones, por eso no se
            re-renderiza cuando cambia <code>count</code>.
          </li>
          <li>
            El historial de acciones de los stores se ve en{' '}
            <Link to="/devtools">/devtools</Link>.
          </li>
        </ul>
      </div>
    </section>
  )
}
