<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Mis favoritos</span>
    </nav>

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Mis favoritos
        <span v-if="favoritosStore.total" class="text-gray-400 font-normal text-lg ml-2">
          ({{ favoritosStore.total }})
        </span>
      </h1>
    </div>

    <!-- Skeleton -->
    <div
      v-if="favoritosStore.cargando"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
    </div>

    <!-- Vacío -->
    <div v-else-if="!favoritosStore.favoritos.length" class="text-center py-24">
      <i class="pi pi-heart text-5xl text-gray-200 mb-4 block" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">No tienes favoritos aún</h2>
      <p class="text-gray-400 text-sm mb-8">Guarda los productos que más te gustan</p>
      <RouterLink
        to="/catalogo"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Ver catálogo
      </RouterLink>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="favorito in favoritosStore.favoritos"
        :key="favorito.id"
        class="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
      >
        <!-- Imagen -->
        <div class="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <img
            v-if="favorito.imagen_principal"
            :src="imagenUrl(favorito.imagen_principal)"
            :alt="favorito.nombre"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-image text-4xl text-gray-200" />
          </div>

          <!-- Botón quitar favorito -->
          <button
            @click="quitarFavorito(favorito.producto_id)"
            class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
          >
            <i class="pi pi-heart-fill text-sm text-red-500" />
          </button>
        </div>

        <!-- Info -->
        <RouterLink :to="`/catalogo/${favorito.slug}`" class="block p-3">
          <p v-if="favorito.marca" class="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {{ favorito.marca }}
          </p>
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {{ favorito.nombre }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-black">
              {{ formatearPrecio(favorito.oferta_desde || favorito.precio_desde) }}
            </span>
            <span v-if="favorito.oferta_desde" class="text-xs text-gray-400 line-through">
              {{ formatearPrecio(favorito.precio_desde) }}
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritosStore } from '@/stores/favoritos.store'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio } from '@/utils/formato'

const favoritosStore = useFavoritosStore()
const uiStore = useUiStore()

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const quitarFavorito = async (productoId) => {
  await favoritosStore.toggle(productoId)
  uiStore.info('Eliminado', 'Producto eliminado de favoritos')
}

onMounted(() => favoritosStore.cargar())
</script>
