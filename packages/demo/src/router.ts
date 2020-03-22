import { createRouter, createWebHashHistory } from 'vue-router'

import Icons from './components/Icons.vue'
import Overview from './components/Overview.vue'
import SelectInputs from './components/SelectInputs.vue'
import TextInputs from './components/TextInputs.vue'
import ToggleInputs from './components/ToggleInputs.vue'

export const routerHistory = createWebHashHistory('/ofdocs')
export const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', component: Overview },
    { path: '/icons', component: Icons },
    { path: '/select-inputs', component: SelectInputs },
    { path: '/text-inputs', component: TextInputs },
    { path: '/toggle-inputs', component: ToggleInputs }
  ]
})
