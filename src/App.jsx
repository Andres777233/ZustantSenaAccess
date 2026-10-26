import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Ambientes from './pages/Ambientes'
import Cart from './pages/Cart'
import CounterPage from './pages/CounterPage'
import Devtools from './pages/Devtools'
import Equipos from './pages/Equipos'
import Excusas from './pages/Excusas'
import Favorites from './pages/Favorites'
import Guia from './pages/Guia'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Porteria from './pages/Porteria'
import Tienda from './pages/Tienda'
import { useUiStore } from './store/useUiStore'

export default function App() {
  // El tema es estado global (useUiStore) y se aplica al <body>.
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    document.body.className = `tema-${theme}`
  }, [theme])

  return (
    <BrowserRouter>
      <Navbar />

      <main className="contenedor">
        <Routes>
          {/* SenaAccess */}
          <Route path="/" element={<Inicio />} />
          <Route path="/ambientes" element={<Ambientes />} />
          <Route path="/equipos" element={<Equipos />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/excusas" element={<Excusas />} />
          </Route>

          <Route element={<ProtectedRoute roles={['Admin', 'Superadmin']} />}>
            <Route path="/porteria" element={<Porteria />} />
          </Route>

          {/* Tienda SENA (práctica 3.3) */}
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/carrito" element={<Cart />} />
          <Route path="/tienda/contador" element={<CounterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tienda/favoritos" element={<Favorites />} />
          </Route>

          {/* Documentación y depuración */}
          <Route path="/devtools" element={<Devtools />} />
          <Route path="/guia" element={<Guia />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="pie">
        <p>
          SenaAccess · Práctica de estado global con <strong>Zustand 5</strong> ·
          SENA ADSO 228118 · RAP3
        </p>
      </footer>
    </BrowserRouter>
  )
}
