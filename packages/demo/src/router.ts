import { createRouter, createWebHistory } from 'vue-router'

import TestForm from './components/TestForm.vue'
import TestInputs from './components/TestInputs.vue'

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', component: TestForm },
    { path: '/inputs', component: TestInputs }
    //    { path: '/users/:id', name: 'user', component: User, props: true },
  ]
})
