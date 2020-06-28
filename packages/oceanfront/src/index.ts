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
import { OfSelectField } from './components/SelectField'
import OfSidebar from './components/Sidebar.vue'
import { OfTextField } from './components/TextField'
import { OfToggleField } from './components/ToggleField'

import { FileField } from './fields/File'
import { SelectField } from './fields/Select'
import { TextField } from './fields/Text'
import { ToggleField } from './fields/Toggle'

import { registerFieldType, registerTextFormatter } from './lib/formats'
import { ColorFormatter } from './formats/Color'
import { NumberFormatter } from './formats/Number'
import { DurationFormatter } from './formats/Duration'

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
  OfSelectField,
  OfSidebar,
  OfTextField,
  OfToggleField,
} as any

export const directives: Record<string, Directive> = {}

export const Oceanfront: Plugin = {
  install(vue: App, args: any) {
    vue.config.devtools = true
    extendDefaultConfig(() => {
      registerFieldType('file', FileField)
      registerFieldType('select', SelectField)
      registerFieldType('text', TextField)
      registerFieldType('textarea', TextField)
      registerFieldType('toggle', ToggleField)
      registerTextFormatter('color', ColorFormatter)
      registerTextFormatter('number', NumberFormatter)
      registerTextFormatter('duration', DurationFormatter)
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
  },
}

export { extendConfig, useConfig } from './lib/config'
export { showMissingIcons, useIcons } from './lib/icons'
export {
  registerFieldType,
  registerTextFormatter,
  useFormats,
} from './lib/formats'
export { registerItemList, useItems } from './lib/items'
export { setMobileBreakpoint, useLayout } from './lib/layout'
export { useLocale } from './lib/locale'
export { useRoutes } from './lib/routes'

export default Oceanfront
