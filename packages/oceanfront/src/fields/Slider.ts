import { ref, computed, watch, h, watchEffect } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '@/lib/fields'
import { CompatResizeObserver, watchResize } from '@/lib/util'

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
      // FIXME parse floats
      let min = props.min ?? 0
      let max = props.max ?? 100
      if (min > max) {
        const m = max
        max = min
        min = m
      }
      const delta = max - min
      const step = Math.max(0, Math.min(delta, props.step ?? 1))
      return { min, max, delta, step }
    })
    watch(
      () => ctx.value,
      (val) => {
        if (val == null || val === '')
          val = opts.value.min + (opts.value.max - opts.value.min) / 2
        console.trace('nval', val, typeof val)
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
    const inputElt = ref<HTMLInputElement | undefined>()
    const thumbElt = ref<HTMLDivElement | undefined>()
    const trackElt = ref<HTMLDivElement | undefined>()
    let trackSize: CompatResizeObserver | undefined
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
    watch(
      () => trackElt.value,
      (elt) => {
        if (elt) {
          trackSize = watchResize((entries) => {
            trackWidth.value = Math.round(entries[0].size.width)
          }, elt)
        } else if (trackSize) {
          trackSize.disconnect()
          trackSize = undefined
        }
      }
    )

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
      console.log('set: ' + val)
    }

    // position thumb
    watchEffect(() => {
      const { delta, min } = opts.value
      const tw = trackWidth.value
      if (delta && tw && thumbElt.value) {
        thumbElt.value.style.left =
          Math.round((((pendingValue.value - min) * tw) / delta) * 100) / 100 +
          'px'
      }
    })

    return fieldRender({
      class: 'of-slider-field',
      content: () => {
        return h('div', { class: 'of-slider' }, [
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
        ])
      },
      focus,
      focused,
      pendingValue,
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
