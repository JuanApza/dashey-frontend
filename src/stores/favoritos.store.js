import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favoritosServicio } from '@/services/favoritos.service'
import { useAuthStore } from '@/stores/auth.store'

export const useFavoritosStore = defineStore('favoritos', () => {
  const favoritos = ref([])
  const cargando = ref(false)
  const ids = ref(new Set())

  const total = computed(() => favoritos.value.length)

  const esFavorito = (productoId) => ids.value.has(productoId)

  const cargar = async () => {
    const authStore = useAuthStore()
    if (!authStore.estaAutenticado) return

    cargando.value = true
    try {
      const res = await favoritosServicio.getMisFavoritos()
      favoritos.value = res.data
      ids.value = new Set(res.data.map((f) => f.producto_id))
    } catch (error) {
      favoritos.value = []
      ids.value = new Set()
    } finally {
      cargando.value = false
    }
  }

  const toggle = async (productoId) => {
    const authStore = useAuthStore()
    if (!authStore.estaAutenticado) return false

    if (esFavorito(productoId)) {
      await favoritosServicio.eliminar(productoId)
      favoritos.value = favoritos.value.filter((f) => f.producto_id !== productoId)
      ids.value.delete(productoId)
    } else {
      await favoritosServicio.agregar(productoId)
      ids.value.add(productoId)
      await cargar()
    }
    return true
  }

  const limpiar = () => {
    favoritos.value = []
    ids.value = new Set()
  }

  return { favoritos, cargando, total, esFavorito, cargar, toggle, limpiar }
})
