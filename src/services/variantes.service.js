import api from './api'

export const variantesServicio = {
  getVariantes: (productoId) => api.get(`/admin/productos/${productoId}/variantes`),
  crear: (productoId, datos) => api.post(`/admin/productos/${productoId}/variantes`, datos),
  editar: (productoId, id, datos) =>
    api.put(`/admin/productos/${productoId}/variantes/${id}`, datos),
  ajustarStock: (productoId, id, datos) =>
    api.patch(`/admin/productos/${productoId}/variantes/${id}/stock`, datos),
  eliminar: (productoId, id) => api.delete(`/admin/productos/${productoId}/variantes/${id}`),
}
