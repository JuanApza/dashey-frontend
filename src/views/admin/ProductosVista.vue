<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Productos</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ paginacion?.total || 0 }} productos en total</p>
      </div>
      <RouterLink
        to="/admin/productos/nuevo"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i class="pi pi-plus text-sm" />
        Nuevo producto
      </RouterLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre o SKU..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
          @keyup.enter="buscar"
        />
      </div>
      <select
        v-model="filtroActivo"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      >
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>
      <select
        v-model="filtroDestacado"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      >
        <option value="">Todos</option>
        <option value="true">Destacados</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <!-- Skeleton -->
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 8" :key="i" class="flex items-center gap-4 p-4 animate-pulse">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-100 rounded w-48" />
            <div class="h-3 bg-gray-100 rounded w-32" />
          </div>
          <div class="h-3.5 bg-gray-100 rounded w-16" />
          <div class="h-6 bg-gray-100 rounded w-16" />
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="!productos.length" class="text-center py-16">
        <i class="pi pi-box text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay productos</p>
        <RouterLink
          to="/admin/productos/nuevo"
          class="text-sm text-black underline mt-2 inline-block"
        >
          Crear el primero
        </RouterLink>
      </div>

      <!-- Lista -->
      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="producto in productos"
          :key="producto.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Imagen -->
          <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              v-if="producto.imagen_principal"
              :src="imagenUrl(producto.imagen_principal)"
              :alt="producto.nombre"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="pi pi-image text-gray-300 text-sm" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ producto.nombre }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-gray-400">{{ producto.categoria }}</span>
              <span v-if="producto.marca" class="text-gray-300">·</span>
              <span v-if="producto.marca" class="text-xs text-gray-400">{{ producto.marca }}</span>
            </div>
          </div>

          <!-- Precio -->
          <div class="text-right hidden sm:block">
            <p class="text-sm font-semibold text-gray-900">
              {{ formatearPrecio(producto.precio_desde) }}
            </p>
            <p v-if="producto.oferta_desde" class="text-xs text-green-600">
              Oferta: {{ formatearPrecio(producto.oferta_desde) }}
            </p>
          </div>

          <!-- Colores y tallas -->
          <div class="hidden md:flex items-center gap-1">
            <div
              v-for="color in (producto.colores || []).slice(0, 4)"
              :key="color"
              class="w-4 h-4 rounded-full border border-gray-200 bg-gray-200"
              :title="color"
            />
            <span v-if="(producto.colores || []).length > 4" class="text-xs text-gray-400">
              +{{ producto.colores.length - 4 }}
            </span>
          </div>

          <!-- Estado -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span
              :class="[
                'text-xs font-medium px-2.5 py-1 rounded-full',
                producto.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
              ]"
            >
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
            <span
              v-if="producto.destacado"
              class="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700"
            >
              Destacado
            </span>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <RouterLink
              :to="`/admin/productos/${producto.id}/editar`"
              class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              title="Editar"
            >
              <i class="pi pi-pencil text-sm" />
            </RouterLink>
            <button
              @click="toggleActivo(producto)"
              :title="producto.activo ? 'Desactivar' : 'Activar'"
              class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i :class="['text-sm', producto.activo ? 'pi pi-eye-slash' : 'pi pi-eye']" />
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div
        v-if="paginacion?.totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-gray-100"
      >
        <p class="text-xs text-gray-400">
          Página {{ paginacion.page }} de {{ paginacion.totalPages }}
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="!paginacion.hasPrev"
            @click="irAPagina(paginacion.page - 1)"
            class="p-1.5 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-colors"
          >
            <i class="pi pi-angle-left text-xs" />
          </button>
          <button
            :disabled="!paginacion.hasNext"
            @click="irAPagina(paginacion.page + 1)"
            class="p-1.5 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-colors"
          >
            <i class="pi pi-angle-right text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio } from '@/utils/formato'

const uiStore = useUiStore()
const productos = ref([])
const paginacion = ref(null)
const cargando = ref(true)
const busqueda = ref('')
const filtroActivo = ref('')
const filtroDestacado = ref('')
const paginaActual = ref(1)

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const cargar = async () => {
  cargando.value = true
  try {
    const params = {
      page: paginaActual.value,
      limit: 15,
      ...(busqueda.value && { busqueda: busqueda.value }),
      ...(filtroActivo.value !== '' && { activo: filtroActivo.value }),
      ...(filtroDestacado.value !== '' && { destacado: filtroDestacado.value }),
    }
    const { default: api } = await import('@/services/api')
    const res = await api.get('/admin/productos', { params })
    productos.value = res.data
    paginacion.value = res.pagination
  } catch {
    uiStore.error('Error', 'No se pudieron cargar los productos')
  } finally {
    cargando.value = false
  }
}

const buscar = () => {
  paginaActual.value = 1
  cargar()
}

const irAPagina = (pagina) => {
  paginaActual.value = pagina
  cargar()
}

const toggleActivo = async (producto) => {
  try {
    const { default: api } = await import('@/services/api')
    await api.patch(`/admin/productos/${producto.id}/toggle`)
    producto.activo = !producto.activo
    uiStore.exito('Actualizado', `Producto ${producto.activo ? 'activado' : 'desactivado'}`)
  } catch {
    uiStore.error('Error', 'No se pudo actualizar el producto')
  }
}

onMounted(cargar)
</script>
