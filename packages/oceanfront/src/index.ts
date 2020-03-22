import { App, Component, Plugin, Directive } from 'vue'

import { initConfig, OfConfig } from './lib/config'
import OfDialog from './components/Dialog.vue'
import { OfIcon, IconHandler } from './components/Icon'
import OfListItem from './components/ListItem.vue'
import OfNavGroup from './components/NavGroup.vue'
import OfSelect from './components/Select.vue'
import OfSidebar from './components/Sidebar.vue'
import OfTextarea from './components/Textarea.vue'
import OfTextField from './components/TextField.vue'
import OfToggle from './components/Toggle.vue'

import './scss/index.scss'

export const components: Record<string, Component> = {
  OfConfig,
  OfDialog,
  OfIcon,
  OfListItem,
  OfNavGroup,
  OfSelect,
  OfSidebar,
  OfTextarea,
  OfTextField,
  OfToggle
} as any

export const directives: Record<string, Directive> = {}

export const Oceanfront: Plugin = {
  install(vue: App, args: any) {
    initConfig({ icons: new IconHandler() }, args)
    for (const idx in components) {
      vue.component(idx, components[idx])
    }
    for (const idx in directives) {
      vue.directive(idx, directives[idx])
    }
  }
}

export default Oceanfront
