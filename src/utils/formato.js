export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(precio)
}

export const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha))
}

export const formatearEstado = (estado) => {
  const estados = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    preparando: 'En preparación',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
    devuelto: 'Devuelto',
  }
  return estados[estado] || estado
}

export const colorEstado = (estado) => {
  const colores = {
    pendiente: 'text-yellow-600 bg-yellow-50',
    confirmado: 'text-blue-600   bg-blue-50',
    preparando: 'text-purple-600 bg-purple-50',
    enviado: 'text-indigo-600 bg-indigo-50',
    entregado: 'text-green-600  bg-green-50',
    cancelado: 'text-red-600    bg-red-50',
    devuelto: 'text-gray-600   bg-gray-50',
  }
  return colores[estado] || 'text-gray-600 bg-gray-50'
}
