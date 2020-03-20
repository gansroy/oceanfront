import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './main.scss'
import './theme/demo.scss'
import Oceanfront from 'oceanfront'

console.log('hello', Oceanfront)

createApp(App)
  .use(Oceanfront)
  .use(router)
  .mount('#app')
