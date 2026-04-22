<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Categorías</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ categorias.length }} categorías en total</p>
      </div>
      <button
        @click="abrirModal()"
        class="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i class="pi pi-plus text-sm" />
        Nueva categoría
      </button>
    </div>

    <!-- Lista -->
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div v-if="cargando" class="divide-y divide-gray-50">
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 p-4 animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-40" />
          <div class="h-3 bg-gray-100 rounded w-24 ml-auto" />
        </div>
      </div>

      <div v-else-if="!categorias.length" class="text-center py-16">
        <i class="pi pi-tags text-4xl text-gray-200 mb-3 block" />
        <p class="text-sm text-gray-400">No hay categorías</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <template v-for="categoria in categorias" :key="categoria.id">
          <!-- Categoría raíz -->
          <div class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900">{{ categoria.nombre }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ categoria.slug }}</p>
            </div>
            <span
              :class="[
                'text-xs font-medium px-2.5 py-1 rounded-full',
                categoria.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
              ]"
            >
              {{ categoria.activo ? 'Activa' : 'Inactiva' }}
            </span>
            <div class="flex items-center gap-1">
              <button
                @click="abrirModal(categoria)"
                class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i class="pi pi-pencil text-sm" />
              </button>
              <button
                @click="eliminar(categoria)"
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i class="pi pi-trash text-sm" />
              </button>
            </div>
          </div>

          <!-- Subcategorías -->
          <div
            v-for="hijo in categoria.hijos"
            :key="hijo.id"
            class="flex items-center gap-3 p-4 pl-10 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-arrow-right text-xs text-gray-300 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700">{{ hijo.nombre }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ hijo.slug }}</p>
            </div>
            <span
              :class="[
                'text-xs font-medium px-2.5 py-1 rounded-full',
                hijo.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
              ]"
            >
              {{ hijo.activo ? 'Activa' : 'Inactiva' }}
            </span>
            <div class="flex items-center gap-1">
              <button
                @click="abrirModal(hijo)"
                class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i class="pi pi-pencil text-sm" />
              </button>
              <button
                @click="eliminar(hijo)"
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i class="pi pi-trash text-sm" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModal" />
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="text-base font-semibold text-gray-900 mb-5">
          {{ editando ? 'Editar categoría' : 'Nueva categoría' }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Nombre de la categoría"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
            />
            <p v-if="errores.nombre" class="text-xs text-red-500 mt-1">{{ errores.nombre }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Categoría padre</label>
            <select
              v-model="form.padre_id"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
            >
              <option :value="null">Sin padre (categoría raíz)</option>
              <option v-for="cat in categoriasSinHijos" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="2"
              placeholder="Descripción opcional"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black resize-none"
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="form.activo" id="activo" class="rounded" />
            <label for="activo" class="text-sm text-gray-700 cursor-pointer"
              >Categoría activa</label
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
            {{ editando ? 'Guardar cambios' : 'Crear categoría' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useUiStore } from '@/stores/ui.store'
import { useCatalogoStore } from '@/stores/catalogo.store'

const uiStore = useUiStore()
const catalogoStore = useCatalogoStore()

const categorias = ref([])
const cargando = ref(true)
const modalAbierto = ref(false)
const editando = ref(null)
const guardando = ref(false)

const form = reactive({
  nombre: '',
  padre_id: null,
  descripcion: '',
  activo: true,
})

const errores = reactive({ nombre: '' })

const categoriasSinHijos = computed(() =>
  categorias.value.filter((c) => !c.hijos?.length || editando.value?.id !== c.id),
)

const cargar = async () => {
  cargando.value = true
  try {
    await catalogoStore.getCategorias()
    categorias.value = catalogoStore.categorias
  } catch {
    uiStore.error('Error', 'No se pudieron cargar las categorías')
  } finally {
    cargando.value = false
  }
}

const abrirModal = (categoria = null) => {
  editando.value = categoria
  if (categoria) {
    form.nombre = categoria.nombre
    form.padre_id = categoria.padre_id || null
    form.descripcion = categoria.descripcion || ''
    form.activo = categoria.activo
  } else {
    form.nombre = ''
    form.padre_id = null
    form.descripcion = ''
    form.activo = true
  }
  errores.nombre = ''
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  editando.value = null
}

const guardar = async () => {
  errores.nombre = ''
  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es requerido'
    return
  }

  guardando.value = true
  try {
    const { default: api } = await import('@/services/api')
    if (editando.value) {
      await api.put(`/admin/categorias/${editando.value.id}`, form)
      uiStore.exito('Actualizada', 'Categoría actualizada correctamente')
    } else {
      await api.post('/admin/categorias', form)
      uiStore.exito('Creada', 'Categoría creada correctamente')
    }
    cerrarModal()
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo guardar la categoría')
  } finally {
    guardando.value = false
  }
}

const eliminar = async (categoria) => {
  if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return
  try {
    const { default: api } = await import('@/services/api')
    await api.delete(`/admin/categorias/${categoria.id}`)
    uiStore.exito('Eliminada', 'Categoría eliminada correctamente')
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo eliminar la categoría')
  }
}

onMounted(cargar)
</script>
