<template>
  <header class="bg-white sticky top-0 z-50 shadow-[0_1px_0_0_#f0f0f0]">
    <!-- Barra principal -->
    <div class="w-full mx-auto sm:px-6 lg:px-8">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <RouterLink to="/" class="shrink-0">
          <span class="text-xl font-bold tracking-[0.25em] uppercase">
            <span class="text-black">DASHE</span><span :style="{ color: COLOR_ACENTO }">Y</span>
          </span>
        </RouterLink>

        <!-- Buscador desktop -->
        <div class="hidden md:flex flex-1 max-w-sm relative">
          <InputText
            v-model="busqueda"
            placeholder="Buscar en la tienda..."
            class="w-full rounded-full! text-sm! border-gray-200! pr-10!"
            @keyup.enter="buscar"
          />
          <Button
            icon="pi pi-search"
            text
            rounded
            severity="secondary"
            size="small"
            class="absolute! right-1 top-1/2 -translate-y-1/2"
            @click="buscar"
          />
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-0.5">
          <!-- Búsqueda móvil -->
          <Button
            icon="pi pi-search"
            text
            rounded
            severity="secondary"
            class="md:hidden"
            @click="mostrarBusquedaMovil = !mostrarBusquedaMovil"
          />

          <!-- Usuario autenticado -->
          <div v-if="authStore.estaAutenticado" ref="menuUsuarioRef" class="relative">
            <Button
              text
              rounded
              severity="secondary"
              class="flex! items-center! gap-1.5! px-2!"
              @click="menuUsuario = !menuUsuario"
            >
              <Avatar
                :label="inicialUsuario"
                size="small"
                shape="circle"
                class="bg-black! text-white! text-xs! font-semibold!"
              />
              <span class="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-20">
                {{ nombreCorto }}
              </span>
              <i class="pi pi-chevron-down text-[10px] text-gray-400 hidden sm:block" />
            </Button>

            <!-- Dropdown usuario -->
            <Transition name="dropdown">
              <div
                v-if="menuUsuario"
                class="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div class="px-4 py-3 border-b border-gray-50">
                  <p class="text-[11px] text-gray-400 uppercase tracking-wide">Conectada como</p>
                  <p class="text-sm font-semibold text-gray-800 truncate mt-0.5">
                    {{ authStore.usuario?.nombre }}
                  </p>
                </div>
                <div class="py-1">
                  <RouterLink
                    to="/mis-pedidos"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                    @click="menuUsuario = false"
                  >
                    <i class="pi pi-shopping-bag text-gray-400 text-sm" />
                    Mis pedidos
                  </RouterLink>
                  <RouterLink
                    v-if="authStore.esAdmin"
                    to="/admin"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                    @click="menuUsuario = false"
                  >
                    <i class="pi pi-cog text-gray-400 text-sm" />
                    Panel admin
                  </RouterLink>
                </div>
                <div class="border-t border-gray-50 py-1">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    @click="cerrarSesion"
                  >
                    <i class="pi pi-sign-out text-sm" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Login si no autenticado -->
          <RouterLink v-else to="/auth/login">
            <Button icon="pi pi-user" text rounded severity="secondary" />
          </RouterLink>

          <!-- Carrito — siempre navega a /carrito -->
          <RouterLink to="/carrito" class="relative inline-flex">
            <Button icon="pi pi-shopping-bag" text rounded severity="secondary" />
            <Badge
              v-if="carritoStore.totalItems > 0"
              :value="carritoStore.totalItems > 9 ? '9+' : carritoStore.totalItems"
              class="absolute! -top-1! -right-1! bg-black! min-w-[1.15rem]! h-[1.15rem]! text-[10px]! p-0! leading-[1.15rem]!"
            />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Búsqueda móvil expandida -->
    <Transition name="slide-down">
      <div v-if="mostrarBusquedaMovil" class="md:hidden border-t border-gray-100 px-4 py-3">
        <div class="relative">
          <InputText
            v-model="busqueda"
            placeholder="Buscar en la tienda..."
            class="w-full rounded-full! text-sm! border-gray-200! pr-10!"
            autofocus
            @keyup.enter="buscarYCerrar"
          />
          <Button
            icon="pi pi-search"
            text
            rounded
            severity="secondary"
            size="small"
            class="absolute! right-1 top-1/2 -translate-y-1/2"
            @click="buscarYCerrar"
          />
        </div>
      </div>
    </Transition>

    <!-- Categorías desktop: con submenús hover -->
    <nav class="border-t border-gray-100 hidden md:block">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul class="flex items-center justify-center gap-x-2">
          <li>
            <RouterLink
              to="/catalogo"
              class="nav-link"
              :class="{ 'nav-link-activo': $route.name === 'catalogo' && !$route.query.categoria }"
            >
              Todo
            </RouterLink>
          </li>

          <li
            v-for="cat in catalogoStore.categorias"
            :key="cat.id"
            class="relative group flex-shrink-0"
          >
            <RouterLink
              :to="`/catalogo?categoria=${cat.slug}`"
              class="nav-link"
              :class="{ 'nav-link-activo': $route.query.categoria === cat.slug }"
            >
              {{ cat.nombre }}
            </RouterLink>

            <div
              v-if="cat.hijos?.length"
              class="absolute left-0 top-full bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[180px] z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <RouterLink
                v-for="hijo in cat.hijos"
                :key="hijo.id"
                :to="`/catalogo?categoria=${hijo.slug}`"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
              >
                {{ hijo.nombre }}
              </RouterLink>
            </div>
          </li>

          <li>
            <RouterLink
              to="/catalogo?destacado=true"
              class="nav-link font-medium"
              :style="{ color: COLOR_ACENTO }"
            >
              Ofertas
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Categorías móvil: strip horizontal sin submenús -->
    <div class="md:hidden border-t border-gray-100 overflow-x-auto scrollbar-none">
      <div class="flex items-center px-4 min-w-max">
        <RouterLink
          to="/catalogo"
          class="cat-chip"
          :class="{ 'cat-chip-activo': $route.name === 'catalogo' && !$route.query.categoria }"
        >
          Todo
        </RouterLink>
        <RouterLink
          v-for="cat in catalogoStore.categorias"
          :key="cat.id"
          :to="`/catalogo?categoria=${cat.slug}`"
          class="cat-chip"
          :class="{ 'cat-chip-activo': $route.query.categoria === cat.slug }"
        >
          {{ cat.nombre }}
        </RouterLink>
        <RouterLink
          to="/catalogo?destacado=true"
          class="cat-chip font-medium"
          :style="{ color: COLOR_ACENTO }"
        >
          Ofertas
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useCarritoStore } from '@/stores/carrito.store'
import { useCatalogoStore } from '@/stores/catalogo.store'
import { useAuth } from '@/composables/useAuth'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'

const COLOR_ACENTO = '#C8A96E'

const router = useRouter()
const authStore = useAuthStore()
const carritoStore = useCarritoStore()
const catalogoStore = useCatalogoStore()
const { logout } = useAuth()

const busqueda = ref('')
const menuUsuario = ref(false)
const mostrarBusquedaMovil = ref(false)
const menuUsuarioRef = ref(null)

const inicialUsuario = computed(() => authStore.usuario?.nombre?.charAt(0)?.toUpperCase() ?? 'U')
const nombreCorto = computed(() => authStore.usuario?.nombre?.split(' ')[0] ?? '')

const buscar = () => {
  const q = busqueda.value.trim()
  if (!q) return
  router.push({ name: 'catalogo', query: { busqueda: q } })
}

const buscarYCerrar = () => {
  buscar()
  mostrarBusquedaMovil.value = false
}

const cerrarSesion = async () => {
  menuUsuario.value = false
  await logout()
}

const handleClickFuera = (e) => {
  if (menuUsuarioRef.value && !menuUsuarioRef.value.contains(e.target)) {
    menuUsuario.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickFuera)
  if (!catalogoStore.categorias.length) {
    await catalogoStore.getCategorias()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickFuera)
})
</script>

<style scoped>
/* ── Categorías desktop ── */
.nav-link {
  display: block;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}
.nav-link:hover {
  color: #111;
}
.nav-link-activo {
  color: #111;
  font-weight: 500;
  border-bottom-color: #111;
}

/* ── Categorías móvil ── */
.cat-chip {
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}
.cat-chip:hover {
  color: #111;
}
.cat-chip-activo {
  color: #111;
  font-weight: 500;
  border-bottom-color: #111;
}

/* ── Scrollbar oculto ── */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ── Animaciones ── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
