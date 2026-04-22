import { useCatalogoStore } from '@/stores/catalogo.store'

export const usePagination = () => {
  const catalogoStore = useCatalogoStore()

  const irAPagina = (page) => {
    catalogoStore.setPagina(page)
    catalogoStore.getProductos()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    paginacion: catalogoStore.paginacion,
    irAPagina,
  }
}
