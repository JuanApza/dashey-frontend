import api from './api'

export const pedidosServicio = {
  getMisPedidos: () => api.get('/pedidos'),
  getDetalle: (id) => api.get(`/pedidos/${id}`),
  crear: (data) => api.post('/pedidos', data),
  getListadoAdmin: (params) => api.get('/admin/pedidos', { params }),
  getDetalleAdmin: (id) => api.get(`/admin/pedidos/${id}`),
  cambiarEstado: (id, data) => api.patch(`/admin/pedidos/${id}/estado`, data),
}
