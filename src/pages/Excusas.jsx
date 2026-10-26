import { useEffect, useState } from 'react'
import { useAmbientesStore } from '../store/useAmbientesStore'
import { useAuthStore } from '../store/useAuthStore'
import { useExcusasStore } from '../store/useExcusasStore'

const hora = (iso) =>
  new Date(iso).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })

export default function Excusas() {
  // Estado local: solo a este formulario le interesan los inputs.
  const [motivo, setMotivo] = useState('')
  const [ambiente, setAmbiente] = useState('')
  const [pin, setPin] = useState('')
  const [aviso, setAviso] = useState(null)

  // Estado global: excusas y PIN viven en useExcusasStore.
  const excusas = useExcusasStore((s) => s.excusas)
  const crearExcusa = useExcusasStore((s) => s.crearExcusa)
  const validarPin = useExcusasStore((s) => s.validarPin)
  const limpiarUsadas = useExcusasStore((s) => s.limpiarUsadas)
  const ultimoPin = useExcusasStore((s) => s.ultimoPin)
  const loading = useExcusasStore((s) => s.loading)
  const error = useExcusasStore((s) => s.error)

  const ambientes = useAmbientesStore((s) => s.ambientes)
  const fetchAmbientes = useAmbientesStore((s) => s.fetchAmbientes)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    fetchAmbientes()
  }, [fetchAmbientes])

  const puedeValidar =
    user?.rol === 'Instructor' ||
    user?.rol === 'Admin' ||
    user?.rol === 'Superadmin'

  const pendientes = excusas.filter((e) => e.estado === 'pendiente')

  const handleCrear = async (event) => {
    event.preventDefault()
    setAviso(null)
    const nuevoPin = await crearExcusa({ motivo, ambiente })
    if (nuevoPin) {
      setAviso({ tipo: 'ok', texto: `PIN ${nuevoPin} generado. Vale 15 minutos.` })
      setMotivo('')
    }
  }

  const handleValidar = async (event) => {
    event.preventDefault()
    setAviso(null)
    const excusa = await validarPin(pin)
    if (excusa) {
      setAviso({
        tipo: 'ok',
        texto: `PIN ${excusa.pin} validado: ${excusa.motivo}`,
      })
      setPin('')
    }
  }

  return (
    <section>
      <header className="cabecera">
        <div>
          <h1>Excusas</h1>
          <p className="subtitulo">
            El PIN se genera en <code>useExcusasStore</code> y sobrevive a la
            recarga con <code>persist</code>.
          </p>
        </div>
      </header>

      <div className="dos-columnas">
        <div className="panel">
          <h2>Nueva excusa</h2>
          <form onSubmit={handleCrear} className="formulario">
            <label htmlFor="ambiente">Ambiente</label>
            <select
              id="ambiente"
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
              required
            >
              <option value="">Selecciona un ambiente…</option>
              {ambientes.map((a) => (
                <option key={a.id} value={a.nombre}>
                  {a.nombre}
                </option>
              ))}
            </select>

            <label htmlFor="motivo">Motivo</label>
            <textarea
              id="motivo"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Cita médica, trámite de matrícula…"
              required
            />

            <button type="submit" className="btn btn-verde" disabled={loading}>
              {loading ? 'Generando…' : 'Generar PIN'}
            </button>
          </form>

          {ultimoPin && (
            <div className="pin-caja">
              <small>Último PIN generado</small>
              <strong>{ultimoPin}</strong>
              <span>Válido por 15 minutos</span>
            </div>
          )}

          {error && (
            <p className="aviso error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="panel">
          <h2>Validar PIN</h2>
          {puedeValidar ? (
            <form onSubmit={handleValidar} className="formulario">
              <label htmlFor="pin">PIN del aprendiz</label>
              <input
                id="pin"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                required
              />
              <button type="submit" className="btn btn-verde" disabled={loading}>
                Validar
              </button>
            </form>
          ) : (
            <p className="subtitulo">
              Solo instructor, portería o superadmin pueden validar un PIN.
            </p>
          )}

          {aviso && (
            <p className={`aviso ${aviso.tipo === 'ok' ? 'ok' : 'error'}`}>
              {aviso.texto}
            </p>
          )}

          <div className="linea">
            <span>Pendientes</span>
            <strong>{pendientes.length}</strong>
          </div>
          <div className="linea">
            <span>Total creadas</span>
            <strong>{excusas.length}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="cabecera">
          <h2>Mis excusas</h2>
          {excusas.some((e) => e.estado !== 'pendiente') && (
            <button
              type="button"
              className="btn btn-fantasma"
              onClick={limpiarUsadas}
            >
              Quitar usadas
            </button>
          )}
        </div>

        {excusas.length === 0 && (
          <p className="subtitulo">Todavía no has generado excusas.</p>
        )}

        {excusas.length > 0 && (
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>PIN</th>
                  <th>Motivo</th>
                  <th>Ambiente</th>
                  <th>Estado</th>
                  <th>Expira</th>
                </tr>
              </thead>
              <tbody>
                {excusas.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <code>{e.pin}</code>
                    </td>
                    <td>{e.motivo}</td>
                    <td>{e.ambiente}</td>
                    <td>
                      <span className={`estado estado-${e.estado}`}>{e.estado}</span>
                    </td>
                    <td>{hora(e.expira)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
