<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useFavoritosStore } from '@/stores/favoritos.store'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const { cargarUsuario } = useAuth()
const favoritosStore = useFavoritosStore()

onMounted(async () => {
  await cargarUsuario()
  await favoritosStore.cargar()
})
</script>
