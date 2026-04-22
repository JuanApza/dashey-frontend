import api from './api'

export const productosServicio = {
  getListado: (params) => api.get('/productos', { params }),
  getDetalle: (slug) => api.get(`/productos/${slug}`),
}
