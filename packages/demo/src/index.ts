import { createApp } from 'vue'
import App from './App.vue'
import { demo } from './demo'
import { router } from './router'
import './index.scss'
import './theme/demo.scss'
import { Oceanfront, registerFieldType, showMissingIcons } from 'oceanfront'
import 'highlight.js/styles/vs2015.css'
import MinutesField from './components/MinutesField'

createApp(App)
  .use(Oceanfront, {
    config: () => {
      showMissingIcons()
      registerFieldType('minutes', MinutesField)
    },
  })
  .use(demo)
  .use(router)
  .mount('#app')
