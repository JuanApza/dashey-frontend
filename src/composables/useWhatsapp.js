import { pagosServicio } from '@/services/pagos.service'
import { useUiStore } from '@/stores/ui.store'

export const useWhatsapp = () => {
  const uiStore = useUiStore()

  const abrirWhatsapp = async (pedidoId) => {
    try {
      const res = await pagosServicio.getWhatsapp(pedidoId)
      window.open(res.data.whatsapp_link, '_blank')
    } catch {
      uiStore.error('Error', 'No se pudo generar el link de WhatsApp')
    }
  }

  return { abrirWhatsapp }
}
