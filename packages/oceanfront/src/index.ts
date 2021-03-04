import { App, Component, Plugin, Directive } from 'vue'

import { extendDefaultConfig } from './lib/config'
import { OfConfig } from './components/Config'
import OfDataTable from './components/DataTable.vue'
import OfDialog from './components/Dialog.vue'
import { OfIcon } from './components/Icon'
import { OfField } from './components/Field'
import { OfFormat } from './components/Format'
import { OfLink } from './components/Link'
import { OfListItem } from './components/ListItem'
import OfListGroup from './components/ListGroup.vue'
import { OfNavGroup } from './components/NavGroup'
import { OfOverlay } from './components/Overlay'
import { OfSelectField } from './components/SelectField'
import OfSidebar from './components/Sidebar.vue'
import { OfSliderField } from './components/SliderField'
import { OfTextField } from './components/TextField'
import { OfToggle } from './components/Toggle'
import { OfToggleField } from './components/ToggleField'
import OfTabs from './components/Tabs.vue'
import OfSpinner from './components/Spinner.vue'
import OfPagination from './components/Pagination.vue'
import OfButton from './components/Button.vue'

import { FileField } from './fields/File'
import { SelectField } from './fields/Select'
import { TextField } from './fields/Text'
import { ToggleField } from './fields/Toggle'
import { SliderField } from './fields/Slider'

import {
  registerFieldType,
  registerTextFormatter,
  TextFormatterConstructor,
} from './lib/formats'
import { ColorFormatter } from './formats/Color'
import { NumberFormatter } from './formats/Number'
import { DurationFormatter } from './formats/Duration'
import { UrlFormatter } from './formats/Url'

import './scss/index.scss'
import { FieldTypeConstructor } from './lib/fields'

export const components: Record<string, Component> = {
  OfConfig,
  OfDataTable,
  OfDialog,
  OfField,
  OfIcon,
  OfFormat,
  OfLink,
  OfListItem,
  OfListGroup,
  OfNavGroup,
  OfOverlay,
  OfPagination,
  OfSelectField,
  OfSidebar,
  OfSliderField,
  OfTabs,
  OfTextField,
  OfToggle,
  OfToggleField,
  OfSpinner,
  OfButton,
}

export const fieldTypes: Record<string, FieldTypeConstructor> = {
  file: FileField,
  select: SelectField,
  text: TextField,
  textarea: TextField,
  password: TextField,
  slider: SliderField,
  toggle: ToggleField,
}

export const textFormatters: Record<string, TextFormatterConstructor> = {
  color: ColorFormatter,
  duration: DurationFormatter,
  number: NumberFormatter,
  url: UrlFormatter,
}

export const directives: Record<string, Directive> = {}

export const Oceanfront: Plugin = {
  install(vue: App, args: any) {
    extendDefaultConfig(() => {
      for (const idx in fieldTypes) {
        registerFieldType(idx, fieldTypes[idx])
      }
      for (const idx in textFormatters) {
        registerTextFormatter(idx, textFormatters[idx])
      }
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
export { NavRouter, NavTo, setNavGroup, setRouter, useNav } from './lib/nav'
export { makeRecord, setCurrentRecord, useRecords } from './lib/records'
export { Tab } from './lib/tab'
export {
  Paginator,
  calcOffset,
  calcTotalPages,
  calcPageValue,
  calcStartRecord,
} from './lib/paginator'

export default Oceanfront
