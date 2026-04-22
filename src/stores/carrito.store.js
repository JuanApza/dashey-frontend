import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarritoStore = defineStore('carrito', () => {
  // ── Estado ───────────────────────────────────────
  const items = ref(JSON.parse(localStorage.getItem('carrito') || '[]'))
  const abierto = ref(false)

  // ── Getters ──────────────────────────────────────
  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))

  const subtotal = computed(() =>
    parseFloat(items.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)),
  )

  const estaVacio = computed(() => items.value.length === 0)

  // ── Acciones ─────────────────────────────────────
  const agregar = (producto, variante, cantidad = 1) => {
    const indice = items.value.findIndex((i) => i.varianteId === variante.id)

    if (indice >= 0) {
      const nuevaCantidad = items.value[indice].cantidad + cantidad
      if (nuevaCantidad > variante.stock) return false
      items.value[indice].cantidad = nuevaCantidad
    } else {
      if (cantidad > variante.stock) return false
      items.value.push({
        varianteId: variante.id,
        productoId: producto.id,
        productoNombre: producto.nombre,
        productoSlug: producto.slug,
        talla: variante.talla,
        color: variante.color,
        codigoHex: variante.codigo_hex,
        sku: variante.sku,
        precio: parseFloat(variante.precio_oferta || variante.precio),
        imagen:
          producto.imagenes?.find((img) => img.variante_id === variante.id || img.es_principal)
            ?.url || null,
        cantidad,
        stockDisponible: variante.stock,
      })
    }

    _persistir()
    abierto.value = true
    return true
  }

  const quitar = (varianteId) => {
    items.value = items.value.filter((i) => i.varianteId !== varianteId)
    _persistir()
  }

  const actualizarCantidad = (varianteId, cantidad) => {
    const indice = items.value.findIndex((i) => i.varianteId === varianteId)
    if (indice < 0) return

    if (cantidad <= 0) {
      quitar(varianteId)
      return
    }

    if (cantidad > items.value[indice].stockDisponible) return
    items.value[indice].cantidad = cantidad
    _persistir()
  }

  const vaciar = () => {
    items.value = []
    _persistir()
  }

  const abrirDrawer = () => {
    abierto.value = true
  }
  const cerrarDrawer = () => {
    abierto.value = false
  }
  const toggleDrawer = () => {
    abierto.value = !abierto.value
  }

  // ── Privado ───────────────────────────────────────
  const _persistir = () => {
    localStorage.setItem('carrito', JSON.stringify(items.value))
  }

  return {
    items,
    abierto,
    totalItems,
    subtotal,
    estaVacio,
    agregar,
    quitar,
    actualizarCantidad,
    vaciar,
    abrirDrawer,
    cerrarDrawer,
    toggleDrawer,
  }
})
