<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const { cargarUsuario } = useAuth()

onMounted(async () => {
  await cargarUsuario()
})
</script>
