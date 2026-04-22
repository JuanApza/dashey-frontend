<template>
  <aside class="w-full">
    <!-- Header del panel -->
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Filtros</h2>
      <button
        v-if="tieneFiltros"
        @click="limpiarFiltros"
        class="text-xs text-gray-400 hover:text-black underline transition-colors"
      >
        Limpiar todo
      </button>
    </div>

    <!-- Filtros activos -->
    <div v-if="tieneFiltros" class="flex flex-wrap gap-1.5 mb-5">
      <span
        v-for="(valor, key) in filtrosActivos"
        :key="key"
        class="inline-flex items-center gap-1 bg-black text-white text-xs px-2.5 py-1 rounded-full"
      >
        {{ etiquetaFiltro(key, valor) }}
        <button @click="limpiarFiltro(key)" class="hover:opacity-70 ml-0.5">
          <i class="pi pi-times text-xs" />
        </button>
      </span>
    </div>

    <!-- Secciones de filtros -->
    <div class="space-y-1">
      <!-- Categoría -->
      <FiltroSeccion titulo="Categoría" :abierto="true">
        <FiltroCategoria />
      </FiltroSeccion>

      <!-- Talla -->
      <FiltroSeccion titulo="Talla">
        <FiltroTalla />
      </FiltroSeccion>

      <!-- Color -->
      <FiltroSeccion titulo="Color">
        <FiltroColor />
      </FiltroSeccion>

      <!-- Precio -->
      <FiltroSeccion titulo="Precio">
        <FiltroPrecio />
      </FiltroSeccion>
    </div>
  </aside>
</template>

<script setup>
import { useFiltros } from '@/composables/useFiltros'
import FiltroSeccion from './FiltroSeccion.vue'
import FiltroCategoria from './FiltroCategoria.vue'
import FiltroTalla from './FiltroTalla.vue'
import FiltroColor from './FiltroColor.vue'
import FiltroPrecio from './FiltroPrecio.vue'

const { filtrosActivos, tieneFiltros, limpiarFiltros, limpiarFiltro } = useFiltros()

const etiquetaFiltro = (key, valor) => {
  const etiquetas = {
    categoria: `Cat: ${valor}`,
    marca: `Marca: ${valor}`,
    talla: `Talla: ${valor}`,
    color: `Color: ${valor}`,
    precio_min: `Desde: S/. ${valor}`,
    precio_max: `Hasta: S/. ${valor}`,
    busqueda: `"${valor}"`,
  }
  return etiquetas[key] || valor
}
</script>
