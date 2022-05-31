import { createRouter, createWebHashHistory } from 'vue-router'

import layout from './layout'
import dashboard from '@/views/dashboard'
import counter from '@/views/counter'
import post from '@/views/post'
import token from '@/views/token'

import question from '@/views/question'

import anwserAdmin from '@/views/anwser/admin/anwser'
import anwserAdminNormal from '@/views/anwser/admin/normal'

import anwserFrontRank from '@/views/anwser/front/rank'
import anwserFrontNewbie from '@/views/anwser/front/newbie'
import anwserFrontNormal from '@/views/anwser/front/normal'
import anwserFrontKnowbie from '@/views/anwser/front/knowbie'

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
    path: '/anwser/admin', component: layout, 
    redirect: '/anwser/admin/index',
    children: [
      {
        path: 'index',
        component: anwserAdmin,
      }
    ],
    meta: {
      title: 'anwser'
    } 
  },
  {
    path: '/anwser/admin/normal', component: layout, 
    redirect: '/anwser/admin/normal/index',
    children: [
      {
        path: 'index',
        component: anwserAdminNormal,
      }
    ],
    meta: {
      title: 'anwser 人机'
    } 
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes: [ 
    ...routes, 
    {
      path: '/',
      redirect: '/dashboard/index',
    },
    {
      path: '/anwser/rank', 
      redirect: '/anwser/rank/newbie',
      component: anwserFrontRank, 
      children: [
        {
          path: 'newbie',
          component: anwserFrontNewbie,
        },
        {
          path: 'normal',
          component: anwserFrontNormal,
        },
        {
          path: 'knowbie',
          component: anwserFrontKnowbie,
        },
      ],
      meta: {
        title: ''
      } 
    },
  ],
})