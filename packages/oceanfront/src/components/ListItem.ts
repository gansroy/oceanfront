import {
  computed,
  defineComponent,
  h,
  PropType,
  reactive,
  ref,
  Ref,
  SetupContext,
  VNode,
} from 'vue'
import { NavGroupUnregister, NavTo, useNav } from '../lib/nav'
import { OfIcon } from './Icon'

export const OfListItem = defineComponent({
  name: 'OfListItem',
  props: {
    active: { type: [Boolean, String], default: null },
    disabled: Boolean,
    expand: { type: [Boolean, String], default: null },
    href: String,
    to: [String, Object] as PropType<NavTo>,
  },
  emits: {
    click: null,
  },
  setup(props, ctx: SetupContext) {
    let unreg: NavGroupUnregister | null
    const nav = useNav()
    const disabled = computed(() => props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const expand = computed(() => props.expand)
    const focused = ref(false)
    const focus = () => {
      elt.value?.focus?.()
    }
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
    const navActive = ref(routeActive.value)
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
      onKeydown(evt: KeyboardEvent) {
        if ((evt.key === ' ' || evt.key === 'Enter') && clicked(evt)) return
        const result = nav.groupNavigate({ event: evt })
        if (result) return false
      },
      onVnodeMounted(_vnode: VNode) {
        unreg = nav.groupRegister(
          reactive({
            disabled: (disabled as any) as Ref<boolean | undefined>, // FIXME cast should not be necessary
            elt,
            focused,
            navActive: navActive as Ref<boolean>, // FIXME cast should not be necessary
            focus,
          })
        )
      },
      onVnodeUnmounted() {
        elt.value = undefined
        if (unreg) unreg.unregister()
        unreg = null
      },
    }

    const content = () => {
      const result = [
        h('div', { class: 'of-list-item-content' }, ctx.slots.default?.()),
      ]
      if (expand.value !== null) {
        result.push(
          h(OfIcon, {
            name: expand.value ? 'expand-up' : 'expand-down',
          })
        )
      }
      return result
    }

    return () => {
      const hrefVal = disabled.value ? null : href.value
      return h(
        (hrefVal ? 'a' : 'div') as any,
        {
          'aria-current': routeActive.value ? 'page' : undefined,
          class: {
            'of-list-item': true,
            'of--active': routeActive.value,
            'of--disabled': disabled.value,
            'of--focused': focused.value,
            'of--link': !!hrefVal,
          },
          href: hrefVal,
          tabIndex: navActive.value ? 0 : -1,
          ref: elt,
          ...handlers,
        },
        h('div', { class: 'of-list-item-inner' }, content())
      )
    }
  },
})
