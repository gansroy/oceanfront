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
  name: 'of-menu-item',
  props: {
    disabled: Boolean,
    to: [String, Object]
  },
  setup(props, ctx: SetupContext) {
    let unreg: (() => void) | undefined
    const disabled = computed(() => props.disabled)
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
      if (router && props.to) {
        const rt = router.resolve(props.to)
        return rt && rt.fullPath
      }
    })
    const clicked = (evt: Event) => {
      if (href.value) {
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
        if (evt.key == ' ' && clicked(evt)) return
        console.log(evt.key)
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

    return () =>
      h(
        (href.value ? 'a' : 'div') as any,
        {
          class: 'menu-option of-menu-item',
          href: href.value,
          tabIndex: navActive.value ? 0 : -1,
          ref: 'elt',
          ...handlers
        },
        ctx.slots.default!()
      )
  }
})
</script>
