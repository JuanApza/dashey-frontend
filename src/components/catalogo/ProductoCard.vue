<template>
  <article
    class="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer"
    @click="irAProducto"
  >
    <!-- Imagen -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-50">
      <img
        v-if="imagenPrincipal"
        :src="imagenUrl"
        :alt="producto.nombre"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="pi pi-image text-4xl text-gray-200" />
      </div>

      <!-- Badge oferta -->
      <div v-if="tieneOferta" class="absolute top-3 left-3">
        <span class="bg-black text-white text-xs font-medium px-2.5 py-1 rounded-full">
          -{{ porcentajeOferta }}%
        </span>
      </div>

      <!-- Badge destacado -->
      <div v-if="producto.destacado && !tieneOferta" class="absolute top-3 left-3">
        <span class="bg-[#C8A96E] text-white text-xs font-medium px-2.5 py-1 rounded-full">
          Destacado
        </span>
      </div>

      <!-- Botón agregar rápido -->
      <div
        class="absolute bottom-3 left-0 right-0 px-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
      >
        <button
          @click.stop="agregarRapido"
          class="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <!-- Marca -->
      <p v-if="producto.marca" class="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {{ producto.marca }}
      </p>

      <!-- Nombre -->
      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-black">
        {{ producto.nombre }}
      </h3>

      <!-- Precio -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-semibold text-black">
          {{ formatearPrecio(precioDesde) }}
        </span>
        <span v-if="tieneOferta" class="text-xs text-gray-400 line-through">
          {{ formatearPrecio(producto.precio_desde) }}
        </span>
      </div>

      <!-- Colores disponibles -->
      <div v-if="colores.length" class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="color in coloresVisibles"
          :key="color.hex"
          :title="color.nombre"
          :style="{ backgroundColor: color.hex || '#e5e7eb' }"
          class="w-4 h-4 rounded-full border border-gray-200 hover:scale-110 transition-transform"
        />
        <span v-if="colores.length > 4" class="text-xs text-gray-400">
          +{{ colores.length - 4 }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito.store'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio } from '@/utils/formato'

const props = defineProps({
  producto: { type: Object, required: true },
})

const router = useRouter()
const carritoStore = useCarritoStore()
const uiStore = useUiStore()

const imagenPrincipal = computed(() => props.producto.imagen_principal)

const imagenUrl = computed(() => {
  if (!imagenPrincipal.value) return null
  if (imagenPrincipal.value.startsWith('http')) return imagenPrincipal.value
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${imagenPrincipal.value}`
})

const colores = computed(() => {
  if (!props.producto.colores) return []
  return props.producto.colores.filter(Boolean).map((nombre) => ({ nombre, hex: null }))
})

const coloresVisibles = computed(() => colores.value.slice(0, 4))

const tieneOferta = computed(
  () => props.producto.oferta_desde && props.producto.oferta_desde < props.producto.precio_desde,
)

const precioDesde = computed(() =>
  tieneOferta.value ? props.producto.oferta_desde : props.producto.precio_desde,
)

const porcentajeOferta = computed(() => {
  if (!tieneOferta.value) return 0
  return Math.round((1 - props.producto.oferta_desde / props.producto.precio_desde) * 100)
})

const irAProducto = () => {
  router.push({ name: 'producto', params: { slug: props.producto.slug } })
}

const agregarRapido = () => {
  uiStore.info('Selecciona talla', 'Elige tu talla y color en la página del producto')
  irAProducto()
}
</script>
