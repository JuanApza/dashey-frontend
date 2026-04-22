<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-black text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div class="max-w-xl">
          <p class="text-xs uppercase tracking-widest text-[#C8A96E] mb-4 font-medium">
            Nueva colección
          </p>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Viste con<br />actitud DASHEY
          </h1>
          <p class="text-gray-400 text-lg mb-8 leading-relaxed">
            Ropa de calidad para quienes marcan la diferencia. Encuentra tu estilo en nuestra
            colección.
          </p>
          <div class="flex items-center gap-4">
            <RouterLink
              to="/catalogo"
              class="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver colección
              <i class="pi pi-arrow-right text-sm" />
            </RouterLink>
            <a
              :href="`https://wa.me/${whatsapp}`"
              target="_blank"
              class="inline-flex items-center gap-2 border border-gray-700 text-white text-sm font-medium px-6 py-3 rounded-lg hover:border-white transition-colors"
            >
              <i class="pi pi-whatsapp" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Comprar por categoría</h2>
      </div>

      <div v-if="catalogoStore.cargando" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="aspect-square bg-gray-100 rounded-xl animate-pulse" />
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RouterLink
          v-for="categoria in catalogoStore.categorias.slice(0, 4)"
          :key="categoria.id"
          :to="`/catalogo?categoria=${categoria.slug}`"
          class="group relative aspect-square bg-gray-900 rounded-xl overflow-hidden flex items-end p-4 hover:opacity-90 transition-opacity"
        >
          <div class="relative z-10">
            <p class="text-white font-semibold text-lg">{{ categoria.nombre }}</p>
            <p class="text-gray-400 text-xs mt-0.5 group-hover:text-gray-300 transition-colors">
              Ver todo →
            </p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Destacados</h2>
          <RouterLink
            to="/catalogo?destacado=true"
            class="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            Ver todos <i class="pi pi-arrow-right text-xs" />
          </RouterLink>
        </div>

        <div
          v-if="catalogoStore.cargando"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div v-for="i in 4" :key="i" class="bg-white rounded-xl aspect-[3/4] animate-pulse" />
        </div>

        <div
          v-else-if="catalogoStore.productos.length"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <ProductoCard
            v-for="producto in catalogoStore.productos.slice(0, 8)"
            :key="producto.id"
            :producto="producto"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-400">No hay productos destacados disponibles</p>
        </div>
      </div>
    </section>

    <!-- Banner WhatsApp -->
    <section class="bg-black text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <i class="pi pi-whatsapp text-4xl text-green-400 mb-4 block" />
        <h2 class="text-2xl font-bold mb-3">¿Tienes alguna pregunta?</h2>
        <p class="text-gray-400 mb-8 max-w-md mx-auto">
          Escríbenos por WhatsApp y te atendemos al instante. Pedidos, tallas, colores — lo que
          necesites.
        </p>
        <a
          :href="`https://wa.me/${whatsapp}?text=${mensajeWhatsapp}`"
          target="_blank"
          class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors"
        >
          <i class="pi pi-whatsapp" />
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCatalogoStore } from '@/stores/catalogo.store'
import ProductoCard from '@/components/catalogo/ProductoCard.vue'

const catalogoStore = useCatalogoStore()
const whatsapp = import.meta.env.VITE_WHATSAPP || '51999999999'
const mensajeWhatsapp = encodeURIComponent(
  'Hola, me gustaría obtener más información sobre sus productos.',
)

onMounted(async () => {
  await Promise.all([catalogoStore.getCategorias(), catalogoStore.getProductos()])
})
</script>
