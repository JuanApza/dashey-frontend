<template>
  <footer class="bg-black text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Marca -->
        <div class="lg:col-span-1">
          <h2 class="text-xl font-bold tracking-widest uppercase mb-4">DASHEY</h2>
          <p class="text-sm text-gray-400 leading-relaxed mb-6">
            Moda para quienes marcan la diferencia. Encuentra tu estilo en nuestra colección de ropa
            de calidad.
          </p>
          <div class="flex items-center gap-3">
            <a
              v-for="red in redesSociales"
              :key="red.nombre"
              :href="red.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="red.nombre"
              class="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
            >
              <i :class="red.icono" class="text-sm" />
            </a>
          </div>
        </div>

        <!-- Tienda -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">Tienda</h3>
          <ul class="space-y-2.5">
            <li v-for="link in linksTienda" :key="link.nombre">
              <RouterLink
                :to="link.ruta"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {{ link.nombre }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Mi cuenta -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">Mi cuenta</h3>
          <ul class="space-y-2.5">
            <li v-for="link in linksCuenta" :key="link.nombre">
              <RouterLink
                :to="link.ruta"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {{ link.nombre }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-4">Contacto</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2.5">
              <i class="pi pi-whatsapp text-sm text-gray-400 mt-0.5" />
              <a
                :href="`https://wa.me/${whatsapp}`"
                target="_blank"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {{ whatsappFormateado }}
              </a>
            </li>

            <li class="flex items-start gap-2.5">
              <i class="pi pi-envelope text-sm text-gray-400 mt-0.5" />
              <a
                href="mailto:contacto@dashey.pe"
                class="text-sm text-gray-400 hover:text-white transition-colors"
              >
                contacto@dashey.pe
              </a>
            </li>
            <li class="flex items-start gap-2.5">
              <i class="pi pi-map-marker text-sm text-gray-400 mt-0.5" />
              <span class="text-sm text-gray-400">Lima, Perú</span>
            </li>
          </ul>
          <a
            :href="`https://wa.me/${whatsapp}?text=${mensajeWhatsapp}`"
            target="_blank"
            class="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <i class="pi pi-whatsapp" />
            Escríbenos
          </a>
        </div>
      </div>
    </div>

    <!-- Métodos de pago -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-500">Aceptamos</p>
          <div class="flex items-center gap-3 flex-wrap justify-center">
            <span
              v-for="metodo in metodosPago"
              :key="metodo"
              class="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-md font-medium"
            >
              {{ metodo }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600"
        >
          <p>© {{ anioActual }} DASHEY. Todos los derechos reservados.</p>
          <div class="flex items-center gap-4">
            <RouterLink to="/terminos" class="hover:text-gray-400 transition-colors">
              Términos y condiciones
            </RouterLink>
            <RouterLink to="/privacidad" class="hover:text-gray-400 transition-colors">
              Política de privacidad
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const whatsapp = import.meta.env.VITE_WHATSAPP || '51999999999'
const whatsappFormateado = `+${whatsapp}`
const mensajeWhatsapp = encodeURIComponent(
  'Hola, me gustaría obtener más información sobre sus productos.',
)
const anioActual = new Date().getFullYear()

const redesSociales = [
  { nombre: 'Instagram', icono: 'pi pi-instagram', url: 'https://instagram.com/dashey' },
  { nombre: 'Facebook', icono: 'pi pi-facebook', url: 'https://facebook.com/dashey' },
  { nombre: 'TikTok', icono: 'pi pi-tiktok', url: 'https://tiktok.com/@dashey' },
]

const linksTienda = [
  { nombre: 'Todos los productos', ruta: '/catalogo' },
  { nombre: 'Hombre', ruta: '/catalogo?categoria=hombre' },
  { nombre: 'Mujer', ruta: '/catalogo?categoria=mujer' },
  { nombre: 'Niños', ruta: '/catalogo?categoria=ninos' },
  { nombre: 'Ofertas', ruta: '/catalogo?destacado=true' },
]

const linksCuenta = [
  { nombre: 'Iniciar sesión', ruta: '/auth/login' },
  { nombre: 'Crear cuenta', ruta: '/auth/registro' },
  { nombre: 'Mis pedidos', ruta: '/mis-pedidos' },
  { nombre: 'Carrito', ruta: '/carrito' },
]

const metodosPago = ['Yape', 'Plin', 'BCP', 'Interbank', 'BBVA', 'Contraentrega']
</script>
