import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoriasServicio } from '@/services/categorias.service'
import { productosServicio } from '@/services/productos.service'

export const useCatalogoStore = defineStore('catalogo', () => {
  // ── Estado ───────────────────────────────────────
  const categorias = ref([])
  const productos = ref([])
  const producto = ref(null)
  const cargando = ref(false)
  const error = ref(null)
  const paginacion = ref(null)

  const filtros = ref({
    categoria: null,
    marca: null,
    talla: null,
    color: null,
    precio_min: null,
    precio_max: null,
    busqueda: null,
    page: 1,
    limit: 12,
  })

  // ── Getters ──────────────────────────────────────
  const filtrosActivos = computed(() =>
    Object.entries(filtros.value)
      .filter(([k, v]) => v !== null && k !== 'page' && k !== 'limit')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
  )

  const tieneFiltros = computed(() => Object.keys(filtrosActivos.value).length > 0)

  // ── Acciones ─────────────────────────────────────
  const getCategorias = async () => {
    try {
      cargando.value = true
      const res = await categoriasServicio.getArbol()
      categorias.value = res.data
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  const getProductos = async () => {
    try {
      cargando.value = true
      error.value = null

      const params = Object.fromEntries(
        Object.entries({ ...filtros.value }).filter(([, v]) => v !== null && v !== ''),
      )

      const res = await productosServicio.getListado(params)
      productos.value = res.data
      paginacion.value = res.pagination
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  const getProducto = async (slug) => {
    try {
      cargando.value = true
      error.value = null
      const res = await productosServicio.getDetalle(slug)
      producto.value = res.data
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  const setFiltro = (key, value) => {
    filtros.value[key] = value
    filtros.value.page = 1
  }

  const limpiarFiltros = () => {
    filtros.value = {
      categoria: null,
      marca: null,
      talla: null,
      color: null,
      precio_min: null,
      precio_max: null,
      busqueda: null,
      page: 1,
      limit: 12,
    }
  }

  const setPagina = (page) => {
    filtros.value.page = page
  }

  return {
    categorias,
    productos,
    producto,
    cargando,
    error,
    paginacion,
    filtros,
    filtrosActivos,
    tieneFiltros,
    getCategorias,
    getProductos,
    getProducto,
    setFiltro,
    limpiarFiltros,
    setPagina,
  }
})
