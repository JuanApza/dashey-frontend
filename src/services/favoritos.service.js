import api from './api'

export const favoritosServicio = {
  getMisFavoritos: () => api.get('/favoritos'),
  agregar: (productoId) => api.post(`/favoritos/${productoId}`),
  eliminar: (productoId) => api.delete(`/favoritos/${productoId}`),
  verificar: (productoId) => api.get(`/favoritos/check/${productoId}`),
}
