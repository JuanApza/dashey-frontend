import api from './api'

export const cuponesServicio = {
  validar: (data) => api.post('/cupones/validar', data),
}
