import { useCatalogoStore } from '@/stores/catalogo.store'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

export const useFiltros = () => {
  const catalogoStore = useCatalogoStore()
  const router = useRouter()
  const route = useRoute()

  const aplicarFiltro = (key, value) => {
    catalogoStore.setFiltro(key, value || null)
    _sincronizarUrl()
    catalogoStore.getProductos()
  }

  const limpiarFiltros = () => {
    catalogoStore.limpiarFiltros()
    router.push({ query: {} })
    catalogoStore.getProductos()
  }

  const limpiarFiltro = (key) => {
    catalogoStore.setFiltro(key, null)
    _sincronizarUrl()
    catalogoStore.getProductos()
  }

  const cargarDesdUrl = () => {
    const query = route.query
    if (query.categoria) catalogoStore.setFiltro('categoria', query.categoria)
    if (query.marca) catalogoStore.setFiltro('marca', query.marca)
    if (query.talla) catalogoStore.setFiltro('talla', query.talla)
    if (query.color) catalogoStore.setFiltro('color', query.color)
    if (query.precio_min) catalogoStore.setFiltro('precio_min', Number(query.precio_min))
    if (query.precio_max) catalogoStore.setFiltro('precio_max', Number(query.precio_max))
    if (query.busqueda) catalogoStore.setFiltro('busqueda', query.busqueda)
    if (query.page) catalogoStore.setFiltro('page', Number(query.page))
  }

  const _sincronizarUrl = () => {
    const query = Object.fromEntries(
      Object.entries(catalogoStore.filtros).filter(([, v]) => v !== null && v !== ''),
    )
    router.push({ query })
  }

  return {
    filtros: catalogoStore.filtros,
    filtrosActivos: catalogoStore.filtrosActivos,
    tieneFiltros: catalogoStore.tieneFiltros,
    aplicarFiltro,
    limpiarFiltros,
    limpiarFiltro,
    cargarDesdUrl,
  }
}
