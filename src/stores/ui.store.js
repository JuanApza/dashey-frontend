import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // ── Estado ───────────────────────────────────────
  const cargandoGlobal = ref(false)
  const toasts = ref([])

  // ── Toast / Notificaciones ────────────────────────
  const agregarToast = ({ tipo = 'info', titulo, mensaje, duracion = 4000 }) => {
    const id = Date.now()
    toasts.value.push({ id, tipo, titulo, mensaje })
    setTimeout(() => quitarToast(id), duracion)
  }

  const quitarToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const exito = (titulo, mensaje) => agregarToast({ tipo: 'exito', titulo, mensaje })
  const error = (titulo, mensaje) => agregarToast({ tipo: 'error', titulo, mensaje })
  const info = (titulo, mensaje) => agregarToast({ tipo: 'info', titulo, mensaje })
  const alerta = (titulo, mensaje) => agregarToast({ tipo: 'alerta', titulo, mensaje })

  // ── Loading global ────────────────────────────────
  const iniciarCarga = () => {
    cargandoGlobal.value = true
  }
  const terminarCarga = () => {
    cargandoGlobal.value = false
  }

  return {
    cargandoGlobal,
    toasts,
    agregarToast,
    quitarToast,
    exito,
    error,
    info,
    alerta,
    iniciarCarga,
    terminarCarga,
  }
})
