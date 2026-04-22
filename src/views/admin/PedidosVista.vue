<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Pedidos</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ paginacion?.total || 0 }} pedidos en total</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
      <select
        v-model="filtroEstado"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      >
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="confirmado">Confirmado</option>
        <option value="preparando">Preparando</option>
        <option value="enviado">Enviado</option>
        <option value="entregado">Entregado</option>
        <option value="cancelado">Cancelado</option>
        <option value="devuelto">Devuelto</option>
      </select>
      <input
        v-model="filtroFechaDesde"
        type="date"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      />
      <input
        v-model="filtroFechaHasta"
        type="date"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      />
      <button
        @click="limpiarFiltros"
        class="text-sm text-gray-400 hover:text-black transition-colors"
      >
        Limpiar
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <!-- Skeleton -->
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 8" :key="i" class="flex items-center gap-4 p-4 animate-pulse">
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-100 rounded w-32" />
            <div class="h-3 bg-gray-100 rounded w-48" />
          </div>
          <div class="h-3.5 bg-gray-100 rounded w-20" />
          <div class="h-6 bg-gray-100 rounded w-20" />
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="!pedidos.length" class="text-center py-16">
        <i class="pi pi-shopping-bag text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay pedidos</p>
      </div>

      <!-- Lista -->
      <div v-else class="divide-y divide-gray-50">
        <RouterLink
          v-for="pedido in pedidos"
          :key="pedido.id"
          :to="`/admin/pedidos/${pedido.id}`"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Info pedido -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-gray-900">
                #{{ pedido.id.slice(0, 8).toUpperCase() }}
              </p>
              <span class="text-gray-300">·</span>
              <p class="text-sm text-gray-500 truncate">{{ pedido.cliente_nombre }}</p>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <p class="text-xs text-gray-400">{{ formatearFecha(pedido.creado_en) }}</p>
              <span class="text-gray-300">·</span>
              <p class="text-xs text-gray-400">{{ pedido.total_items }} productos</p>
              <span class="text-gray-300">·</span>
              <p class="text-xs text-gray-400 capitalize">{{ pedido.metodo_pago }}</p>
            </div>
          </div>

          <!-- Total -->
          <p class="text-sm font-bold text-gray-900 flex-shrink-0">
            {{ formatearPrecio(pedido.total) }}
          </p>

          <!-- Estado -->
          <span
            :class="[
              'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
              colorEstado(pedido.estado),
            ]"
          >
            {{ formatearEstado(pedido.estado) }}
          </span>

          <i class="pi pi-angle-right text-gray-300 text-sm flex-shrink-0" />
        </RouterLink>
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
import { pedidosServicio } from '@/services/pedidos.service'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio, formatearFecha, formatearEstado, colorEstado } from '@/utils/formato'

const uiStore = useUiStore()
const pedidos = ref([])
const paginacion = ref(null)
const cargando = ref(true)
const filtroEstado = ref('')
const filtroFechaDesde = ref('')
const filtroFechaHasta = ref('')
const paginaActual = ref(1)

const cargar = async () => {
  cargando.value = true
  try {
    const params = {
      page: paginaActual.value,
      limit: 15,
      ...(filtroEstado.value && { estado: filtroEstado.value }),
      ...(filtroFechaDesde.value && { fecha_desde: filtroFechaDesde.value }),
      ...(filtroFechaHasta.value && { fecha_hasta: filtroFechaHasta.value }),
    }
    const res = await pedidosServicio.getListadoAdmin(params)
    pedidos.value = res.data
    paginacion.value = res.pagination
  } catch {
    uiStore.error('Error', 'No se pudieron cargar los pedidos')
  } finally {
    cargando.value = false
  }
}

const limpiarFiltros = () => {
  filtroEstado.value = ''
  filtroFechaDesde.value = ''
  filtroFechaHasta.value = ''
  paginaActual.value = 1
  cargar()
}

const irAPagina = (pagina) => {
  paginaActual.value = pagina
  cargar()
}

onMounted(cargar)
</script>
