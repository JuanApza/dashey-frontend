<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <Transition v-for="toast in uiStore.toasts" :key="toast.id" name="toast" appear>
        <div
          :class="[
            'flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg pointer-events-auto',
            clases[toast.tipo] || clases.info,
          ]"
        >
          <i :class="[iconos[toast.tipo] || iconos.info, 'text-sm mt-0.5 flex-shrink-0']" />
          <div class="flex-1 min-w-0">
            <p v-if="toast.titulo" class="text-sm font-semibold leading-tight">
              {{ toast.titulo }}
            </p>
            <p v-if="toast.mensaje" class="text-xs opacity-80 mt-0.5 leading-snug">
              {{ toast.mensaje }}
            </p>
          </div>
          <button
            @click="uiStore.quitarToast(toast.id)"
            class="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <i class="pi pi-times text-xs" />
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui.store'

const uiStore = useUiStore()

const clases = {
  exito: 'bg-white border-green-200 text-green-800',
  error: 'bg-white border-red-200 text-red-800',
  alerta: 'bg-white border-yellow-200 text-yellow-800',
  info: 'bg-white border-blue-200 text-blue-800',
}

const iconos = {
  exito: 'pi pi-check-circle text-green-500',
  error: 'pi pi-times-circle text-red-500',
  alerta: 'pi pi-exclamation-triangle text-yellow-500',
  info: 'pi pi-info-circle text-blue-500',
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
