<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <RouterLink to="/carrito" class="hover:text-black transition-colors">Carrito</RouterLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Checkout</span>
    </nav>

    <h1 class="text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Dirección de envío -->
        <div class="bg-white border border-gray-100 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-map-marker text-sm" />
            Dirección de envío
          </h2>

          <!-- Direcciones guardadas -->
          <div v-if="direcciones.length" class="space-y-3 mb-4">
            <label
              v-for="dir in direcciones"
              :key="dir.id"
              :class="[
                'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                form.direccion_id === dir.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-100 hover:border-gray-200',
              ]"
            >
              <input type="radio" :value="dir.id" v-model="form.direccion_id" class="mt-1" />
              <div>
                <p class="text-sm font-medium text-gray-900">{{ dir.calle }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ dir.ciudad }}, {{ dir.departamento }} — {{ dir.pais }}
                </p>
                <span v-if="dir.es_principal" class="text-xs text-[#C8A96E] font-medium"
                  >Principal</span
                >
              </div>
            </label>
          </div>

          <!-- Nueva dirección -->
          <div
            v-if="mostrarFormDireccion || !direcciones.length"
            class="space-y-4 border-t border-gray-100 pt-4"
          >
            <p class="text-sm font-medium text-gray-700">Nueva dirección</p>
            <BaseInput
              v-model="nuevaDireccion.calle"
              etiqueta="Calle y número"
              placeholder="Av. Larco 123, Dpto 4B"
              :requerido="true"
              :error="erroresDireccion.calle"
            />
            <div class="grid grid-cols-2 gap-4">
              <BaseInput
                v-model="nuevaDireccion.ciudad"
                etiqueta="Ciudad / Distrito"
                placeholder="Miraflores"
                :requerido="true"
                :error="erroresDireccion.ciudad"
              />
              <BaseInput
                v-model="nuevaDireccion.departamento"
                etiqueta="Departamento"
                placeholder="Lima"
                :requerido="true"
                :error="erroresDireccion.departamento"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <BaseInput
                v-model="nuevaDireccion.codigo_postal"
                etiqueta="Código postal"
                placeholder="15074"
              />
              <div class="flex items-end">
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer pb-2">
                  <input type="checkbox" v-model="nuevaDireccion.es_principal" class="rounded" />
                  Guardar como principal
                </label>
              </div>
            </div>
            <BaseButton
              @click="guardarDireccion"
              variante="secundario"
              :cargando="guardandoDireccion"
              tamano="sm"
            >
              Guardar dirección
            </BaseButton>
          </div>

          <button
            v-if="direcciones.length"
            @click="mostrarFormDireccion = !mostrarFormDireccion"
            class="mt-3 text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-1"
          >
            <i :class="mostrarFormDireccion ? 'pi pi-minus' : 'pi pi-plus'" class="text-xs" />
            {{ mostrarFormDireccion ? 'Cancelar' : 'Agregar nueva dirección' }}
          </button>
        </div>

        <!-- Método de pago -->
        <div class="bg-white border border-gray-100 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-credit-card text-sm" />
            Método de pago
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label
              v-for="metodo in metodosPago"
              :key="metodo.valor"
              :class="[
                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors text-center',
                form.metodo_pago === metodo.valor
                  ? 'border-black bg-gray-50'
                  : 'border-gray-100 hover:border-gray-200',
              ]"
            >
              <input
                type="radio"
                :value="metodo.valor"
                v-model="form.metodo_pago"
                class="sr-only"
              />
              <i :class="metodo.icono" class="text-xl" />
              <span class="text-xs font-medium text-gray-700">{{ metodo.label }}</span>
            </label>
          </div>
          <p v-if="errores.metodo_pago" class="text-xs text-red-500 mt-2">
            {{ errores.metodo_pago }}
          </p>
        </div>

        <!-- Cupón -->
        <div class="bg-white border border-gray-100 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-tag text-sm" />
            Cupón de descuento
          </h2>

          <div class="flex gap-2">
            <BaseInput
              v-model="codigoCupon"
              placeholder="Ingresa tu código"
              class="flex-1"
              :deshabilitado="!!cuponAplicado"
            />
            <BaseButton
              v-if="!cuponAplicado"
              @click="validarCupon"
              variante="secundario"
              :cargando="validandoCupon"
            >
              Aplicar
            </BaseButton>
            <BaseButton v-else @click="quitarCupon" variante="peligro"> Quitar </BaseButton>
          </div>

          <div v-if="cuponAplicado" class="mt-3 flex items-center gap-2 text-green-600 text-sm">
            <i class="pi pi-check-circle" />
            Cupón aplicado — descuento de S/. {{ cuponAplicado.descuento }}
          </div>
          <p v-if="errorCupon" class="text-xs text-red-500 mt-2">{{ errorCupon }}</p>
        </div>

        <!-- Notas -->
        <div class="bg-white border border-gray-100 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-pencil text-sm" />
            Notas del pedido
          </h2>
          <textarea
            v-model="form.notas"
            placeholder="Instrucciones especiales para el envío (opcional)"
            rows="3"
            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black resize-none"
          />
        </div>
      </div>

      <!-- Resumen -->
      <div class="lg:col-span-1">
        <div class="bg-white border border-gray-100 rounded-xl p-6 sticky top-24">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Resumen</h2>

          <!-- Items -->
          <div class="space-y-3 mb-4">
            <div
              v-for="item in carritoStore.items"
              :key="item.varianteId"
              class="flex items-center gap-3"
            >
              <div class="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  v-if="item.imagen"
                  :src="imagenUrl(item.imagen)"
                  :alt="item.productoNombre"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 line-clamp-1">
                  {{ item.productoNombre }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ item.talla }} / {{ item.color }} × {{ item.cantidad }}
                </p>
              </div>
              <p class="text-xs font-semibold text-gray-900 flex-shrink-0">
                {{ formatearPrecio(item.precio * item.cantidad) }}
              </p>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span>{{ formatearPrecio(carritoStore.subtotal) }}</span>
            </div>
            <div v-if="cuponAplicado" class="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{{ formatearPrecio(cuponAplicado.descuento) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Envío</span>
              <span class="text-gray-500">Por confirmar</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="text-xl font-bold text-black">{{ formatearPrecio(totalFinal) }}</span>
            </div>
          </div>

          <BaseButton
            @click="realizarPedido"
            variante="primario"
            :bloque="true"
            :cargando="creandoPedido"
            tamano="lg"
          >
            Confirmar pedido
          </BaseButton>

          <p class="text-xs text-gray-400 text-center mt-3">
            Al confirmar aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito.store'
import { useUiStore } from '@/stores/ui.store'
import { pedidosServicio } from '@/services/pedidos.service'
import { cuponesServicio } from '@/services/cupones.service'
import { direccionesServicio } from '@/services/direcciones.service'
import { formatearPrecio } from '@/utils/formato'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const carritoStore = useCarritoStore()
const uiStore = useUiStore()

const direcciones = ref([])
const mostrarFormDireccion = ref(false)
const guardandoDireccion = ref(false)
const validandoCupon = ref(false)
const creandoPedido = ref(false)
const codigoCupon = ref('')
const cuponAplicado = ref(null)
const errorCupon = ref('')

const form = reactive({
  direccion_id: null,
  metodo_pago: null,
  notas: '',
})

const errores = reactive({
  direccion_id: '',
  metodo_pago: '',
})

const nuevaDireccion = reactive({
  calle: '',
  ciudad: '',
  departamento: '',
  codigo_postal: '',
  es_principal: false,
})

const erroresDireccion = reactive({
  calle: '',
  ciudad: '',
  departamento: '',
})

const metodosPago = [
  { valor: 'yape', label: 'Yape', icono: 'pi pi-mobile' },
  { valor: 'transferencia', label: 'Transferencia', icono: 'pi pi-building' },
  { valor: 'contraentrega', label: 'Contraentrega', icono: 'pi pi-truck' },
  { valor: 'mercadopago', label: 'MercadoPago', icono: 'pi pi-wallet' },
]

const totalFinal = computed(() => {
  const descuento = cuponAplicado.value?.descuento || 0
  return parseFloat((carritoStore.subtotal - descuento).toFixed(2))
})

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const cargarDirecciones = async () => {
  try {
    const res = await direccionesServicio.getMisDirecciones()
    direcciones.value = res.data
    const principal = direcciones.value.find((d) => d.es_principal)
    if (principal) form.direccion_id = principal.id
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudieron cargar las direcciones')
  }
}

const guardarDireccion = async () => {
  erroresDireccion.calle = ''
  erroresDireccion.ciudad = ''
  erroresDireccion.departamento = ''

  if (!nuevaDireccion.calle) {
    erroresDireccion.calle = 'Requerido'
    return
  }
  if (!nuevaDireccion.ciudad) {
    erroresDireccion.ciudad = 'Requerido'
    return
  }
  if (!nuevaDireccion.departamento) {
    erroresDireccion.departamento = 'Requerido'
    return
  }

  guardandoDireccion.value = true
  try {
    const res = await direccionesServicio.crear(nuevaDireccion)
    direcciones.value.push(res.data)
    form.direccion_id = res.data.id
    mostrarFormDireccion.value = false
    Object.assign(nuevaDireccion, {
      calle: '',
      ciudad: '',
      departamento: '',
      codigo_postal: '',
      es_principal: false,
    })
    uiStore.exito('Dirección guardada', 'Dirección agregada correctamente')
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo guardar la dirección')
  } finally {
    guardandoDireccion.value = false
  }
}

const validarCupon = async () => {
  if (!codigoCupon.value.trim()) return
  errorCupon.value = ''
  validandoCupon.value = true
  try {
    const res = await cuponesServicio.validar({
      codigo: codigoCupon.value,
      subtotal: carritoStore.subtotal,
    })
    cuponAplicado.value = res.data
    uiStore.exito('Cupón aplicado', `Descuento de S/. ${res.data.descuento}`)
  } catch (err) {
    errorCupon.value = err.message || 'Cupón inválido'
  } finally {
    validandoCupon.value = false
  }
}

const quitarCupon = () => {
  cuponAplicado.value = null
  codigoCupon.value = ''
  errorCupon.value = ''
}

const validarFormulario = () => {
  errores.direccion_id = ''
  errores.metodo_pago = ''
  let valido = true

  if (!form.direccion_id) {
    errores.direccion_id = 'Selecciona una dirección'
    valido = false
  }
  if (!form.metodo_pago) {
    errores.metodo_pago = 'Selecciona un método de pago'
    valido = false
  }

  return valido
}

const realizarPedido = async () => {
  if (!validarFormulario()) return
  if (carritoStore.estaVacio) {
    uiStore.error('Carrito vacío', 'Agrega productos antes de continuar')
    return
  }

  creandoPedido.value = true
  try {
    const payload = {
      direccion_id: form.direccion_id,
      metodo_pago: form.metodo_pago,
      notas: form.notas || null,
      cupon_codigo: cuponAplicado.value?.codigo || null,
      items: carritoStore.items.map((i) => ({
        variante_id: i.varianteId,
        cantidad: i.cantidad,
      })),
    }

    const res = await pedidosServicio.crear(payload)
    carritoStore.vaciar()
    uiStore.exito('Pedido creado', 'Tu pedido fue registrado correctamente')
    router.push({ name: 'pago', params: { pedidoId: res.data.id } })
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo crear el pedido')
  } finally {
    creandoPedido.value = false
  }
}

onMounted(async () => {
  if (carritoStore.estaVacio) {
    router.push({ name: 'carrito' })
    return
  }
  await cargarDirecciones()
})
</script>
