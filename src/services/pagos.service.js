import api from './api'

export const pagosServicio = {
  getInfo: (pedidoId) => api.get(`/pedidos/${pedidoId}/pago`),
  getWhatsapp: (pedidoId) => api.get(`/pedidos/${pedidoId}/pago/whatsapp`),
  subirComprobante: (pedidoId, formData) =>
    api.post(`/pedidos/${pedidoId}/pago/comprobante`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  confirmarPago: (pedidoId, datos) => api.post(`/admin/pagos/${pedidoId}/confirmar`, datos),
  rechazarPago: (pedidoId, datos) => api.post(`/admin/pagos/${pedidoId}/rechazar`, datos),
}
