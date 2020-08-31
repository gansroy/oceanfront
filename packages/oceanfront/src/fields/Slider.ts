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

    let step: number;
    let startX: number;
    let x = 0;
    let sliderLineWidth: number;
    let stepPx: number;
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

    const hooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false;
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
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
    function onStop () {
      calcValue()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onStop)
    }

    const onMove = (_evt: MouseEvent) => {
      const focus = elt.value;
      if (!focus) return;

      const maxX = sliderLineWidth - thumbRadius;
      x = _evt.pageX - startX

      if (x < -thumbRadius) x = -thumbRadius
      if (x > maxX) x = maxX

      focus.style.left = x + 'px'
    }

    const calcValue = () => {
      const val = Math.floor(((x + thumbRadius) / stepPx) * step) + props.min
      const steps = Math.floor(val / step);
      let stepVal = Math.floor(steps * step)

      if(val == props.min || val == props.max) {
        stepVal = val
      }

      stateValue.value = stepVal
      console.log('value = ' + stepVal);
    }

    const onSliderLineMounted = (node: VNode) => {
      const focus = node.el;
      if (!focus) return;

      sliderLineWidth = focus.clientWidth

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

      stepPx = (sliderLineWidth / (delta / step))
    }
    const focus = () => {
      const curelt = elt.value
      if (curelt) curelt.focus()
    }
    return readonly({
      content: () => {
        return h('div', { class: 'of-slider-field' }, [
          h('div', { class: 'of-slider-field--wrapper' }, [
            h('div', { class: 'of-slider-field--label' } ),
            h('div', { class: 'of-slider-field--thumb', ...hooks }),
            h('div', { class: 'of-slider-field--track', onVnodeMounted: onSliderLineMounted  }),
            h('input', {
              id: inputId.value,
              name: ctx.name,
              type: 'hidden',
              class: 'of-field-input',
              value: stateValue.value
            }),
          ]),
        ]);
      },
      focus,
      focused,
      updated: computed(() => initialValue.value !== stateValue.value),
    })
  },
})
