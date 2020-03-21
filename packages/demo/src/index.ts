import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './index.scss'
import './theme/demo.scss'
import { Oceanfront } from 'oceanfront'

createApp(App)
  .use(Oceanfront)
  .use(router)
  .mount('#app')
