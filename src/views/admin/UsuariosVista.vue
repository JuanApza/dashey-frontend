<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900">Clientes</h2>
      <p class="text-sm text-gray-400 mt-0.5">{{ paginacion?.total || 0 }} clientes registrados</p>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 8" :key="i" class="flex items-center gap-4 p-4 animate-pulse">
          <div class="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-100 rounded w-32" />
            <div class="h-3 bg-gray-100 rounded w-48" />
          </div>
          <div class="h-6 bg-gray-100 rounded w-16" />
        </div>
      </div>

      <div v-else-if="!usuarios.length" class="text-center py-16">
        <i class="pi pi-users text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay clientes registrados</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="usuario in usuarios"
          :key="usuario.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Avatar -->
          <div
            class="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
          >
            {{ iniciales(usuario.nombre) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ usuario.nombre }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ usuario.email }}</p>
          </div>

          <!-- Teléfono -->
          <p class="text-xs text-gray-400 hidden sm:block flex-shrink-0">
            {{ usuario.telefono || '—' }}
          </p>

          <!-- Fecha -->
          <p class="text-xs text-gray-400 hidden md:block flex-shrink-0">
            {{ formatearFecha(usuario.creado_en) }}
          </p>

          <!-- Estado -->
          <span
            :class="[
              'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
              usuario.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
            ]"
          >
            {{ usuario.activo ? 'Activo' : 'Inactivo' }}
          </span>

          <!-- Rol -->
          <span
            :class="[
              'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
              usuario.rol === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ usuario.rol }}
          </span>
        </div>
      </div>

      <!-- Paginación -->
      <div
        v-if="paginacion?.totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-gray-100"
      >
        <p class="text-xs text-gray-400">
          Página {{ paginacion.page }} de {{ paginacion.totalPages }}
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="!paginacion.hasPrev"
            @click="irAPagina(paginacion.page - 1)"
            class="p-1.5 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-colors"
          >
            <i class="pi pi-angle-left text-xs" />
          </button>
          <button
            :disabled="!paginacion.hasNext"
            @click="irAPagina(paginacion.page + 1)"
            class="p-1.5 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-colors"
          >
            <i class="pi pi-angle-right text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui.store'
import { formatearFecha } from '@/utils/formato'

const uiStore = useUiStore()
const usuarios = ref([])
const paginacion = ref(null)
const cargando = ref(true)
const paginaActual = ref(1)

const iniciales = (nombre) => {
  return (
    nombre
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  )
}

const cargar = async () => {
  cargando.value = true
  try {
    const { default: api } = await import('@/services/api')
    const res = await api.get('/admin/usuarios', {
      params: { page: paginaActual.value, limit: 20 },
    })
    usuarios.value = res.data
    paginacion.value = res.pagination
  } catch {
    uiStore.error('Error', 'No se pudieron cargar los usuarios')
  } finally {
    cargando.value = false
  }
}

const irAPagina = (pagina) => {
  paginaActual.value = pagina
  cargar()
}

onMounted(cargar)
</script>
