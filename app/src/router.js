import { createRouter, createWebHashHistory } from 'vue-router'

import layout from './layout'
import dashboard from '@/views/dashboard'
import counter from '@/views/counter'

export const routes = [
  { 
    path: '/dashboard', component: layout, 
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        component: dashboard,
      }
    ],
    meta: {
      title: 'dashboard'
    } 
  },
  {
    path: '/counter', component: layout, 
    redirect: '/counter/index',
    children: [
      {
        path: 'index',
        component: counter,
      }
    ],
    meta: {
      title: 'counter'
    } 
  }
  
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})