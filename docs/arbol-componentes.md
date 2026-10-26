# Árbol de componentes (actividad 3.2 – Parte B)

```
main.jsx
└── App.jsx                        ← useUiStore (tema) → clase en <body>
    └── BrowserRouter
        ├── Navbar                   ← useAuthStore, useSolicitudesStore, useExcusasStore, useCartStore, useUiStore
        │   ├── Marca (link a /)
        │   ├── Menú
        │   │   ├── Inicio
        │   │   ├── Ambientes
        │   │   ├── Equipos (+ contador de la solicitud)
        │   │   ├── Excusas (+ contador de PIN pendientes)
        │   │   ├── Portería            (solo Admin / Superadmin)
        │   │   ├── Tienda (+ contador del carrito)
        │   │   ├── DevTools
        │   │   └── Guía
        │   └── Acciones
        │       ├── BotónTema           ← useUiStore.toggleTheme
        │       └── Usuario / Ingresar  ← useAuthStore
        ├── Routes
        │   ├── "/"              → Inicio
        │   │   ├── Hero (saludo por rol)
        │   │   ├── KPIs                ← useAmbientesStore, useEquiposStore, useExcusasStore, useSolicitudesStore
        │   │   └── Tabla prop drilling ← estática
        │   ├── "/ambientes"     → Ambientes
        │   │   ├── Buscador            ← useAmbientesStore.setSearch
        │   │   └── AmbienteCard × n    ← useAmbientesStore (guardados, toggleGuardado)
        │   ├── "/equipos"       → Equipos
        │   │   ├── Buscador            ← useEquiposStore.setSearch
        │   │   ├── Tarjeta de equipo × n ← useSolicitudesStore.addEquipo
        │   │   └── SolicitudPanel      ← useSolicitudesStore (items, updateCantidad, removeEquipo, clear)
        │   ├── "/excusas"       → Excusas           [protegida: cualquier rol]
        │   │   ├── Formulario nueva excusa ← useExcusasStore.crearExcusa + useState local
        │   │   ├── Formulario validar PIN  ← useExcusasStore.validarPin
        │   │   └── Tabla de excusas        ← useExcusasStore.excusas
        │   ├── "/porteria"      → Portería          [protegida: Admin | Superadmin]
        │   │   ├── KPIs                ← useExcusasStore, useAmbientesStore, useEquiposStore
        │   │   ├── Validar PIN         ← useExcusasStore.validarPin
        │   │   └── Lista pendientes    ← useExcusasStore
        │   ├── "/tienda"        → Tienda            (actividad 3.3)
        │   │   ├── ProductFilters      ← useProductStore + useShallow
        │   │   └── ProductCard × n     ← useCartStore.addItem, useFavoritesStore
        │   ├── "/tienda/carrito"   → Cart → CartPanel        ← useCartStore
        │   ├── "/tienda/contador"  → CounterPage
        │   │   ├── CounterDisplay      ← useCounterStore.count
        │   │   └── CounterButtons      ← useCounterStore (acciones)
        │   ├── "/tienda/favoritos" → Favorites      [protegida: cualquier rol]
        │   ├── "/devtools"      → Devtools          ← useActionLogStore (+ demo de acciones)
        │   ├── "/guia"          → Guía
        │   └── "/login"         → Login             ← useAuthStore + useState local
        ├── ProtectedRoute           ← useAuthStore.token y user.rol
        └── Footer
```

## Lectura del árbol

- **Ramas independientes:** la `Navbar` y las páginas no comparten padre directo con los datos;
  antes el usuario y el contador tenían que subir hasta `App` y bajar por props. Hoy cada una lee
  el store con un selector.
- **Props que quedan (y están bien):** `product` en `ProductCard`, `ambiente` en `AmbienteCard` y
  `roles` en `ProtectedRoute`. Son datos que el padre ya tiene y el hijo usa directamente; no
  atraviesan componentes intermedios, así que no hay prop drilling.
- **Estado local:** el texto del formulario de excusas, el PIN que se digita, el aviso “✓ Agregado”
  de una tarjeta y los inputs del login. A nadie más le sirven y no deben persistirse.
- **Estado global:** sesión y rol, ambientes y búsqueda, equipos, solicitud, excusas con PIN, tema,
  catálogo, carrito, favoritos y el log de acciones.
