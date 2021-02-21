import { createApp } from 'vue'
import App from './App.vue'
import { demo } from './demo'
import { router } from './router'
import './index.scss'
import './theme/demo.scss'
import { Oceanfront, showMissingIcons } from 'oceanfront'
import { registerVueRouter } from 'oceanfront-vue-router'
import 'highlight.js/styles/vs2015.css'

createApp(App)
  .use(Oceanfront, {
    config: () => {
      registerVueRouter()
      showMissingIcons()
    },
  })
  .use(demo)
  .use(router)
  .mount('#app')
