import { useFavoritosStore } from '@/stores/favoritos.store'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useRouter } from 'vue-router'

export const useFavoritos = () => {
  const favoritosStore = useFavoritosStore()
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()

  const toggleFavorito = async (productoId) => {
    if (!authStore.estaAutenticado) {
      uiStore.info('Inicia sesión', 'Debes iniciar sesión para guardar favoritos')
      router.push({ name: 'login' })
      return
    }

    const eraFavorito = favoritosStore.esFavorito(productoId)
    await favoritosStore.toggle(productoId)

    if (eraFavorito) {
      uiStore.info('Eliminado', 'Producto eliminado de favoritos')
    } else {
      uiStore.exito('Guardado', 'Producto agregado a favoritos')
    }
  }

  return {
    toggleFavorito,
    esFavorito: favoritosStore.esFavorito,
    total: favoritosStore.total,
  }
}
