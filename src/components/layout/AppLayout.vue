<template>
  <div class="min-h-screen flex flex-col">
    <AppMarquee />
    <AppHeader @abrir-carrito="carritoVisible = true" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <CartDrawer v-model="carritoVisible" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppMarquee from './AppMarquee.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import CartDrawer from './CartDrawer.vue'

const carritoVisible = ref(false)
</script>
