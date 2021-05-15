import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Meet from '../views/Meet.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/meet',
    name: 'Meet',
    component: Meet
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/:id',
    name: 'HelloID',
    component: () => import(/* webpackChunkName: "about" */ '../views/Hello.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
