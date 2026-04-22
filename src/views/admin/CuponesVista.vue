<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Cupones</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ paginacion?.total || 0 }} cupones en total</p>
      </div>
      <button
        @click="abrirModal()"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i class="pi pi-plus text-sm" />
        Nuevo cupón
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4 animate-pulse">
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-100 rounded w-24" />
            <div class="h-3 bg-gray-100 rounded w-40" />
          </div>
          <div class="h-6 bg-gray-100 rounded w-16" />
        </div>
      </div>

      <div v-else-if="!cupones.length" class="text-center py-16">
        <i class="pi pi-tag text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay cupones creados</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="cupon in cupones"
          :key="cupon.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-gray-900 font-mono">{{ cupon.codigo }}</p>
              <span
                :class="[
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  cupon.tipo === 'porcentaje'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700',
                ]"
              >
                {{ cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `S/. ${cupon.valor}` }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1">
              <p class="text-xs text-gray-400">
                Usos: {{ cupon.uso_actual }}{{ cupon.uso_maximo ? `/${cupon.uso_maximo}` : '' }}
              </p>
              <span v-if="cupon.monto_minimo" class="text-xs text-gray-400">
                Mínimo: {{ formatearPrecio(cupon.monto_minimo) }}
              </span>
              <span v-if="cupon.expira_en" class="text-xs text-gray-400">
                Expira: {{ formatearFecha(cupon.expira_en) }}
              </span>
            </div>
          </div>

          <span
            :class="[
              'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
              cupon.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
            ]"
          >
            {{ cupon.activo ? 'Activo' : 'Inactivo' }}
          </span>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              @click="abrirModal(cupon)"
              class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="pi pi-pencil text-sm" />
            </button>
            <button
              @click="eliminar(cupon)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <i class="pi pi-trash text-sm" />
            </button>
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

    <!-- Modal -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModal" />
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-base font-semibold text-gray-900 mb-5">
          {{ editando ? 'Editar cupón' : 'Nuevo cupón' }}
        </h3>

        <div class="space-y-4">
          <div v-if="!editando">
            <label class="text-sm font-medium text-gray-700 block mb-1">Código</label>
            <input
              v-model="form.codigo"
              type="text"
              placeholder="VERANO10"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black uppercase"
              :class="{ 'border-red-400': errores.codigo }"
            />
            <p v-if="errores.codigo" class="text-xs text-red-500 mt-1">{{ errores.codigo }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
              <select
                v-model="form.tipo"
                :disabled="!!editando"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black disabled:bg-gray-50"
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto_fijo">Monto fijo (S/.)</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">
                Valor {{ form.tipo === 'porcentaje' ? '(%)' : '(S/.)' }}
              </label>
              <input
                v-model.number="form.valor"
                type="number"
                min="0"
                :max="form.tipo === 'porcentaje' ? 100 : undefined"
                placeholder="10"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                :class="{ 'border-red-400': errores.valor }"
              />
              <p v-if="errores.valor" class="text-xs text-red-500 mt-1">{{ errores.valor }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Usos máximos</label>
              <input
                v-model.number="form.uso_maximo"
                type="number"
                min="1"
                placeholder="Ilimitado"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Monto mínimo</label>
              <input
                v-model.number="form.monto_minimo"
                type="number"
                min="0"
                placeholder="S/. 0"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Fecha de expiración</label>
            <input
              v-model="form.expira_en"
              type="datetime-local"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
            <input
              v-model="form.descripcion"
              type="text"
              placeholder="Descripción opcional"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="form.activo" id="activo-cupon" class="rounded" />
            <label for="activo-cupon" class="text-sm text-gray-700 cursor-pointer"
              >Cupón activo</label
            >
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="cerrarModal"
            class="flex-1 text-sm border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="guardar"
            :disabled="guardando"
            class="flex-1 text-sm bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <span
              v-if="guardando"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
            {{ editando ? 'Guardar cambios' : 'Crear cupón' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio, formatearFecha } from '@/utils/formato'

const uiStore = useUiStore()
const cupones = ref([])
const paginacion = ref(null)
const cargando = ref(true)
const modalAbierto = ref(false)
const editando = ref(null)
const guardando = ref(false)
const paginaActual = ref(1)

const form = reactive({
  codigo: '',
  tipo: 'porcentaje',
  valor: '',
  uso_maximo: null,
  monto_minimo: null,
  expira_en: '',
  descripcion: '',
  activo: true,
})

const errores = reactive({ codigo: '', valor: '' })

const cargar = async () => {
  cargando.value = true
  try {
    const { default: api } = await import('@/services/api')
    const res = await api.get('/admin/cupones', { params: { page: paginaActual.value, limit: 15 } })
    cupones.value = res.data
    paginacion.value = res.pagination
  } catch {
    uiStore.error('Error', 'No se pudieron cargar los cupones')
  } finally {
    cargando.value = false
  }
}

const abrirModal = (cupon = null) => {
  editando.value = cupon
  if (cupon) {
    form.codigo = cupon.codigo
    form.tipo = cupon.tipo
    form.valor = cupon.valor
    form.uso_maximo = cupon.uso_maximo || null
    form.monto_minimo = cupon.monto_minimo || null
    form.expira_en = cupon.expira_en ? cupon.expira_en.slice(0, 16) : ''
    form.descripcion = cupon.descripcion || ''
    form.activo = cupon.activo
  } else {
    Object.assign(form, {
      codigo: '',
      tipo: 'porcentaje',
      valor: '',
      uso_maximo: null,
      monto_minimo: null,
      expira_en: '',
      descripcion: '',
      activo: true,
    })
  }
  errores.codigo = ''
  errores.valor = ''
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  editando.value = null
}

const guardar = async () => {
  errores.codigo = ''
  errores.valor = ''
  if (!editando.value && !form.codigo.trim()) {
    errores.codigo = 'El código es requerido'
    return
  }
  if (!form.valor || form.valor <= 0) {
    errores.valor = 'El valor debe ser mayor a 0'
    return
  }

  guardando.value = true
  try {
    const { default: api } = await import('@/services/api')
    const datos = {
      ...form,
      codigo: form.codigo.toUpperCase(),
      uso_maximo: form.uso_maximo || null,
      monto_minimo: form.monto_minimo || null,
      expira_en: form.expira_en ? new Date(form.expira_en).toISOString() : null,
    }
    if (editando.value) {
      await api.put(`/admin/cupones/${editando.value.id}`, datos)
      uiStore.exito('Actualizado', 'Cupón actualizado correctamente')
    } else {
      await api.post('/admin/cupones', datos)
      uiStore.exito('Creado', 'Cupón creado correctamente')
    }
    cerrarModal()
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo guardar el cupón')
  } finally {
    guardando.value = false
  }
}

const eliminar = async (cupon) => {
  if (!confirm(`¿Eliminar el cupón "${cupon.codigo}"?`)) return
  try {
    const { default: api } = await import('@/services/api')
    await api.delete(`/admin/cupones/${cupon.id}`)
    uiStore.exito('Eliminado', 'Cupón eliminado correctamente')
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo eliminar el cupón')
  }
}

const irAPagina = (pagina) => {
  paginaActual.value = pagina
  cargar()
}

onMounted(cargar)
</script>
