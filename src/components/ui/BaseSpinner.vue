<template>
  <div :class="contenedorClases">
    <div :class="spinnerClases" />
    <p v-if="texto" class="mt-3 text-sm text-gray-500">{{ texto }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tamano: { type: String, default: 'md' },
  texto: { type: String, default: '' },
  centrado: { type: Boolean, default: true },
})

const contenedorClases = computed(() => [
  props.centrado ? 'flex flex-col items-center justify-center' : '',
])

const spinnerClases = computed(() => {
  const tamanos = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }
  return [
    'rounded-full border-gray-200 border-t-black animate-spin',
    tamanos[props.tamano] || tamanos.md,
  ]
})
</script>
