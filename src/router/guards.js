import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'

export const guardsAuth = async (to) => {
  const authStore = useAuthStore()

  // Si hay token pero no hay usuario cargado, esperamos a cargarlo
  const token = localStorage.getItem('accessToken')
  if (token && !authStore.usuario) {
    const { cargarUsuario } = useAuth()
    await cargarUsuario()
  }

  if (to.meta.requiereAuth && !authStore.estaAutenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiereAdmin && authStore.usuario?.rol !== 'admin') {
    return { name: 'home' }
  }

  if (to.meta.soloInvitados && authStore.estaAutenticado) {
    return { name: 'home' }
  }

  return true
}
