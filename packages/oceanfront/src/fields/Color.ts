import { computed, h, ref } from 'vue'
import Saturation from "../components/Saturation";
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '../lib/fields'
  
export const ColorField = defineFieldType({
  name: 'color',
  components: { Saturation },
  class: 'of-color-field',

  setup(props: FieldProps, ctx: FieldContext) {
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

    const closePopup = () => {
      opened.value = false
    }

    const clickOpen = () => {
      opened.value = true
    }

    const renderPopup = () => {
      return h(
        'div', { role: 'menu', class: 'of-menu of-colorpicker-popup' },
        h(
          'div', { class: 'color-picker' },
          h(
            Saturation, {
              saturation: 0.2,//currentColor.value.hsv.s,
              hue: 0,//currentColor.value.hsv.h,
              value: 0.3,// currentColor.value.hsv.v,
              'onChange': console.log('ON CHANGE'),
            }
          ),
        )
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
                'of-field-input-label',
                'of--align-' + (props.align || 'start'),
              ],
              id: inputId.value,
              tabindex: 0,
            },
            value
          ),
        ]
      },
      click: clickOpen,
      inputId,
      popup: {
        content: () => opened.value ? renderPopup() : undefined,
        visible: opened,
        onBlur: closePopup,
      },
      value: stateValue,
    })
  }
})

