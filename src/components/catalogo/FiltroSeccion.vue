<template>
  <div class="border-b border-gray-100">
    <button
      @click="abierto = !abierto"
      class="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-900 hover:text-black"
    >
      {{ titulo }}
      <i :class="abierto ? 'pi pi-angle-up' : 'pi pi-angle-down'" class="text-gray-400 text-xs" />
    </button>
    <Transition name="accordion">
      <div v-if="abierto" class="pb-4">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  abierto: { type: Boolean, default: false },
})

const abierto = ref(props.abierto)
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
