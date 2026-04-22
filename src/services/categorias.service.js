import api from './api'

export const categoriasServicio = {
  getArbol: () => api.get('/categorias'),
}
