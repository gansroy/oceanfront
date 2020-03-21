import { createRouter, createWebHashHistory } from 'vue-router'

import TestForm from './components/TestForm.vue'
import TestInputs from './components/TestInputs.vue'

export const routerHistory = createWebHashHistory('/ofdocs')
export const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', component: TestForm },
    { path: '/inputs', component: TestInputs }
    //    { path: '/users/:id', name: 'user', component: User, props: true },
  ]
})
