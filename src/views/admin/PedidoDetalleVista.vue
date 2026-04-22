<template>
  <div class="space-y-5 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink
          to="/admin/pedidos"
          class="p-2 rounded-lg border border-gray-200 hover:border-black transition-colors"
        >
          <i class="pi pi-arrow-left text-sm" />
        </RouterLink>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Pedido #{{ pedido?.id?.slice(0, 8).toUpperCase() }}
          </h2>
          <p v-if="pedido" class="text-sm text-gray-400 mt-0.5">
            {{ formatearFecha(pedido.creado_en) }}
          </p>
        </div>
      </div>
      <span
        v-if="pedido"
        :class="['text-sm font-medium px-3 py-1.5 rounded-full', colorEstado(pedido.estado)]"
      >
        {{ formatearEstado(pedido.estado) }}
      </span>
    </div>

    <!-- Skeleton -->
    <div v-if="cargando" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white border border-gray-100 rounded-xl p-6 animate-pulse"
      >
        <div class="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div class="space-y-2">
          <div class="h-3 bg-gray-100 rounded w-full" />
          <div class="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    </div>

    <template v-else-if="pedido">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Items del pedido -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Productos</h3>
            <div class="space-y-4">
              <div v-for="item in pedido.items" :key="item.id" class="flex gap-3">
                <div
                  class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="pi pi-image text-gray-300 text-sm" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 line-clamp-1">
                    {{ item.producto_nombre }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ item.talla }} / {{ item.color }} · SKU: {{ item.sku }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-semibold">{{ formatearPrecio(item.subtotal) }}</p>
                  <p class="text-xs text-gray-400">
                    {{ formatearPrecio(item.precio_unitario) }} × {{ item.cantidad }}
                  </p>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-100 mt-4 pt-4 space-y-1.5">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span>{{ formatearPrecio(pedido.subtotal) }}</span>
              </div>
              <div v-if="pedido.descuento > 0" class="flex justify-between text-sm text-green-600">
                <span>Descuento</span>
                <span>-{{ formatearPrecio(pedido.descuento) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Envío</span>
                <span>{{
                  pedido.costo_envio > 0 ? formatearPrecio(pedido.costo_envio) : 'Gratis'
                }}</span>
              </div>
              <div
                class="flex justify-between font-semibold text-base pt-1 border-t border-gray-100"
              >
                <span>Total</span>
                <span>{{ formatearPrecio(pedido.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Historial de estados -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Historial de estados</h3>
            <div class="space-y-3">
              <div v-for="(estado, i) in pedido.estados" :key="i" class="flex items-start gap-3">
                <div
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs',
                    i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400',
                  ]"
                >
                  <i :class="i === 0 ? 'pi pi-check' : 'pi pi-circle'" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">
                      {{ formatearEstado(estado.estado) }}
                    </p>
                    <p class="text-xs text-gray-400">{{ formatearFecha(estado.creado_en) }}</p>
                  </div>
                  <p v-if="estado.notas" class="text-xs text-gray-500 mt-0.5">{{ estado.notas }}</p>
                  <p v-if="estado.cambiado_por" class="text-xs text-gray-400 mt-0.5">
                    Por: {{ estado.cambiado_por }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna lateral -->
        <div class="space-y-5">
          <!-- Cambiar estado -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Cambiar estado</h3>
            <div class="space-y-3">
              <select
                v-model="nuevoEstado"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
              >
                <option value="">Seleccionar estado</option>
                <option
                  v-for="estado in estadosPermitidos"
                  :key="estado.valor"
                  :value="estado.valor"
                >
                  {{ estado.label }}
                </option>
              </select>
              <textarea
                v-model="notasEstado"
                placeholder="Notas del cambio (opcional)"
                rows="2"
                class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black resize-none"
              />
              <button
                @click="cambiarEstado"
                :disabled="!nuevoEstado || cambiandoEstado"
                class="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span
                  v-if="cambiandoEstado"
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                Confirmar cambio
              </button>

              <!-- Acciones de pago -->
              <div class="border-t border-gray-100 pt-3 space-y-2">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Pago</p>
                <button
                  @click="confirmarPago"
                  :disabled="procesandoPago"
                  class="w-full flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <i class="pi pi-check text-sm" />
                  Confirmar pago
                </button>
                <button
                  @click="rechazarPago"
                  :disabled="procesandoPago"
                  class="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 text-sm font-medium py-2.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  <i class="pi pi-times text-sm" />
                  Rechazar pago
                </button>
              </div>
            </div>
          </div>

          <!-- Info cliente -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Cliente</h3>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-900">{{ pedido.cliente_nombre }}</p>
              <p class="text-sm text-gray-500">{{ pedido.cliente_email }}</p>
              <a
                :href="`https://wa.me/${pedido.cliente_telefono}`"
                target="_blank"
                v-if="pedido.cliente_telefono"
                class="inline-flex items-center gap-1.5 text-sm text-green-600 hover:underline"
              >
                <i class="pi pi-whatsapp text-sm" />
                {{ pedido.cliente_telefono }}
              </a>
            </div>
          </div>

          <!-- Dirección -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Dirección de envío</h3>
            <div class="space-y-1 text-sm text-gray-600">
              <p>{{ pedido.calle }}</p>
              <p>{{ pedido.ciudad }}, {{ pedido.departamento }}</p>
              <p>{{ pedido.pais }}</p>
            </div>
          </div>

          <!-- Método de pago -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Pago</h3>
            <p class="text-sm text-gray-600 capitalize">{{ pedido.metodo_pago }}</p>
            <p v-if="pedido.notas" class="text-xs text-gray-400 mt-2 leading-relaxed">
              Notas: {{ pedido.notas }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { pedidosServicio } from '@/services/pedidos.service'
import { pagosServicio } from '@/services/pagos.service'
import { useUiStore } from '@/stores/ui.store'
import { formatearPrecio, formatearFecha, formatearEstado, colorEstado } from '@/utils/formato'

const route = useRoute()
const uiStore = useUiStore()

const pedido = ref(null)
const cargando = ref(true)
const nuevoEstado = ref('')
const notasEstado = ref('')
const cambiandoEstado = ref(false)
const procesandoPago = ref(false)

const transiciones = {
  pendiente: ['confirmado', 'cancelado'],
  confirmado: ['preparando', 'cancelado'],
  preparando: ['enviado'],
  enviado: ['entregado', 'devuelto'],
  entregado: ['devuelto'],
  cancelado: [],
  devuelto: [],
}

const etiquetas = {
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  devuelto: 'Devuelto',
}

const estadosPermitidos = computed(() => {
  if (!pedido.value) return []
  return (transiciones[pedido.value.estado] || []).map((e) => ({
    valor: e,
    label: etiquetas[e] || e,
  }))
})

const cargar = async () => {
  cargando.value = true
  try {
    const res = await pedidosServicio.getDetalleAdmin(route.params.id)
    pedido.value = res.data
  } catch {
    uiStore.error('Error', 'No se pudo cargar el pedido')
  } finally {
    cargando.value = false
  }
}

const cambiarEstado = async () => {
  if (!nuevoEstado.value) return
  cambiandoEstado.value = true
  try {
    await pedidosServicio.cambiarEstado(pedido.value.id, {
      estado: nuevoEstado.value,
      notas: notasEstado.value || null,
    })
    uiStore.exito('Estado actualizado', `Pedido marcado como ${etiquetas[nuevoEstado.value]}`)
    nuevoEstado.value = ''
    notasEstado.value = ''
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo cambiar el estado')
  } finally {
    cambiandoEstado.value = false
  }
}

const confirmarPago = async () => {
  procesandoPago.value = true
  try {
    await pagosServicio.confirmarPago(pedido.value.id, {
      notas: 'Pago confirmado por el administrador',
    })
    uiStore.exito('Pago confirmado', 'El pedido fue actualizado a confirmado')
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo confirmar el pago')
  } finally {
    procesandoPago.value = false
  }
}

const rechazarPago = async () => {
  procesandoPago.value = true
  try {
    await pagosServicio.rechazarPago(pedido.value.id, {
      notas: 'Pago rechazado por el administrador',
    })
    uiStore.exito('Pago rechazado', 'El pedido fue cancelado')
    await cargar()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo rechazar el pago')
  } finally {
    procesandoPago.value = false
  }
}

onMounted(cargar)
</script>
