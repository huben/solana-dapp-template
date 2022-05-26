import { createRouter, createWebHashHistory } from 'vue-router'

import layout from './layout'
import dashboard from '@/views/dashboard'
import counter from '@/views/counter'
import post from '@/views/post'
import token from '@/views/token'

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
  },
  {
    path: '/post', component: layout, 
    redirect: '/post/index',
    children: [
      {
        path: 'index',
        component: post,
      }
    ],
    meta: {
      title: 'post'
    } 
  },
  {
    path: '/token', component: layout, 
    redirect: '/token/index',
    children: [
      {
        path: 'index',
        component: token,
      }
    ],
    meta: {
      title: 'token'
    } 
  },
  
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})