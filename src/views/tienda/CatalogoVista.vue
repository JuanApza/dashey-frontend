<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Catálogo</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ tituloPagina }}
        </h1>
        <p v-if="catalogoStore.paginacion" class="text-sm text-gray-400 mt-1">
          {{ catalogoStore.paginacion.total }} productos
        </p>
      </div>

      <!-- Ordenar + toggle filtros móvil -->
      <div class="flex items-center gap-3">
        <button
          @click="mostrarFiltrosMovil = !mostrarFiltrosMovil"
          class="lg:hidden flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:border-black transition-colors"
        >
          <i class="pi pi-filter text-sm" />
          Filtros
          <span
            v-if="tieneFiltros"
            class="bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ Object.keys(filtrosActivos).length }}
          </span>
        </button>
      </div>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar filtros — desktop -->
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <FiltrosPanel />
      </aside>

      <!-- Filtros móvil -->
      <Transition name="slide-left">
        <div v-if="mostrarFiltrosMovil" class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-black/40" @click="mostrarFiltrosMovil = false" />
          <div class="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-semibold text-gray-900">Filtros</h2>
              <button @click="mostrarFiltrosMovil = false">
                <i class="pi pi-times text-gray-400" />
              </button>
            </div>
            <FiltrosPanel />
          </div>
        </div>
      </Transition>

      <!-- Grilla de productos -->
      <div class="flex-1 min-w-0">
        <!-- Skeleton loading -->
        <div
          v-if="catalogoStore.cargando"
          class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div v-for="i in 12" :key="i" class="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
        </div>

        <!-- Sin resultados -->
        <div
          v-else-if="!catalogoStore.productos.length"
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <i class="pi pi-search text-4xl text-gray-200 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No encontramos productos</h3>
          <p class="text-gray-400 text-sm mb-6">Intenta con otros filtros o términos de búsqueda</p>
          <button
            @click="limpiarFiltros"
            class="text-sm bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        <!-- Productos -->
        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductoCard
              v-for="producto in catalogoStore.productos"
              :key="producto.id"
              :producto="producto"
            />
          </div>

          <!-- Paginación -->
          <div
            v-if="catalogoStore.paginacion?.totalPages > 1"
            class="flex items-center justify-center gap-2 mt-10"
          >
            <button
              :disabled="!catalogoStore.paginacion.hasPrev"
              @click="irAPagina(catalogoStore.paginacion.page - 1)"
              class="p-2 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <i class="pi pi-angle-left text-sm" />
            </button>

            <button
              v-for="pagina in paginas"
              :key="pagina"
              @click="irAPagina(pagina)"
              :class="[
                'w-9 h-9 text-sm rounded-lg border transition-colors',
                pagina === catalogoStore.paginacion.page
                  ? 'bg-black text-white border-black'
                  : 'border-gray-200 hover:border-black text-gray-700',
              ]"
            >
              {{ pagina }}
            </button>

            <button
              :disabled="!catalogoStore.paginacion.hasNext"
              @click="irAPagina(catalogoStore.paginacion.page + 1)"
              class="p-2 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <i class="pi pi-angle-right text-sm" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCatalogoStore } from '@/stores/catalogo.store'
import { useFiltros } from '@/composables/useFiltros'
import { usePagination } from '@/composables/usePagination'
import FiltrosPanel from '@/components/catalogo/FiltrosPanel.vue'
import ProductoCard from '@/components/catalogo/ProductoCard.vue'

const route = useRoute()
const catalogoStore = useCatalogoStore()
const { filtrosActivos, tieneFiltros, limpiarFiltros, cargarDesdUrl } = useFiltros()
const { irAPagina } = usePagination()

const mostrarFiltrosMovil = ref(false)

const tituloPagina = computed(() => {
  if (filtrosActivos.value?.busqueda) return `Resultados para "${filtrosActivos.value.busqueda}"`
  if (filtrosActivos.value?.categoria) return filtrosActivos.value.categoria.replace(/-/g, ' ')
  return 'Todos los productos'
})

const paginas = computed(() => {
  if (!catalogoStore.paginacion) return []
  const { page, totalPages } = catalogoStore.paginacion
  const rango = []
  const inicio = Math.max(1, page - 2)
  const fin = Math.min(totalPages, page + 2)
  for (let i = inicio; i <= fin; i++) rango.push(i)
  return rango
})

onMounted(async () => {
  await catalogoStore.getCategorias()
  cargarDesdUrl()
  await catalogoStore.getProductos()
})

watch(
  () => route.query,
  async () => {
    cargarDesdUrl()
    await catalogoStore.getProductos()
  },
)
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
}
.slide-left-enter-from .absolute.left-0,
.slide-left-leave-to .absolute.left-0 {
  transform: translateX(-100%);
}
</style>
