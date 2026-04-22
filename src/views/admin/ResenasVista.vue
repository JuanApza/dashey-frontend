<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900">Reseñas</h2>
      <p class="text-sm text-gray-400 mt-0.5">{{ paginacion?.total || 0 }} reseñas en total</p>
    </div>

    <!-- Filtros -->
    <div class="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <select
        v-model="filtroAprobado"
        @change="cargar"
        class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
      >
        <option value="">Todas</option>
        <option value="false">Pendientes</option>
        <option value="true">Aprobadas</option>
      </select>
    </div>

    <!-- Lista -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 5" :key="i" class="p-5 animate-pulse space-y-2">
          <div class="h-4 bg-gray-100 rounded w-40" />
          <div class="h-3 bg-gray-100 rounded w-full" />
          <div class="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>

      <div v-else-if="!resenas.length" class="text-center py-16">
        <i class="pi pi-star text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay reseñas</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="resena in resenas"
          :key="resena.id"
          class="p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <!-- Estrellas y producto -->
              <div class="flex items-center gap-2 mb-1">
                <div class="flex items-center gap-0.5">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'pi pi-star-fill text-xs',
                      i <= resena.calificacion ? 'text-amber-400' : 'text-gray-200',
                    ]"
                  />
                </div>
                <span class="text-xs text-gray-400">·</span>
                <p class="text-xs font-medium text-gray-700 truncate">
                  {{ resena.producto_nombre }}
                </p>
              </div>

              <!-- Título y comentario -->
              <p v-if="resena.titulo" class="text-sm font-semibold text-gray-900 mb-0.5">
                {{ resena.titulo }}
              </p>
              <p v-if="resena.comentario" class="text-sm text-gray-600 line-clamp-2">
                {{ resena.comentario }}
              </p>

              <!-- Meta -->
              <div class="flex items-center gap-2 mt-2">
                <p class="text-xs text-gray-400">{{ resena.autor }}</p>
                <span class="text-gray-300">·</span>
                <p class="text-xs text-gray-400">{{ formatearFecha(resena.creado_en) }}</p>
              </div>
            </div>

            <!-- Estado y acciones -->
            <div class="flex flex-col items-end gap-2 flex-shrink-0">
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  resena.aprobado ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700',
                ]"
              >
                {{ resena.aprobado ? 'Aprobada' : 'Pendiente' }}
              </span>
              <div class="flex items-center gap-1">
                <button
                  v-if="!resena.aprobado"
                  @click="cambiarAprobacion(resena, true)"
                  class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Aprobar"
                >
                  <i class="pi pi-check text-sm" />
                </button>
                <button
                  v-if="resena.aprobado"
                  @click="cambiarAprobacion(resena, false)"
                  class="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  title="Rechazar"
                >
                  <i class="pi pi-times text-sm" />
                </button>
                <button
                  @click="eliminar(resena)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <i class="pi pi-trash text-sm" />
                </button>
              </div>
            </div>
          </div>
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
const resenas = ref([])
const paginacion = ref(null)
const cargando = ref(true)
const filtroAprobado = ref('false')
const paginaActual = ref(1)

const cargar = async () => {
  cargando.value = true
  try {
    const { default: api } = await import('@/services/api')
    const params = {
      page: paginaActual.value,
      limit: 15,
      ...(filtroAprobado.value !== '' && { aprobado: filtroAprobado.value }),
    }
    const res = await api.get('/admin/resenas', { params })
    resenas.value = res.data
    paginacion.value = res.pagination
  } catch {
    uiStore.error('Error', 'No se pudieron cargar las reseñas')
  } finally {
    cargando.value = false
  }
}

const cambiarAprobacion = async (resena, aprobado) => {
  try {
    const { default: api } = await import('@/services/api')
    await api.patch(`/admin/resenas/${resena.id}`, { aprobado })
    resena.aprobado = aprobado
    uiStore.exito(
      aprobado ? 'Aprobada' : 'Rechazada',
      `Reseña ${aprobado ? 'aprobada' : 'rechazada'} correctamente`,
    )
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo actualizar la reseña')
  }
}

const eliminar = async (resena) => {
  if (!confirm('¿Eliminar esta reseña permanentemente?')) return
  try {
    const { default: api } = await import('@/services/api')
    await api.delete(`/admin/resenas/${resena.id}`)
    uiStore.exito('Eliminada', 'Reseña eliminada correctamente')
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo eliminar la reseña')
  }
}

const irAPagina = (pagina) => {
  paginaActual.value = pagina
  cargar()
}

onMounted(cargar)
</script>
