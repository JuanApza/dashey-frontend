import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const token = ref(localStorage.getItem('accessToken') || null)

  const estaAutenticado = computed(() => !!token.value)
  const esAdmin = computed(() => usuario.value?.rol === 'admin')

  const setAuth = (data) => {
    usuario.value = data.usuario
    token.value = data.accessToken
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
  }

  const cerrarSesion = () => {
    usuario.value = null
    token.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return { usuario, token, estaAutenticado, esAdmin, setAuth, cerrarSesion }
})
