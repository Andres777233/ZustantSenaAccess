import { useState } from 'react'
import { useAmbientesStore } from '../store/useAmbientesStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEquiposStore } from '../store/useEquiposStore'
import { useExcusasStore } from '../store/useExcusasStore'

const hora = (iso) =>
  new Date(iso).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })

export default function Porteria() {
  const [pin, setPin] = useState('')
  const [resultado, setResultado] = useState(null)

  const user = useAuthStore((s) => s.user)
  const excusas = useExcusasStore((s) => s.excusas)
  const validarPin = useExcusasStore((s) => s.validarPin)
  const loading = useExcusasStore((s) => s.loading)
  const error = useExcusasStore((s) => s.error)

  const ambientes = useAmbientesStore((s) => s.ambientes)
  const equipos = useEquiposStore((s) => s.equipos)

  const pendientes = excusas.filter((e) => e.estado === 'pendiente')

  const handleValidar = async (event) => {
    event.preventDefault()
    setResultado(null)
    const excusa = await validarPin(pin)
    if (excusa) {
      setResultado({
        tipo: 'ok',
        texto: `Salida autorizada · ${excusa.motivo} (${excusa.ambiente})`,
      })
      setPin('')
    }
  }

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Panel de portería</h1>
          <p className="subtitulo">
            Ruta protegida para <strong>Admin</strong> y <strong>Superadmin</strong>:
            el acceso se decide con <code>useAuthStore.hasRole()</code>.
          </p>
        </div>
        <span className="rol-badge rol-admin">{user?.rol}</span>
      </header>

      <div className="kpis">
        <div className="kpi">
          <small>Excusas pendientes</small>
          <strong>{pendientes.length}</strong>
          <span>useExcusasStore</span>
        </div>
        <div className="kpi">
          <small>Ambientes</small>
          <strong>{ambientes.length}</strong>
          <span>useAmbientesStore</span>
        </div>
        <div className="kpi">
          <small>Equipos</small>
          <strong>{equipos.length}</strong>
          <span>useEquiposStore</span>
        </div>
      </div>

      <div className="dos-columnas">
        <div className="panel">
          <h2>Validar salida con PIN</h2>
          <form onSubmit={handleValidar} className="formulario">
            <label htmlFor="pin-porteria">PIN del aprendiz</label>
            <input
              id="pin-porteria"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="1234"
              required
            />
            <button type="submit" className="btn btn-verde" disabled={loading}>
              {loading ? 'Validando…' : 'Registrar salida'}
            </button>
          </form>

          {resultado && <p className="aviso ok">{resultado.texto}</p>}
          {error && (
            <p className="aviso error" role="alert">
              {error}
            </p>
          )}

          <p className="nota">
            El PIN se comparte con el módulo de excusas a través del store, no por
            props entre rutas.
          </p>
        </div>

        <div className="panel">
          <h2>Excusas pendientes</h2>
          {pendientes.length === 0 ? (
            <p className="subtitulo">No hay excusas pendientes.</p>
          ) : (
            <ul className="lista-excusas">
              {pendientes.map((e) => (
                <li key={e.id}>
                  <code>{e.pin}</code>
                  <span>
                    <strong>{e.motivo}</strong>
                    <small>
                      {e.ambiente} · expira {hora(e.expira)}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
