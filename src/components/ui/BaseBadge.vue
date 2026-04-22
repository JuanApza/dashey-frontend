<template>
  <span :class="clases">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variante: { type: String, default: 'gris' },
  tamano: { type: String, default: 'md' },
})

const clases = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full'

  const variantes = {
    gris: 'bg-gray-100 text-gray-700',
    negro: 'bg-black text-white',
    acento: 'bg-[#C8A96E] text-white',
    exito: 'bg-green-50 text-green-700',
    error: 'bg-red-50 text-red-700',
    alerta: 'bg-yellow-50 text-yellow-700',
    info: 'bg-blue-50 text-blue-700',
  }

  const tamanos = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return [base, variantes[props.variante] || variantes.gris, tamanos[props.tamano] || tamanos.md]
})
</script>
