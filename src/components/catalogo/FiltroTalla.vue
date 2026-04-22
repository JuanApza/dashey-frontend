<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="talla in tallas"
      :key="talla"
      @click="seleccionar(talla)"
      :class="[
        'min-w-[40px] h-9 px-2 text-xs font-medium rounded-lg border transition-all',
        filtros.talla === talla
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black',
      ]"
    >
      {{ talla }}
    </button>
  </div>
</template>

<script setup>
import { useFiltros } from '@/composables/useFiltros'

const { filtros, aplicarFiltro } = useFiltros()

const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34']

const seleccionar = (talla) => {
  const nuevo = filtros.talla === talla ? null : talla
  aplicarFiltro('talla', nuevo)
}
</script>
