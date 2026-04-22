<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="color in colores"
      :key="color.nombre"
      @click="seleccionar(color.nombre)"
      :title="color.nombre"
      class="relative group"
    >
      <span
        :style="{ backgroundColor: color.hex }"
        :class="[
          'block w-7 h-7 rounded-full border-2 transition-all',
          filtros.color === color.nombre
            ? 'border-black scale-110'
            : 'border-transparent hover:border-gray-300 hover:scale-110',
        ]"
      />
      <span
        class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {{ color.nombre }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { useFiltros } from '@/composables/useFiltros'

const { filtros, aplicarFiltro } = useFiltros()

const colores = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Gris', hex: '#9CA3AF' },
  { nombre: 'Azul marino', hex: '#1E3A5F' },
  { nombre: 'Rojo', hex: '#EF4444' },
  { nombre: 'Verde', hex: '#22C55E' },
  { nombre: 'Amarillo', hex: '#EAB308' },
  { nombre: 'Beige', hex: '#D4B896' },
]

const seleccionar = (nombre) => {
  const nuevo = filtros.color === nombre ? null : nombre
  aplicarFiltro('color', nuevo)
}
</script>
