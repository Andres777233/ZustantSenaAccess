/**
 * Simulación del backend de SenaAccess (Laravel).
 *
 * Cada función imita la firma de un endpoint real:
 *   loginRequest      → POST /api/login
 *   crearExcusaRequest→ POST /api/instructor/excusas  (devuelve el PIN de 4 dígitos)
 *   validarExcusaRequest → POST /api/excusas/validar
 *
 * Para conectar el backend de verdad basta con reemplazar el cuerpo por
 * apiFetch(...): los stores no cambian.
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const USUARIOS = [
  {
    email: 'superadmin@sena.edu.co',
    password: '123456',
    nombre: 'Andrés Vargas',
    rol: 'Superadmin',
    documento: '1000000001',
  },
  {
    email: 'portero@sena.edu.co',
    password: '123456',
    nombre: 'Raúl Portería',
    rol: 'Admin',
    documento: '1000000002',
  },
  {
    email: 'instructor@sena.edu.co',
    password: '123456',
    nombre: 'Juan Pablo Ríos',
    rol: 'Instructor',
    documento: '1000000003',
  },
  {
    email: 'aprendiz@sena.edu.co',
    password: '123456',
    nombre: 'Laura Medina',
    rol: 'Aprendiz',
    documento: '1000000004',
  },
]

export async function loginRequest({ email, password }) {
  await wait(600)

  const correo = String(email ?? '').trim().toLowerCase()
  const encontrado = USUARIOS.find(
    (u) => u.email === correo && u.password === password,
  )

  if (!encontrado) {
    throw new Error('Correo o contraseña incorrectos')
  }

  return {
    token: `demo.${btoa(encontrado.email)}.${Date.now()}`,
    user: {
      id: encontrado.documento,
      nombre: encontrado.nombre,
      correo: encontrado.email,
      rol: encontrado.rol,
      documento: encontrado.documento,
    },
  }
}

export async function crearExcusaRequest({ motivo }) {
  await wait(500)
  if (!motivo || motivo.trim().length < 5) {
    throw new Error('El motivo debe tener al menos 5 caracteres')
  }
  const pin = String(Math.floor(1000 + Math.random() * 9000))
  return {
    id: `exc-${Date.now()}`,
    pin,
    motivo: motivo.trim(),
    creada: new Date().toISOString(),
    expira: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  }
}

export async function validarExcusaRequest({ pin }) {
  await wait(400)
  if (!/^\d{4}$/.test(String(pin))) {
    throw new Error('El PIN debe tener 4 dígitos')
  }
  return { pin: String(pin) }
}

export const CREDENCIALES_DEMO = USUARIOS.map(({ email, password, rol }) => ({
  email,
  password,
  rol,
}))
