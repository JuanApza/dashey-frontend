<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <label class="text-xs text-gray-500 mb-1 block">Mínimo</label>
        <input
          v-model.number="min"
          type="number"
          placeholder="S/. 0"
          min="0"
          class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
        />
      </div>
      <span class="text-gray-300 mt-5">—</span>
      <div class="flex-1">
        <label class="text-xs text-gray-500 mb-1 block">Máximo</label>
        <input
          v-model.number="max"
          type="number"
          placeholder="S/. 999"
          min="0"
          class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
        />
      </div>
    </div>
    <button
      @click="aplicar"
      class="w-full text-sm bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Aplicar
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFiltros } from '@/composables/useFiltros'

const { filtros, aplicarFiltro } = useFiltros()

const min = ref(filtros.precio_min || '')
const max = ref(filtros.precio_max || '')

const aplicar = () => {
  aplicarFiltro('precio_min', min.value || null)
  aplicarFiltro('precio_max', max.value || null)
}
</script>
