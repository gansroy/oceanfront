import {
  defineComponent,
  computed,
  h,
  nextTick,
  ref,
  vShow,
  withDirectives,
  watch,
  PropType,
  SetupContext,
  Teleport,
  Transition,
} from 'vue'
import { useLayout } from '../lib/layout'
import { watchPosition } from '../lib/util'
import OfSpinner from './Spinner.vue'

const relativeParentRect = (elt: Element) => {
  let parent = elt.parentNode as Element | undefined
  if (!parent) return
  while (parent) {
    const ppos = getComputedStyle(parent).position
    if (ppos === 'relative' || ppos === 'absolute') break
    parent =
      [window, document.documentElement].indexOf(parent.parentNode as any) !==
      -1
        ? undefined
        : (parent.parentNode as Element)
  }
  if (!parent) {
    const [l, t, w, h] = [
      -window.scrollX,
      -window.scrollY,
      window.innerWidth,
      window.innerHeight,
    ]
    return { left: l, top: t, width: w, height: h, bottom: t + h, right: l + w }
  }
  return parent.getBoundingClientRect()
}

const checkFocused = (elt?: HTMLElement) => {
  if (!elt) return false
  const active = document.activeElement
  return (active && elt.contains(active)) || false
}

const inOverlay = () => !!document.activeElement?.closest('.of-overlay')

export const OfOverlay = defineComponent({
  name: 'OfOverlay',
  inheritAttrs: false,
  props: {
    active: { type: Boolean, default: false },
    align: { type: String, default: 'center' },
    capture: { type: Boolean, default: true },
    class: String,
    embed: Boolean,
    id: String,
    loading: Boolean,
    pad: { type: Boolean, default: true }, // FIXME change to string enum
    shade: { type: Boolean, default: true },
    target: { type: [Element, String] } as any as PropType<Element | string>,
    transition: String,
  },
  emits: ['blur'],
  setup(props, ctx: SetupContext) {
    let focused = false
    const layout = useLayout()
    const elt = ref<HTMLElement | undefined>()
    const portal = ref<HTMLElement | undefined>()
    const portalTo = ref<HTMLElement | undefined>()
    const handlers = {
      onClick(evt: MouseEvent) {
        const outer = elt.value
        if (!outer) return
        if (evt.target === outer) {
          if (focused) {
            focused = false
            ctx.emit('blur')
          }
        }
      },
      onFocusout(_evt: Event) {
        requestAnimationFrame(() => {
          if (focused && !checkFocused(elt.value) && !inOverlay()) {
            focused = false
            ctx.emit('blur')
          }
        })
      },
      onKeydown(evt: KeyboardEvent) {
        if (focused && evt.key == 'Escape') {
          focused = false
          ctx.emit('blur', true)
        }
      },
    }
    const state = computed(() => (props.embed ? 'embed' : 'overlay'))
    const target = ref()
    const targetPos = watchPosition({ scroll: true })
    watch(targetPos.positions, (_pos) => reposition())
    const bind = (active: boolean) => {
      targetPos.disconnect()
      if (active && target.value) {
        targetPos.observe(target.value)
      }
    }
    const focus = () => {
      const outer = elt.value
      if (!outer) return false
      if (checkFocused(outer)) return
      // FIXME look for [autofocus] or [data-autofocus]?
      const findFocus = outer.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      ;((findFocus as HTMLElement) || outer).focus()
      focused = true
    }
    const reparent = () => {
      if (!portal.value) return
      const eltParent = portal.value.parentNode as HTMLElement
      if (!eltParent) return
      const swap = state.value !== 'embed'
      portalTo.value = swap
        ? ((eltParent.closest('[data-overlay-parent]') ??
            document.body) as HTMLElement)
        : undefined
    }
    const reposition = () => {
      const targetElt = target.value
      const outer = elt.value
      if (!outer) return // or not in document
      if (!targetElt) return // or make fixed/absolute

      const parentRect = relativeParentRect(outer)
      const outerRect = outer.getBoundingClientRect()
      const targetRect = targetElt.getBoundingClientRect()
      if (!targetRect || !parentRect) return // or hide?

      const neededWidth = outerRect.width + targetRect.left
      const offsetWidth = Math.max(neededWidth - parentRect.width, 0)

      outer.style.setProperty(
        '--overlay-dyn-margin-left',
        Math.max(targetRect.left + parentRect.left - offsetWidth, 0) + 'px'
      )
      outer.style.setProperty(
        '--overlay-dyn-pad-top',
        Math.max(targetRect.bottom, 0) + 'px'
      )
    }
    const updateState = () => {
      const activeOverlay = props.active && state.value === 'overlay'
      reparent()
      bind(activeOverlay)
      if (activeOverlay) {
        nextTick(() => {
          reposition()
          focus()
        })
      }
    }
    watch(
      () => [props.target, props.active, state.value],
      ([src, ..._]) => {
        if (typeof src === 'string') {
          target.value = document.documentElement.querySelector(src)
        } else if (src instanceof Element) {
          target.value = src
        } else {
          target.value = null
        }
        updateState()
      }
    )
    watch(
      () => layout.windowRect,
      (_) => {
        nextTick(reposition)
      }
    )

    return () => {
      const cls = {
        'of--active': props.active,
        'of--capture': props.active && props.capture,
        'of--embed': state.value === 'embed',
        'of--loading': props.loading,
        'of--overlay': state.value === 'overlay',
        'of--pad': props.pad,
        'of--shade': props.shade,
        'of--fit-content': target.value,
      }
      if (state.value !== 'embed' && !target.value && props.align)
        (cls as any)['of--' + props.align] = true

      return h(
        Teleport,
        {
          disabled: !portalTo.value,
          to: portalTo.value,
          ref: portal,
          onVnodeMounted: updateState,
          onVnodeBeforeUnmount: () => {
            bind(false)
          },
        },
        [
          h(
            Transition,
            { name: props.transition },
            {
              default: () => [
                withDirectives(
                  h(
                    'div',
                    {
                      class: ['of-overlay', cls, props.class],
                      id: props.id,
                      role: 'document',
                      ref: elt,
                      tabIndex:
                        props.active && state.value === 'overlay' ? '-1' : null,
                      ...handlers,
                    },
                    props.loading
                      ? () =>
                          ctx.slots.loading ? ctx.slots.loading() : h(OfSpinner)
                      : ctx.slots.default?.({
                          active: props.active,
                          state: state.value,
                        })
                  ),
                  [[vShow, props.active]]
                ),
              ],
            }
          ),
        ]
      )
    }
  },
})
