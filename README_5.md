# DASHEY — Frontend v5

Documentación del formulario de producto completo y gestión de variantes desde el panel admin.

---

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [ProductoFormVista](#productofromvista)
- [Gestión de variantes](#gestión-de-variantes)
- [Correcciones aplicadas](#correcciones-aplicadas)
- [Estado final del proyecto](#estado-final-del-proyecto)

---

## Estado del proyecto

| Sección                 | Estado     |
| ----------------------- | ---------- |
| Tienda pública completa | ✓ Completo |
| Panel admin completo    | ✓ Completo |
| Formulario de producto  | ✓ Completo |
| Gestión de variantes    | ✓ Completo |
| Ajuste de stock         | ✓ Completo |
| Integración MercadoPago | Pendiente  |
| WebSockets              | Pendiente  |
| Deploy                  | Pendiente  |

---

## ProductoFormVista

Vista de creación y edición de productos en el panel admin. Accesible desde:

- `/admin/productos/nuevo` — crear producto
- `/admin/productos/:id/editar` — editar producto existente

### Flujo de creación

```
Admin completa nombre, categoría, marca, material y descripción
     ↓
Agrega variantes con talla, color, SKU, precio y stock
     ↓
Hace clic en "Crear producto"
     ↓
Backend crea el producto con todas las variantes en una transacción
     ↓
Redirige automáticamente al formulario de edición
     ↓
Admin sube imágenes desde la sección de imágenes
```

### Flujo de edición

```
Admin accede al formulario de edición
     ↓
Se cargan los datos del producto, variantes e imágenes
     ↓
Admin puede:
  ├── Editar datos básicos y guardar
  ├── Agregar nuevas variantes
  ├── Editar variantes existentes
  ├── Ajustar stock de cada variante
  ├── Eliminar variantes
  ├── Subir nuevas imágenes
  ├── Marcar imagen como principal
  └── Eliminar imágenes
```

### Secciones del formulario

**Información básica:**

- Nombre (requerido)
- Categoría con subcategorías anidadas (requerido)
- Marca y material
- Descripción
- Checkboxes de activo y destacado

**Variantes:**

- Lista de variantes con color, talla, SKU, precio y stock
- Modal para crear y editar variantes
- Modal para ajustar stock con preview del resultado
- Eliminar variante con confirmación

**Imágenes** (solo en edición):

- Área de subida con soporte para múltiples archivos
- Galería con overlay al hacer hover
- Marcar imagen como principal
- Eliminar imagen con confirmación
- La primera imagen subida se marca automáticamente como principal

**Columna lateral:**

- Resumen del estado del producto
- Botones de guardar y cancelar
- Nota informativa en modo edición

---

## Gestión de variantes

### Servicio

**`src/services/variantes.service.js`**

```js
import api from './api'

export const variantesServicio = {
  getVariantes: (productoId) => api.get(`/admin/productos/${productoId}/variantes`),
  crear: (productoId, datos) => api.post(`/admin/productos/${productoId}/variantes`, datos),
  editar: (productoId, id, datos) =>
    api.put(`/admin/productos/${productoId}/variantes/${id}`, datos),
  ajustarStock: (productoId, id, datos) =>
    api.patch(`/admin/productos/${productoId}/variantes/${id}/stock`, datos),
  eliminar: (productoId, id) => api.delete(`/admin/productos/${productoId}/variantes/${id}`),
}
```

### Modal de variante

Permite crear y editar variantes con los siguientes campos:

| Campo         | Tipo                | Requerido |
| ------------- | ------------------- | --------- |
| Talla         | Text                | Sí        |
| Color         | Text                | Sí        |
| Código hex    | Text + color picker | No        |
| SKU           | Text                | Sí        |
| Precio        | Number              | Sí        |
| Precio oferta | Number              | No        |
| Stock inicial | Number              | No        |
| Activo        | Checkbox            | —         |

**Comportamiento según modo:**

| Modo                       | Acción al guardar                                                |
| -------------------------- | ---------------------------------------------------------------- |
| Creación de producto       | Agrega al array local — se envía al backend al crear el producto |
| Edición — nueva variante   | Llama a `variantesServicio.crear()` inmediatamente               |
| Edición — editar existente | Llama a `variantesServicio.editar()` inmediatamente              |

### Modal de ajuste de stock

Permite incrementar o decrementar el stock de una variante existente.

**Campos:**

- Cantidad — número positivo (entrada) o negativo (salida)
- Motivo — texto opcional para auditoría

**Preview en tiempo real:**

- Stock actual
- Ajuste aplicado
- Stock resultante — se muestra en rojo si quedaría negativo
- El botón se deshabilita si el resultado sería negativo

**Endpoint consumido:**

```
PATCH /api/v1/admin/productos/:productoId/variantes/:id/stock
Body: { cantidad: number, motivo: string | null }
```

### Lista de variantes

Cada variante en la lista muestra:

- Punto de color con el `codigo_hex`
- Talla y color
- SKU y precio
- Badge de stock clickeable — abre el modal de ajuste (solo en edición)
  - Verde si stock > 5
  - Amarillo si stock entre 1 y 5
  - Rojo si stock = 0
- Badge de estado activo/inactivo
- Botones de editar y eliminar

---

## Correcciones aplicadas

### CORS en archivos estáticos

**Problema:** Las imágenes subidas al backend no se mostraban en el frontend por un error de política CORS.

**Error:** `Cross-Origin-Resource-Policy` bloqueaba las imágenes desde `localhost:3000` en `localhost:5173`.

**Solución:** Configurar `helmet` en el backend para permitir recursos de origen cruzado:

```js
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
```

### Redirección post-creación

**Problema:** Al crear un producto, el admin no tenía forma de subir imágenes inmediatamente porque el formulario redirigía al listado.

**Solución:** Después de crear el producto, redirige al formulario de edición con el `id` del producto recién creado:

```js
router.push(`/admin/productos/${res.data.id}/editar`)
```

---

## Estado final del proyecto

### Backend — 47+ endpoints

| Módulo                 | Endpoints |
| ---------------------- | --------- |
| Auth                   | 4         |
| Usuarios / Direcciones | 4         |
| Categorías             | 5         |
| Productos              | 6         |
| Variantes              | 5         |
| Imágenes               | 5         |
| Pedidos                | 6         |
| Cupones                | 6         |
| Reseñas                | 5         |
| Pagos                  | 5         |
| Admin — Usuarios       | 1         |

### Frontend — Tienda pública

| Vista            | Ruta               |
| ---------------- | ------------------ |
| Home             | `/`                |
| Catálogo         | `/catalogo`        |
| Detalle producto | `/catalogo/:slug`  |
| Carrito          | `/carrito`         |
| Checkout         | `/checkout`        |
| Pago             | `/pago/:pedidoId`  |
| Mis pedidos      | `/mis-pedidos`     |
| Detalle pedido   | `/mis-pedidos/:id` |
| Login            | `/auth/login`      |
| Registro         | `/auth/registro`   |

### Frontend — Panel admin

| Vista           | Ruta                          |
| --------------- | ----------------------------- |
| Dashboard       | `/admin/dashboard`            |
| Productos       | `/admin/productos`            |
| Crear producto  | `/admin/productos/nuevo`      |
| Editar producto | `/admin/productos/:id/editar` |
| Categorías      | `/admin/categorias`           |
| Pedidos         | `/admin/pedidos`              |
| Detalle pedido  | `/admin/pedidos/:id`          |
| Cupones         | `/admin/cupones`              |
| Reseñas         | `/admin/resenas`              |
| Clientes        | `/admin/usuarios`             |

### Pendiente

| Tarea                                      | Prioridad |
| ------------------------------------------ | --------- |
| Integración MercadoPago                    | Media     |
| WebSockets — notificaciones en tiempo real | Media     |
| Deploy — backend Railway, frontend Vercel  | Alta      |
| Tests del backend                          | Baja      |
