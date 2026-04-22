import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { authServicio } from '@/services/auth.service'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()

  const login = async (credenciales) => {
    try {
      const res = await authServicio.login(credenciales)
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)

      // Obtener datos del usuario
      const perfil = await authServicio.getMe()
      authStore.setAuth({
        usuario: perfil.data,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      })

      uiStore.exito('Bienvenido', `Hola ${perfil.data.nombre.split(' ')[0]}`)
      const redirect =
        router.currentRoute.value.query.redirect || (perfil.data.rol === 'admin' ? '/admin' : '/')
      router.push(redirect)
    } catch (err) {
      uiStore.error('Error', err.message || 'Credenciales incorrectas')
      throw err
    }
  }

  const registro = async (datos) => {
    try {
      await authServicio.registro(datos)
      uiStore.exito('Cuenta creada', 'Ahora puedes iniciar sesión')
      router.push({ name: 'login' })
    } catch (err) {
      uiStore.error('Error', err.message || 'No se pudo crear la cuenta')
      throw err
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await authServicio.logout(refreshToken)
    } finally {
      authStore.cerrarSesion()
      router.push({ name: 'home' })
    }
  }

  const cargarUsuario = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token || authStore.usuario) return
    try {
      const perfil = await authServicio.getMe()
      authStore.usuario = perfil.data
    } catch {
      authStore.cerrarSesion()
    }
  }

  return { login, registro, logout, cargarUsuario }
}
