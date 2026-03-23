import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'public',
      component: () => import('@/pages/public/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/public/home/index.vue')
        },
        {
          path: 'product/:id',
          name: 'product-details',
          component: () => import('@/pages/public/product-details/index.vue')
        },
        {
          path: 'auth',
          name: 'seller-auth',
          component: () => import('@/pages/public/auth/index.vue')
        },
        {
          path: 'profile',
          name: 'seller-profile',
          component: () => import('@/pages/public/profile/index.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/admin/AdminLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'admin-login',
          component: () => import('@/pages/admin/login/index.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/admin/products-list/index.vue')
        }
      ]
    }
  ]
})

export default router
