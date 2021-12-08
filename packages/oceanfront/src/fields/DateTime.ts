import { computed, h, Ref, ref, watch } from 'vue'
import OfDateTimePopup from '../components/DateTimePopup.vue'
import { OfIcon } from '../components/Icon'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '../lib/fields'
import { useFormats } from '../lib/formats'
import {
  DateFormatter,
  DateTimeFormatter,
  TimeFormatter,
} from '../formats/DateTime'

type InputType = 'date' | 'datetime' | 'time'

type RenderOpts = {
  close: (date?: Date) => any
  selectedDate: Ref<Date>
  monthStart: Ref<Date>
  withTime: boolean
  withDate: boolean
}

export const renderDateTimePopup = (opts: RenderOpts): any => {
  return h(OfDateTimePopup, {
    date: opts.selectedDate.value,
    monthStart: opts.monthStart.value,
    withTime: opts.withTime,
    withDate: opts.withDate,
    accept: opts.close,
  })
}

const fieldInit =
  (type: InputType) => (props: FieldProps, ctx: FieldContext) => {
    const withTime = type == 'datetime' || type == 'time'
    const withDate = type == 'datetime' || type == 'date'
    const withClear = !ctx.required
    const formatMgr = useFormats()
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const formatter = computed(() => {
      switch (type) {
        case 'date':
          return formatMgr.getTextFormatter('date', {
            dateFormat: 'short',
          }) as DateFormatter
        case 'time':
          return formatMgr.getTextFormatter('time', {
            dateFormat: 'short',
          }) as TimeFormatter
        default:
          return formatMgr.getTextFormatter('datetime', {
            dateFormat: 'short',
          }) as DateTimeFormatter
      }
    })

    const parseDate = (value: any) => {
      const df = formatter.value
      try {
        const loadedValue = df.loadValue(value)
        if (loadedValue instanceof Date) value = loadedValue
      } catch (e) {}
      return value
    }

    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      initial = parseDate(initial)
      return initial ?? null
    })

    const stateValue = ref()
    const opened = ref(false)
    let defaultFieldId: string
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })

    const currentDate: Ref<Date> = ref(new Date())
    const editableDate: Ref<Date> = ref(new Date())
    const monthStart: Ref<Date> = ref(new Date())

    const focus = () => {
      elt.value?.focus()
    }

    const closePopup = (refocus?: boolean) => {
      opened.value = false
      if (refocus) focus()
    }

    watch(
      () => ctx.value,
      (val) => {
        if (val === undefined || val === '') val = null
        const loaded = parseDate(val)
        if (loaded instanceof Date) {
          currentDate.value = loaded
          monthStart.value = loaded
          stateValue.value = val
        } else {
          currentDate.value = new Date()
          monthStart.value = new Date()
          stateValue.value = ''
        }
      },
      {
        immediate: true,
      }
    )

    const clickOpen = (_evt?: MouseEvent) => {
      editableDate.value = new Date(currentDate.value.valueOf())
      monthStart.value = new Date(currentDate.value.valueOf())
      opened.value = true
      return false
    }

    const acceptResult = (date?: Date) => {
      if (date && ctx.onUpdate)
        ctx.onUpdate(formatter.value.formatPortable(date))
      opened.value = false
    }

    const renderPopup = () => {
      return renderDateTimePopup({
        close: acceptResult,
        selectedDate: editableDate,
        monthStart,
        withTime,
        withDate,
      })
    }

    const hooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onKeydown(evt: KeyboardEvent) {
        if (evt.key == ' ' || evt.key == 'ArrowUp' || evt.key == 'ArrowDown') {
          clickOpen()
          evt.preventDefault()
          evt.stopPropagation()
        }
      },
    }
    return fieldRender({
      content: () => {
        const value = stateValue.value
          ? formatter.value?.format(stateValue.value)?.textValue
          : ''
        return [
          h(
            'div',
            {
              class: [
                'of-field-content-text',
                'of--align-' + (props.align || 'start'),
              ],
              id: inputId.value,
              tabindex: 0,
              ref: elt,
              ...hooks,
            },
            value
          ),
        ]
      },
      focused,
      updated: computed(() => {
        return initialValue.value !== stateValue.value
      }),
      cursor: computed(() => (ctx.editable ? 'pointer' : 'default')),
      click: computed(() => (ctx.editable ? clickOpen : null)),
      inputId,
      popup: {
        content: () => (opened.value ? renderPopup() : null),
        visible: opened,
        onBlur: closePopup,
      },
      value: stateValue,
      append() {
        if (ctx.interactive)
          return [
            withDate
              ? h(OfIcon, {
                  name: 'date',
                  size: 'input',
                })
              : null,
            withTime && !withDate
              ? h(OfIcon, {
                  name: 'time',
                  size: 'input',
                })
              : null,
            withClear && (ctx.editable || ctx.mode === 'locked')
              ? h(OfIcon, {
                  name: 'cancel circle',
                  size: 'input',
                  onClick: (e: MouseEvent | TouchEvent) => {
                    e.stopPropagation()
                    e.preventDefault()
                    ctx.onUpdate?.('')
                  },
                })
              : null,
          ]
      },
    })
  }

export const DateTimeField = defineFieldType({
  name: 'datetime',
  class: 'of-datetime-field',
  init: fieldInit('datetime'),
})

export const DateField = defineFieldType({
  name: 'date',
  class: 'of-datetime-field',
  init: fieldInit('date'),
})

export const TimeField = defineFieldType({
  name: 'time',
  class: 'of-time-field',
  init: fieldInit('time'),
})
