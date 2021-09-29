import { App } from 'vue'
import OfDemoField from './components/DemoField.vue'
import OfHighlight from './components/Highlight.vue'

export const demo = {
  install(vm: App): void {
    vm.component('OfDemoField', OfDemoField)
    vm.component('OfHighlight', OfHighlight)
  },
}
