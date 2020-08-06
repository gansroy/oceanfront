import { createRouter, createWebHashHistory } from 'vue-router'

import DataTables from './components/DataTables.vue'
import Formatters from './components/Formatters.vue'
import Colors from './components/Colors.vue'
import Icons from './components/Icons.vue'
import Overview from './components/Overview.vue'
import FileInputs from './components/FileInputs.vue'
import Records from './components/Records.vue'
import SelectInputs from './components/SelectInputs.vue'
import TextInputs from './components/TextInputs.vue'
import ToggleInputs from './components/ToggleInputs.vue'
import Tabs from './components/Tabs.vue'

export const routerHistory = createWebHashHistory('/ofdocs')
export const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', name: 'index', component: Overview },
    { path: '/colors', component: Colors },
    { path: '/icons', component: Icons },
    { path: '/records', component: Records },
    { path: '/formatters', component: Formatters },
    { path: '/file-inputs', component: FileInputs },
    { path: '/select-inputs', component: SelectInputs },
    { path: '/text-inputs', component: TextInputs },
    { path: '/toggle-inputs', component: ToggleInputs },
    { path: '/data-tables', component: DataTables },
    { path: '/tabs', component: Tabs },
  ],
})
