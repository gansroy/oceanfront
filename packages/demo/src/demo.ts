import { App, Component } from 'vue'
import OfHighlight from './components/Highlight.vue'

export const demo = {
  install(vm: App) {
    vm.component('OfHighlight', (OfHighlight as any) as Component)
  }
}
