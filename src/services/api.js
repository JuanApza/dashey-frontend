import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Interceptor de request — agrega el token automáticamente ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de response — maneja errores globalmente ──
api.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const original = error.config

    // Token expirado — intentar renovar
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        _cerrarSesion()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          { refreshToken },
        )
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return api(original)
      } catch {
        _cerrarSesion()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error?.response?.data || error)
  },
)

const _cerrarSesion = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/auth/login'
}

export default api
