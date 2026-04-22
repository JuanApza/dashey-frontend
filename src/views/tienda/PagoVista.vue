<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-black transition-colors">Inicio</RouterLink>
      <span>/</span>
      <RouterLink to="/mis-pedidos" class="hover:text-black transition-colors"
        >Mis pedidos</RouterLink
      >
      <span>/</span>
      <span class="text-gray-900 font-medium">Pago</span>
    </nav>

    <!-- Skeleton -->
    <div v-if="cargando" class="space-y-4">
      <div class="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
      <div class="h-40 bg-gray-100 rounded-xl animate-pulse" />
      <div class="h-40 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="infoPago">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-check text-2xl text-green-500" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Pedido confirmado</h1>
        <p class="text-sm text-gray-500">Pedido #{{ pedidoId.slice(0, 8).toUpperCase() }}</p>
      </div>

      <!-- Resumen del pedido -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">Resumen del pedido</h2>
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">Total a pagar</span>
          <span class="text-xl font-bold text-black">
            {{ formatearPrecio(infoPago.pedido.total) }}
          </span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-gray-500">Método de pago</span>
          <span class="font-medium capitalize">{{ infoPago.pedido.metodo_pago }}</span>
        </div>
      </div>

      <!-- Contraentrega -->
      <div
        v-if="infoPago.pedido.metodo_pago === 'contraentrega'"
        class="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-4"
      >
        <div class="flex items-start gap-3">
          <i class="pi pi-truck text-blue-500 text-xl mt-0.5" />
          <div>
            <h3 class="text-sm font-semibold text-blue-900 mb-1">Pago contra entrega</h3>
            <p class="text-sm text-blue-700 leading-relaxed">
              Pagarás cuando recibas tu pedido. Nos pondremos en contacto contigo para coordinar la
              entrega.
            </p>
          </div>
        </div>
      </div>

      <!-- Yape / Transferencia -->
      <div
        v-if="['yape', 'transferencia', 'plin'].includes(infoPago.pedido.metodo_pago)"
        class="space-y-4 mb-4"
      >
        <!-- Yape -->
        <div
          v-if="infoPago.metodos_pago.yape"
          class="bg-white border border-gray-100 rounded-xl p-6"
        >
          <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-mobile text-purple-500" />
            Pagar por Yape / Plin
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Número</span>
              <span class="font-semibold">{{ infoPago.metodos_pago.yape.numero }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Titular</span>
              <span class="font-medium">{{ infoPago.metodos_pago.yape.titular }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Monto exacto</span>
              <span class="font-bold text-black">{{ formatearPrecio(infoPago.pedido.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Transferencia -->
        <div
          v-if="infoPago.metodos_pago.transferencia"
          class="bg-white border border-gray-100 rounded-xl p-6"
        >
          <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-building text-blue-500" />
            Transferencia bancaria
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Banco</span>
              <span class="font-medium">{{ infoPago.metodos_pago.transferencia.banco }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Cuenta</span>
              <span class="font-semibold">{{ infoPago.metodos_pago.transferencia.cuenta }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">CCI</span>
              <span class="font-medium text-xs">{{ infoPago.metodos_pago.transferencia.cci }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Titular</span>
              <span class="font-medium">{{ infoPago.metodos_pago.transferencia.titular }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Monto exacto</span>
              <span class="font-bold text-black">{{ formatearPrecio(infoPago.pedido.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Subir comprobante -->
        <div class="bg-white border border-gray-100 rounded-xl p-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="pi pi-upload text-gray-500" />
            Subir comprobante de pago
          </h3>

          <div v-if="!comprobanteSubido">
            <div
              @click="$refs.inputArchivo.click()"
              class="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors mb-3"
            >
              <i class="pi pi-image text-2xl text-gray-300 mb-2 block" />
              <p class="text-sm text-gray-500">Haz clic para seleccionar la imagen</p>
              <p class="text-xs text-gray-400 mt-1">JPG, PNG o WebP</p>
            </div>
            <input
              ref="inputArchivo"
              type="file"
              accept="image/*"
              class="hidden"
              @change="seleccionarArchivo"
            />
            <div
              v-if="archivoSeleccionado"
              class="flex items-center gap-2 text-sm text-gray-600 mb-3"
            >
              <i class="pi pi-file-image text-gray-400" />
              {{ archivoSeleccionado.name }}
            </div>
            <div class="flex gap-2">
              <select
                v-model="metodoComprobante"
                class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black flex-1"
              >
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <BaseInput
                v-model="referenciaComprobante"
                placeholder="N° operación (opcional)"
                class="flex-1"
              />
            </div>
            <BaseButton
              @click="subirComprobante"
              variante="primario"
              :bloque="true"
              :cargando="subiendoComprobante"
              :deshabilitado="!archivoSeleccionado"
              tamano="md"
              class="mt-3"
            >
              <i class="pi pi-upload mr-2" />
              Enviar comprobante
            </BaseButton>
          </div>

          <div v-else class="flex items-center gap-3 text-green-600">
            <i class="pi pi-check-circle text-xl" />
            <div>
              <p class="text-sm font-medium">Comprobante enviado</p>
              <p class="text-xs text-gray-500">Lo revisaremos y confirmaremos tu pedido en breve</p>
            </div>
          </div>
        </div>
      </div>

      <!-- WhatsApp -->
      <div class="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <i class="pi pi-whatsapp text-green-500" />
          Coordinar por WhatsApp
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Envíanos el resumen de tu pedido por WhatsApp para coordinar el pago y la entrega.
        </p>
        <a
          :href="infoPago.whatsapp_link"
          target="_blank"
          class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <i class="pi pi-whatsapp" />
          Enviar pedido por WhatsApp
        </a>
      </div>

      <!-- Acciones -->
      <div class="flex flex-col sm:flex-row gap-3">
        <RouterLink
          :to="{ name: 'pedido-detalle', params: { id: pedidoId } }"
          class="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-sm font-medium py-3 rounded-xl hover:border-black transition-colors"
        >
          <i class="pi pi-eye text-sm" />
          Ver mi pedido
        </RouterLink>
        <RouterLink
          to="/catalogo"
          class="flex-1 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Seguir comprando
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import { pagosServicio } from '@/services/pagos.service'
import { formatearPrecio } from '@/utils/formato'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const uiStore = useUiStore()

const pedidoId = route.params.pedidoId
const cargando = ref(true)
const infoPago = ref(null)
const archivoSeleccionado = ref(null)
const metodoComprobante = ref('yape')
const referenciaComprobante = ref('')
const subiendoComprobante = ref(false)
const comprobanteSubido = ref(false)
const inputArchivo = ref(null)

const seleccionarArchivo = (e) => {
  archivoSeleccionado.value = e.target.files[0] || null
}

const subirComprobante = async () => {
  if (!archivoSeleccionado.value) return
  subiendoComprobante.value = true
  try {
    const formData = new FormData()
    formData.append('comprobante', archivoSeleccionado.value)
    formData.append('pedido_id', pedidoId)
    formData.append('metodo', metodoComprobante.value)
    if (referenciaComprobante.value) formData.append('referencia', referenciaComprobante.value)

    await pagosServicio.subirComprobante(pedidoId, formData)
    comprobanteSubido.value = true
    uiStore.exito('Comprobante enviado', 'Lo revisaremos y confirmaremos tu pedido en breve')
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo subir el comprobante')
  } finally {
    subiendoComprobante.value = false
  }
}

onMounted(async () => {
  try {
    const res = await pagosServicio.getInfo(pedidoId)
    infoPago.value = res.data
  } catch {
    uiStore.error('Error', 'No se pudo obtener la información del pago')
  } finally {
    cargando.value = false
  }
})
</script>
