import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/components/gallery-header')
  },
  {
    path: '/test',
    component: () => import('@/views/test')
  }
]

const router = new VueRouter({
  routes
})

export default router
