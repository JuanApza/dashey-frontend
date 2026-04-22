<template>
  <div v-if="visible" :class="clases" role="alert">
    <div class="flex items-start gap-3">
      <span class="text-lg leading-none mt-0.5">{{ icono }}</span>
      <div class="flex-1">
        <p v-if="titulo" class="font-medium text-sm">{{ titulo }}</p>
        <p class="text-sm opacity-90">
          <slot />
        </p>
      </div>
      <button v-if="cerrable" @click="visible = false" class="opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tipo: { type: String, default: 'info' },
  titulo: { type: String, default: '' },
  cerrable: { type: Boolean, default: false },
})

const visible = ref(true)

const iconos = { info: 'ℹ️', exito: '✅', error: '❌', alerta: '⚠️' }
const icono = computed(() => iconos[props.tipo] || iconos.info)

const clases = computed(() => {
  const base = 'rounded-lg p-4 border'
  const tipos = {
    info: 'bg-blue-50   border-blue-200   text-blue-800',
    exito: 'bg-green-50  border-green-200  text-green-800',
    error: 'bg-red-50    border-red-200    text-red-800',
    alerta: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }
  return [base, tipos[props.tipo] || tipos.info]
})
</script>
