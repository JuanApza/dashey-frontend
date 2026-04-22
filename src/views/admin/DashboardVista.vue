<template>
  <div class="space-y-6">
    <!-- Métricas principales -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="metrica in metricas"
        :key="metrica.label"
        class="bg-white border border-gray-100 rounded-xl p-5"
      >
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {{ metrica.label }}
          </p>
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', metrica.bgIcono]">
            <i :class="[metrica.icono, 'text-sm', metrica.colorIcono]" />
          </div>
        </div>
        <p v-if="cargando" class="h-7 bg-gray-100 rounded animate-pulse w-24" />
        <p v-else class="text-2xl font-bold text-gray-900">{{ metrica.valor }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pedidos recientes -->
      <div class="bg-white border border-gray-100 rounded-xl p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-semibold text-gray-900">Pedidos recientes</h2>
          <RouterLink
            to="/admin/pedidos"
            class="text-xs text-gray-400 hover:text-black transition-colors"
          >
            Ver todos →
          </RouterLink>
        </div>

        <div v-if="cargando" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-50 rounded-lg animate-pulse" />
        </div>

        <div v-else-if="pedidosRecientes.length" class="space-y-2">
          <RouterLink
            v-for="pedido in pedidosRecientes"
            :key="pedido.id"
            :to="`/admin/pedidos/${pedido.id}`"
            class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                #{{ pedido.id.slice(0, 8).toUpperCase() }}
              </p>
              <p class="text-xs text-gray-400">{{ pedido.cliente_nombre }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">{{ formatearPrecio(pedido.total) }}</p>
              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  colorEstado(pedido.estado),
                ]"
              >
                {{ formatearEstado(pedido.estado) }}
              </span>
            </div>
          </RouterLink>
        </div>

        <p v-else class="text-sm text-gray-400 text-center py-8">No hay pedidos aún</p>
      </div>

      <!-- Accesos rápidos -->
      <div class="bg-white border border-gray-100 rounded-xl p-6">
        <h2 class="text-sm font-semibold text-gray-900 mb-5">Accesos rápidos</h2>
        <div class="grid grid-cols-2 gap-3">
          <RouterLink
            v-for="acceso in accesosRapidos"
            :key="acceso.ruta"
            :to="acceso.ruta"
            class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', acceso.bg]">
              <i :class="[acceso.icono, 'text-lg', acceso.color]" />
            </div>
            <span class="text-xs font-medium text-gray-700">{{ acceso.label }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { pedidosServicio } from '@/services/pedidos.service'
import { formatearPrecio, formatearEstado, colorEstado } from '@/utils/formato'

const cargando = ref(true)
const pedidosRecientes = ref([])
const totalPedidos = ref(0)
const totalPendientes = ref(0)

const metricas = computed(() => [
  {
    label: 'Total pedidos',
    valor: totalPedidos.value,
    icono: 'pi pi-shopping-bag',
    bgIcono: 'bg-blue-50',
    colorIcono: 'text-blue-500',
  },
  {
    label: 'Pendientes',
    valor: totalPendientes.value,
    icono: 'pi pi-clock',
    bgIcono: 'bg-yellow-50',
    colorIcono: 'text-yellow-500',
  },
  {
    label: 'Productos',
    valor: '—',
    icono: 'pi pi-box',
    bgIcono: 'bg-purple-50',
    colorIcono: 'text-purple-500',
  },
  {
    label: 'Clientes',
    valor: '—',
    icono: 'pi pi-users',
    bgIcono: 'bg-green-50',
    colorIcono: 'text-green-500',
  },
])

const accesosRapidos = [
  {
    ruta: '/admin/productos/nuevo',
    label: 'Nuevo producto',
    icono: 'pi pi-plus',
    bg: 'bg-black',
    color: 'text-white',
  },
  {
    ruta: '/admin/pedidos',
    label: 'Ver pedidos',
    icono: 'pi pi-shopping-bag',
    bg: 'bg-blue-50',
    color: 'text-blue-500',
  },
  {
    ruta: '/admin/cupones',
    label: 'Crear cupón',
    icono: 'pi pi-tag',
    bg: 'bg-green-50',
    color: 'text-green-500',
  },
  {
    ruta: '/admin/resenas',
    label: 'Moderar reseñas',
    icono: 'pi pi-star',
    bg: 'bg-yellow-50',
    color: 'text-yellow-500',
  },
]

onMounted(async () => {
  try {
    const res = await pedidosServicio.getListadoAdmin({ limit: 5, page: 1 })
    pedidosRecientes.value = res.data.slice(0, 5)
    totalPedidos.value = res.pagination?.total || 0

    const pendientes = await pedidosServicio.getListadoAdmin({ estado: 'pendiente', limit: 1 })
    totalPendientes.value = pendientes.pagination?.total || 0
  } catch (err) {
    console.error(err)
  } finally {
    cargando.value = false
  }
})
</script>
