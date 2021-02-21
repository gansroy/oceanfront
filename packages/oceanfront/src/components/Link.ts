import { computed, defineComponent, h, PropType, ref, SetupContext } from 'vue'
import { NavTo, useNav } from '../lib/nav'

export const OfLink = defineComponent({
  name: 'OfLink',
  props: {
    active: { type: [Boolean, String], default: null },
    disabled: Boolean,
    href: String,
    to: [String, Object] as PropType<NavTo>,
  },
  emits: {
    click: null,
  },
  setup(props, ctx: SetupContext) {
    const nav = useNav()
    const disabled = computed(() => props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const href = computed(() => {
      if (props.href) return props.href
      return nav.routeResolve(props.to || props.href)
    })
    const routeActive = computed(() => {
      if (props.active === null) {
        return nav.routeActive(props.to || props.href)
      }
      return props.active
    })
    const clicked = (evt: Event) => {
      const target = props.to || props.href
      if (target && nav.routeNavigate(target)) {
        evt.preventDefault()
        return true
      } else {
        ctx.emit('click', evt)
      }
    }
    const handlers = {
      onClick: clicked,
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
    }

    return () => {
      const hrefVal = disabled.value ? null : href.value
      return h(
        'a',
        {
          'aria-current': routeActive.value ? 'page' : undefined,
          class: {
            'of-link': true,
            'of--active': routeActive.value,
            'of--disabled': disabled.value,
            'of--focused': focused.value,
            'of--link': !!hrefVal,
          },
          href: hrefVal,
          ref: elt,
          ...handlers,
        },
        ctx.slots.default?.()
      )
    }
  },
})
