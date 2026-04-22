# DASHEY — Frontend v2

Documentación de los componentes, vistas y flujos construidos en la segunda fase del frontend.

---

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Vistas construidas](#vistas-construidas)
- [Componentes construidos](#componentes-construidos)
- [Flujos funcionales](#flujos-funcionales)
- [Estructura de archivos actualizada](#estructura-de-archivos-actualizada)

---

## Estado del proyecto

| Sección                | Estado     |
| ---------------------- | ---------- |
| Configuración inicial  | ✓ Completo |
| Stores Pinia           | ✓ Completo |
| Composables            | ✓ Completo |
| Servicios Axios        | ✓ Completo |
| Componentes UI base    | ✓ Completo |
| Layout — AppHeader     | ✓ Completo |
| Layout — AppFooter     | ✓ Completo |
| Componentes de filtros | ✓ Completo |
| ProductoCard           | ✓ Completo |
| HomeVista              | ✓ Completo |
| CatalogoVista          | ✓ Completo |
| ProductoVista          | ✓ Completo |
| CarritoVista           | ✓ Completo |
| LoginVista             | ✓ Completo |
| RegistroVista          | ✓ Completo |
| ToastContainer         | ✓ Completo |
| CheckoutVista          | Pendiente  |
| PedidosVista           | Pendiente  |
| PedidoDetalleVista     | Pendiente  |
| PagoVista              | Pendiente  |

---

## Vistas construidas

### HomeVista — `/`

Vista principal de la tienda. Carga categorías y productos destacados al montarse.

**Secciones:**

- Hero con CTA principal y link a WhatsApp
- Grilla de categorías (máximo 4)
- Grilla de productos destacados (máximo 8)
- Banner de contacto por WhatsApp

**Datos que consume:**

- `catalogoStore.getCategorias()` — árbol de categorías
- `catalogoStore.getProductos()` — productos con filtro de destacados

---

### CatalogoVista — `/catalogo`

Vista del catálogo completo con filtros laterales, búsqueda y paginación.

**Funcionalidades:**

- Sidebar de filtros visible en desktop, drawer deslizable en móvil
- Filtros sincronizados con la URL — al compartir el link, los filtros se preservan
- Paginación numérica con navegación anterior/siguiente
- Skeleton loading mientras cargan los productos
- Estado vacío con botón para limpiar filtros
- Título dinámico según filtros activos

**Datos que consume:**

- `catalogoStore.getCategorias()`
- `catalogoStore.getProductos()` con filtros desde URL

**Query params soportados:**
| Param | Descripción |
|-------|-------------|
| `categoria` | Slug de categoría |
| `marca` | Nombre de marca |
| `talla` | Talla seleccionada |
| `color` | Color seleccionado |
| `precio_min` | Precio mínimo |
| `precio_max` | Precio máximo |
| `busqueda` | Término de búsqueda |
| `page` | Página actual |

---

### ProductoVista — `/catalogo/:slug`

Vista de detalle del producto con selección de variantes.

**Funcionalidades:**

- Galería de imágenes con miniaturas — cambia según color seleccionado
- Selector de color con puntos de color hexadecimal
- Selector de talla — tallas agotadas aparecen deshabilitadas y tachadas
- Tallas disponibles se filtran según el color seleccionado
- Selector de cantidad con validación de stock
- Precio dinámico según variante seleccionada
- Badge de porcentaje de descuento si hay precio de oferta
- Indicador de stock: en stock / últimas unidades / agotado
- Botón de agregar al carrito — deshabilitado si no hay variante seleccionada
- Link de consulta directa por WhatsApp con el producto y URL actuales
- Sección de descripción y composición del material

**Lógica de variantes:**

- Los colores disponibles se calculan desde las variantes activas con stock
- Las tallas disponibles se filtran según el color seleccionado
- La variante seleccionada se determina por la combinación color + talla
- Las imágenes se filtran según la variante activa

---

### CarritoVista — `/carrito`

Vista del carrito de compras con resumen del pedido.

**Funcionalidades:**

- Estado vacío con link al catálogo
- Lista de items con imagen, nombre, talla, color, SKU
- Control de cantidad por item con validación de stock máximo
- Eliminar item individual
- Vaciar carrito completo
- Resumen con subtotal
- Botón para proceder al checkout
- El carrito persiste en `localStorage` entre sesiones

---

### LoginVista — `/auth/login`

Formulario de inicio de sesión.

**Funcionalidades:**

- Validación de campos en el frontend antes de llamar al backend
- Mostrar/ocultar contraseña
- Mensaje de error general si las credenciales son incorrectas
- Estado de carga durante el login
- Al iniciar sesión redirige a la ruta original o al home
- Link a registro

---

### RegistroVista — `/auth/registro`

Formulario de creación de cuenta.

**Funcionalidades:**

- Validación de nombre, email, contraseña y confirmación
- Verificación de que las contraseñas coincidan
- Mostrar/ocultar contraseña
- Al registrarse redirige al login con mensaje de éxito
- Link a login

---

## Componentes construidos

### Layout

#### `AppHeader.vue`

Barra de navegación principal fija en la parte superior.

**Funcionalidades:**

- Logo con link al home
- Buscador en desktop — busca por texto y redirige al catálogo
- Buscador expandible en móvil
- Menú de usuario con dropdown — mis pedidos, panel admin (si es admin), cerrar sesión
- Ícono de login si no hay sesión activa
- Ícono del carrito con contador de items
- Barra de categorías con submenú al hacer hover
- Cierra el dropdown al hacer clic fuera
- Carga las categorías automáticamente al montarse

#### `AppFooter.vue`

Pie de página de la tienda.

**Secciones:**

- Descripción de la marca y redes sociales
- Links de navegación de la tienda
- Links de cuenta del usuario
- Información de contacto con WhatsApp, email y ubicación
- Botón de WhatsApp directo
- Métodos de pago aceptados
- Copyright y links legales

#### `AppLayout.vue`

Layout contenedor de la tienda pública. Monta `AppHeader` y `AppFooter` una sola vez y renderiza las vistas en `<RouterView />`.

#### `AuthLayout.vue`

Layout para las vistas de login y registro. Centra el contenido verticalmente sin header ni footer.

#### `AdminLayout.vue`

Layout base para el panel admin. Vacío por ahora — se construirá en la siguiente fase.

---

### Catálogo

#### `ProductoCard.vue`

Tarjeta de producto para la grilla del catálogo.

**Props:**
| Prop | Tipo | Requerido |
|------|------|-----------|
| `producto` | Object | Sí |

**Funcionalidades:**

- Imagen principal con lazy loading y efecto zoom al hover
- Badge de descuento o destacado
- Botón de agregar rápido visible al hover — redirige al detalle para seleccionar variante
- Nombre, marca y precio desde
- Precio de oferta con tachado del precio original
- Puntos de color de las variantes disponibles

#### `FiltrosPanel.vue`

Panel contenedor de todos los filtros. Muestra los filtros activos como badges con botón para eliminarlos individualmente o limpiar todos.

#### `FiltroSeccion.vue`

Acordeón reutilizable para cada sección de filtros. Se abre y cierra con animación.

**Props:**
| Prop | Tipo | Default |
|------|------|---------|
| `titulo` | String | — |
| `abierto` | Boolean | `false` |

#### `FiltroCategoria.vue`

Lista de categorías raíz. Muestra subcategorías al seleccionar la categoría padre. Resalta la categoría activa.

#### `FiltroTalla.vue`

Botones de talla. Resalta la talla seleccionada. Incluye tallas de ropa y pantalones.

#### `FiltroColor.vue`

Círculos de color. Muestra el nombre al hacer hover. Resalta el color seleccionado con anillo.

#### `FiltroPrecio.vue`

Inputs de precio mínimo y máximo con botón para aplicar.

---

### UI Base

#### `BaseButton.vue`

Botón reutilizable con variantes, tamaños y estados.

**Props:**
| Prop | Opciones | Default |
|------|----------|---------|
| `variante` | `primario` `secundario` `acento` `fantasma` `peligro` | `primario` |
| `tamano` | `sm` `md` `lg` `xl` | `md` |
| `tipo` | `button` `submit` `reset` | `button` |
| `cargando` | Boolean | `false` |
| `deshabilitado` | Boolean | `false` |
| `bloque` | Boolean | `false` |

#### `BaseInput.vue`

Input reutilizable con etiqueta, error, ayuda y slots para íconos.

**Props:** `modelValue`, `etiqueta`, `tipo`, `placeholder`, `error`, `ayuda`, `requerido`, `deshabilitado`

**Slots:** `#izquierda`, `#derecha`

#### `BaseBadge.vue`

Etiqueta de estado con variantes de color.

**Props:**
| Prop | Opciones |
|------|----------|
| `variante` | `gris` `negro` `acento` `exito` `error` `alerta` `info` |
| `tamano` | `sm` `md` `lg` |

#### `BaseSpinner.vue`

Indicador de carga circular.

**Props:** `tamano` (`sm` `md` `lg`), `texto`, `centrado`

#### `BaseAlert.vue`

Alerta informativa con ícono y opción de cerrar.

**Props:** `tipo` (`info` `exito` `error` `alerta`), `titulo`, `cerrable`

#### `ToastContainer.vue`

Sistema de notificaciones globales. Se monta en `App.vue` via `Teleport` al `body`. Las notificaciones se eliminan automáticamente después de 4 segundos.

**Uso:**

```js
import { useUiStore } from '@/stores/ui.store'
const uiStore = useUiStore()

uiStore.exito('Título', 'Mensaje')
uiStore.error('Título', 'Mensaje')
uiStore.info('Título', 'Mensaje')
uiStore.alerta('Título', 'Mensaje')
```

---

## Flujos funcionales

### Flujo de autenticación

```
Usuario va a /auth/login
     ↓
Completa el formulario
     ↓
useAuth.login() llama a authServicio.login()
     ↓
El token se guarda en localStorage y en authStore
     ↓
Redirige al home o a la ruta original
     ↓
AppHeader muestra el nombre del usuario y el menú de cuenta
```

### Flujo de búsqueda y filtros

```
Usuario aplica un filtro o busca un término
     ↓
useFiltros.aplicarFiltro() actualiza el store y la URL
     ↓
catalogoStore.getProductos() hace fetch al backend con los params
     ↓
La grilla se actualiza con los nuevos productos
     ↓
Al compartir la URL, los filtros se preservan
```

### Flujo de agregar al carrito

```
Usuario selecciona color y talla en ProductoVista
     ↓
useCarrito.agregar() valida el stock disponible
     ↓
Si hay stock → agrega al carritoStore y persiste en localStorage
Si no hay stock → muestra toast de error
     ↓
AppHeader actualiza el contador del carrito automáticamente
```

### Flujo de compra

```
CarritoVista → /checkout (requiere auth)
     ↓
Si no está autenticado → redirige a /auth/login con redirect
     ↓
Checkout → seleccionar dirección, método de pago, cupón
     ↓
Crear pedido en el backend
     ↓
PagoVista → info de pago, subir comprobante o WhatsApp
```

---

## Estructura de archivos actualizada

```
dashey-frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseSpinner.vue
│   │   │   ├── BaseAlert.vue
│   │   │   └── ToastContainer.vue
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── AppLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── AdminLayout.vue
│   │   └── catalogo/
│   │       ├── ProductoCard.vue
│   │       ├── FiltrosPanel.vue
│   │       ├── FiltroSeccion.vue
│   │       ├── FiltroCategoria.vue
│   │       ├── FiltroTalla.vue
│   │       ├── FiltroColor.vue
│   │       └── FiltroPrecio.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── useCarrito.js
│   │   ├── useFiltros.js
│   │   ├── usePagination.js
│   │   └── useWhatsapp.js
│   ├── stores/
│   │   ├── auth.store.js
│   │   ├── carrito.store.js
│   │   ├── catalogo.store.js
│   │   └── ui.store.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── categorias.service.js
│   │   ├── productos.service.js
│   │   ├── pedidos.service.js
│   │   ├── cupones.service.js
│   │   └── pagos.service.js
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
│   ├── router/
│   │   ├── index.js
│   │   └── guards.js
│   └── utils/
│       └── formato.js
├── .env
├── .env.example
├── vite.config.js
└── tailwind.config.js
```

---

> Próxima fase: CheckoutVista, PedidosVista, PedidoDetalleVista y PagoVista.
