import { createRouter, createWebHashHistory } from 'vue-router'

import redirect from './modules/redirect'
import error from './modules/error'
import login from './modules/login'
import lock from './modules/lock'
import home from './modules/home'
import test from './modules/test'
import system from './modules/system'
import product from './modules/product'
import order from './modules/order'

/* Menu bar routes */
// Fixed menu
export const fixedRoutes = [...home]
// Dynamic menu
export const asyncRoutes = [...system, ...product, ...order]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    ...redirect, // Unified redirect configuration
    ...login,
    ...lock,
    ...fixedRoutes,
    ...error,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
