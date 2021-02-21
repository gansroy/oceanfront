import {
  ref,
  computed,
  watch,
  h,
  watchEffect,
  triggerRef,
  shallowRef,
  nextTick,
} from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '../lib/fields'
import { watchPosition } from '../lib/util'

function intoInt(val?: string | number): number | undefined {
  if (typeof val === 'number') {
    return Math.round(val)
  }
  if (val != null) return parseInt(val, 10)
}

export const SliderField = defineFieldType({
  name: 'slider',
  setup(props: FieldProps, ctx: FieldContext) {
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })
    const pendingValue = ref<number>(0)
    const stateValue = ref()
    const opts = computed(() => {
      let min = intoInt(props.min) ?? 0
      let max = intoInt(props.max) ?? 100
      if (min > max) {
        const m = max
        max = min
        min = m
      }
      const delta = max - min
      const step = Math.max(0, Math.min(delta, intoInt(props.step) ?? 1))
      return { min, max, delta, step }
    })
    watch(
      () => ctx.value,
      (val) => {
        if (val == null || val === '')
          val = opts.value.min + (opts.value.max - opts.value.min) / 2
        pendingValue.value = val
        stateValue.value = val
      },
      {
        immediate: true,
      }
    )

    const fixValue = (val: number) => {
      const { delta, step, min, max } = opts.value
      if (delta && step) {
        val = Math.round((val - min) / step) * step + min
      }
      val = Math.max(min, Math.min(max, val))
      return val
    }

    let defaultFieldId: string
    let lazyInputValue = pendingValue.value
    let startX = 0
    let startVal = 0
    const inputElt = shallowRef<HTMLInputElement | undefined>()
    const thumbElt = shallowRef<HTMLDivElement | undefined>()
    const trackElt = shallowRef<HTMLDivElement | undefined>()
    const trackWidth = ref(0)
    const focused = ref(false)
    const focus = () => {
      inputElt.value?.focus()
    }
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })
    const inputHooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onKeydown(evt: KeyboardEvent) {
        if (evt.key == 'ArrowUp' || evt.key == 'ArrowRight') {
          setValue(fixValue(pendingValue.value + opts.value.step))
        } else if (evt.key == 'ArrowDown' || evt.key == 'ArrowLeft') {
          setValue(fixValue(pendingValue.value - opts.value.step))
        } else if (evt.key == 'Esc') {
          pendingValue.value = stateValue.value
          cancelMove()
        }
      },
    }
    const thumbHooks = {
      onMousedown(evt: MouseEvent) {
        const elt = thumbElt.value
        if (!elt) return
        evt.stopPropagation()
        evt.preventDefault()
        focus()
        startX = evt.pageX
        startVal = pendingValue.value
        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', stopMove)
        // snap to current step in case value was manually assigned
        handleMove(evt)
      },
    }
    const trackHooks = {
      onMousedown(evt: MouseEvent) {
        const tg = evt.target as HTMLDivElement | null
        if (!tg) return
        const dims = tg.getBoundingClientRect()
        if (!dims.width) return
        evt.stopPropagation()
        evt.preventDefault()
        focus()
        startX = evt.pageX
        pendingValue.value = fixValue(
          ((startX - dims.left) * opts.value.delta) / dims.width
        )
        startVal = pendingValue.value
        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', stopMove)
      },
    }

    const cancelMove = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', stopMove)
    }
    const stopMove = () => {
      cancelMove()
      setValue(pendingValue.value)
    }
    const handleMove = (evt: MouseEvent) => {
      const tw = trackWidth.value
      if (tw) {
        pendingValue.value = fixValue(
          startVal + ((evt.pageX - startX) * opts.value.delta) / tw
        )
      }
    }
    const setValue = (val: number) => {
      lazyInputValue = val
      pendingValue.value = val
      stateValue.value = val
      if (inputElt.value) inputElt.value.value = '' + val
      if (ctx.onUpdate) ctx.onUpdate(val)
    }

    const trackPos = watchPosition({ immediate: true })
    watch(trackPos.positions, (entries) => {
      const first = entries.values().next().value
      trackWidth.value = Math.round(first?.width || 0)
    })
    watch(trackElt, (track) => {
      trackPos.disconnect()
      if (track) trackPos.observe(track)
    })
    // position thumb
    watchEffect(() => {
      const { delta, min } = opts.value
      const tw = trackWidth.value
      const val = pendingValue.value
      const thumb = thumbElt.value
      if (thumb && delta && tw) {
        thumb.style.left =
          Math.round((((val - min) * tw) / delta) * 100) / 100 + 'px'
      }
    })

    return fieldRender({
      class: 'of-slider-field',
      content: () => {
        return h(
          'div',
          {
            class: 'of-slider',
            onVnodeMounted: () => {
              // watch is not triggered on first render
              nextTick(() => triggerRef(trackElt))
            },
          },
          [
            h('input', {
              id: inputId.value,
              name: ctx.name,
              ref: inputElt,
              type: 'text',
              class: 'of-field-input',
              value: lazyInputValue,
              ...inputHooks,
            }),
            h('div', {
              class: 'of-slider-thumb',
              ref: thumbElt,
              ...thumbHooks,
            }),
            h('div', {
              class: 'of-slider-track',
              ref: trackElt,
              ...trackHooks,
            }),
          ]
        )
      },
      focus,
      focused,
      pendingValue,
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
