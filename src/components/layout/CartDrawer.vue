<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    class="!w-full sm:!w-[420px]"
    :pt="{
      root: {
        style: {
          backgroundColor: '#f5ede0',
          borderInlineStartWidth: '0',
        },
      },
      header: { class: 'px-6 py-4' },
      content: { style: { padding: '0' } },
    }"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-outfit-variable text-xl">Mi carrito</span>
        <Badge
          v-if="carritoStore.totalItems > 0"
          :value="carritoStore.totalItems"
          class="bg-black! text-white! text-[12px]!"
        />
      </div>
    </template>

    <!-- Barra envío gratis -->
    <div class="w-full bg-black flex flex-col items-center justify-center py-3 gap-2">
      <div v-if="envioGratis">
        <span class="text-sm text-white font-medium">El Envío es Gratis</span>
      </div>
      <div class="w-[90%]">
        <div class="w-full h-1 bg-camel rounded-full" :class="{ 'animate-pulse': envioGratis }" />
      </div>
    </div>

    <!-- Vacío -->
    <div
      v-if="carritoStore.estaVacio"
      class="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-20"
    >
      <i class="pi pi-shopping-bag text-5xl text-gray-200" />
      <p class="text-gray-400 text-sm">Tu carrito está vacío</p>
      <Button label="Ver productos" severity="contrast" rounded size="small" @click="irACatalogo" />
    </div>

    <div v-else class="flex flex-col" style="height: calc(100% - 56px)">
      <!-- Items -->
      <div class="flex-1 overflow-y-auto px-6">
        <div
          v-for="item in carritoStore.items"
          :key="item.varianteId"
          class="flex gap-4 py-5 border-b border-camel items-stretch"
        >
          <!-- Imagen -->
          <div class="w-28 h-40 rounded-lg overflow-hidden border border-transparent bg-gray-50">
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
          <div class="flex flex-col justify-between flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <div>
                <p class="text-sm font-outfit-thin text-camel">{{ item.productoNombre }}</p>
                <p class="text-xs text-mocha mt-0.5 uppercase tracking-wide">
                  {{ item.color }}{{ item.color && item.talla ? ' · ' : '' }}{{ item.talla }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">{{ item.sku }}</p>
              </div>
              <span class="text-sm font-outfit-semibold text-mocha shrink-0">
                S/. {{ (item.precio * item.cantidad).toFixed(2) }}
              </span>
            </div>

            <div class="flex items-center justify-between mt-auto">
              <!-- Cantidad -->
              <div class="flex items-center gap-3 bg-camel/35 rounded-full py-1 px-2">
                <button
                  :disabled="item.cantidad <= 1"
                  class="cursor-pointer w-6 h-6 flex items-center justify-center text-mocha hover:text-black transition-colors disabled:opacity-40"
                  @click="carritoStore.actualizarCantidad(item.varianteId, item.cantidad - 1)"
                >
                  <i class="pi pi-minus text-[11px]" />
                </button>
                <span class="text-sm w-4 text-center font-medium">{{ item.cantidad }}</span>
                <button
                  :disabled="item.cantidad >= item.stockDisponible"
                  class="cursor-pointer w-6 h-6 flex items-center justify-center text-mocha hover:text-black transition-colors disabled:opacity-40"
                  @click="carritoStore.actualizarCantidad(item.varianteId, item.cantidad + 1)"
                >
                  <i class="pi pi-plus text-[11px]" />
                </button>
              </div>

              <!-- Quitar -->
              <button
                class="cursor-pointer text-xs text-mocha hover:text-red-800 transition-colors tracking-widest uppercase"
                @click="carritoStore.quitar(item.varianteId)"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-auto px-6 py-6 space-y-3 font-outfit-medium" style="background-color: #f5ede0">
        <div class="w-full mx-auto border-t pb-4 border-mocha"></div>
        <div class="flex font-outfit-light justify-between text-sm text-mocha">
          <span>Subtotal</span>
          <span>S/. {{ carritoStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex font-outfit-light justify-between text-sm text-mocha pb-4">
          <span>Envío</span>
          <span :class="envioGratis ? 'text-mocha font-outfit-medium' : 'text-gray-800'">
            {{ envioGratis ? 'Gratis' : 'Calculado al finalizar' }}
          </span>
        </div>
        <div
          class="flex justify-between text-base font-outfit-bold text-mocha pt-4 border-t border-mocha pb-4"
        >
          <span>Total</span>
          <span>S/. {{ carritoStore.subtotal.toFixed(2) }}</span>
        </div>

        <button
          class="w-full bg-mocha text-cream text-sm font-outfit-medium tracking-widest uppercase rounded-full py-4 hover:bg-orange-700 hover:cursor-pointer transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="irACheckout"
        >
          Finalizar compra <i class="w-0.5 h-0.5 pi pi-arrow-right ml-1"></i>
        </button>

        <p class="text-center text-[11px] text-camel tracking-wide uppercase pt-2">
          Pago seguro - 30 días devolución
        </p>
      </div>
    </div>
  </Drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito.store'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const visible = defineModel({ type: Boolean, default: false })
const router = useRouter()
const carritoStore = useCarritoStore()

const envioGratis = computed(() => carritoStore.subtotal >= 50)

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const irACheckout = () => {
  visible.value = false
  router.push('/checkout')
}

const irACatalogo = () => {
  visible.value = false
  router.push('/catalogo')
}
</script>
