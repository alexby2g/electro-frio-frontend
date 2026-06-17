const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../pages/IndexPage.vue'),
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('../pages/ClientesPage.vue'),
      },
      {
        path: 'servicios',
        name: 'servicios',
        component: () => import('../pages/ServiciosPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

export default routes