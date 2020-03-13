<template>
  <transition>
    <div
      :id="id"
      class="of-overlay-outer"
      :class="classAttr"
      role="document"
      ref="elt"
      :tabindex="active ? '-1' : null"
      v-on="handlers"
      v-show="active"
    >
      <slot name="loading" v-if="loading">
        <of-spinner />
      </slot>
      <slot :active="active"></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  SetupContext,
  reactive,
  computed,
  Ref,
  onMounted,
  watch,
  nextTick,
  watchEffect,
  onUnmounted
} from 'vue'
import OfSpinner from './Spinner.vue'

const relativeParentRect = (elt: Element) => {
  let parent = elt.parentNode as Element | undefined
  if (!parent) return
  while (parent) {
    if (getComputedStyle(parent).position == 'relative') break
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
      window.innerHeight
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

export default defineComponent({
  name: 'of-overlay',
  components: { OfSpinner },
  inheritAttrs: false,
  props: {
    active: { default: false },
    align: { default: 'center' },
    capture: { default: true },
    class: String,
    id: String,
    loading: { default: false },
    pad: { default: true }, // FIXME change to string enum
    shade: { default: true },
    target: {}
  },
  setup(props, ctx: SetupContext) {
    const active = computed(() => props.active)
    const align = computed(() => props.align)
    const target = computed(() => {
      active.value // trigger re-eval
      const src = props.target
      if (typeof src === 'string') {
        return document.documentElement.querySelector(src)
      } else if (src instanceof Element) {
        return src
      }
    })
    let bound = false
    let focused = false
    const elt = ref<HTMLElement | undefined>()
    const scrolled = ref<number>()
    const handlers = {
      click(evt: MouseEvent) {
        const outer = elt.value
        if (!outer) return
        if (evt.target === outer) {
          if (focused) {
            focused = false
            ctx.emit('blur')
          }
        }
      }
    }
    const onFocusChange = () => {
      // FIXME debounce
      requestAnimationFrame(() => {
        if (focused && !checkFocused(elt.value)) {
          focused = false
          ctx.emit('blur')
        }
      })
    }
    const onScroll = () => {
      // FIXME use normal debounce
      if (target.value) scrolled.value = new Date().getTime()
    }
    const bind = (flag: boolean) => {
      if (typeof window === 'undefined') return
      if (flag) {
        if (!bound) {
          window.addEventListener('focusout', onFocusChange, { passive: true })
          window.addEventListener('resize', onScroll, { passive: true })
          window.addEventListener('scroll', onScroll, { passive: true })
          bound = true
        }
      } else {
        if (bound) {
          window.removeEventListener('focusout', onFocusChange)
          window.removeEventListener('resize', onScroll)
          window.removeEventListener('scroll', onScroll)
          bound = false
        }
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
    const reposition = () => {
      const targetElt = target.value
      const outer = elt.value
      if (!outer) return // or not in document
      if (!targetElt) return // or make fixed/absolute
      const parentRect = relativeParentRect(outer)
      const targetRect = targetElt.getBoundingClientRect()
      if (!targetRect || !parentRect) return // or hide?
      outer.style.setProperty(
        '--overlay-dyn-pad-left',
        Math.max(targetRect.left + parentRect.left, 0) + 'px'
      )
      outer.style.setProperty(
        '--overlay-dyn-pad-top',
        Math.max(targetRect.bottom, 0) + 'px'
      )
    }
    watch(
      () => active.value,
      active => {
        bind(active)
        if (active) {
          nextTick(() => {
            reposition()
            focus()
          })
        }
      }
    )
    watch(
      () => scrolled.value,
      _ => {
        nextTick(reposition)
      }
    )
    const classAttr = computed(() => {
      const cls = {
        active: active.value,
        capture: active.value && props.capture,
        [align.value]: !target.value,
        loading: props.loading,
        pad: props.pad,
        shade: props.shade
      }
      return [cls, props.class]
    })
    onMounted(() => {
      if (!elt.value) return
      let parent = elt.value.parentNode as HTMLElement
      parent =
        (parent && parent.closest('[data-overlay-parent]')) ?? document.body
      parent.appendChild(elt.value)
    })
    onUnmounted(() => {
      bind(false)
    })
    return {
      active,
      classAttr,
      elt,
      focus,
      handlers,
      id: computed(() => props.id)
    }
  }
})
</script>
