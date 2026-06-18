import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach((to, _from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && auth.user) {
    return { name: 'home' }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
})

export default router
