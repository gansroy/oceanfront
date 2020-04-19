import { App, Component, Plugin, Directive } from 'vue'

import { extendDefaultConfig } from './lib/config'
import OfConfig from './components/Config'
import OfDialog from './components/Dialog.vue'
import OfIcon from './components/Icon'
import OfFormat from './components/Format'
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
  OfFormat,
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
    if (args && typeof args.config === 'function') {
      extendDefaultConfig(args.config)
    }
    // FIXME register components using a config manager
    for (const idx in components) {
      vue.component(idx, components[idx])
    }
    for (const idx in directives) {
      vue.directive(idx, directives[idx])
    }
  }
}

export { NumberFormatter } from './lib/format'

export { extendConfig, useConfig } from './lib/config'
export { showMissingIcons, useIcons } from './lib/icons'
export { setMobileBreakpoint, useLayout } from './lib/layout'
export { useLocale } from './lib/locale'
export { useRoutes } from './lib/routes'

export default Oceanfront
