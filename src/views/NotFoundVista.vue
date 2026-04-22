<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300">404</h1>
      <p class="text-gray-500 mt-4">Página no encontrada</p>
      <RouterLink to="/" class="mt-6 inline-block text-black underline">
        Volver al inicio
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
