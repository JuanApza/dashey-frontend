import api from './api'

export const authServicio = {
  registro: (datos) => api.post('/auth/register', datos),
  login: (datos) => api.post('/auth/login', datos),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/usuarios/me'),
}
