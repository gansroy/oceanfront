import {computed, h, ref, resolveComponent, watch} from 'vue'
import Saturation from '../components/Saturation'
import Hue from '../components/Hue'
import {hsvToHsl, hsvToRgb, loadColor, rgbToHsv, rgbToHex, hexToRgb, hslToRgb} from '../lib/color'
import {
  FieldContext,
  FieldProps,
  defineFieldType,
  fieldRender,
  newFieldId,
} from '../lib/fields'

export const ColorField = defineFieldType({
  name: 'color',
  class: 'of-color-field',

  init(props: FieldProps, ctx: FieldContext) {
    const opened = ref(false)
    const focused = ref(false)
    const elt = ref<HTMLElement | undefined>()
    let defaultFieldId: string
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })
    const focus = () => {
      elt.value?.focus()
    }
    const closePopup = (refocus?: boolean) => {
      opened.value = false
      if (refocus) focus()
    }
    const clickOpen = () => {
      if (ctx.editable) opened.value = true
    }
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue

      return initial ?? null
    })
    const stateValue = ref()
    const compColor: any = computed(() => {
      const hsv = stateValue.value || { h: 0, s: 0, v: 0 }
      const rgb = hsvToRgb(hsv)
      const hsl = hsvToHsl(hsv)
      return {
        hsv,
        rgb: 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')',
        hsl:
          'hsl(' +
          hsl.h +
          ', ' +
          Math.round(hsl.s * 100) +
          '%, ' +
          Math.round(hsl.l * 100) +
          '%)',
        hex: rgbToHex(rgb),
      }
    })
    watch(
      () => ctx.value,
      (val) => {
        try {
          const rgb = val ? loadColor(val) : null
          if (rgb) {
            if (!stateValue.value || compColor.value.hex != rgbToHex(rgb)) {
              // conditional to avoid clobbering the hue value
              stateValue.value = rgbToHsv(rgb as any)
            }
          }
        } catch (e) {
          // ignore invalid color
        }
      },
      {
        immediate: true,
      }
    )
    const setHsv = (color: { h: number; s: number; v: number; a?: number }) => {
      stateValue.value = color
      // onChange(compColor.value.hex)
    }
    const onChange = (data: string): void => {
      if (stateValue.value && ctx.onUpdate) ctx.onUpdate(data)
    }
    const renderPopup = () => {
      const color: any = compColor.value
      const hsv = color.hsv

      const chosenColor = (val: any) => {
        let rgb: any
        let hsv: any
        let color: any

        switch (props.inputType) {
          case 'hex':
            rgb = hexToRgb(val)
            hsv = rgbToHsv(rgb)
            break
          case 'hsl':
            let hslArr = val.replace(/hsl|\(|\)/gi, '').split(',')
            color = {
              'h': parseInt(hslArr[0].trim()),
              's': parseInt(hslArr[1].trim()),
              'l': parseInt(hslArr[2].trim()),
            }
            rgb = hslToRgb(color)
            hsv = rgbToHsv(rgb)
            break
          default:
            let rgbArr = val.replace(/rgb|\(|\)/gi, '').split(',')
            color = {
              'r': parseInt(rgbArr[0].trim()),
              'g': parseInt(rgbArr[1].trim()),
              'b': parseInt(rgbArr[2].trim()),
            }
            hsv = rgbToHsv(color);
            break
        }
        setHsv({...hsv});
      }

      const colorInputField = h(resolveComponent('OfField'), {
        type: "text",
        // label: props.inputType,
        // maxlength: 7,
        modelValue: color[props.inputType],
        "onUpdate:modelValue": chosenColor
      });

      const preparedHsv = () => {

      }

      return h(
        'div',
        {
          class: 'of-menu of-colorpicker-popup of--elevated-1',
          tabindex: '0',
        },
        h('div', { class: 'color-picker' }, [
          h(Saturation, {
            saturation: hsv.s,
            hue: hsv.h,
            value: hsv.v,
            onChange: (s: number, v: number) => setHsv({ ...hsv, s, v }),
          }),
          h(Hue, {
            hue: hsv.h,
            onChange: (h: number) => setHsv({ ...hsv, h }),
          }),
          colorInputField
        ])
      )
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
      class: 'of-color-field',
      content: () =>
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
          [compColor.value[props.inputType]]
        ),
      focused,
      click: clickOpen,
      cursor: computed(() => (ctx.editable ? 'pointer' : 'default')),
      inputId,
      popup: {
        content: () => (opened.value ? renderPopup() : undefined),
        visible: opened,
        onBlur: closePopup,
      },
      prepend: () =>
        h(
          'div',
          {
            class: 'of-color-swatch',
            style: {
              backgroundColor: compColor.value.hex,
            },
          },
          h('div', { class: 'of-color-swatch-border' })
        ),
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
