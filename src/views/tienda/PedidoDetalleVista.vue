<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <RouterLink to="/mis-pedidos" class="hover:text-black transition-colors"
        >Mis pedidos</RouterLink
      >
      <span>/</span>
      <span class="text-gray-900 font-medium">Detalle</span>
    </nav>

    <!-- Skeleton -->
    <div v-if="cargando" class="space-y-4">
      <div class="h-8 bg-gray-100 rounded animate-pulse w-48" />
      <div class="h-40 bg-gray-100 rounded-xl animate-pulse" />
      <div class="h-60 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="pedido">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Pedido #{{ pedido.id.slice(0, 8).toUpperCase() }}
          </h1>
          <p class="text-sm text-gray-400 mt-1">{{ formatearFecha(pedido.creado_en) }}</p>
        </div>
        <span :class="['text-sm font-medium px-3 py-1.5 rounded-full', colorEstado(pedido.estado)]">
          {{ formatearEstado(pedido.estado) }}
        </span>
      </div>

      <!-- Historial de estados -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">Seguimiento</h2>
        <div class="space-y-3">
          <div
            v-for="(estado, i) in pedido.estados"
            :key="estado.id || i"
            class="flex items-start gap-3"
          >
            <div
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                i === 0 ? 'bg-black' : 'bg-gray-100',
              ]"
            >
              <i
                :class="[
                  'text-xs',
                  i === 0 ? 'pi pi-check text-white' : 'pi pi-circle text-gray-400',
                ]"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ formatearEstado(estado.estado) }}</p>
              <p class="text-xs text-gray-400">{{ formatearFecha(estado.creado_en) }}</p>
              <p v-if="estado.notas" class="text-xs text-gray-500 mt-0.5">{{ estado.notas }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items del pedido -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">Productos</h2>
        <div class="space-y-4">
          <div v-for="item in pedido.items" :key="item.id" class="flex gap-4">
            <RouterLink
              :to="{ name: 'producto', params: { slug: item.producto_slug } }"
              class="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <div class="w-full h-full flex items-center justify-center">
                <i class="pi pi-image text-gray-200" />
              </div>
            </RouterLink>
            <div class="flex-1 min-w-0">
              <RouterLink
                :to="{ name: 'producto', params: { slug: item.producto_slug } }"
                class="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
              >
                {{ item.producto_nombre }}
              </RouterLink>
              <p class="text-xs text-gray-500 mt-0.5">
                Talla: {{ item.talla }} · Color: {{ item.color }}
              </p>
              <p class="text-xs text-gray-400">SKU: {{ item.sku }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900">
                {{ formatearPrecio(item.subtotal) }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ formatearPrecio(item.precio_unitario) }} × {{ item.cantidad }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Totales -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">Resumen del pago</h2>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Subtotal</span>
            <span>{{ formatearPrecio(pedido.subtotal) }}</span>
          </div>
          <div v-if="pedido.descuento > 0" class="flex justify-between text-sm text-green-600">
            <span>Descuento</span>
            <span>-{{ formatearPrecio(pedido.descuento) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Envío</span>
            <span>{{
              pedido.costo_envio > 0 ? formatearPrecio(pedido.costo_envio) : 'Gratis'
            }}</span>
          </div>
          <div class="border-t border-gray-100 pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span class="text-lg">{{ formatearPrecio(pedido.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Dirección de envío -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">Dirección de envío</h2>
        <p class="text-sm text-gray-700">{{ pedido.calle }}</p>
        <p class="text-sm text-gray-500">{{ pedido.ciudad }}, {{ pedido.departamento }}</p>
        <p class="text-sm text-gray-500">{{ pedido.pais }}</p>
      </div>

      <!-- Acciones -->
      <div class="flex flex-col sm:flex-row gap-3">
        <RouterLink
          v-if="pedido.estado === 'pendiente'"
          :to="{ name: 'pago', params: { pedidoId: pedido.id } }"
          class="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <i class="pi pi-credit-card text-sm" />
          Ir a pagar
        </RouterLink>
        <RouterLink
          to="/mis-pedidos"
          class="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-sm font-medium py-3 rounded-xl hover:border-black transition-colors"
        >
          <i class="pi pi-arrow-left text-sm" />
          Volver a mis pedidos
        </RouterLink>
      </div>
    </template>

    <!-- No encontrado -->
    <div v-else class="text-center py-24">
      <i class="pi pi-search text-4xl text-gray-200 mb-4 block" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h2>
      <RouterLink to="/mis-pedidos" class="text-sm text-gray-400 hover:text-black underline">
        Ver mis pedidos
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { pedidosServicio } from '@/services/pedidos.service'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio, formatearFecha, formatearEstado, colorEstado } from '@/utils/formato'

const route = useRoute()
const uiStore = useUiStore()

const pedido = ref(null)
const cargando = ref(true)

onMounted(async () => {
  try {
    const res = await pedidosServicio.getDetalle(route.params.id)
    pedido.value = res.data
  } catch {
    uiStore.error('Error', 'No se pudo cargar el pedido')
  } finally {
    cargando.value = false
  }
})
</script>
