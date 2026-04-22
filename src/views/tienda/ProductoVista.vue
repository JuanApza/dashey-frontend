<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Skeleton loading -->
    <div v-if="catalogoStore.cargando" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="aspect-square bg-gray-100 rounded-xl animate-pulse" />
      <div class="space-y-4">
        <div class="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
        <div class="h-8 bg-gray-100 rounded animate-pulse w-2/3" />
        <div class="h-6 bg-gray-100 rounded animate-pulse w-1/4" />
      </div>
    </div>

    <!-- Producto -->
    <template v-else-if="producto">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
        <span>/</span>
        <RouterLink to="/catalogo" class="hover:text-black transition-colors">Catálogo</RouterLink>
        <span>/</span>
        <span class="text-gray-900 font-medium truncate">{{ producto.nombre }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Galería -->
        <div class="space-y-3">
          <div class="aspect-square bg-gray-50 rounded-xl overflow-hidden">
            <img
              v-if="imagenActiva"
              :src="imagenUrl(imagenActiva.url)"
              :alt="imagenActiva.alt_text || producto.nombre"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="pi pi-image text-6xl text-gray-200" />
            </div>
          </div>

          <!-- Miniaturas -->
          <div v-if="imagenesFiltradas.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="imagen in imagenesFiltradas"
              :key="imagen.id"
              @click="imagenActiva = imagen"
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                imagenActiva?.id === imagen.id
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300',
              ]"
            >
              <img
                :src="imagenUrl(imagen.url)"
                :alt="imagen.alt_text"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Info del producto -->
        <div>
          <p v-if="producto.marca" class="text-xs text-gray-400 uppercase tracking-wider mb-2">
            {{ producto.marca }}
          </p>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {{ producto.nombre }}
          </h1>

          <!-- Precio -->
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl font-bold text-black">
              {{ formatearPrecio(precioActual) }}
            </span>
            <span
              v-if="varianteSeleccionada?.precio_oferta"
              class="text-lg text-gray-400 line-through"
            >
              {{ formatearPrecio(varianteSeleccionada.precio) }}
            </span>
            <span
              v-if="varianteSeleccionada?.precio_oferta"
              class="bg-black text-white text-xs px-2 py-1 rounded-full"
            >
              -{{ porcentajeOferta }}%
            </span>
          </div>

          <!-- Selector de color -->
          <div v-if="coloresDisponibles.length" class="mb-5">
            <p class="text-sm font-medium text-gray-700 mb-2">
              Color:
              <span class="font-normal text-gray-500">{{
                colorSeleccionado || 'Selecciona uno'
              }}</span>
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in coloresDisponibles"
                :key="color.nombre"
                @click="seleccionarColor(color.nombre)"
                :title="color.nombre"
                :style="{ backgroundColor: color.hex || '#e5e7eb' }"
                :class="[
                  'w-8 h-8 rounded-full border-2 transition-all',
                  colorSeleccionado === color.nombre
                    ? 'border-black scale-110 ring-2 ring-offset-1 ring-black'
                    : 'border-transparent hover:border-gray-400 hover:scale-105',
                ]"
              />
            </div>
          </div>

          <!-- Selector de talla -->
          <div v-if="tallasDisponibles.length" class="mb-5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-gray-700">
                Talla:
                <span class="font-normal text-gray-500">{{
                  tallaSeleccionada || 'Selecciona una'
                }}</span>
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="talla in tallasDisponibles"
                :key="talla.talla"
                @click="seleccionarTalla(talla.talla)"
                :disabled="!talla.disponible"
                :class="[
                  'min-w-[44px] h-10 px-3 text-sm font-medium rounded-lg border-2 transition-all',
                  tallaSeleccionada === talla.talla
                    ? 'bg-black text-white border-black'
                    : talla.disponible
                      ? 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black'
                      : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through',
                ]"
              >
                {{ talla.talla }}
              </button>
            </div>
          </div>

          <!-- Stock -->
          <div v-if="varianteSeleccionada" class="mb-5">
            <p
              v-if="varianteSeleccionada.stock > 5"
              class="text-xs text-green-600 flex items-center gap-1"
            >
              <i class="pi pi-check-circle" /> En stock
            </p>
            <p
              v-else-if="varianteSeleccionada.stock > 0"
              class="text-xs text-yellow-600 flex items-center gap-1"
            >
              <i class="pi pi-exclamation-triangle" /> Últimas
              {{ varianteSeleccionada.stock }} unidades
            </p>
            <p v-else class="text-xs text-red-500 flex items-center gap-1">
              <i class="pi pi-times-circle" /> Agotado
            </p>
          </div>

          <!-- Cantidad -->
          <div
            v-if="varianteSeleccionada && varianteSeleccionada.stock > 0"
            class="flex items-center gap-3 mb-6"
          >
            <p class="text-sm font-medium text-gray-700">Cantidad:</p>
            <div class="flex items-center border border-gray-200 rounded-lg">
              <button
                @click="cantidad > 1 ? cantidad-- : null"
                class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-lg"
              >
                <i class="pi pi-minus text-xs" />
              </button>
              <span class="w-10 text-center text-sm font-medium">{{ cantidad }}</span>
              <button
                @click="cantidad < varianteSeleccionada.stock ? cantidad++ : null"
                class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-r-lg"
              >
                <i class="pi pi-plus text-xs" />
              </button>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              @click="agregarAlCarrito"
              :disabled="!varianteSeleccionada || varianteSeleccionada.stock === 0"
              class="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="pi pi-shopping-cart" />
              {{ !varianteSeleccionada ? 'Selecciona talla y color' : 'Agregar al carrito' }}
            </button>
            <a
              :href="linkWhatsapp"
              target="_blank"
              class="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-3.5 px-5 rounded-xl hover:border-green-500 hover:text-green-600 transition-colors"
            >
              <i class="pi pi-whatsapp" />
              Consultar
            </a>
          </div>

          <!-- Descripción -->
          <div v-if="producto.descripcion" class="border-t border-gray-100 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Descripción</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ producto.descripcion }}</p>
          </div>

          <!-- Material -->
          <div v-if="producto.material" class="border-t border-gray-100 pt-4 mt-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Composición</h3>
            <p class="text-sm text-gray-600">{{ producto.material }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- No encontrado -->
    <div v-else class="text-center py-24">
      <i class="pi pi-search text-4xl text-gray-200 mb-4 block" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
      <RouterLink to="/catalogo" class="text-sm text-gray-400 hover:text-black underline">
        Volver al catálogo
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCatalogoStore } from '@/stores/catalogo.store'
import { useCarrito } from '@/composables/useCarrito'
import { formatearPrecio } from '@/utils/formato'

const route = useRoute()
const catalogoStore = useCatalogoStore()
const { agregar } = useCarrito()

const colorSeleccionado = ref(null)
const tallaSeleccionada = ref(null)
const cantidad = ref(1)
const imagenActiva = ref(null)

const producto = computed(() => catalogoStore.producto)

const whatsapp = import.meta.env.VITE_WHATSAPP || '51999999999'

const linkWhatsapp = computed(() => {
  if (!producto.value) return `https://wa.me/${whatsapp}`
  const msg = encodeURIComponent(
    `Hola, me interesa el producto: ${producto.value.nombre}\n${window.location.href}`,
  )
  return `https://wa.me/${whatsapp}?text=${msg}`
})

// Colores únicos disponibles
const coloresDisponibles = computed(() => {
  if (!producto.value?.variantes) return []
  const mapa = {}
  producto.value.variantes
    .filter((v) => v.activo && v.stock > 0)
    .forEach((v) => {
      if (!mapa[v.color]) mapa[v.color] = { nombre: v.color, hex: v.codigo_hex }
    })
  return Object.values(mapa)
})

// Tallas disponibles según color seleccionado
const tallasDisponibles = computed(() => {
  if (!producto.value?.variantes) return []
  return producto.value.variantes
    .filter((v) => v.activo && (!colorSeleccionado.value || v.color === colorSeleccionado.value))
    .map((v) => ({ talla: v.talla, disponible: v.stock > 0 }))
    .filter((t, i, arr) => arr.findIndex((x) => x.talla === t.talla) === i)
})

// Variante actualmente seleccionada
const varianteSeleccionada = computed(() => {
  if (!colorSeleccionado.value || !tallaSeleccionada.value) return null
  return (
    producto.value?.variantes?.find(
      (v) => v.color === colorSeleccionado.value && v.talla === tallaSeleccionada.value,
    ) || null
  )
})

const precioActual = computed(() => {
  if (!varianteSeleccionada.value) {
    const precios =
      producto.value?.variantes?.map((v) => parseFloat(v.precio_oferta || v.precio)) || []
    return precios.length ? Math.min(...precios) : 0
  }
  return parseFloat(varianteSeleccionada.value.precio_oferta || varianteSeleccionada.value.precio)
})

const porcentajeOferta = computed(() => {
  if (!varianteSeleccionada.value?.precio_oferta) return 0
  return Math.round(
    (1 - varianteSeleccionada.value.precio_oferta / varianteSeleccionada.value.precio) * 100,
  )
})

// Imágenes filtradas según color seleccionado
const imagenesFiltradas = computed(() => {
  if (!producto.value?.imagenes) return []
  if (!colorSeleccionado.value) return producto.value.imagenes
  const varianteId = varianteSeleccionada.value?.id
  return producto.value.imagenes.filter((img) => !img.variante_id || img.variante_id === varianteId)
})

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const seleccionarColor = (color) => {
  colorSeleccionado.value = color
  tallaSeleccionada.value = null
  cantidad.value = 1
  const imagen =
    imagenesFiltradas.value.find((img) => img.es_principal) || imagenesFiltradas.value[0]
  if (imagen) imagenActiva.value = imagen
}

const seleccionarTalla = (talla) => {
  tallaSeleccionada.value = talla
  cantidad.value = 1
}

const agregarAlCarrito = () => {
  if (!varianteSeleccionada.value) return
  agregar(producto.value, varianteSeleccionada.value, cantidad.value)
}

onMounted(async () => {
  await catalogoStore.getProducto(route.params.slug)
  if (producto.value?.imagenes?.length) {
    imagenActiva.value =
      producto.value.imagenes.find((img) => img.es_principal) || producto.value.imagenes[0]
  }
})

watch(
  () => route.params.slug,
  async (slug) => {
    if (slug) await catalogoStore.getProducto(slug)
  },
)
</script>
