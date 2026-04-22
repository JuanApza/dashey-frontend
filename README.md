# DASHEY — Frontend v1

Documentación de la configuración inicial, arquitectura y componentes base del frontend.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Arquitectura](#arquitectura)
- [Stores Pinia](#stores-pinia)
- [Composables](#composables)
- [Servicios](#servicios)
- [Componentes UI base](#componentes-ui-base)
- [Utilidades](#utilidades)
- [Variables de entorno](#variables-de-entorno)

---

## Stack tecnológico

| Paquete                 | Uso                      |
| ----------------------- | ------------------------ |
| Vue 3 + Composition API | Framework principal      |
| Vue Router 4            | Navegación y rutas       |
| Pinia                   | Manejo de estado global  |
| PrimeVue                | Componentes UI avanzados |
| Tailwind CSS            | Estilos y utilidades     |
| Axios                   | Llamadas al backend      |

---

## Requisitos previos

- Node.js 18 o superior
- Backend DASHEY corriendo en `http://localhost:3000`

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/dashey-frontend.git
cd dashey-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WHATSAPP=51999999999
```

### 4. Arrancar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## Arquitectura

El proyecto sigue una arquitectura por capas con separación clara de responsabilidades:

```
Vistas (páginas)
     ↓
Composables (lógica reutilizable)
     ↓
Stores Pinia (estado global)
     ↓
Servicios Axios (llamadas al backend)
     ↓
Backend DASHEY API
```

### Estructura de carpetas

```
dashey-frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # estilos globales + variables CSS
│   │
│   ├── components/
│   │   ├── ui/                   # átomos reutilizables
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseSpinner.vue
│   │   │   └── BaseAlert.vue
│   │   ├── layout/               # estructura de página
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppBreadcrumb.vue
│   │   │   ├── AppLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── AdminLayout.vue
│   │   ├── catalogo/             # componentes del catálogo
│   │   │   ├── ProductoCard.vue
│   │   │   ├── ProductoGaleria.vue
│   │   │   ├── ProductoVariantes.vue
│   │   │   ├── ProductoResenas.vue
│   │   │   ├── FiltroCategoria.vue
│   │   │   ├── FiltroTalla.vue
│   │   │   ├── FiltroColor.vue
│   │   │   ├── FiltroPrecio.vue
│   │   │   └── FiltrosPanel.vue
│   │   ├── carrito/
│   │   │   ├── CartDrawer.vue
│   │   │   ├── CartItem.vue
│   │   │   └── CartResumen.vue
│   │   └── checkout/
│   │       ├── CheckoutDireccion.vue
│   │       ├── CheckoutMetodoPago.vue
│   │       ├── CheckoutCupon.vue
│   │       └── CheckoutResumen.vue
│   │
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── useCarrito.js
│   │   ├── useFiltros.js
│   │   ├── usePagination.js
│   │   └── useWhatsapp.js
│   │
│   ├── stores/
│   │   ├── auth.store.js
│   │   ├── carrito.store.js
│   │   ├── catalogo.store.js
│   │   └── ui.store.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── categorias.service.js
│   │   ├── productos.service.js
│   │   ├── pedidos.service.js
│   │   ├── cupones.service.js
│   │   └── pagos.service.js
│   │
│   ├── views/
│   │   ├── tienda/
│   │   │   ├── HomeVista.vue
│   │   │   ├── CatalogoVista.vue
│   │   │   ├── ProductoVista.vue
│   │   │   ├── CarritoVista.vue
│   │   │   ├── CheckoutVista.vue
│   │   │   ├── PedidosVista.vue
│   │   │   ├── PedidoDetalleVista.vue
│   │   │   └── PagoVista.vue
│   │   ├── auth/
│   │   │   ├── LoginVista.vue
│   │   │   └── RegistroVista.vue
│   │   └── NotFoundVista.vue
│   │
│   ├── router/
│   │   ├── index.js
│   │   └── guards.js
│   │
│   └── utils/
│       └── formato.js
│
├── index.html
├── vite.config.js
├── .env
└── .env.example
```

### Convenciones de nombrado

| Tipo        | Convención               | Ejemplo                |
| ----------- | ------------------------ | ---------------------- |
| Componentes | PascalCase               | `ProductoCard.vue`     |
| Composables | camelCase con `use`      | `useCarrito.js`        |
| Stores      | camelCase con `.store`   | `carrito.store.js`     |
| Servicios   | camelCase con `.service` | `productos.service.js` |
| Vistas      | PascalCase con `Vista`   | `HomeVista.vue`        |
| Utils       | camelCase                | `formato.js`           |

---

## Stores Pinia

### `auth.store.js`

Maneja el estado de autenticación del usuario.

| Estado    | Tipo           | Descripción                   |
| --------- | -------------- | ----------------------------- |
| `usuario` | Object \| null | Datos del usuario autenticado |
| `token`   | String \| null | Access token JWT              |

| Getter            | Tipo    | Descripción            |
| ----------------- | ------- | ---------------------- |
| `estaAutenticado` | Boolean | Si hay un token válido |
| `esAdmin`         | Boolean | Si el rol es admin     |

| Acción           | Descripción                                      |
| ---------------- | ------------------------------------------------ |
| `setAuth(data)`  | Guarda usuario y tokens en estado y localStorage |
| `cerrarSesion()` | Limpia estado y localStorage                     |

---

### `carrito.store.js`

Maneja el carrito de compras. Persiste en `localStorage` automáticamente.

| Estado    | Tipo    | Descripción                           |
| --------- | ------- | ------------------------------------- |
| `items`   | Array   | Productos en el carrito               |
| `abierto` | Boolean | Si el drawer del carrito está visible |

| Getter       | Tipo    | Descripción                  |
| ------------ | ------- | ---------------------------- |
| `totalItems` | Number  | Suma de cantidades           |
| `subtotal`   | Number  | Suma de precios × cantidades |
| `estaVacio`  | Boolean | Si no hay items              |

| Acción                                     | Descripción                                                   |
| ------------------------------------------ | ------------------------------------------------------------- |
| `agregar(producto, variante, cantidad)`    | Agrega o incrementa un item — retorna `false` si no hay stock |
| `quitar(varianteId)`                       | Elimina un item del carrito                                   |
| `actualizarCantidad(varianteId, cantidad)` | Cambia la cantidad de un item                                 |
| `vaciar()`                                 | Elimina todos los items                                       |
| `abrirDrawer()`                            | Abre el drawer del carrito                                    |
| `cerrarDrawer()`                           | Cierra el drawer                                              |
| `toggleDrawer()`                           | Alterna el estado del drawer                                  |

**Estructura de un item en el carrito:**

```js
{
  varianteId:      'uuid',
  productoId:      'uuid',
  productoNombre:  'Polo Clásico',
  productoSlug:    'polo-clasico',
  talla:           'M',
  color:           'Blanco',
  codigoHex:       '#FFFFFF',
  sku:             'POLO-BLA-M-001',
  precio:          49.90,
  imagen:          '/uploads/productos/...',
  cantidad:        2,
  stockDisponible: 15,
}
```

---

### `catalogo.store.js`

Maneja productos, categorías y filtros del catálogo.

| Estado       | Tipo           | Descripción                 |
| ------------ | -------------- | --------------------------- |
| `categorias` | Array          | Árbol de categorías         |
| `productos`  | Array          | Listado actual de productos |
| `producto`   | Object \| null | Producto en detalle         |
| `cargando`   | Boolean        | Estado de carga             |
| `paginacion` | Object \| null | Metadata de paginación      |
| `filtros`    | Object         | Filtros activos             |

| Getter           | Descripción                        |
| ---------------- | ---------------------------------- |
| `filtrosActivos` | Filtros con valor distinto de null |
| `tieneFiltros`   | Si hay algún filtro activo         |

| Acción                  | Descripción                              |
| ----------------------- | ---------------------------------------- |
| `getCategorias()`       | Carga el árbol de categorías             |
| `getProductos()`        | Carga productos con los filtros actuales |
| `getProducto(slug)`     | Carga el detalle de un producto          |
| `setFiltro(key, value)` | Aplica un filtro y resetea a página 1    |
| `limpiarFiltros()`      | Resetea todos los filtros                |
| `setPagina(page)`       | Cambia la página actual                  |

**Estructura de filtros:**

```js
{
  categoria:  null,   // slug de categoría
  marca:      null,
  talla:      null,
  color:      null,
  precio_min: null,
  precio_max: null,
  busqueda:   null,
  page:       1,
  limit:      12,
}
```

---

### `ui.store.js`

Maneja el estado global de la interfaz: toasts y loading.

| Acción                    | Descripción                          |
| ------------------------- | ------------------------------------ |
| `exito(titulo, mensaje)`  | Toast de éxito (verde) — dura 4s     |
| `error(titulo, mensaje)`  | Toast de error (rojo) — dura 4s      |
| `info(titulo, mensaje)`   | Toast informativo (azul) — dura 4s   |
| `alerta(titulo, mensaje)` | Toast de alerta (amarillo) — dura 4s |
| `iniciarCarga()`          | Activa el loading global             |
| `terminarCarga()`         | Desactiva el loading global          |

---

## Composables

### `useAuth.js`

Encapsula el flujo de autenticación con feedback visual automático.

```js
import { useAuth } from '@/composables/useAuth'

const { login, registro, logout } = useAuth()

// Login
await login({ email: 'juan@test.com', password: '123456' })

// Registro
await registro({ nombre: 'Juan', email: 'juan@test.com', password: '123456' })

// Logout
await logout()
```

---

### `useCarrito.js`

Encapsula las acciones del carrito con feedback visual automático.

```js
import { useCarrito } from '@/composables/useCarrito'

const { agregar, quitar, actualizarCantidad, vaciar } = useCarrito()

// Agregar producto
agregar(producto, variante, 2)

// Quitar producto
quitar(varianteId)

// Actualizar cantidad
actualizarCantidad(varianteId, 3)
```

---

### `useFiltros.js`

Encapsula la lógica de filtros con sincronización automática de URL.

```js
import { useFiltros } from '@/composables/useFiltros'

const { filtros, tieneFiltros, aplicarFiltro, limpiarFiltros, limpiarFiltro, cargarDesdUrl } =
  useFiltros()

// Aplicar filtro — actualiza URL y recarga productos
aplicarFiltro('categoria', 'hombre-polos')
aplicarFiltro('talla', 'M')

// Limpiar un filtro específico
limpiarFiltro('talla')

// Limpiar todos
limpiarFiltros()

// Cargar filtros desde la URL actual (útil al montar el componente)
cargarDesdUrl()
```

---

### `usePagination.js`

Encapsula la lógica de paginación.

```js
import { usePagination } from '@/composables/usePagination'

const { paginacion, irAPagina } = usePagination()

// Ir a una página — recarga productos y hace scroll al top
irAPagina(2)
```

---

### `useWhatsapp.js`

Abre el link de WhatsApp con el resumen del pedido.

```js
import { useWhatsapp } from '@/composables/useWhatsapp'

const { abrirWhatsapp } = useWhatsapp()

// Abre WhatsApp en nueva pestaña con el resumen del pedido
abrirWhatsapp(pedidoId)
```

---

## Servicios

Todos los servicios usan la instancia de Axios configurada en `api.js`.

### `api.js`

Instancia de Axios con:

- `baseURL` desde `VITE_API_URL`
- Interceptor de request — agrega el `Authorization: Bearer <token>` automáticamente
- Interceptor de response — renueva el token automáticamente cuando expira (401)
- Si el refresh falla, cierra sesión y redirige a `/auth/login`

### Servicios disponibles

| Servicio                                   | Método | Descripción         |
| ------------------------------------------ | ------ | ------------------- |
| `authServicio.registro(datos)`             | POST   | Registrar usuario   |
| `authServicio.login(datos)`                | POST   | Iniciar sesión      |
| `authServicio.refresh(token)`              | POST   | Renovar tokens      |
| `authServicio.logout(token)`               | POST   | Cerrar sesión       |
| `categoriasServicio.getArbol()`            | GET    | Árbol de categorías |
| `productosServicio.getListado(params)`     | GET    | Listado con filtros |
| `productosServicio.getDetalle(slug)`       | GET    | Detalle de producto |
| `pedidosServicio.getMisPedidos()`          | GET    | Pedidos del usuario |
| `pedidosServicio.getDetalle(id)`           | GET    | Detalle de pedido   |
| `pedidosServicio.crear(data)`              | POST   | Crear pedido        |
| `cuponesServicio.validar(data)`            | POST   | Validar cupón       |
| `pagosServicio.getInfo(pedidoId)`          | GET    | Info de pago        |
| `pagosServicio.getWhatsapp(pedidoId)`      | GET    | Link WhatsApp       |
| `pagosServicio.subirComprobante(id, form)` | POST   | Subir comprobante   |

---

## Componentes UI base

Todos los componentes base usan Tailwind CSS y son completamente reutilizables.

### `BaseButton.vue`

```vue
<!-- Variantes -->
<BaseButton variante="primario">Comprar</BaseButton>
<BaseButton variante="secundario">Cancelar</BaseButton>
<BaseButton variante="acento">Agregar al carrito</BaseButton>
<BaseButton variante="fantasma">Ver más</BaseButton>
<BaseButton variante="peligro">Eliminar</BaseButton>

<!-- Tamaños -->
<BaseButton tamano="sm">Pequeño</BaseButton>
<BaseButton tamano="md">Mediano</BaseButton>
<BaseButton tamano="lg">Grande</BaseButton>

<!-- Estados -->
<BaseButton :cargando="true">Procesando...</BaseButton>
<BaseButton :deshabilitado="true">No disponible</BaseButton>
<BaseButton :bloque="true">Ancho completo</BaseButton>
```

| Prop            | Tipo    | Default    | Opciones                                              |
| --------------- | ------- | ---------- | ----------------------------------------------------- |
| `variante`      | String  | `primario` | `primario` `secundario` `acento` `fantasma` `peligro` |
| `tamano`        | String  | `md`       | `sm` `md` `lg` `xl`                                   |
| `tipo`          | String  | `button`   | `button` `submit` `reset`                             |
| `cargando`      | Boolean | `false`    | —                                                     |
| `deshabilitado` | Boolean | `false`    | —                                                     |
| `bloque`        | Boolean | `false`    | —                                                     |

---

### `BaseInput.vue`

```vue
<BaseInput
  v-model="email"
  etiqueta="Correo electrónico"
  tipo="email"
  placeholder="juan@ejemplo.com"
  :requerido="true"
  :error="errores.email"
  ayuda="Nunca compartiremos tu correo"
>
  <template #izquierda>✉</template>
</BaseInput>
```

| Prop            | Tipo             | Default |
| --------------- | ---------------- | ------- |
| `modelValue`    | String \| Number | `''`    |
| `etiqueta`      | String           | `''`    |
| `tipo`          | String           | `text`  |
| `placeholder`   | String           | `''`    |
| `error`         | String           | `''`    |
| `ayuda`         | String           | `''`    |
| `requerido`     | Boolean          | `false` |
| `deshabilitado` | Boolean          | `false` |

---

### `BaseBadge.vue`

```vue
<BaseBadge variante="exito">En stock</BaseBadge>
<BaseBadge variante="error">Agotado</BaseBadge>
<BaseBadge variante="alerta">Pocas unidades</BaseBadge>
<BaseBadge variante="acento" tamano="lg">-20%</BaseBadge>
```

| Prop       | Opciones                                                |
| ---------- | ------------------------------------------------------- |
| `variante` | `gris` `negro` `acento` `exito` `error` `alerta` `info` |
| `tamano`   | `sm` `md` `lg`                                          |

---

### `BaseSpinner.vue`

```vue
<BaseSpinner />
<BaseSpinner tamano="lg" texto="Cargando productos..." />
<BaseSpinner :centrado="false" tamano="sm" />
```

---

### `BaseAlert.vue`

```vue
<BaseAlert tipo="exito" titulo="Pedido creado">
  Tu pedido fue registrado correctamente.
</BaseAlert>

<BaseAlert tipo="error" :cerrable="true">
  No se pudo procesar el pago.
</BaseAlert>
```

| Prop       | Opciones                        |
| ---------- | ------------------------------- |
| `tipo`     | `info` `exito` `error` `alerta` |
| `cerrable` | Boolean                         |

---

## Utilidades

### `formato.js`

```js
import { formatearPrecio, formatearFecha, formatearEstado, colorEstado } from '@/utils/formato'

formatearPrecio(49.9) // → 'S/ 49.90'
formatearFecha('2025-01-01') // → '01 de enero de 2025'
formatearEstado('preparando') // → 'En preparación'
colorEstado('enviado') // → 'text-indigo-600 bg-indigo-50'
```

---

## Variables de entorno

| Variable        | Requerida | Descripción                           |
| --------------- | --------- | ------------------------------------- |
| `VITE_API_URL`  | Sí        | URL base del backend                  |
| `VITE_WHATSAPP` | No        | Número de WhatsApp con código de país |

---

## Router

### Rutas disponibles

| Ruta               | Nombre           | Auth           | Descripción           |
| ------------------ | ---------------- | -------------- | --------------------- |
| `/`                | `home`           | —              | Página principal      |
| `/catalogo`        | `catalogo`       | —              | Catálogo de productos |
| `/catalogo/:slug`  | `producto`       | —              | Detalle de producto   |
| `/carrito`         | `carrito`        | —              | Carrito de compras    |
| `/checkout`        | `checkout`       | JWT            | Finalizar compra      |
| `/mis-pedidos`     | `pedidos`        | JWT            | Historial de pedidos  |
| `/mis-pedidos/:id` | `pedido-detalle` | JWT            | Detalle de pedido     |
| `/pago/:pedidoId`  | `pago`           | JWT            | Página de pago        |
| `/auth/login`      | `login`          | Solo invitados | Iniciar sesión        |
| `/auth/registro`   | `registro`       | Solo invitados | Crear cuenta          |
| `/:pathMatch(.*)`  | `not-found`      | —              | Página 404            |

### Guards

- `requiereAuth` — redirige a `/auth/login` si no hay sesión activa
- `requiereAdmin` — redirige a `/` si el rol no es admin
- `soloInvitados` — redirige a `/` si ya hay sesión activa

---

> Próxima fase: construcción de AppHeader, AppFooter, componentes de catálogo y vistas de la tienda pública.
