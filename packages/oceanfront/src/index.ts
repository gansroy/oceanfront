import { App, Component, Plugin, Directive } from 'vue'

import { extendDefaultConfig } from './lib/config'
import { OfConfig } from './components/Config'
import OfDataTable from './components/DataTable.vue'
import OfDialog from './components/Dialog.vue'
import OfDateTimePopup from './components/DateTimePopup.vue'
import { OfIcon } from './components/Icon'
import { OfField } from './components/Field'
import { OfFormat } from './components/Format'
import { OfLink } from './components/Link'
import { OfListItem } from './components/ListItem'
import OfListGroup from './components/ListGroup.vue'
import { OfNavGroup } from './components/NavGroup'
import { OfOverlay } from './components/Overlay'
import { OfSelectField } from './components/SelectField'
import { OfDatetimeField } from './components/DatetimeField'
import { OfDateField } from './components/DateField'
import { OfTimeField } from './components/TimeField'
import OfSidebar from './components/Sidebar.vue'
import { OfSliderField } from './components/SliderField'
import { OfTextField } from './components/TextField'
import { OfToggle } from './components/Toggle'
import { OfToggleField } from './components/ToggleField'
import OfTabs from './components/Tabs.vue'
import OfBadge from './components/Badge.vue'
import OfCalendar from './components/Calendar/Calendar'
import OfSpinner from './components/Spinner.vue'
import OfPagination from './components/Pagination.vue'
import OfButton from './components/Button.vue'
import { OfColorField } from './components/ColorField'
import OfDataType from './components/DataType/DataType'
import { OfOptionList } from './components/OptionList'

import { FileField } from './fields/File'
import { SelectField } from './fields/Select'
import { DateTimeField, DateField, TimeField } from './fields/DateTime'
import { TextField } from './fields/Text'
import { ToggleField } from './fields/Toggle'
import { SliderField } from './fields/Slider'
import { ColorField } from './fields/Color'

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
import { DateTimeFormatter, DateFormatter, TimeFormatter } from './formats/DateTime'

export const components: Record<string, Component> = {
  OfConfig,
  OfDataTable,
  OfDatetimeField,
  OfDateField,
  OfTimeField,
  OfDateTimePopup,
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
  OfCalendar,
  OfTextField,
  OfToggle,
  OfToggleField,
  OfSpinner,
  OfButton,
  OfColorField,
  OfDataType,
  OfBadge,
  OfOptionList,
}

export const fieldTypes: Record<string, FieldTypeConstructor> = {
  file: FileField,
  select: SelectField,
  text: TextField,
  textarea: TextField,
  password: TextField,
  slider: SliderField,
  toggle: ToggleField,
  datetime: DateTimeField,
  date: DateField,
  time: TimeField,
  color: ColorField,
}

export const textFormatters: Record<string, TextFormatterConstructor> = {
  color: ColorFormatter,
  duration: DurationFormatter,
  number: NumberFormatter,
  url: UrlFormatter,
  datetime: DateTimeFormatter,
  date: DateFormatter,
  time: TimeFormatter,
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

export {
  addDays, addMonths
} from './lib/datetime'


export { registerItemList, useItems } from './lib/items'
export { setMobileBreakpoint, useLayout } from './lib/layout'
export { useLocale } from './lib/locale'
export {
  NavGroup,
  NavGroupTarget,
  NavGroupUnregister,
  provideNavGroup,
  useNavGroup,
} from './lib/nav'
export { makeRecord, setCurrentRecord, useRecords } from './lib/records'
export { Tab } from './lib/tab'
export {
  Paginator,
  calcOffset,
  calcTotalPages,
  calcPageValue,
  calcStartRecord,
} from './lib/paginator'

export {
  ExtFieldRender,
  FieldContext,
  FieldDragIn,
  FieldPopup,
  FieldProps,
  FieldRender,
  FieldSetup,
  FieldType,
  FieldTypeConstructor,
  FormatProp,
  defineFieldType,
  extendFieldFormat,
  fieldRender,
  newFieldId,
} from "./lib/fields"

export default Oceanfront
