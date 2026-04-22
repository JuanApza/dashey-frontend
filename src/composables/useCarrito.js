import { useCarritoStore } from '@/stores/carrito.store'
import { useUiStore } from '@/stores/ui.store'

export const useCarrito = () => {
  const carritoStore = useCarritoStore()
  const uiStore = useUiStore()

  const agregar = (producto, variante, cantidad = 1) => {
    const agregado = carritoStore.agregar(producto, variante, cantidad)
    if (agregado) {
      uiStore.exito('Agregado', `${producto.nombre} agregado al carrito`)
    } else {
      uiStore.error('Sin stock', 'No hay suficiente stock disponible')
    }
    return agregado
  }

  const quitar = (varianteId) => {
    carritoStore.quitar(varianteId)
    uiStore.info('Eliminado', 'Producto eliminado del carrito')
  }

  const actualizarCantidad = (varianteId, cantidad) => {
    carritoStore.actualizarCantidad(varianteId, cantidad)
  }

  const vaciar = () => {
    carritoStore.vaciar()
    uiStore.info('Carrito vacío', 'Se eliminaron todos los productos')
  }

  return {
    agregar,
    quitar,
    actualizarCantidad,
    vaciar,
  }
}
