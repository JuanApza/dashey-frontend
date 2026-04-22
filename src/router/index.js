import { createRouter, createWebHistory } from 'vue-router'
import { guardsAuth } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Tienda pública ────────────────────────────────
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/tienda/HomeVista.vue'),
        },
        {
          path: 'catalogo',
          name: 'catalogo',
          component: () => import('@/views/tienda/CatalogoVista.vue'),
        },
        {
          path: 'catalogo/:slug',
          name: 'producto',
          component: () => import('@/views/tienda/ProductoVista.vue'),
        },
        {
          path: 'carrito',
          name: 'carrito',
          component: () => import('@/views/tienda/CarritoVista.vue'),
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/tienda/CheckoutVista.vue'),
          meta: { requiereAuth: true },
        },
        {
          path: 'mis-pedidos',
          name: 'pedidos',
          component: () => import('@/views/tienda/PedidosVista.vue'),
          meta: { requiereAuth: true },
        },
        {
          path: 'mis-pedidos/:id',
          name: 'pedido-detalle',
          component: () => import('@/views/tienda/PedidoDetalleVista.vue'),
          meta: { requiereAuth: true },
        },
        {
          path: 'pago/:pedidoId',
          name: 'pago',
          component: () => import('@/views/tienda/PagoVista.vue'),
          meta: { requiereAuth: true },
        },
      ],
    },

    // ── Auth ─────────────────────────────────────────
    {
      path: '/auth',
      component: () => import('@/components/layout/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginVista.vue'),
          meta: { soloInvitados: true },
        },
        {
          path: 'registro',
          name: 'registro',
          component: () => import('@/views/auth/RegistroVista.vue'),
          meta: { soloInvitados: true },
        },
      ],
    },

    // ── Admin ─────────────────────────────────────────
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiereAuth: true, requiereAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardVista.vue'),
        },
        {
          path: 'productos',
          name: 'admin-productos',
          component: () => import('@/views/admin/ProductosVista.vue'),
        },
        {
          path: 'productos/nuevo',
          name: 'admin-producto-nuevo',
          component: () => import('@/views/admin/ProductoFormVista.vue'),
        },
        {
          path: 'productos/:id/editar',
          name: 'admin-producto-editar',
          component: () => import('@/views/admin/ProductoFormVista.vue'),
        },
        {
          path: 'categorias',
          name: 'admin-categorias',
          component: () => import('@/views/admin/CategoriasVista.vue'),
        },
        {
          path: 'pedidos',
          name: 'admin-pedidos',
          component: () => import('@/views/admin/PedidosVista.vue'),
        },
        {
          path: 'pedidos/:id',
          name: 'admin-pedido-detalle',
          component: () => import('@/views/admin/PedidoDetalleVista.vue'),
        },
        {
          path: 'cupones',
          name: 'admin-cupones',
          component: () => import('@/views/admin/CuponesVista.vue'),
        },
        {
          path: 'resenas',
          name: 'admin-resenas',
          component: () => import('@/views/admin/ResenasVista.vue'),
        },
        {
          path: 'usuarios',
          name: 'admin-usuarios',
          component: () => import('@/views/admin/UsuariosVista.vue'),
        },
      ],
    },

    // ── 404 ──────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundVista.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach(guardsAuth)

export default router
