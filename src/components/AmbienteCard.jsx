import { useAmbientesStore } from '../store/useAmbientesStore'

export default function AmbienteCard({ ambiente }) {
  const guardado = useAmbientesStore((s) => s.guardados.includes(ambiente.id))
  const toggleGuardado = useAmbientesStore((s) => s.toggleGuardado)

  return (
    <article className="tarjeta">
      <button
        type="button"
        className={`favorito ${guardado ? 'activo' : ''}`}
        onClick={() => toggleGuardado(ambiente.id)}
        aria-label={guardado ? 'Quitar de guardados' : 'Guardar ambiente'}
        title={guardado ? 'Quitar de guardados' : 'Guardar ambiente'}
      >
        {guardado ? '★' : '☆'}
      </button>

      <div className="tarjeta-icono" aria-hidden="true">
        {ambiente.icon}
      </div>

      <span className="etiqueta">{ambiente.programa}</span>
      <h3>{ambiente.nombre}</h3>
      <span className="chip-jornada">{ambiente.jornada}</span>

      <div className="tarjeta-datos">
        <span>👩‍🏫 {ambiente.instructor}</span>
        <span>📍 {ambiente.sede}</span>
      </div>

      <div className="tarjeta-pie">
        <small className="stock">Capacidad: {ambiente.capacidad} aprendices</small>
      </div>
    </article>
  )
}
