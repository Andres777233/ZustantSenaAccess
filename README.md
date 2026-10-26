# SenaAccess · Zustand

Práctica del **RAP3 – Crear componentes Frontend** (Tecnólogo en Análisis y Desarrollo de
Software, código 228118) sobre **estado global en React** con **Zustand 5**, **React 19** y
**Vite**.

El repositorio tiene dos módulos en una sola app:

| Módulo | Rutas | Para qué |
| --- | --- | --- |
| **SenaAccess** | `/`, `/ambientes`, `/equipos`, `/excusas`, `/porteria` | Actividad 3.4: stores del proyecto (sesión con roles, ambientes, equipos, excusas con PIN). |
| **Tienda SENA** | `/tienda`, `/tienda/carrito`, `/tienda/favoritos`, `/tienda/contador` | Actividad 3.3: catálogo, carrito, favoritos, tema y filtros, tal como los pide la guía. |

Además: `/devtools` (historial de acciones, ejercicio 6) y `/guia` (resumen de stores y lista de
chequeo).

---

## 1. Cómo ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle de producción en dist/
npm run preview  # sirve el bundle
```

El catálogo, los ambientes y los equipos se cargan de archivos locales (`public/products.json`,
`public/data/*.json`). Si existe un backend real (Express o Laravel) con `GET /products`,
`GET /ambientes` y `GET /equipos`, basta con crear un `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Los stores cambian de origen sin tocar ningún componente.

## 2. Cuentas de prueba

| Correo | Contraseña | Rol | Qué puede hacer |
| --- | --- | --- | --- |
| `superadmin@sena.edu.co` | `123456` | Superadmin | Todo, incluido `/porteria` |
| `portero@sena.edu.co` | `123456` | Admin | Panel de portería (validar PIN) |
| `instructor@sena.edu.co` | `123456` | Instructor | Ambientes, equipos, excusas y validar PIN |
| `aprendiz@sena.edu.co` | `123456` | Aprendiz | Ambientes, equipos, excusas |

Sin sesión se puede ver el catálogo, los ambientes y el inventario; `/excusas`, `/porteria` y
`/tienda/favoritos` están protegidas.

---

## 3. Estructura

```
src/
├── components/
│   ├── Navbar.jsx            # menú por rol, contadores y tema (solo selectores)
│   ├── ProtectedRoute.jsx    # token + roles desde useAuthStore
│   ├── AmbienteCard.jsx      # ambiente + botón ★ (guardados)
│   ├── SolicitudPanel.jsx    # solicitud de equipos: +/-, quitar, vaciar, totales
│   ├── ProductCard.jsx       # tienda: carrito y favoritos
│   ├── ProductFilters.jsx    # tienda: búsqueda + categoría (useShallow)
│   ├── CartPanel.jsx         # tienda: carrito
│   └── Counter.jsx           # CounterDisplay + CounterButtons
├── pages/
│   ├── Inicio.jsx            # dashboard con KPIs de cuatro stores
│   ├── Ambientes.jsx         # async + búsqueda compartida
│   ├── Equipos.jsx           # inventario + solicitud
│   ├── Excusas.jsx           # crear excusa (PIN) y validar PIN
│   ├── Porteria.jsx          # ruta protegida Admin/Superadmin
│   ├── Tienda.jsx            # catálogo (actividad 3.3)
│   ├── Cart.jsx
│   ├── Favorites.jsx
│   ├── CounterPage.jsx
│   ├── Devtools.jsx          # historial de acciones
│   ├── Guia.jsx
│   └── Login.jsx
├── store/
│   ├── useAuthStore.js
│   ├── useAmbientesStore.js
│   ├── useEquiposStore.js
│   ├── useSolicitudesStore.js
│   ├── useExcusasStore.js
│   ├── useUiStore.js
│   ├── useProductStore.js
│   ├── useCartStore.js
│   ├── useFavoritesStore.js
│   ├── useCounterStore.js
│   └── actionLog.js          # useActionLogStore + middleware withActionLog
├── services/api.js           # apiFetch: lee el token con getState()
├── data/mockApi.js           # login y excusas simulados (firma de los endpoints)
├── App.jsx                   # rutas + tema en el <body>
├── main.jsx
└── styles.css
docs/
├── respuestas.pdf            # 3.1 + 3.2A + 3.3.13
├── arbol-componentes.md
├── tabla-datos-compartidos.md
├── captura-devtools.png      # ejercicio 6
├── captura-inicio.png
├── captura-ambientes.png
└── captura-tienda.png
```

---

## 4. Manejo de estado

Regla aplicada en todo el proyecto: **`useState` para lo que le interesa a un componente y
Zustand para lo que comparten varias ramas del árbol**. Todos los componentes leen el store con
**selectores** (`useCartStore((s) => s.items)`), nunca con `useStore()` sin argumentos, y todas
las actualizaciones son **inmutables** (`spread`, `map`, `filter`).

### 4.1 Resumen de stores

| Store | Propósito | Estado | Acciones | Middleware |
| --- | --- | --- | --- | --- |
| `useAuthStore` | Sesión y rol | `user`, `token`, `loading`, `error` | `login`, `logout`, `isAuthenticated`, `hasRole` | `persist` (user + token) |
| `useAmbientesStore` | Ambientes y búsqueda | `ambientes`, `loading`, `error`, `loaded`, `search`, `guardados` | `fetchAmbientes`, `setSearch`, `toggleGuardado` | `persist` (guardados) |
| `useEquiposStore` | Inventario | `equipos`, `loading`, `error`, `loaded`, `search` | `fetchEquipos`, `setSearch` | — |
| `useSolicitudesStore` | Solicitud de equipos | `items` | `addEquipo`, `removeEquipo`, `updateCantidad`, `clearSolicitud`, `totalEquipos` | `persist` + `devtools` + `withActionLog` |
| `useExcusasStore` | Excusas con PIN | `excusas`, `loading`, `error`, `ultimoPin` | `crearExcusa`, `validarPin`, `limpiarUsadas`, `pendientes` | `persist` (excusas) |
| `useUiStore` | Tema | `theme` | `toggleTheme`, `setTheme` | `persist` (theme) |
| `useProductStore` | Catálogo de la tienda | `products`, `loading`, `error`, `loaded`, `search`, `category` | `fetchProducts`, `setSearch`, `setCategory`, `clearFilters` | — |
| `useCartStore` | Carrito de la tienda | `items` | `addItem`, `removeItem`, `updateQty`, `clearCart`, `totalItems`, `totalPrice` | `persist` + `devtools` + `withActionLog` |
| `useFavoritesStore` | Favoritos de la tienda | `ids` | `toggleFavorite`, `isFavorite`, `clearFavorites` | `persist` (ids) |
| `useCounterStore` | Ejemplo base | `count` | `increment`, `decrement`, `incrementBy`, `reset` | — |
| `useActionLogStore` | Historial de acciones | `entries` | `push`, `clear` | — |

### 4.2 Detalle

**`useAuthStore`** — `login(correo, password)` es async: pone `loading`, guarda `user` y `token` o
el mensaje real del error. `hasRole('Admin', 'Superadmin')` lo usan la Navbar (para mostrar
“Portería”) y `ProtectedRoute` (para bloquear la ruta). `persist` con `partialize` guarda **solo**
`user` y `token`; la contraseña nunca toca el store.

**`useAmbientesStore`** — `fetchAmbientes()` usa `apiFetch`, valida `res.ok` y guarda el mensaje
del servidor en `error`; evita descargas duplicadas con `loading` y `loaded`. `search` es el
ejemplo de estado compartido entre ramas: el input y la lista están en la misma página, pero el
dato no viaja por props. `guardados` se persiste porque el usuario espera encontrar sus ambientes
marcados al volver.

**`useEquiposStore`** — mismo patrón async; `search` filtra por nombre, serial, categoría o estado.

**`useSolicitudesStore`** — reemplaza el “carrito” en el dominio del proyecto. `addEquipo` busca
el equipo: si existe crea un arreglo nuevo con `map` y `cantidad + 1`, si no usa
`[...items, { ...equipo, cantidad: 1 }]`. `updateCantidad` filtra las cantidades en 0 (bajar a 0
equivale a quitar). Los totales se calculan con `get()` o con un selector `reduce`; no se guardan
como estado.

**`useExcusasStore`** — dos acciones async: `crearExcusa` devuelve el PIN de 4 dígitos (15 min) y
`validarPin` comprueba que exista, que siga pendiente y que no haya expirado; si todo está bien la
marca como `usada`. `persist` guarda solo `excusas` (el `loading` no tiene sentido en disco).
Así el PIN generado en `/excusas` se puede validar en `/porteria` aunque se recargue la página.

**`useUiStore`** — `theme` con `persist`; `App` aplica `document.body.className = 'tema-' + theme`.

**`useProductStore`** — catálogo de la práctica 3.3 con `search` y `category` globales.

**`useCartStore`** — carrito de la práctica: `persist` + `devtools` (acciones `cart/*`) +
`withActionLog`.

**`useFavoritesStore`** — guarda solo los `ids`; los datos del producto ya viven en
`useProductStore`.

**`useCounterStore`** — el store mínimo de la guía: `CounterButtons` solo selecciona funciones,
por eso no se re-renderiza al cambiar `count`.

**`useActionLogStore` + `withActionLog`** — middleware propio: envuelve `set()` y registra cada
acción con su nombre y hora. Es la evidencia del ejercicio 6 visible en `/devtools` (y equivale a
lo que muestra la extensión Redux DevTools).

### 4.3 Selectores, `useShallow` y valores derivados

- Cada dato se pide por separado: `const items = useCartStore((s) => s.items)`.
- `ProductFilters` pide cinco valores a la vez y usa `useShallow`
  (`zustand/react/shallow`): sin él, el selector devolvería un objeto nuevo en cada render y
  Zustand 5 podría entrar en un ciclo infinito.
- Los arreglos derivados (productos filtrados, ambientes filtrados, categorías) se calculan con
  `useMemo`; los escalares (totales) con un selector `reduce`.

### 4.4 Prop drilling eliminado

| Antes (props) | Ahora (store) |
| --- | --- |
| `App` → `Navbar` con el usuario y el rol | `Navbar` lee `useAuthStore` |
| `App` → `ProtectedRoute` con `user`/`token` | `ProtectedRoute` lee `useAuthStore` |
| `App` → `Ambientes` → lista con los ambientes | `useAmbientesStore` |
| Input de búsqueda → lista (ambientes/equipos) | `useAmbientesStore.search` / `useEquiposStore.search` |
| `Equipos` → panel con la solicitud | `useSolicitudesStore` |
| `Excusas` → `Portería` con el PIN (entre rutas) | `useExcusasStore` |
| `App` → `body` con el tema | `App` lee `useUiStore` |
| `Catalog` → `ProductFilters` con `search`/`setSearch` | `useProductStore` |
| `Navbar` con el contador del carrito | `Navbar` lee `useCartStore` |

---

## 5. Persistencia

| Clave en `localStorage` | Store | Qué guarda |
| --- | --- | --- |
| `senaaccess-auth` | `useAuthStore` | `user`, `token` |
| `senaaccess-ambientes` | `useAmbientesStore` | `guardados` |
| `senaaccess-solicitud` | `useSolicitudesStore` | `items` |
| `senaaccess-excusas` | `useExcusasStore` | `excusas` (PIN pendientes) |
| `tienda-sena-cart` | `useCartStore` | `items` |
| `tienda-sena-favoritos` | `useFavoritesStore` | `ids` |
| `tienda-sena-ui` | `useUiStore` | `theme` |

Para comprobarlo: **F12 → Application → Local Storage** o
`localStorage.getItem('senaaccess-solicitud')` en la consola.

> **Seguridad:** no se guardan contraseñas. El token queda en `localStorage` porque es una práctica
> académica; en producción se prefieren cookies `httpOnly` emitidas por el backend.

---

## 6. Acciones asíncronas y backend real

| Acción | Endpoint que simula | Hoy |
| --- | --- | --- |
| `useAuthStore.login` | `POST /api/login` | `src/data/mockApi.js` (600 ms) |
| `useAmbientesStore.fetchAmbientes` | `GET /api/ambientes` | `public/data/ambientes.json` o `VITE_API_URL` |
| `useEquiposStore.fetchEquipos` | `GET /api/equipos` | `public/data/equipos.json` o `VITE_API_URL` |
| `useExcusasStore.crearExcusa` | `POST /api/instructor/excusas` | `mockApi.js` (genera PIN) |
| `useExcusasStore.validarPin` | `POST /api/excusas/validar` | `mockApi.js` |
| `useProductStore.fetchProducts` | `GET /api/products` | `public/products.json` o `VITE_API_URL` |

Todas manejan `loading` y `error`; `apiFetch` agrega el token con `getState()` y cierra la sesión
si el backend responde 401.

---

## 7. DevTools y evidencias

- **Página `/devtools`**: historial de acciones de `useCartStore` y `useSolicitudesStore` con
  nombre (`cart/addItem`, `solicitud/updateCantidad`…), hora y resumen del estado.
- **`/devtools?demo=1`** ejecuta acciones de ejemplo automáticamente.
- **Captura**: `docs/captura-devtools.png` (8 acciones registradas).
- **Extensión Redux DevTools**: instalar, abrir `F12 → Redux` y repetir el flujo; los stores
  `CartStore` y `SolicitudesStore` aparecen con el mismo historial.

---

## 8. Ejercicios de la actividad 3.3

| N.° | Ejercicio | Dónde está resuelto |
| --- | --- | --- |
| 1 | Tienda SENA con catálogo desde API, carrito con total y persistencia | `useProductStore`, `useCartStore`, `Tienda`, `ProductCard` |
| 2 | `CartPanel.jsx` con +/-, eliminar y vaciar | `src/components/CartPanel.jsx` |
| 3 | `useFavoritesStore` + corazón + página de favoritos | `useFavoritesStore`, `ProductCard`, `Favorites` |
| 4 | `useUiStore` con tema persistido y clase en `<body>` | `useUiStore`, `App`, `Navbar` |
| 5 | Filtro por texto y categoría compartido entre componentes | `useProductStore` + `ProductFilters` + `Tienda` |
| 6 | Carrito conectado a DevTools + captura del historial | `useCartStore` (`devtools`), `/devtools`, `docs/captura-devtools.png` |

---

## 9. Lista de chequeo (12 criterios)

| N.° | Criterio | Estado |
| --- | --- | --- |
| 1 | Zustand instalado y stores en `src/store/` | ✅ (11 stores) |
| 2 | Mínimo dos stores con nombres tipo hook | ✅ |
| 3 | Store de autenticación completo | ✅ `useAuthStore` |
| 4 | Acción asíncrona con `loading` y `error` | ✅ ambientes, equipos, productos, excusas, login |
| 5 | `persist` justificado y sin datos sensibles | ✅ 7 claves, sin contraseñas |
| 6 | Lectura con selectores, no el store completo | ✅ en todos los componentes |
| 7 | Actualizaciones inmutables | ✅ `spread` / `map` / `filter` |
| 8 | Prop drilling eliminado | ✅ ver 4.4 |
| 9 | Funcionalidades existentes intactas | ✅ build y rutas verificadas |
| 10 | Rama `feature/zustand`, commits y PR revisado | ⚠️ el repositorio quedó con **un único commit `zustand` en `main`**; falta la rama y el PR (ver sección 11) |
| 11 | README con “Manejo de estado” | ✅ esta sección |
| 12 | Sustentación de los stores | ⚠️ pendiente la exposición oral (el material está en `/guia`) |

---

## 10. Documentos de la entrega

- [`docs/respuestas.pdf`](docs/respuestas.pdf) — actividad 3.1, diagnóstico 3.2A y preguntas 3.3.13.
- [`docs/respuestas.md`](docs/respuestas.md) / `docs/respuestas.html` — misma información en Markdown y HTML.
- [`docs/arbol-componentes.md`](docs/arbol-componentes.md) — árbol de componentes.
- [`docs/tabla-datos-compartidos.md`](docs/tabla-datos-compartidos.md) — tabla de datos compartidos.
- `docs/captura-*.png` — capturas de Inicio, Ambientes, Tienda y DevTools.

Para regenerar el PDF:

```bash
node scripts/md-a-html.mjs
# luego, con Edge/Chrome:
msedge --headless --print-to-pdf-no-header --print-to-pdf=docs/respuestas.pdf docs/respuestas.html
```

---

## 11. Git

El repositorio quedó con **un único commit** (`zustand`) en `main`. Para cumplir el criterio 10 de
la guía (rama + PR revisado) se puede hacer:

```bash
git checkout -b feature/zustand
git commit --allow-empty -m "feat: agrega store de favoritos"
git push origin feature/zustand
# abrir el Pull Request en GitHub y pedir la revisión de otro integrante
```

---

## 12. Referencias

- Zustand — <https://zustand.docs.pmnd.rs>
- React (manejo de estado) — <https://react.dev/learn/managing-state>
- Vite — <https://vite.dev/guide/>
