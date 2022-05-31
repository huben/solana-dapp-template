import { createRouter, createWebHashHistory } from 'vue-router'

import layout from './layout'
import dashboard from '@/views/dashboard'
import counter from '@/views/counter'
import post from '@/views/post'
import token from '@/views/token'

import question from '@/views/question'
import anwser from '@/views/anwser'

import anwserRank from '@/views/anwserRank'

import anwserNewbie from '@/views/anwser/newbie'
import anwserNormal from '@/views/anwser/normal'
import anwserKnowbie from '@/views/anwser/knowbie'

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
  {
    path: '/question', component: layout, 
    redirect: '/question/index',
    children: [
      {
        path: 'index',
        component: question,
      }
    ],
    meta: {
      title: 'question'
    } 
  },
  {
    path: '/anwser', component: layout, 
    redirect: '/anwser/index',
    children: [
      {
        path: 'index',
        component: anwser,
      }
    ],
    meta: {
      title: 'anwser'
    } 
  },
  
  
]

export default createRouter({
  history: createWebHashHistory(),
  routes: [ 
    ...routes, 
    {
      path: '/anwser/rank', 
      redirect: '/anwser/rank/newbie',
      component: anwserRank, 
      children: [
        {
          path: 'newbie',
          component: anwserNewbie,
        },
        {
          path: 'normal',
          component: anwserNormal,
        },
        {
          path: 'knowbie',
          component: anwserKnowbie,
        },
      ],
      meta: {
        title: ''
      } 
    },
  ],
})