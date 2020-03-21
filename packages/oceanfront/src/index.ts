import { App, Component, Plugin } from 'vue'

import OfDialog from './components/Dialog.vue'
import OfListItem from './components/ListItem.vue'
import OfNavGroup from './components/NavGroup.vue'
import OfSelect from './components/Select.vue'
import OfSidebar from './components/Sidebar.vue'
import OfTextarea from './components/Textarea.vue'
import OfTextField from './components/TextField.vue'
import OfToggle from './components/Toggle.vue'

import './scss/index.scss'

export const components: Record<string, Component> = {
  OfDialog,
  OfListItem,
  OfNavGroup,
  OfSelect,
  OfSidebar,
  OfTextarea,
  OfTextField,
  OfToggle
} as any

export const Oceanfront: Plugin = {
  install(vue: App) {
    for (const idx in components) {
      vue.component(idx, components[idx])
    }
  }
}

export default Oceanfront
