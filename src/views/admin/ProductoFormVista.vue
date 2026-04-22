<template>
  <div class="space-y-5 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <RouterLink
        to="/admin/productos"
        class="p-2 rounded-lg border border-gray-200 hover:border-black transition-colors"
      >
        <i class="pi pi-arrow-left text-sm" />
      </RouterLink>
      <div>
        <h2 class="text-lg font-semibold text-gray-900">
          {{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <p v-if="esEdicion" class="text-sm text-gray-400 mt-0.5">{{ form.nombre }}</p>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="cargandoProducto" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white border border-gray-100 rounded-xl p-6 animate-pulse"
      >
        <div class="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div class="space-y-3">
          <div class="h-10 bg-gray-100 rounded" />
          <div class="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Información básica -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Información básica</h3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej: Polo clásico hombre"
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  :class="{ 'border-red-400': errores.nombre }"
                />
                <p v-if="errores.nombre" class="text-xs text-red-500 mt-1">{{ errores.nombre }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">
                  Categoría <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.categoria_id"
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  :class="{ 'border-red-400': errores.categoria_id }"
                >
                  <option value="">Seleccionar categoría</option>
                  <template v-for="cat in categorias" :key="cat.id">
                    <option :value="cat.id">{{ cat.nombre }}</option>
                    <option v-for="hijo in cat.hijos" :key="hijo.id" :value="hijo.id">
                      &nbsp;&nbsp;└ {{ hijo.nombre }}
                    </option>
                  </template>
                </select>
                <p v-if="errores.categoria_id" class="text-xs text-red-500 mt-1">
                  {{ errores.categoria_id }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Marca</label>
                  <input
                    v-model="form.marca"
                    type="text"
                    placeholder="Ej: DASHEY"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Material</label>
                  <input
                    v-model="form.material"
                    type="text"
                    placeholder="Ej: 100% algodón"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
                <textarea
                  v-model="form.descripcion"
                  rows="4"
                  placeholder="Descripción detallada del producto..."
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.activo" class="rounded" />
                  <span class="text-sm text-gray-700">Producto activo</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.destacado" class="rounded" />
                  <span class="text-sm text-gray-700">Destacado en home</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Variantes -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold text-gray-900">
                Variantes
                <span class="text-gray-400 font-normal ml-1">({{ variantes.length }})</span>
              </h3>
              <button
                @click="abrirModalVariante()"
                class="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <i class="pi pi-plus text-xs" />
                Agregar variante
              </button>
            </div>

            <p v-if="errores.variantes" class="text-xs text-red-500 mb-3">
              {{ errores.variantes }}
            </p>

            <div
              v-if="!variantes.length"
              class="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl"
            >
              <i class="pi pi-tag text-2xl text-gray-200 mb-2 block" />
              <p class="text-sm text-gray-400">
                Agrega al menos una variante con talla, color y precio
              </p>
            </div>

            <!-- Lista de variantes -->
            <div v-else class="divide-y divide-gray-50">
              <div
                v-for="(variante, index) in variantes"
                :key="variante.id || index"
                class="flex items-center gap-3 py-3"
              >
                <!-- Color dot -->
                <div
                  class="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0"
                  :style="{ backgroundColor: variante.codigo_hex || '#e5e7eb' }"
                />

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ variante.talla }} — {{ variante.color }}
                  </p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-gray-400">SKU: {{ variante.sku }}</span>
                    <span class="text-gray-300">·</span>
                    <span class="text-xs text-gray-400">S/. {{ variante.precio }}</span>
                    <span v-if="variante.precio_oferta" class="text-xs text-green-600">
                      Oferta: S/. {{ variante.precio_oferta }}
                    </span>
                  </div>
                </div>

                <!-- Stock -->
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    v-if="esEdicion"
                    @click="abrirModalStock(variante)"
                    :class="[
                      'text-xs font-medium px-2.5 py-1 rounded-full transition-colors',
                      variante.stock > 5
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : variante.stock > 0
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100',
                    ]"
                  >
                    Stock: {{ variante.stock }}
                  </button>
                  <span v-else class="text-xs text-gray-400">Stock: {{ variante.stock }}</span>
                </div>

                <!-- Estado -->
                <span
                  :class="[
                    'text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                    variante.activo !== false
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500',
                  ]"
                >
                  {{ variante.activo !== false ? 'Activa' : 'Inactiva' }}
                </span>

                <!-- Acciones -->
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button
                    @click="abrirModalVariante(variante, index)"
                    class="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <i class="pi pi-pencil text-xs" />
                  </button>
                  <button
                    @click="eliminarVariante(variante, index)"
                    class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <i class="pi pi-trash text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal variante -->
          <div
            v-if="modalVarianteAbierto"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/40" @click="cerrarModalVariante" />
            <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <h3 class="text-base font-semibold text-gray-900 mb-5">
                {{ varianteEditando ? 'Editar variante' : 'Nueva variante' }}
              </h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Talla *</label>
                  <input
                    v-model="formVariante.talla"
                    type="text"
                    placeholder="S, M, L, 30..."
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.talla }"
                  />
                  <p v-if="erroresVariante.talla" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.talla }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Color *</label>
                  <input
                    v-model="formVariante.color"
                    type="text"
                    placeholder="Azul marino"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.color }"
                  />
                  <p v-if="erroresVariante.color" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.color }}
                  </p>
                </div>

                <div class="col-span-2">
                  <label class="text-sm font-medium text-gray-700 block mb-1"
                    >Color hexadecimal</label
                  >
                  <div class="flex gap-2">
                    <input
                      v-model="formVariante.codigo_hex"
                      type="text"
                      placeholder="#000000"
                      class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    />
                    <input
                      type="color"
                      :value="formVariante.codigo_hex || '#000000'"
                      @input="formVariante.codigo_hex = $event.target.value"
                      class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="text-sm font-medium text-gray-700 block mb-1">SKU *</label>
                  <input
                    v-model="formVariante.sku"
                    type="text"
                    placeholder="POLO-AZM-S-001"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.sku }"
                  />
                  <p v-if="erroresVariante.sku" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.sku }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Precio *</label>
                  <input
                    v-model.number="formVariante.precio"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="49.90"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.precio }"
                  />
                  <p v-if="erroresVariante.precio" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.precio }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Precio oferta</label>
                  <input
                    v-model.number="formVariante.precio_oferta"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="39.90"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Stock inicial</label>
                  <input
                    v-model.number="formVariante.stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div class="flex items-end pb-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="formVariante.activo" class="rounded" />
                    <span class="text-sm text-gray-700">Variante activa</span>
                  </label>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  @click="cerrarModalVariante"
                  class="flex-1 text-sm border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="guardarVariante"
                  :disabled="guardandoVariante"
                  class="flex-1 text-sm bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span
                    v-if="guardandoVariante"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  {{ varianteEditando ? 'Guardar cambios' : 'Agregar variante' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Modal ajuste de stock -->
          <div
            v-if="modalStockAbierto"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/40" @click="modalStockAbierto = false" />
            <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 class="text-base font-semibold text-gray-900 mb-1">Ajustar stock</h3>
              <p class="text-sm text-gray-500 mb-5">
                {{ varianteStock?.talla }} — {{ varianteStock?.color }} · Stock actual:
                <strong>{{ varianteStock?.stock }}</strong>
              </p>

              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">
                    Cantidad (positivo = entrada, negativo = salida)
                  </label>
                  <input
                    v-model.number="cantidadStock"
                    type="number"
                    placeholder="Ej: 10 o -5"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1"
                    >Motivo (opcional)</label
                  >
                  <input
                    v-model="motivoStock"
                    type="text"
                    placeholder="Ej: Reposición, Venta manual..."
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <!-- Preview resultado -->
                <div v-if="cantidadStock" class="bg-gray-50 rounded-lg p-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Stock actual</span>
                    <span>{{ varianteStock?.stock }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Ajuste</span>
                    <span :class="cantidadStock > 0 ? 'text-green-600' : 'text-red-500'">
                      {{ cantidadStock > 0 ? '+' : '' }}{{ cantidadStock }}
                    </span>
                  </div>
                  <div
                    class="flex justify-between font-semibold border-t border-gray-200 mt-2 pt-2"
                  >
                    <span>Stock resultante</span>
                    <span
                      :class="
                        varianteStock?.stock + cantidadStock < 0 ? 'text-red-500' : 'text-gray-900'
                      "
                    >
                      {{ varianteStock?.stock + cantidadStock }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  @click="modalStockAbierto = false"
                  class="flex-1 text-sm border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="aplicarAjusteStock"
                  :disabled="
                    !cantidadStock || ajustandoStock || varianteStock?.stock + cantidadStock < 0
                  "
                  class="flex-1 text-sm bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span
                    v-if="ajustandoStock"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Aplicar ajuste
                </button>
              </div>
            </div>
          </div>

          <!-- Modal variante -->
          <div
            v-if="modalVarianteAbierto"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/40" @click="cerrarModalVariante" />
            <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <h3 class="text-base font-semibold text-gray-900 mb-5">
                {{ varianteEditando ? 'Editar variante' : 'Nueva variante' }}
              </h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Talla *</label>
                  <input
                    v-model="formVariante.talla"
                    type="text"
                    placeholder="S, M, L, 30..."
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.talla }"
                  />
                  <p v-if="erroresVariante.talla" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.talla }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Color *</label>
                  <input
                    v-model="formVariante.color"
                    type="text"
                    placeholder="Azul marino"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.color }"
                  />
                  <p v-if="erroresVariante.color" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.color }}
                  </p>
                </div>

                <div class="col-span-2">
                  <label class="text-sm font-medium text-gray-700 block mb-1"
                    >Color hexadecimal</label
                  >
                  <div class="flex gap-2">
                    <input
                      v-model="formVariante.codigo_hex"
                      type="text"
                      placeholder="#000000"
                      class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    />
                    <input
                      type="color"
                      :value="formVariante.codigo_hex || '#000000'"
                      @input="formVariante.codigo_hex = $event.target.value"
                      class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="text-sm font-medium text-gray-700 block mb-1">SKU *</label>
                  <input
                    v-model="formVariante.sku"
                    type="text"
                    placeholder="POLO-AZM-S-001"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.sku }"
                  />
                  <p v-if="erroresVariante.sku" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.sku }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Precio *</label>
                  <input
                    v-model.number="formVariante.precio"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="49.90"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                    :class="{ 'border-red-400': erroresVariante.precio }"
                  />
                  <p v-if="erroresVariante.precio" class="text-xs text-red-500 mt-1">
                    {{ erroresVariante.precio }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Precio oferta</label>
                  <input
                    v-model.number="formVariante.precio_oferta"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="39.90"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">Stock inicial</label>
                  <input
                    v-model.number="formVariante.stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div class="flex items-end pb-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="formVariante.activo" class="rounded" />
                    <span class="text-sm text-gray-700">Variante activa</span>
                  </label>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  @click="cerrarModalVariante"
                  class="flex-1 text-sm border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="guardarVariante"
                  :disabled="guardandoVariante"
                  class="flex-1 text-sm bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span
                    v-if="guardandoVariante"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  {{ varianteEditando ? 'Guardar cambios' : 'Agregar variante' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Modal ajuste de stock -->
          <div
            v-if="modalStockAbierto"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/40" @click="modalStockAbierto = false" />
            <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 class="text-base font-semibold text-gray-900 mb-1">Ajustar stock</h3>
              <p class="text-sm text-gray-500 mb-5">
                {{ varianteStock?.talla }} — {{ varianteStock?.color }} · Stock actual:
                <strong>{{ varianteStock?.stock }}</strong>
              </p>

              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">
                    Cantidad (positivo = entrada, negativo = salida)
                  </label>
                  <input
                    v-model.number="cantidadStock"
                    type="number"
                    placeholder="Ej: 10 o -5"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1"
                    >Motivo (opcional)</label
                  >
                  <input
                    v-model="motivoStock"
                    type="text"
                    placeholder="Ej: Reposición, Venta manual..."
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <!-- Preview resultado -->
                <div v-if="cantidadStock" class="bg-gray-50 rounded-lg p-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Stock actual</span>
                    <span>{{ varianteStock?.stock }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Ajuste</span>
                    <span :class="cantidadStock > 0 ? 'text-green-600' : 'text-red-500'">
                      {{ cantidadStock > 0 ? '+' : '' }}{{ cantidadStock }}
                    </span>
                  </div>
                  <div
                    class="flex justify-between font-semibold border-t border-gray-200 mt-2 pt-2"
                  >
                    <span>Stock resultante</span>
                    <span
                      :class="
                        varianteStock?.stock + cantidadStock < 0 ? 'text-red-500' : 'text-gray-900'
                      "
                    >
                      {{ varianteStock?.stock + cantidadStock }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  @click="modalStockAbierto = false"
                  class="flex-1 text-sm border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="aplicarAjusteStock"
                  :disabled="
                    !cantidadStock || ajustandoStock || varianteStock?.stock + cantidadStock < 0
                  "
                  class="flex-1 text-sm bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span
                    v-if="ajustandoStock"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Aplicar ajuste
                </button>
              </div>
            </div>
          </div>

          <!-- Imágenes (solo en edición) -->
          <div v-if="esEdicion" class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Imágenes</h3>

            <!-- Subir imagen -->
            <div class="mb-4">
              <div
                @click="$refs.inputImagen.click()"
                class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <i class="pi pi-upload text-2xl text-gray-300 mb-2 block" />
                <p class="text-sm text-gray-500">Haz clic para subir imagen</p>
                <p class="text-xs text-gray-400 mt-1">JPG, PNG o WebP — máx. 5MB</p>
              </div>
              <input
                ref="inputImagen"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="subirImagenes"
              />
            </div>

            <!-- Galería -->
            <div v-if="imagenes.length" class="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div
                v-for="imagen in imagenes"
                :key="imagen.id"
                class="relative group aspect-square bg-gray-50 rounded-xl overflow-hidden"
              >
                <img
                  :src="imagenUrl(imagen.url)"
                  :alt="imagen.alt_text"
                  class="w-full h-full object-cover"
                />

                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                >
                  <button
                    v-if="!imagen.es_principal"
                    @click="setPrincipal(imagen)"
                    title="Hacer principal"
                    class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    <i class="pi pi-star text-xs" />
                  </button>
                  <button
                    @click="eliminarImagen(imagen)"
                    title="Eliminar"
                    class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
                  >
                    <i class="pi pi-trash text-xs" />
                  </button>
                </div>

                <!-- Badge principal -->
                <div v-if="imagen.es_principal" class="absolute top-1.5 left-1.5">
                  <span class="bg-black text-white text-xs px-1.5 py-0.5 rounded-md"
                    >Principal</span
                  >
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-400 text-center py-4">
              No hay imágenes — sube al menos una
            </p>
          </div>
        </div>

        <!-- Columna lateral -->
        <div class="space-y-5">
          <!-- Estado -->
          <div class="bg-white border border-gray-100 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Publicación</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Estado</span>
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    form.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
                  ]"
                >
                  {{ form.activo ? 'Activo' : 'Borrador' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Destacado</span>
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    form.destacado ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500',
                  ]"
                >
                  {{ form.destacado ? 'Sí' : 'No' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Variantes</span>
                <span class="text-sm font-medium text-gray-900">{{ variantes.length }}</span>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-3">
            <button
              @click="guardar"
              :disabled="guardando"
              class="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <span
                v-if="guardando"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              <i v-else class="pi pi-check text-sm" />
              {{ esEdicion ? 'Guardar cambios' : 'Crear producto' }}
            </button>
            <RouterLink
              to="/admin/productos"
              class="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-3 rounded-xl hover:border-gray-400 transition-colors"
            >
              Cancelar
            </RouterLink>
          </div>

          <!-- Info edición -->
          <div v-if="esEdicion" class="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p class="text-xs text-blue-700 leading-relaxed">
              <i class="pi pi-info-circle mr-1" />
              Para agregar variantes a un producto existente usa la sección de variantes en el
              listado de productos.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import { useCatalogoStore } from '@/stores/catalogo.store'
import { variantesServicio } from '@/services/variantes.service'
const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const catalogoStore = useCatalogoStore()

const esEdicion = computed(() => !!route.params.id)
const cargandoProducto = ref(false)
const guardando = ref(false)
const categorias = ref([])
const imagenes = ref([])
const inputImagen = ref(null)

const form = reactive({
  nombre: '',
  categoria_id: '',
  marca: '',
  material: '',
  descripcion: '',
  activo: true,
  destacado: false,
})

const errores = reactive({
  nombre: '',
  categoria_id: '',
  variantes: '',
})

const variantes = ref([])

const imagenUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${url}`
}

const cargarProducto = async () => {
  if (!esEdicion.value) return
  cargandoProducto.value = true
  try {
    const { default: api } = await import('@/services/api')
    const res = await api.get(`/admin/productos`)
    const productos = res.data
    const prod = productos.find((p) => p.id === route.params.id)
    if (!prod) {
      router.push('/admin/productos')
      return
    }

    const detalle = await api.get(`/productos/${prod.slug}`)
    const p = detalle.data

    form.nombre = p.nombre
    form.categoria_id = p.categoria_id || ''
    form.marca = p.marca || ''
    form.material = p.material || ''
    form.descripcion = p.descripcion || ''
    form.activo = p.activo
    form.destacado = p.destacado
    if (esEdicion.value) {
      const varRes = await variantesServicio.getVariantes(route.params.id)
      variantes.value = varRes.data || []
    } else {
      variantes.value = p.variantes?.map((v) => ({ ...v })) || []
    }
    imagenes.value = p.imagenes || []
  } catch {
    uiStore.error('Error', 'No se pudo cargar el producto')
  } finally {
    cargandoProducto.value = false
  }
}

// ── Variables modal variante ──────────────────────────
const modalVarianteAbierto = ref(false)
const varianteEditando = ref(null)
const varianteIndex = ref(null)
const guardandoVariante = ref(false)

const formVariante = reactive({
  talla: '',
  color: '',
  codigo_hex: '',
  sku: '',
  precio: '',
  precio_oferta: '',
  stock: 0,
  activo: true,
})

const erroresVariante = reactive({
  talla: '',
  color: '',
  sku: '',
  precio: '',
})

// ── Variables modal stock ─────────────────────────────
const modalStockAbierto = ref(false)
const varianteStock = ref(null)
const cantidadStock = ref(0)
const motivoStock = ref('')
const ajustandoStock = ref(false)

// ── Funciones modal variante ──────────────────────────
const abrirModalVariante = (variante = null, index = null) => {
  varianteEditando.value = variante
  varianteIndex.value = index
  if (variante) {
    formVariante.talla = variante.talla
    formVariante.color = variante.color
    formVariante.codigo_hex = variante.codigo_hex || ''
    formVariante.sku = variante.sku
    formVariante.precio = variante.precio
    formVariante.precio_oferta = variante.precio_oferta || ''
    formVariante.stock = variante.stock
    formVariante.activo = variante.activo !== false
  } else {
    Object.assign(formVariante, {
      talla: '',
      color: '',
      codigo_hex: '',
      sku: '',
      precio: '',
      precio_oferta: '',
      stock: 0,
      activo: true,
    })
  }
  Object.assign(erroresVariante, { talla: '', color: '', sku: '', precio: '' })
  modalVarianteAbierto.value = true
}

const cerrarModalVariante = () => {
  modalVarianteAbierto.value = false
  varianteEditando.value = null
  varianteIndex.value = null
}

const validarVariante = () => {
  Object.assign(erroresVariante, { talla: '', color: '', sku: '', precio: '' })
  let valido = true
  if (!formVariante.talla) {
    erroresVariante.talla = 'Requerido'
    valido = false
  }
  if (!formVariante.color) {
    erroresVariante.color = 'Requerido'
    valido = false
  }
  if (!formVariante.sku) {
    erroresVariante.sku = 'Requerido'
    valido = false
  }
  if (!formVariante.precio || formVariante.precio <= 0) {
    erroresVariante.precio = 'Requerido'
    valido = false
  }
  return valido
}

const guardarVariante = async () => {
  if (!validarVariante()) return
  guardandoVariante.value = true

  const datos = {
    talla: formVariante.talla,
    color: formVariante.color,
    codigo_hex: formVariante.codigo_hex || null,
    sku: formVariante.sku,
    precio: parseFloat(formVariante.precio),
    precio_oferta: formVariante.precio_oferta ? parseFloat(formVariante.precio_oferta) : null,
    stock: parseInt(formVariante.stock) || 0,
    activo: formVariante.activo,
  }

  try {
    if (esEdicion.value && varianteEditando.value?.id) {
      // Editar variante existente en backend
      const res = await variantesServicio.editar(route.params.id, varianteEditando.value.id, datos)
      variantes.value[varianteIndex.value] = res.data
      uiStore.exito('Actualizada', 'Variante actualizada correctamente')
    } else if (esEdicion.value) {
      // Crear nueva variante en backend
      const res = await variantesServicio.crear(route.params.id, datos)
      variantes.value.push(res.data)
      uiStore.exito('Creada', 'Variante agregada correctamente')
    } else {
      // Modo creación — solo agregar al array local
      if (varianteIndex.value !== null) {
        variantes.value[varianteIndex.value] = { ...datos }
      } else {
        variantes.value.push({ ...datos })
      }
    }
    cerrarModalVariante()
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo guardar la variante')
  } finally {
    guardandoVariante.value = false
  }
}

const eliminarVariante = async (variante, index) => {
  if (!confirm(`¿Eliminar la variante ${variante.talla} — ${variante.color}?`)) return
  try {
    if (esEdicion.value && variante.id) {
      await variantesServicio.eliminar(route.params.id, variante.id)
    }
    variantes.value.splice(index, 1)
    uiStore.exito('Eliminada', 'Variante eliminada correctamente')
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo eliminar la variante')
  }
}

// ── Funciones modal stock ─────────────────────────────
const abrirModalStock = (variante) => {
  varianteStock.value = variante
  cantidadStock.value = 0
  motivoStock.value = ''
  modalStockAbierto.value = true
}

const aplicarAjusteStock = async () => {
  if (!cantidadStock.value) return
  ajustandoStock.value = true
  try {
    const res = await variantesServicio.ajustarStock(route.params.id, varianteStock.value.id, {
      cantidad: cantidadStock.value,
      motivo: motivoStock.value || null,
    })
    const index = variantes.value.findIndex((v) => v.id === varianteStock.value.id)
    if (index >= 0) variantes.value[index].stock = res.data.stock
    uiStore.exito('Stock ajustado', `Nuevo stock: ${res.data.stock}`)
    modalStockAbierto.value = false
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo ajustar el stock')
  } finally {
    ajustandoStock.value = false
  }
}

const validar = () => {
  errores.nombre = ''
  errores.categoria_id = ''
  errores.variantes = ''
  let valido = true

  if (!form.nombre.trim()) {
    errores.nombre = 'El nombre es requerido'
    valido = false
  }
  if (!form.categoria_id) {
    errores.categoria_id = 'La categoría es requerida'
    valido = false
  }
  if (!esEdicion.value && !variantes.value.length) {
    errores.variantes = 'Agrega al menos una variante'
    valido = false
  }

  // Validar cada variante
  for (const v of variantes.value) {
    if (!v.talla || !v.color || !v.sku || !v.precio) {
      errores.variantes = 'Completa todos los campos obligatorios de cada variante'
      valido = false
      break
    }
  }

  return valido
}

const guardar = async () => {
  if (!validar()) return
  guardando.value = true
  try {
    const { default: api } = await import('@/services/api')

    if (esEdicion.value) {
      await api.put(`/admin/productos/${route.params.id}`, {
        nombre: form.nombre,
        categoria_id: form.categoria_id,
        marca: form.marca || null,
        material: form.material || null,
        descripcion: form.descripcion || null,
        activo: form.activo,
        destacado: form.destacado,
      })
      uiStore.exito('Actualizado', 'Producto actualizado correctamente')
    } else {
      const res = await api.post('/admin/productos', {
        ...form,
        variantes: variantes.value.map((v) => ({
          ...v,
          precio: parseFloat(v.precio),
          precio_oferta: v.precio_oferta ? parseFloat(v.precio_oferta) : null,
          stock: parseInt(v.stock) || 0,
          codigo_hex: v.codigo_hex || null,
        })),
      })
      uiStore.exito('Creado', 'Producto creado — ahora puedes agregar imágenes')
      router.push(`/admin/productos/${res.data.id}/editar`)
    }
  } catch (err) {
    uiStore.error('Error', err.message || 'No se pudo guardar el producto')
  } finally {
    guardando.value = false
  }
}

const subirImagenes = async (e) => {
  const archivos = Array.from(e.target.files)
  if (!archivos.length) return

  for (const archivo of archivos) {
    try {
      const formData = new FormData()
      formData.append('imagen', archivo)
      const { default: api } = await import('@/services/api')
      const res = await api.post(`/admin/productos/${route.params.id}/imagenes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      imagenes.value.push(res.data)
      uiStore.exito('Imagen subida', 'Imagen agregada correctamente')
    } catch {
      uiStore.error('Error', `No se pudo subir ${archivo.name}`)
    }
  }
  e.target.value = ''
}

const setPrincipal = async (imagen) => {
  try {
    const { default: api } = await import('@/services/api')
    await api.patch(`/admin/productos/${route.params.id}/imagenes/${imagen.id}/principal`)
    imagenes.value.forEach((img) => {
      img.es_principal = img.id === imagen.id
    })
    uiStore.exito('Actualizada', 'Imagen principal actualizada')
  } catch {
    uiStore.error('Error', 'No se pudo actualizar la imagen principal')
  }
}

const eliminarImagen = async (imagen) => {
  if (!confirm('¿Eliminar esta imagen?')) return
  try {
    const { default: api } = await import('@/services/api')
    await api.delete(`/admin/productos/${route.params.id}/imagenes/${imagen.id}`)
    imagenes.value = imagenes.value.filter((img) => img.id !== imagen.id)
    uiStore.exito('Eliminada', 'Imagen eliminada correctamente')
  } catch {
    uiStore.error('Error', 'No se pudo eliminar la imagen')
  }
}

onMounted(async () => {
  await catalogoStore.getCategorias()
  categorias.value = catalogoStore.categorias
  await cargarProducto()
})
</script>
