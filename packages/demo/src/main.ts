import { createApp } from 'vue'
import App from './App.vue'
import './main.scss'
import './theme/demo.scss'
import Oceanfront from 'oceanfront'

console.log('hello', Oceanfront)

createApp(App)
  .use(Oceanfront)
  .mount('#app')
