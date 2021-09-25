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

import { hsvToRgb, hsvToHsl } from 'src/lib/color'

const hexp = (val: number): string => {
  const v = val.toString(16)
  return v.length == 1 ? '0' + v : v
}

export const ColorField = defineFieldType({
  name: 'color',
  class: 'of-color-field',

  setup(props: FieldProps, ctx: FieldContext) {
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
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })
    const stateValue = ref()
    watch(
      () => ctx.value,
      (val) => {
        if (val === undefined || val === '') val = null
        stateValue.value = val
      },
      {
        immediate: true,
      }
    )
    const color = computed(() => {
      const val = stateValue.value || { h: 0, s: 0, v: 0 }
      const rgb = hsvToRgb(val.h, val.s, val.v)
      const hsl = hsvToHsl(val.h, val.s, val.v)
      hsl.s = Math.round(hsl.s * 100)
      hsl.l = Math.round(hsl.l * 100)
      return {
        hsl,
        rgb,
        label: '#' + hexp(rgb.r) + hexp(rgb.g) + hexp(rgb.b),
      }
    })
    const onSaturationChange = (saturation: number, bright: number) => {
      stateValue.value = { ...stateValue.value, s: saturation, v: bright }
      onChange(stateValue)
    }
    const onHueChange = (hue: number) => {
      stateValue.value = { ...stateValue.value, h: hue }
      onChange(stateValue)
    }
    const onChange = (data: any): void => {
      if (stateValue.value && ctx.onUpdate) ctx.onUpdate(data.value)
    }
    const renderPopup = () => {
      const value = stateValue.value
      const vis = color.value
      return h(
        'div',
        { class: 'of-menu of-colorpicker-popup' },
        h('div', { class: 'color-picker' }, [
          h(Saturation, {
            saturation: value.s,
            hue: value.h,
            value: value.v,
            onChange: onSaturationChange,
          }),
          h(Hue, {
            hue: value.h,
            onChange: onHueChange,
          }),
          h(
            'div',
            {},
            'hsl(' + vis.hsl.h + ', ' + vis.hsl.s + '%, ' + vis.hsl.l + '%)'
          ),
          h(
            'div',
            {},
            'rgb(' + vis.rgb.r + ', ' + vis.rgb.g + ', ' + vis.rgb.b + ')'
          ),
        ])
      )
    }

    return fieldRender({
      class: 'of-color-field',
      content: () =>
        h(
          'div',
          {
            class: [
              'of-field-input-label',
              'of--align-' + (props.align || 'start'),
            ],
            id: inputId.value,
            tabindex: 0,
          },
          [color.value.label]
        ),
      click: clickOpen,
      cursor: editable.value ? 'pointer' : 'default',
      inputId,
      popup: {
        content: () => (opened.value ? renderPopup() : undefined),
        visible: opened,
        onBlur: closePopup,
      },
      prepend: () =>
        h('div', {
          class: 'of-color-swatch',
          style: {
            backgroundColor:
              'hsl(' +
              color.value.hsl.h +
              ', ' +
              color.value.hsl.s +
              '%, ' +
              color.value.hsl.l +
              '%)',
          },
        }),
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
