import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CREDENCIALES_DEMO } from '../data/mockApi'
import { useAuthStore } from '../store/useAuthStore'

const COLOR_ROL = {
  Superadmin: 'rol-superadmin',
  Admin: 'rol-admin',
  Instructor: 'rol-instructor',
  Aprendiz: 'rol-aprendiz',
}

export default function Login() {
  // Estado local: solo a este formulario le interesan los inputs.
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  // Estado global: sesión, carga y error viven en useAuthStore.
  const login = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)
  const error = useAuthStore((s) => s.error)
  const token = useAuthStore((s) => s.token)

  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from ?? '/'

  useEffect(() => {
    if (token) navigate(destino, { replace: true })
  }, [token, destino, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const ok = await login(correo, password)
    if (!ok) setPassword('')
  }

  const usarDemo = (credencial) => {
    setCorreo(credencial.email)
    setPassword(credencial.password)
  }

  return (
    <section className="login">
      <div className="login-caja">
        <h1>Ingresar a SenaAccess</h1>
        <p className="subtitulo">
          La sesión se guarda en <code>useAuthStore</code> con{' '}
          <code>persist</code> (solo <code>user</code> y <code>token</code>).
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="aprendiz@sena.edu.co"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
          />

          {error && (
            <p className="aviso error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-verde btn-bloque" disabled={loading}>
            {loading ? 'Verificando…' : 'Entrar'}
          </button>
        </form>

        <div className="demo">
          <p>Cuentas de prueba (contraseña 123456):</p>
          {CREDENCIALES_DEMO.map((c) => (
            <button
              key={c.email}
              type="button"
              className="chip chip-demo"
              onClick={() => usarDemo(c)}
            >
              <span className={`rol-badge ${COLOR_ROL[c.rol] ?? ''}`}>{c.rol}</span>
              {c.email}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
