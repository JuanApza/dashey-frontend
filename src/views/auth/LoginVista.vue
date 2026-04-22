<template>
  <div class="w-full max-w-md mx-auto px-4">
    <!-- Logo -->
    <div class="text-center mb-8">
      <RouterLink to="/" class="inline-block">
        <h1 class="text-2xl font-bold tracking-widest uppercase">DASHEY</h1>
      </RouterLink>
      <p class="text-gray-500 text-sm mt-2">Inicia sesión en tu cuenta</p>
    </div>

    <!-- Card -->
    <div class="bg-white border border-gray-100 rounded-2xl p-8">
      <form @submit.prevent="handleLogin" class="space-y-5">
        <BaseInput
          v-model="form.email"
          etiqueta="Correo electrónico"
          tipo="email"
          placeholder="juan@ejemplo.com"
          :requerido="true"
          :error="errores.email"
          :deshabilitado="cargando"
        />

        <BaseInput
          v-model="form.password"
          etiqueta="Contraseña"
          :tipo="mostrarPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :requerido="true"
          :error="errores.password"
          :deshabilitado="cargando"
        >
          <template #derecha>
            <button
              type="button"
              @click="mostrarPassword = !mostrarPassword"
              class="text-gray-400 hover:text-gray-600"
            >
              <i :class="mostrarPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm" />
            </button>
          </template>
        </BaseInput>

        <BaseAlert v-if="errorGeneral" tipo="error">
          {{ errorGeneral }}
        </BaseAlert>

        <BaseButton
          tipo="submit"
          variante="primario"
          :bloque="true"
          :cargando="cargando"
          tamano="lg"
        >
          Iniciar sesión
        </BaseButton>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          ¿No tienes cuenta?
          <RouterLink to="/auth/registro" class="text-black font-medium hover:underline ml-1">
            Regístrate
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Volver -->
    <div class="text-center mt-6">
      <RouterLink
        to="/"
        class="text-sm text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-1"
      >
        <i class="pi pi-arrow-left text-xs" />
        Volver a la tienda
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const { login } = useAuth()
const cargando = ref(false)
const mostrarPassword = ref(false)
const errorGeneral = ref('')

const form = reactive({
  email: '',
  password: '',
})

const errores = reactive({
  email: '',
  password: '',
})

const validar = () => {
  errores.email = ''
  errores.password = ''
  let valido = true

  if (!form.email) {
    errores.email = 'El correo es requerido'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errores.email = 'Ingresa un correo válido'
    valido = false
  }

  if (!form.password) {
    errores.password = 'La contraseña es requerida'
    valido = false
  } else if (form.password.length < 6) {
    errores.password = 'Mínimo 6 caracteres'
    valido = false
  }

  return valido
}

const handleLogin = async () => {
  errorGeneral.value = ''
  if (!validar()) return

  cargando.value = true
  try {
    await login({ email: form.email, password: form.password })
  } catch (err) {
    errorGeneral.value = err?.message || 'Credenciales incorrectas'
  } finally {
    cargando.value = false
  }
}
</script>
