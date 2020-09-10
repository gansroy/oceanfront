import { ref, computed, watch, h, readonly, VNode } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
} from '@/lib/fields'

export const supportedTypes = new Set(['range'])

export const SliderField = defineFieldType({
  name: 'slider',
  setup(props: FieldProps, ctx: FieldContext) {
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.value
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

    let startX: number;
    let x = 0;
    let sliderLineWidth: number;
    let stepPx: number;
    let pendingVal: number;
    let defaultFieldId: string
    const thumbRadius = 10;
    const elt = ref<HTMLInputElement | undefined>()
    const focused = ref(false)
    const delta = props.max - props.min;
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })
    const step = computed(() => {
      let step: number
      if(props.step > delta) {
        step = delta
      } else if (sliderLineWidth > delta) {
        step = (sliderLineWidth / delta)
      } else {
        step = (delta / sliderLineWidth)
      }
      if(step < props.step) {
        step = props.step
      }
      return step
    })
    const hooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false;
        document.removeEventListener('keydown', onKeydown)
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
        document.addEventListener('keydown', onKeydown)
      },
      onKeydown(_evt: KeyboardEvent) {
        onKeydown(_evt)
      },
    }
    const thumbHooks = {
      onAfterLeave(_evt: FocusEvent) {
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      },
      onMousedown(_evt: MouseEvent) {
        const focus = elt.value;
        if (!focus) return;
        startX = _evt.pageX - focus.offsetLeft;
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onStop)
      },
    }
    function onKeydown(_evt: KeyboardEvent) {
      if(_evt.key == 'ArrowUp' || _evt.key == 'ArrowRight') {
        x += stepPx
      } else if(_evt.key == 'ArrowDown' || _evt.key == 'ArrowLeft') {
        x -= stepPx
      }
      setX()
      calcValue()
    }
    function onStop () {
      setValue()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onStop)
    }
    const onMove = (_evt: MouseEvent) => {
      x = _evt.pageX - startX
      setX()
      calcValue()
    }
    function setValue() {
      stateValue.value = pendingVal
      console.log('val: ' + stateValue.value)
    }
    function setX() {
      const maxX = sliderLineWidth - thumbRadius;
      const thumb = elt.value;
      if (!thumb) return;
      if (x < -thumbRadius) x = -thumbRadius
      if (x > maxX) x = maxX
      thumb.style.left = x + 'px'
    }
    const calcValue = () => {
      const val = Math.floor(((x + thumbRadius) / stepPx) * step.value) + props.min
      const steps = Math.floor(val / step.value);
      pendingVal = Math.floor(steps * step.value)

      if(val <= props.min || val >= props.max) {
        pendingVal = val
      }

      console.log('pendingVal: ' + pendingVal)
    }
    const onSliderLineMounted = (node: VNode) => {
      const focus = node.el;
      const thumb = elt.value;
      if (!focus || !thumb) return;
      sliderLineWidth = focus.clientWidth
      stepPx = (sliderLineWidth / (delta / step.value))
      if(initialValue.value) {
        if(initialValue.value <= props.min) {
          x = - thumbRadius
        } else if(initialValue.value >= props.max) {
          x = sliderLineWidth - thumbRadius
        } else {
          x = initialValue.value / props.step
          x = x < 1 ? stepPx : Math.round(x) * stepPx - thumbRadius
        }
      } else {
        x = - thumbRadius
      }
      thumb.style.left = x + 'px'
      calcValue()
      setValue()
    }
    const focus = () => {
      const curelt = elt.value
      if (curelt) curelt.focus()
    }
    return readonly({
      content: () => {
        return h('div', { class: 'of-slider-field' }, [
          h('div', { class: 'of-slider-field--wrapper' }, [
            h('div', { class: 'of-slider-field--thumb', ...thumbHooks }),
            h('div', { class: 'of-slider-field--track', onVnodeMounted: onSliderLineMounted }),
            h('input', {
              id: inputId.value,
              name: ctx.name,
              type: 'text',
              class: 'of-field-input',
              value: stateValue.value,
              ...hooks
            }),
          ]),
        ])
      },
      focus,
      focused,
      updated: computed(() => initialValue.value !== stateValue.value),
    })
  },
})
