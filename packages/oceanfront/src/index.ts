import { App, Component, Plugin, Directive } from 'vue'

import { extendDefaultConfig } from './lib/config'
import { OfConfig } from './components/Config'
import OfDataTable from './components/DataTable.vue'
import OfDialog from './components/Dialog.vue'
import { OfIcon } from './components/Icon'
import { OfField } from './components/Field'
import { OfFormat } from './components/Format'
import OfListItem from './components/ListItem.vue'
import OfListGroup from './components/ListGroup.vue'
import OfNavGroup from './components/NavGroup.vue'
import OfSelect from './components/Select.vue'
import OfSidebar from './components/Sidebar.vue'
import OfTextarea from './components/Textarea.vue'
import { OfTextField } from './components/TextField'
import OfToggle from './components/Toggle.vue'

import { registerFieldType, registerTextFormatter } from './lib/formats'
import { NumberFormatter } from './formats/Number'
import { SelectField } from './fields/Select'
import { TextField } from './fields/Text'

import './scss/index.scss'

export const components: Record<string, Component> = {
  OfConfig,
  OfDataTable,
  OfDialog,
  OfField,
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
    extendDefaultConfig(() => {
      registerFieldType('select', SelectField)
      registerFieldType('text', TextField)
      registerTextFormatter('number', NumberFormatter)
    })
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

export { extendConfig, useConfig } from './lib/config'
export { showMissingIcons, useIcons } from './lib/icons'
export {
  registerFieldType,
  registerTextFormatter,
  useFormats
} from './lib/formats'
export { registerItemList, useItems } from './lib/items'
export { setMobileBreakpoint, useLayout } from './lib/layout'
export { useLocale } from './lib/locale'
export { useRoutes } from './lib/routes'

export default Oceanfront
