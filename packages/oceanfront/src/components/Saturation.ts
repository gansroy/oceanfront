import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watch,
  h,
  nextTick,
} from 'vue'

import { triggerDragEvent } from '../lib/colorpicker'

const clamp = (value: number, min: number, max: number) => {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value
}

export default defineComponent({
  name: 'Saturation',
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360
      },
    },
    saturation: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1
      },
    },
    value: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1
      },
    },
  },
  emits: ['update:saturation', 'update:value', 'change'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()

    const cursorTop = ref(0)
    const cursorLeft = ref(0)
    const background = ref('hsl(' + props.hue + ', 100%, 50%)')
    const currentHsv = reactive({
      h: props.hue,
      s: props.saturation,
      v: props.value,
    })

    const handleDrag = (event: MouseEvent) => {
      if (instance) {
        const clientRect = instance.vnode.el?.getBoundingClientRect()

        let left = event.clientX - clientRect.left
        let top = event.clientY - clientRect.top

        left = clamp(left, 0, clientRect.width)
        top = clamp(top, 0, clientRect.height)

        const saturation = Math.round((left / clientRect.width) * 100) / 100
        const bright =
          Math.round(clamp(-(top / clientRect.height) + 1, 0, 1) * 100) / 100

        cursorLeft.value = left
        cursorTop.value = top

        currentHsv.s = saturation
        currentHsv.v = bright

        emit('update:saturation', saturation)
        emit('update:value', bright)
        emit('change', saturation, bright)
      }
    }

    const updateCursorPosition = () => {
      if (instance) {
        const el = instance.vnode.el
        cursorLeft.value = currentHsv.s * el?.clientWidth
        cursorTop.value = (1 - currentHsv.v) * el?.clientHeight
      }
    }

    onMounted(() => {
      nextTick(() => {
        if (instance && instance.vnode.el) {
          triggerDragEvent(instance.vnode.el as HTMLElement, {
            drag: (event: Event) => {
              handleDrag(event as MouseEvent)
            },
            end: (event) => {
              handleDrag(event as MouseEvent)
            },
          })
          updateCursorPosition()
        }
      })
    })

    watch(
      () => props.hue,
      (hue: number) => {
        currentHsv.h = hue
        background.value = 'hsl(' + Math.round(currentHsv.h) + ', 100%, 50%)'
      }
    )

    watch(
      () => props.value,
      (value: number) => {
        currentHsv.v = value
        updateCursorPosition()
      }
    )

    watch(
      () => props.saturation,
      (saturation: number) => {
        currentHsv.s = saturation
        updateCursorPosition()
      }
    )

    return () => {
      return h(
        'div',
        {
          class: 'saturation',
          style: { backgroundColor: background.value },
        },
        [
          h('div', { class: 'saturation__white' }),
          h('div', { class: 'saturation__black' }),
          h(
            'div',
            {
              class: 'saturation__cursor',
              style: {
                top: cursorTop.value + 'px',
                left: cursorLeft.value + 'px',
                onClick: handleDrag,
              },
            },
            h('div')
          ),
        ]
      )
    }
  },
})
