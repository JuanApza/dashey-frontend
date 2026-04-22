<template>
  <div class="flex flex-col gap-1">
    <label v-if="etiqueta" :for="id" class="text-sm font-medium text-gray-700">
      {{ etiqueta }}
      <span v-if="requerido" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <span v-if="$slots.izquierda" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <slot name="izquierda" />
      </span>

      <input
        :id="id"
        :type="tipo"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :class="clases"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <span v-if="$slots.derecha" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <slot name="derecha" />
      </span>
    </div>

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-else-if="ayuda" class="text-xs text-gray-500">{{ ayuda }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  etiqueta: { type: String, default: '' },
  tipo: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  ayuda: { type: String, default: '' },
  deshabilitado: { type: Boolean, default: false },
  requerido: { type: Boolean, default: false },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2)}` },
})

defineEmits(['update:modelValue'])

const clases = computed(() => {
  const base =
    'w-full rounded-lg border text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-400'
  const padding = 'px-3 py-2.5'
  const borde = props.error
    ? 'border-red-400 focus:ring-red-400'
    : 'border-gray-300 focus:border-black'
  return [base, padding, borde]
})
</script>
