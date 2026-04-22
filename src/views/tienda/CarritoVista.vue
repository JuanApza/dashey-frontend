<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Carrito</span>
    </nav>

    <h1 class="text-2xl font-bold text-gray-900 mb-8">
      Mi carrito
      <span v-if="carritoStore.totalItems" class="text-gray-400 font-normal text-lg ml-2">
        ({{ carritoStore.totalItems }}
        {{ carritoStore.totalItems === 1 ? 'producto' : 'productos' }})
      </span>
    </h1>

    <!-- Carrito vacío -->
    <div v-if="carritoStore.estaVacio" class="text-center py-24">
      <i class="pi pi-shopping-cart text-5xl text-gray-200 mb-4 block" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
      <p class="text-gray-400 text-sm mb-8">Agrega productos desde el catálogo para comenzar</p>
      <RouterLink
        to="/catalogo"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i class="pi pi-arrow-left text-sm" />
        Ver catálogo
      </RouterLink>
    </div>

    <!-- Items + Resumen -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Lista de items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in carritoStore.items"
          :key="item.varianteId"
          class="flex gap-4 bg-white border border-gray-100 rounded-xl p-4"
        >
          <!-- Imagen -->
          <div class="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
            <img
              v-if="item.imagen"
              :src="imagenUrl(item.imagen)"
              :alt="item.productoNombre"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="pi pi-image text-2xl text-gray-200" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 line-clamp-2">
                  {{ item.productoNombre }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500">Talla: {{ item.talla }}</span>
                  <span class="text-gray-300">·</span>
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <span
                      v-if="item.codigoHex"
                      class="w-3 h-3 rounded-full border border-gray-200 inline-block"
                      :style="{ backgroundColor: item.codigoHex }"
                    />
                    {{ item.color }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">SKU: {{ item.sku }}</p>
              </div>
              <button
                @click="quitar(item.varianteId)"
                class="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <i class="pi pi-trash text-sm" />
              </button>
            </div>

            <!-- Precio y cantidad -->
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-gray-200 rounded-lg">
                <button
                  @click="actualizarCantidad(item.varianteId, item.cantidad - 1)"
                  class="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-lg"
                >
                  <i class="pi pi-minus text-xs" />
                </button>
                <span class="w-8 text-center text-sm font-medium">{{ item.cantidad }}</span>
                <button
                  @click="actualizarCantidad(item.varianteId, item.cantidad + 1)"
                  :disabled="item.cantidad >= item.stockDisponible"
                  class="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors rounded-r-lg"
                >
                  <i class="pi pi-plus text-xs" />
                </button>
              </div>
              <p class="text-sm font-semibold text-gray-900">
                {{ formatearPrecio(item.precio * item.cantidad) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Vaciar carrito -->
        <div class="flex justify-end">
          <button
            @click="vaciar"
            class="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <i class="pi pi-trash text-xs" />
            Vaciar carrito
          </button>
        </div>
      </div>

      <!-- Resumen del pedido -->
      <div class="lg:col-span-1">
        <div class="bg-white border border-gray-100 rounded-xl p-6 sticky top-24">
          <h2 class="text-lg font-semibold text-gray-900 mb-5">Resumen del pedido</h2>

          <div class="space-y-3 mb-5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span class="font-medium">{{ formatearPrecio(carritoStore.subtotal) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Envío</span>
              <span class="text-green-600 font-medium">Por confirmar</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="text-xl font-bold text-black">
                {{ formatearPrecio(carritoStore.subtotal) }}
              </span>
            </div>
          </div>

          <RouterLink
            to="/checkout"
            class="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Proceder al pago
            <i class="pi pi-arrow-right text-sm" />
          </RouterLink>

          <RouterLink
            to="/catalogo"
            class="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black mt-3 transition-colors"
          >
            <i class="pi pi-arrow-left text-xs" />
            Seguir comprando
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito.store'
import { useCarrito } from '@/composables/useCarrito'
import { formatearPrecio } from '@/utils/formato'

const carritoStore = useCarritoStore()
const { quitar, actualizarCantidad, vaciar } = useCarrito()

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}
</script>
