import { App } from 'vue'
import OfDemoField from './components/DemoField.vue'
import OfHighlight from './components/Highlight.vue'
import { OfHtmlEditor } from 'oceanfront-html-editor'

export const demo = {
  install(vm: App): void {
    vm.component('OfDemoField', OfDemoField)
    vm.component('OfHighlight', OfHighlight)
    vm.component('OfHtmlEditor', OfHtmlEditor)
  },
}
