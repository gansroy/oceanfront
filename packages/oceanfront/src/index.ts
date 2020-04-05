import { App, Component, Plugin, Directive } from 'vue'

import { initConfig, OfConfig, useConfig as _useConfig } from './lib/config'
import { NumberFormatter as _NumberFormatter } from './lib/format'
import OfDialog from './components/Dialog.vue'
import { OfIcon } from './components/Icon'
import OfListItem from './components/ListItem.vue'
import OfListGroup from './components/ListGroup.vue'
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
  OfListGroup,
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
    initConfig({}, args)
    for (const idx in components) {
      vue.component(idx, components[idx])
    }
    for (const idx in directives) {
      vue.directive(idx, directives[idx])
    }
  }
}

export const NumberFormatter = _NumberFormatter

export const useConfig = _useConfig

export default Oceanfront
