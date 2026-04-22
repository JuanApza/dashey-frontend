# DASHEY — Frontend v4

Documentación del panel de administración.

---

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Layout del admin](#layout-del-admin)
- [Vistas del admin](#vistas-del-admin)
- [Correcciones aplicadas](#correcciones-aplicadas)
- [Estructura de archivos final](#estructura-de-archivos-final)

---

## Estado del proyecto

| Sección                      | Estado     |
| ---------------------------- | ---------- |
| Tienda pública completa      | ✓ Completo |
| Panel admin — Layout         | ✓ Completo |
| Panel admin — Dashboard      | ✓ Completo |
| Panel admin — Productos      | ✓ Completo |
| Panel admin — Categorías     | ✓ Completo |
| Panel admin — Pedidos        | ✓ Completo |
| Panel admin — Detalle pedido | ✓ Completo |
| Panel admin — Cupones        | ✓ Completo |
| Panel admin — Reseñas        | ✓ Completo |
| Panel admin — Clientes       | ✓ Completo |
| Formulario de producto       | Pendiente  |

---

## Layout del admin

### `AdminLayout.vue`

Layout contenedor del panel admin. Monta el sidebar y el topbar una sola vez y renderiza las vistas en `<RouterView />`.

**Estructura:**

```
AdminLayout
├── Sidebar (fijo en desktop, drawer en móvil)
│   ├── Logo con link a la tienda
│   ├── Navegación principal
│   └── Footer — volver a tienda / cerrar sesión
├── Overlay móvil (cierra el sidebar al hacer clic)
└── Contenido principal
    ├── Topbar — botón menú móvil, título de página, avatar
    └── <RouterView /> — vista activa
```

**Navegación del sidebar:**

| Ruta                | Label      |
| ------------------- | ---------- |
| `/admin/dashboard`  | Dashboard  |
| `/admin/productos`  | Productos  |
| `/admin/categorias` | Categorías |
| `/admin/pedidos`    | Pedidos    |
| `/admin/cupones`    | Cupones    |
| `/admin/resenas`    | Reseñas    |
| `/admin/usuarios`   | Clientes   |

**El título del topbar** se calcula automáticamente según la ruta activa.

---

## Vistas del admin

### DashboardVista — `/admin/dashboard`

Vista principal del panel con métricas y accesos rápidos.

**Secciones:**

- Métricas — total de pedidos, pedidos pendientes, productos y clientes
- Pedidos recientes — últimos 5 pedidos con nombre del cliente, total y estado
- Accesos rápidos — nuevo producto, ver pedidos, crear cupón, moderar reseñas

**Datos que consume:**

- `pedidosServicio.getListadoAdmin({ limit: 5 })` — pedidos recientes
- `pedidosServicio.getListadoAdmin({ estado: 'pendiente' })` — contador de pendientes

---

### ProductosVista — `/admin/productos`

Listado de todos los productos con filtros y paginación.

**Funcionalidades:**

- Búsqueda por nombre — se ejecuta al presionar Enter
- Filtro por estado (activo/inactivo)
- Filtro por destacado
- Skeleton loading
- Imagen principal, nombre, categoría, marca, precio y colores por producto
- Badge de estado activo/inactivo y destacado
- Botón editar — navega a `/admin/productos/:id/editar`
- Botón toggle — activa o desactiva el producto sin recargar la página
- Paginación con anterior/siguiente

---

### CategoriasVista — `/admin/categorias`

Árbol de categorías con modal de creación y edición.

**Funcionalidades:**

- Muestra categorías raíz y subcategorías anidadas visualmente
- Modal para crear categoría nueva — nombre, categoría padre, descripción, estado
- Modal para editar categoría existente
- Confirmar antes de eliminar
- El slug se genera automáticamente en el backend desde el nombre
- Solo las categorías raíz aparecen como opciones de padre

---

### PedidosVista — `/admin/pedidos`

Listado de todos los pedidos con filtros.

**Funcionalidades:**

- Filtro por estado del pedido
- Filtro por fecha desde y hasta
- Botón para limpiar filtros
- Cada fila muestra: número, cliente, fecha, cantidad de productos, método de pago, total y estado
- Al hacer clic navega al detalle del pedido
- Paginación

---

### PedidoDetalleVista — `/admin/pedidos/:id`

Detalle completo de un pedido con gestión de estado y pago.

**Secciones:**

**Columna principal:**

- Lista de productos con talla, color, SKU y subtotal
- Resumen de totales — subtotal, descuento, envío y total
- Historial de estados en orden cronológico con notas y quién realizó el cambio

**Columna lateral:**

- Selector de nuevo estado con validación de transiciones permitidas
- Textarea para notas del cambio
- Botón confirmar pago — llama a `pagosServicio.confirmarPago()` y actualiza a `confirmado`
- Botón rechazar pago — llama a `pagosServicio.rechazarPago()` y cancela el pedido
- Info del cliente — nombre, email y WhatsApp
- Dirección de envío
- Método de pago y notas del pedido

**Transiciones de estado válidas:**
| Estado actual | Puede pasar a |
|---------------|---------------|
| pendiente | confirmado, cancelado |
| confirmado | preparando, cancelado |
| preparando | enviado |
| enviado | entregado, devuelto |
| entregado | devuelto |
| cancelado | — |
| devuelto | — |

---

### CuponesVista — `/admin/cupones`

Gestión de cupones de descuento con modal.

**Funcionalidades:**

- Listado con código, tipo, valor, usos y estado
- Modal para crear cupón — código, tipo, valor, usos máximos, monto mínimo, expiración, descripción
- Modal para editar — el código y tipo no se pueden cambiar después de creado
- Badge de tipo: azul para porcentaje, púrpura para monto fijo
- Confirmar antes de eliminar
- Paginación

---

### ResenasVista — `/admin/resenas`

Moderación de reseñas de productos.

**Funcionalidades:**

- Filtro por estado — pendientes o aprobadas (por defecto muestra pendientes)
- Cada reseña muestra: estrellas, producto, título, comentario, autor y fecha
- Botón aprobar — disponible solo si la reseña está pendiente
- Botón rechazar — disponible solo si la reseña está aprobada
- Botón eliminar permanentemente
- Los cambios de aprobación se reflejan sin recargar la página
- Paginación

---

### UsuariosVista — `/admin/usuarios`

Listado de clientes registrados.

**Funcionalidades:**

- Avatar con iniciales del nombre
- Nombre, email, teléfono, fecha de registro, estado y rol
- Badge negro para admins
- Paginación

**Endpoint de backend agregado:**

```
GET /api/v1/admin/usuarios
```

Devuelve listado paginado de todos los usuarios ordenados por fecha de registro descendente.

---

## Correcciones aplicadas

### Guard de autenticación con recarga de página

**Problema:** Al recargar directamente una ruta del admin (ej: `/admin/dashboard`), el guard se ejecutaba antes de que `App.vue` cargara el usuario desde el backend, encontraba `authStore.usuario = null` y redirigía al home.

**Solución:** El guard ahora es `async` y espera a cargar el usuario si hay un token en `localStorage` pero el store está vacío:

```js
export const guardsAuth = async (to) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('accessToken')

  if (token && !authStore.usuario) {
    const { cargarUsuario } = useAuth()
    await cargarUsuario()
  }
  // ... resto del guard
}
```

### Login con datos del usuario

**Problema:** El endpoint de login solo devolvía los tokens, no los datos del usuario. El store guardaba `usuario = null` y el header no mostraba el nombre ni el rol correctamente.

**Solución:** Después del login se hace una llamada adicional a `GET /usuarios/me` para obtener los datos del usuario y guardarlos en el store. Si el usuario es admin, redirige automáticamente a `/admin`.

---

## Estructura de archivos final

```
dashey-frontend/
└── src/
    ├── components/
    │   └── layout/
    │       ├── AppLayout.vue
    │       ├── AppHeader.vue
    │       ├── AppFooter.vue
    │       ├── AuthLayout.vue
    │       └── AdminLayout.vue      ← con sidebar y topbar completos
    └── views/
        ├── tienda/                  ← 8 vistas completas
        ├── auth/                    ← login y registro
        └── admin/
            ├── DashboardVista.vue
            ├── ProductosVista.vue
            ├── ProductoFormVista.vue  ← pendiente
            ├── CategoriasVista.vue
            ├── PedidosVista.vue
            ├── PedidoDetalleVista.vue
            ├── CuponesVista.vue
            ├── ResenasVista.vue
            └── UsuariosVista.vue
```

---

> Pendiente: ProductoFormVista — formulario de creación y edición de productos con variantes e imágenes.
