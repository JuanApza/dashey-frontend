<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Mis pedidos</span>
    </nav>

    <h1 class="text-2xl font-bold text-gray-900 mb-8">Mis pedidos</h1>

    <!-- Skeleton -->
    <div v-if="cargando" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white border border-gray-100 rounded-xl p-5 animate-pulse"
      >
        <div class="flex justify-between mb-3">
          <div class="h-4 bg-gray-100 rounded w-32" />
          <div class="h-4 bg-gray-100 rounded w-20" />
        </div>
        <div class="h-3 bg-gray-100 rounded w-48" />
      </div>
    </div>

    <!-- Sin pedidos -->
    <div v-else-if="!pedidos.length" class="text-center py-24">
      <i class="pi pi-shopping-bag text-5xl text-gray-200 mb-4 block" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h2>
      <p class="text-gray-400 text-sm mb-8">Cuando realices una compra aparecerá aquí</p>
      <RouterLink
        to="/catalogo"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Ir al catálogo
      </RouterLink>
    </div>

    <!-- Lista de pedidos -->
    <div v-else class="space-y-4">
      <RouterLink
        v-for="pedido in pedidos"
        :key="pedido.id"
        :to="{ name: 'pedido-detalle', params: { id: pedido.id } }"
        class="block bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-colors"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <div>
            <p class="text-sm font-semibold text-gray-900">
              Pedido #{{ pedido.id.slice(0, 8).toUpperCase() }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ formatearFecha(pedido.creado_en) }}
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-bold text-black">{{ formatearPrecio(pedido.total) }}</p>
            <span
              :class="[
                'text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block',
                colorEstado(pedido.estado),
              ]"
            >
              {{ formatearEstado(pedido.estado) }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-400">
          <span
            >{{ pedido.total_items }}
            {{ pedido.total_items === 1 ? 'producto' : 'productos' }}</span
          >
          <span class="flex items-center gap-1">
            Ver detalle <i class="pi pi-angle-right text-xs" />
          </span>
        </div>
      </RouterLink>
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
const cargando = ref(true)

onMounted(async () => {
  try {
    const res = await pedidosServicio.getMisPedidos()
    pedidos.value = res.data
  } catch {
    uiStore.error('Error', 'No se pudieron cargar los pedidos')
  } finally {
    cargando.value = false
  }
})
</script>
