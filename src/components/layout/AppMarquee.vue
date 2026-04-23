<template>
  <div class="w-full bg-black overflow-hidden py-2.5">
    <div class="marquee-track flex items-center gap-0 whitespace-nowrap">
      <span v-for="n in 3" :key="n" class="marquee-content flex items-center gap-8 px-8">
        <span
          v-for="(item, i) in items"
          :key="i"
          class="inline-flex items-center gap-2 text-white text-xs font-medium tracking-widest uppercase"
        >
          <span :class="item.icono" class="text-[#C8A96E] text-xs" />
          {{ item.texto }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
const items = [
  { icono: 'pi pi-truck', texto: 'Envío gratis en pedidos mayores a S/. 150' },
  { icono: 'pi pi-tag', texto: 'Nuevas colecciones disponibles' },
  { icono: 'pi pi-percentage', texto: 'Hasta 40% de descuento en ofertas' },
  { icono: 'pi pi-whatsapp', texto: 'Atención por WhatsApp las 24hrs' },
  { icono: 'pi pi-refresh', texto: 'Devoluciones gratis en 30 días' },
  { icono: 'pi pi-star', texto: 'Productos de calidad premium' },
]
</script>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
