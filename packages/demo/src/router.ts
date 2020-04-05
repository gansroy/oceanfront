import { createRouter, createWebHashHistory } from 'vue-router'

import Formatters from './components/Formatters.vue'
import Icons from './components/Icons.vue'
import Overview from './components/Overview.vue'
import SelectInputs from './components/SelectInputs.vue'
import TextInputs from './components/TextInputs.vue'
import ToggleInputs from './components/ToggleInputs.vue'

export const routerHistory = createWebHashHistory('/ofdocs')
export const router = createRouter({
  history: routerHistory,
  routes: [
    // 'as any' to work around a temporary vue-router typing issue
    { path: '/', name: 'index', component: Overview as any },
    { path: '/icons', component: Icons as any },
    { path: '/formatters', component: Formatters as any },
    { path: '/select-inputs', component: SelectInputs as any },
    { path: '/text-inputs', component: TextInputs as any },
    { path: '/toggle-inputs', component: ToggleInputs as any }
  ]
})
