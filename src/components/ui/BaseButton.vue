<template>
  <button :type="tipo" :disabled="deshabilitado || cargando" :class="clases" v-bind="$attrs">
    <span
      v-if="cargando"
      class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
    />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variante: { type: String, default: 'primario' },
  tamano: { type: String, default: 'md' },
  tipo: { type: String, default: 'button' },
  cargando: { type: Boolean, default: false },
  deshabilitado: { type: Boolean, default: false },
  bloque: { type: Boolean, default: false },
})

const clases = computed(() => {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variantes = {
    primario: 'bg-black text-white hover:bg-gray-800 active:scale-95',
    secundario: 'bg-white text-black border border-gray-300 hover:bg-gray-50 active:scale-95',
    acento: 'bg-[#C8A96E] text-white hover:bg-[#b8955a] active:scale-95',
    fantasma: 'bg-transparent text-black hover:bg-gray-100 active:scale-95',
    peligro: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  }

  const tamanos = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
    xl: 'text-base px-8 py-4',
  }

  return [
    base,
    variantes[props.variante] || variantes.primario,
    tamanos[props.tamano] || tamanos.md,
    props.bloque ? 'w-full' : '',
  ]
})
</script>
