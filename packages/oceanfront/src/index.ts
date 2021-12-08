import { App, Component, Directive, Plugin } from 'vue'
import OfBadge from './components/Badge.vue'
import OfButton from './components/Button.vue'
import OfCalendar from './components/Calendar/Calendar'
import { OfColorField } from './components/ColorField'
import { OfConfig } from './components/Config'
import OfDataTable from './components/DataTable.vue'
import OfDataType from './components/DataType/DataType'
import { OfDateField } from './components/DateField'
import { OfDatetimeField } from './components/DatetimeField'
import OfDateTimePopup from './components/DateTimePopup.vue'
import OfDialog from './components/Dialog.vue'
import { OfField } from './components/Field'
import OfFocusGroup from './components/FocusGroup.vue'
import { OfFormat } from './components/Format'
import { OfIcon } from './components/Icon'
import { OfLink } from './components/Link'
import OfListGroup from './components/ListGroup.vue'
import { OfListItem } from './components/ListItem'
import { OfNavGroup } from './components/NavGroup'
import OfOptionList from './components/OptionList.vue'
import { OfOverlay } from './components/Overlay'
import OfPagination from './components/Pagination.vue'
import { OfSelectField } from './components/SelectField'
import OfSidebar from './components/Sidebar.vue'
import { OfSliderField } from './components/SliderField'
import OfSpinner from './components/Spinner.vue'
import OfTabs from './components/Tabs.vue'
import { OfTextField } from './components/TextField'
import { OfTimeField } from './components/TimeField'
import { OfToggle } from './components/Toggle'
import { OfToggleField } from './components/ToggleField'
import Hue from './components/Hue'
import Saturation from './components/Saturation'
import { ColorField } from './fields/Color'
import { DateField, DateTimeField, TimeField } from './fields/DateTime'
import { FileField } from './fields/File'
import { SelectField } from './fields/Select'
import { SliderField } from './fields/Slider'
import { TextField } from './fields/Text'
import { ToggleField } from './fields/Toggle'
import { ColorFormatter } from './formats/Color'
import {
  DateFormatter,
  DateTimeFormatter,
  TimeFormatter,
} from './formats/DateTime'
import { DurationFormatter } from './formats/Duration'
import { NumberFormatter } from './formats/Number'
import { UrlFormatter } from './formats/Url'
import { extendDefaultConfig } from './lib/config'
import { FieldTypeConstructor } from './lib/fields'
import { registerIconFont } from './lib/icons'
import {
  registerFieldType,
  registerTextFormatter,
  TextFormatterConstructor,
} from './lib/formats'
import './scss/index.scss'
import { materialIconFont } from '../icons/material'

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
  OfFocusGroup,
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
      registerIconFont('mi', materialIconFont)
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

export { extendConfig, useConfig, Config, ConfigFunction } from './lib/config'
export { addDays, addMonths } from './lib/datetime'
export {
  ExtFieldRender,
  FieldContext,
  FieldDragIn,
  FieldInit,
  FieldPopup,
  FieldProps,
  FieldRender,
  FieldType,
  FieldTypeConstructor,
  FieldFormatProp,
  FieldMode,
  FieldLabelPositionProp,
  defineFieldType,
  extendFieldFormat,
  fieldRender,
  newFieldId,
} from './lib/fields'
export { Hue, Saturation }
export { FocusGroup, provideFocusGroup, useFocusGroup } from './lib/focus'
export {
  FormatState,
  registerFieldType,
  registerTextFormatter,
  TextFormatResult,
  TextFormatter,
  TextFormatterProp,
  TextInputResult,
  useFormats,
} from './lib/formats'
export { IconFont, SvgIcon, showMissingIcons, useIcons } from './lib/icons'
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
export {
  calcOffset,
  calcPageValue,
  calcStartRecord,
  calcTotalPages,
  Paginator,
} from './lib/paginator'
export {
  FieldMetadata,
  FieldRecordState,
  FormRecord,
  Lock,
  LockOptions,
  makeRecord,
  RecordMetadata,
  setCurrentRecord,
  useRecords,
} from './lib/records'
export { Tab } from './lib/tab'

export default Oceanfront
