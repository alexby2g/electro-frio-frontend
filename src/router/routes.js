const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('../pages/IndexPage.vue') },
      { path: 'clientes', name: 'clientes', component: () => import('../pages/ClientesPage.vue') },
      { path: 'tecnicos', name: 'tecnicos', component: () => import('../pages/TecnicosPage.vue') },
      { path: 'servicios', name: 'servicios', component: () => import('../pages/ServiciosPage.vue') },
      { path: 'equipos', name: 'equipos', component: () => import('../pages/EquiposPage.vue') },
      { path: 'citas', name: 'citas', component: () => import('../pages/CitasPage.vue') },
      { path: 'pagos', name: 'pagos', component: () => import('../pages/PagosPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

export default routes
