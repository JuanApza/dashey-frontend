<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300',
        sidebarAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <RouterLink to="/" class="text-lg font-bold tracking-widest uppercase">DASHEY</RouterLink>
        <button @click="sidebarAbierto = false" class="lg:hidden text-gray-400 hover:text-black">
          <i class="pi pi-times" />
        </button>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 px-3 py-4 overflow-y-auto">
        <div class="space-y-0.5">
          <RouterLink
            v-for="item in navItems"
            :key="item.ruta"
            :to="item.ruta"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              $route.path.startsWith(item.ruta)
                ? 'bg-black text-white font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-black',
            ]"
          >
            <i :class="[item.icono, 'text-sm w-4']" />
            {{ item.label }}
            <span
              v-if="item.badge"
              class="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </div>
      </nav>

      <!-- Footer del sidebar -->
      <div class="px-3 py-4 border-t border-gray-100">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
        >
          <i class="pi pi-arrow-left text-sm w-4" />
          Volver a la tienda
        </RouterLink>
        <button
          @click="cerrarSesion"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-0.5"
        >
          <i class="pi pi-sign-out text-sm w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Overlay móvil -->
    <div
      v-if="sidebarAbierto"
      @click="sidebarAbierto = false"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
    />

    <!-- Contenido principal -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Topbar -->
      <header
        class="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30"
      >
        <button
          @click="sidebarAbierto = true"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <i class="pi pi-bars text-lg" />
        </button>
        <h1 class="text-base font-semibold text-gray-900">{{ tituloPagina }}</h1>
        <div class="ml-auto flex items-center gap-3">
          <span class="text-sm text-gray-500 hidden sm:block">
            {{ authStore.usuario?.nombre }}
          </span>
          <div
            class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium"
          >
            {{ iniciales }}
          </div>
        </div>
      </header>

      <!-- Vista -->
      <main class="flex-1 p-4 sm:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()

const sidebarAbierto = ref(false)

const navItems = [
  { ruta: '/admin/dashboard', label: 'Dashboard', icono: 'pi pi-chart-bar' },
  { ruta: '/admin/productos', label: 'Productos', icono: 'pi pi-box' },
  { ruta: '/admin/categorias', label: 'Categorías', icono: 'pi pi-tags' },
  { ruta: '/admin/pedidos', label: 'Pedidos', icono: 'pi pi-shopping-bag' },
  { ruta: '/admin/cupones', label: 'Cupones', icono: 'pi pi-tag' },
  { ruta: '/admin/resenas', label: 'Reseñas', icono: 'pi pi-star' },
  { ruta: '/admin/usuarios', label: 'Clientes', icono: 'pi pi-users' },
]

const tituloPagina = computed(() => {
  const item = navItems.find((i) => route.path.startsWith(i.ruta))
  return item?.label || 'Panel admin'
})

const iniciales = computed(() => {
  const nombre = authStore.usuario?.nombre || ''
  return nombre
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const cerrarSesion = async () => {
  await logout()
}
</script>
