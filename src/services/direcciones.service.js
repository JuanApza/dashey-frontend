import api from './api'

export const direccionesServicio = {
  getMisDirecciones: () => api.get('/usuarios/me/direcciones'),
  crear: (datos) => api.post('/usuarios/me/direcciones', datos),
  eliminar: (id) => api.delete(`/usuarios/me/direcciones/${id}`),
}
