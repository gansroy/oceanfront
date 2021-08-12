import { computed, h, ref, watch } from 'vue'
import Saturation from '../components/Saturation'
import Hue from '../components/Hue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '../lib/fields'

import { hsvToRgb } from '../lib/colorpicker'

export const ColorField = defineFieldType({
  name: 'color',
  class: 'of-color-field',

  setup(props: FieldProps, ctx: FieldContext) {
    const stateValue = ref()
    const hsl = ref()
    const rgb = ref()
    const opened = ref(false)
    const editable = computed(() => ctx.mode === 'edit' && !ctx.locked)
    let defaultFieldId: string
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })
    const closePopup = () => {
      opened.value = false
    }
    const clickOpen = () => {
      opened.value = true
    }
    watch(
      () => stateValue.value,
      (val) => {
        hsl.value = {
          h: val.h,
          s: Math.round(val.s * 100),
          l: Math.round(val.v * 100),
        }
        rgb.value = hsvToRgb(val.h, val.s, val.v)
      },
      { deep: true }
    )
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })
    stateValue.value = ctx.value
    const onSaturationChange = (saturation: number, bright: number) => {
      stateValue.value = {
        h: stateValue.value.h,
        s: saturation,
        v: bright,
      }
      onChange(stateValue)
    }
    const onHueChange = (hue: number) => {
      stateValue.value = {
        h: hue,
        s: stateValue.value.s,
        v: stateValue.value.v,
      }
      onChange(stateValue)
    }
    const onChange = (data: any): void => {
      if (stateValue.value && ctx.onUpdate) ctx.onUpdate(data.value)
    }
    const renderPopup = () => {
      return h(
        'div',
        { class: 'of-menu of-colorpicker-popup' },
        h('div', { class: 'color-picker' }, [
          h(Saturation, {
            saturation: stateValue.value.s,
            hue: stateValue.value.h,
            value: stateValue.value.v,
            onChange: onSaturationChange,
          }),
          h(Hue, {
            hue: stateValue.value.h,
            onChange: onHueChange,
          }),
          h(
            'div',
            {},
            'hsl(' +
              hsl.value.h +
              ', ' +
              hsl.value.s +
              '%, ' +
              hsl.value.l +
              '%)'
          ),
          h(
            'div',
            {},
            'rgb(' + rgb.value.r + ', ' + rgb.value.g + ', ' + rgb.value.b + ')'
          ),
        ])
      )
    }

    return fieldRender({
      content: () => {
        const value = stateValue.value
        return [
          h(
            'div',
            {
              class: [
                'of-field-color-picker',
                'of-field-input-label',
                'of--align-' + (props.align || 'start'),
              ],
              style: {
                backgroundColor:
                  'hsl(' +
                  hsl.value.h +
                  ', ' +
                  hsl.value.s +
                  '%, ' +
                  hsl.value.l +
                  '%)',
              },
              id: inputId.value,
              tabindex: 0,
            },
            value
          ),
        ]
      },
      click: clickOpen,
      cursor: editable.value ? 'pointer' : 'default',
      inputId,
      popup: {
        content: () => (opened.value ? renderPopup() : undefined),
        visible: opened,
        onBlur: closePopup,
      },
      value: stateValue,
      updated: computed(() => initialValue.value !== stateValue.value),
    })
  },
})
