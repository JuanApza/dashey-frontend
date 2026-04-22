<template>
  <ul class="space-y-1">
    <li v-for="categoria in categorias" :key="categoria.id">
      <button
        @click="seleccionar(categoria.slug)"
        :class="[
          'w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors',
          filtros.categoria === categoria.slug
            ? 'bg-black text-white font-medium'
            : 'text-gray-600 hover:bg-gray-50 hover:text-black',
        ]"
      >
        {{ categoria.nombre }}
      </button>

      <!-- Subcategorías -->
      <ul
        v-if="categoria.hijos?.length && filtros.categoria?.startsWith(categoria.slug)"
        class="ml-3 mt-1 space-y-1"
      >
        <li v-for="hijo in categoria.hijos" :key="hijo.id">
          <button
            @click="seleccionar(hijo.slug)"
            :class="[
              'w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors',
              filtros.categoria === hijo.slug
                ? 'bg-gray-100 text-black font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-black',
            ]"
          >
            {{ hijo.nombre }}
          </button>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { useCatalogoStore } from '@/stores/catalogo.store'
import { useFiltros } from '@/composables/useFiltros'
import { computed } from 'vue'

const catalogoStore = useCatalogoStore()
const { filtros, aplicarFiltro } = useFiltros()

const categorias = computed(() => catalogoStore.categorias)

const seleccionar = (slug) => {
  const nuevo = filtros.categoria === slug ? null : slug
  aplicarFiltro('categoria', nuevo)
}
</script>
