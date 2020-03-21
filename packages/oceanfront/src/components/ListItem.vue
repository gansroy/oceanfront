<script lang="ts">
import {
  h,
  defineComponent,
  SetupContext,
  provide,
  ComponentPublicInstance,
  watchEffect,
  Ref,
  computed,
  reactive,
  inject,
  ref,
  onMounted,
  onUnmounted,
  VNode
} from 'vue'
import { INavGroup } from './NavGroup.vue'

export default defineComponent({
  name: 'of-list-item',
  props: {
    disabled: [Boolean, String],
    href: String,
    to: [String, Object]
  },
  setup(props, ctx: SetupContext) {
    let unreg: (() => void) | undefined
    const disabled = computed(() => !!props.disabled || props.disabled === '')
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const navActive = ref(false)
    const navGroup = inject<INavGroup>('of_NavGroup')
    const navTo = () => {
      let focus = elt.value
      if (focus && focus.focus) focus.focus()
    }
    const route = inject('route')
    const router = inject('router') as any
    const href = computed(() => {
      if (props.href) return props.href
      if (router && props.to) {
        const rt = router.resolve(props.to)
        if (rt) {
          return router.createHref(rt)
        }
      }
    })
    const clicked = (evt: Event) => {
      if (href.value && router) {
        router.push(props.to)
        evt.preventDefault()
        return true
      }
    }
    const handlers = {
      onClick: clicked,
      onBlur(evt: FocusEvent) {
        focused.value = false
      },
      onFocus(evt: FocusEvent) {
        focused.value = true
      },
      onKeydown(evt: KeyboardEvent) {
        if ((evt.key === ' ' || evt.key === 'Enter') && clicked(evt)) return
        const result = navGroup && navGroup.nav({ event: evt })
        if (result) return false
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el
        if (navGroup) {
          unreg = navGroup.navRegister(
            reactive({ disabled, elt, focused, navActive, navTo })
          )
        }
      },
      onVnodeUnmounted() {
        elt.value = undefined
        if (unreg) unreg()
        unreg = undefined
      }
    }

    return () => {
      const hrefVal = disabled.value ? null : href.value
      return h(
        (hrefVal ? 'a' : 'div') as any,
        {
          class: {
            'of-list-item': true,
            'of--enabled': !disabled.value,
            'of--disabled': disabled.value,
            'of--link': !!hrefVal
          },
          href: hrefVal,
          tabIndex: navActive.value ? 0 : -1,
          ref: 'elt',
          ...handlers
        },
        [h('div', { class: 'of-list-item-inner' }, ctx.slots.default!())]
      )
    }
  }
})
</script>
