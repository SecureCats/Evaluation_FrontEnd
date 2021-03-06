import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/class/:class/semester/:semester',
      name: 'home',
      component: Home
    },
    {
      path: '/success',
      name: 'success',
      component: () => import(/* webpackChunkName: "about" */ './views/Success.vue')
    },
    {
      path: '/denied',
      name: 'denied',
      component: () => import(/* webpackChunkName: "about" */ './views/Denied.vue')
    },
    {
      path: '*',
      name: '404',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/404.vue')
    },
  ]
})
