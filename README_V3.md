# DASHEY — Frontend v3

Documentación de las vistas de checkout, pago y pedidos de la tienda pública.

---

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Vistas construidas](#vistas-construidas)
- [Endpoints de backend agregados](#endpoints-de-backend-agregados)
- [Flujo completo de compra](#flujo-completo-de-compra)
- [Estructura de archivos actualizada](#estructura-de-archivos-actualizada)

---

## Estado del proyecto

| Sección                        | Estado     |
| ------------------------------ | ---------- |
| Configuración inicial          | ✓ Completo |
| Stores Pinia                   | ✓ Completo |
| Composables                    | ✓ Completo |
| Servicios Axios                | ✓ Completo |
| Componentes UI base            | ✓ Completo |
| Layout — AppHeader + AppFooter | ✓ Completo |
| Componentes de filtros         | ✓ Completo |
| ProductoCard                   | ✓ Completo |
| HomeVista                      | ✓ Completo |
| CatalogoVista                  | ✓ Completo |
| ProductoVista                  | ✓ Completo |
| CarritoVista                   | ✓ Completo |
| LoginVista + RegistroVista     | ✓ Completo |
| CheckoutVista                  | ✓ Completo |
| PagoVista                      | ✓ Completo |
| PedidosVista                   | ✓ Completo |
| PedidoDetalleVista             | ✓ Completo |
| Panel Admin                    | Pendiente  |

---

## Vistas construidas

### CheckoutVista — `/checkout`

Vista de finalización del pedido. Requiere autenticación. Si el carrito está vacío redirige automáticamente a `/carrito`.

**Secciones:**

**Dirección de envío**

- Lista las direcciones guardadas del usuario como opciones seleccionables
- La dirección principal se preselecciona automáticamente
- Formulario para agregar nueva dirección con validación
- Guardar nueva dirección llama al backend y la agrega a la lista sin recargar

**Método de pago**

- Tarjetas visuales para seleccionar: Yape, Transferencia, Contraentrega, MercadoPago
- Validación antes de continuar

**Cupón de descuento**

- Input de código con botón para validar
- Llama al endpoint `/cupones/validar` con el subtotal actual
- Muestra el descuento calculado si el cupón es válido
- Botón para quitar el cupón aplicado

**Notas del pedido**

- Textarea opcional para instrucciones especiales de envío

**Resumen**

- Lista de items con imagen, nombre, talla, color y cantidad
- Subtotal, descuento (si aplica) y total final
- Botón de confirmar pedido

**Flujo al confirmar:**

1. Valida que haya dirección y método de pago seleccionados
2. Construye el payload con items del carrito
3. Llama a `pedidosServicio.crear()`
4. Si es exitoso vacía el carrito y redirige a `PagoVista`

---

### PagoVista — `/pago/:pedidoId`

Vista de instrucciones de pago post-compra.

**Secciones:**

**Header de confirmación**

- Ícono de check verde
- Número de pedido abreviado

**Resumen del pedido**

- Total a pagar y método de pago seleccionado

**Instrucciones según método de pago:**

| Método                            | Instrucciones mostradas                |
| --------------------------------- | -------------------------------------- |
| `contraentrega`                   | Mensaje informativo — pago al recibir  |
| `yape` / `plin` / `transferencia` | Datos de Yape y transferencia bancaria |

**Subir comprobante** (solo para Yape/transferencia)

- Área de drop para seleccionar imagen
- Selector de método (Yape, Plin, Transferencia)
- Campo opcional para número de operación
- Botón para enviar — llama a `pagosServicio.subirComprobante()`
- Al enviarse exitosamente muestra confirmación y oculta el formulario

**WhatsApp**

- Botón que abre WhatsApp con el resumen del pedido precargado
- Disponible para todos los métodos de pago

**Acciones**

- Ver detalle del pedido
- Seguir comprando

---

### PedidosVista — `/mis-pedidos`

Historial de pedidos del usuario autenticado.

**Funcionalidades:**

- Skeleton loading mientras cargan los pedidos
- Estado vacío con link al catálogo
- Lista de pedidos ordenados por fecha descendente
- Cada pedido muestra: número abreviado, fecha, total, estado con badge de color y cantidad de productos
- Al hacer clic navega al detalle del pedido

**Colores de estado:**
| Estado | Color |
|--------|-------|
| pendiente | Amarillo |
| confirmado | Azul |
| preparando | Púrpura |
| enviado | Índigo |
| entregado | Verde |
| cancelado | Rojo |
| devuelto | Gris |

---

### PedidoDetalleVista — `/mis-pedidos/:id`

Detalle completo de un pedido.

**Secciones:**

**Header**

- Número de pedido, fecha y badge de estado

**Seguimiento**

- Historial de cambios de estado en orden cronológico inverso
- Cada estado muestra: nombre, fecha y notas del cambio
- El estado más reciente tiene ícono negro, los anteriores grises

**Productos**

- Lista de items con nombre, talla, color, SKU y subtotal
- Precio unitario × cantidad
- Link al producto en el catálogo

**Resumen del pago**

- Subtotal, descuento, costo de envío y total

**Dirección de envío**

- Calle, ciudad, departamento y país

**Acciones**

- Si el pedido está `pendiente` muestra botón para ir a pagar
- Botón para volver a mis pedidos

---

## Endpoints de backend agregados

En esta fase se agregaron los endpoints de gestión de direcciones del usuario.

### `GET /api/v1/usuarios/me/direcciones`

Obtiene las direcciones del usuario autenticado ordenadas con la principal primero.

**Headers:** `Authorization: Bearer <accessToken>`

**Respuesta `200`:**

```json
{
  "ok": true,
  "message": "Direcciones obtenidas",
  "data": [
    {
      "id": "uuid",
      "calle": "Av. Larco 123",
      "ciudad": "Miraflores",
      "departamento": "Lima",
      "pais": "Peru",
      "es_principal": true
    }
  ]
}
```

---

### `POST /api/v1/usuarios/me/direcciones`

Crea una nueva dirección para el usuario. Si `es_principal` es `true`, desmarca automáticamente la anterior.

**Headers:** `Authorization: Bearer <accessToken>`

**Body:**

```json
{
  "calle": "Av. Larco 123",
  "ciudad": "Miraflores",
  "departamento": "Lima",
  "codigo_postal": "15074",
  "pais": "Peru",
  "es_principal": true
}
```

---

### `DELETE /api/v1/usuarios/me/direcciones/:id`

Elimina una dirección del usuario. Solo puede eliminar sus propias direcciones.

**Headers:** `Authorization: Bearer <accessToken>`

---

### Servicio frontend agregado

**`src/services/direcciones.service.js`**

```js
import api from './api'

export const direccionesServicio = {
  getMisDirecciones: () => api.get('/usuarios/me/direcciones'),
  crear: (datos) => api.post('/usuarios/me/direcciones', datos),
  eliminar: (id) => api.delete(`/usuarios/me/direcciones/${id}`),
}
```

---

## Flujo completo de compra

```
Cliente navega al catálogo
     ↓
Selecciona producto → elige color y talla
     ↓
Agrega al carrito → toast de confirmación
     ↓
Va al carrito → revisa items y subtotal
     ↓
Clic en "Proceder al pago"
     ↓ (si no está autenticado → redirige a login con redirect)
CheckoutVista
  ├── Selecciona dirección (o crea una nueva)
  ├── Selecciona método de pago
  ├── Aplica cupón (opcional)
  └── Confirma el pedido
     ↓
Backend valida stock, aplica cupón, crea pedido y descuenta stock
     ↓
Carrito se vacía automáticamente
     ↓
PagoVista
  ├── Muestra instrucciones según método de pago
  ├── Cliente sube comprobante (Yape/transferencia)
  └── Cliente puede coordinar por WhatsApp
     ↓
Admin confirma el pago → pedido pasa a "confirmado"
     ↓
Cliente ve el historial en PedidosVista y el detalle en PedidoDetalleVista
```

---

## Estructura de archivos actualizada

```
dashey-frontend/
└── src/
    ├── services/
    │   ├── api.js
    │   ├── auth.service.js
    │   ├── categorias.service.js
    │   ├── productos.service.js
    │   ├── pedidos.service.js
    │   ├── cupones.service.js
    │   ├── pagos.service.js
    │   └── direcciones.service.js       ← nuevo
    └── views/
        ├── tienda/
        │   ├── HomeVista.vue
        │   ├── CatalogoVista.vue
        │   ├── ProductoVista.vue
        │   ├── CarritoVista.vue
        │   ├── CheckoutVista.vue        ← nuevo
        │   ├── PagoVista.vue            ← nuevo
        │   ├── PedidosVista.vue         ← nuevo
        │   └── PedidoDetalleVista.vue   ← nuevo
        ├── auth/
        │   ├── LoginVista.vue
        │   └── RegistroVista.vue
        └── NotFoundVista.vue
```

---

> Próxima fase: Panel de administración — dashboard, gestión de productos, pedidos y cupones.
