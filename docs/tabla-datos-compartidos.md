# Tabla de datos compartidos (actividad 3.2 – Parte B)

Proyecto: **SenaAccess** (módulo principal) + **Tienda SENA** (práctica de la actividad 3.3).

| Dato o información | Componentes que la usan | ¿Cómo se comparte hoy? | ¿Debería ser global? |
| --- | --- | --- | --- |
| Usuario autenticado (`user`) | Navbar, Login, ProtectedRoute, Portería, Excusas, Inicio | `useAuthStore` (persist) | **Sí.** Lo consultan varias rutas y debe sobrevivir a la recarga. |
| Rol del usuario | Navbar (menú), ProtectedRoute (`roles`), Portería, Excusas | `useAuthStore.user.rol` + `hasRole()` | **Sí.** Decide qué se muestra y qué ruta se permite. |
| Token de sesión | ProtectedRoute, `apiFetch` (servicio) | `useAuthStore` + `getState()` fuera de React | **Sí.** Es la credencial de todas las peticiones y se necesita fuera de los componentes. |
| Ambientes | Inicio, Ambientes, Excusas (selector), Portería | `useAmbientesStore.fetchAmbientes()` (async) | **Sí.** Lo piden cuatro pantallas; cachearlo evita descargar la lista cuatro veces. |
| Búsqueda de ambientes | Input en Ambientes, lista en Ambientes | `useAmbientesStore.search` | **Sí.** Input y lista son hermanos: es el caso típico de estado compartido entre ramas. |
| Ambientes guardados (★) | AmbienteCard, Inicio (KPI), Ambientes (contador) | `useAmbientesStore.guardados` (persist) | **Sí.** Se marcan en una ruta y se cuentan en otra; deben sobrevivir a la recarga. |
| Inventario de equipos | Inicio, Equipos, Portería | `useEquiposStore.fetchEquipos()` (async) | **Sí.** Tres pantallas y una sola descarga. |
| Búsqueda de equipos | Input y lista en Equipos | `useEquiposStore.search` | **Sí.** Input y lista son hermanos. |
| Solicitud de equipos | Navbar (contador), Equipos, SolicitudPanel | `useSolicitudesStore` (persist + devtools) | **Sí.** El contador está en otra rama y la solicitud debe sobrevivir a la recarga. |
| Total de equipos solicitados | Navbar, SolicitudPanel | Selector `reduce` sobre `items` + `totalEquipos()` | **No como estado aparte.** Es un valor derivado; guardarlo obligaría a sincronizarlo a mano. |
| Excusas y PIN | Excusas, Portería, Navbar (pendientes) | `useExcusasStore` (persist) | **Sí.** El PIN se genera en una ruta y se valida en otra; dura 15 minutos y debe sobrevivir a la recarga. |
| `loading` / `error` de cada petición | Ambientes, Equipos, Tienda, Excusas | Stores respectivos | **Sí.** Describen la misma petición; si fueran locales, dos pantallas mostrarían estados distintos. |
| Tema (`dark` / `light`) | Navbar (botón), App (`<body>`), todo el CSS | `useUiStore` (persist) | **Sí.** Lo lee el `<body>` y lo cambia un botón de otra rama. |
| Catálogo de la tienda | Tienda, ProductFilters, Favoritos | `useProductStore.fetchProducts()` (async) | **Sí.** Dos rutas lo consumen. |
| Carrito (práctica 3.3) | Navbar (badge), ProductCard, CartPanel | `useCartStore` (persist + devtools) | **Sí.** Badge y tarjetas están en ramas distintas; debe sobrevivir a la recarga. |
| Favoritos de la tienda | ProductCard, Favoritos | `useFavoritesStore` (persist) | **Sí.** Se marcan en una ruta y se listan en otra. |
| Historial de acciones | Devtools, middleware `withActionLog` | `useActionLogStore` | **Sí (para depuración).** Lo escribe un middleware y lo lee una página; no se persiste. |
| Texto del formulario de excusas | Solo Excusas | `useState` local | **No.** A nadie más le interesa y no debe persistirse. |
| PIN que se digita para validar | Solo Excusas / Portería | `useState` local | **No.** Es un input; el dato real (la excusa) ya está en el store. |
| Correo y contraseña del login | Solo Login | `useState` local | **No.** Nunca debe ir al store ni a localStorage. |
| Aviso “✓ Agregado” de una tarjeta | Solo ProductCard | `useState` local | **No.** Es feedback visual de un componente. |

## Criterio usado

Un dato pasa al store solo si cumple **al menos dos** de estas condiciones:

1. Lo leen o escriben componentes que no son padre e hijo directos.
2. Debe sobrevivir a la navegación entre rutas.
3. Debe sobrevivir a una recarga de la página (justifica `persist`).
4. Se necesita fuera de un componente (servicios, `apiFetch`, middleware).

Si no cumple ninguna, se queda en `useState`.
