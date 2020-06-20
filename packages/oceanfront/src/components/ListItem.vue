<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  inject,
  reactive,
  ref,
  Ref,
  SetupContext,
  VNode,
} from 'vue'
import { INavGroup } from './NavGroup.vue'
import { OfIcon } from './Icon'
import { useRoutes } from '../lib/routes'

export default defineComponent({
  name: 'OfListItem',
  props: {
    active: { type: [Boolean, String], default: null },
    disabled: Boolean,
    expand: { type: [Boolean, String], default: null },
    href: String,
    to: [String, Object],
  },
  emits: {
    click: null,
  },
  setup(props, ctx: SetupContext) {
    let unreg: (() => void) | undefined
    const routes = useRoutes()
    const disabled = computed(() => props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const expand = computed(() => props.expand)
    const focused = ref(false)
    const navGroup = inject<INavGroup>('of_NavGroup')
    const navTo = () => {
      let focus = elt.value
      if (focus && focus.focus) focus.focus()
    }
    const route = routes?.activeRoute
    const router = routes?.router
    const resolveRoute = computed(() => {
      if (router && props.to) {
        return router.resolve(props.to)
      }
    })
    const href = computed(() => {
      if (props.href) return props.href
      const rt = resolveRoute.value
      if (rt) return rt.href
    })
    const active = computed(() => {
      if (props.active === null) {
        if (!href.value) return false
        const rt = resolveRoute.value
        // FIXME not an accurate comparison, only looks at path
        return rt && route ? rt.path === route.path : false
      }
      return props.active
    })
    const navActive = ref(active.value)
    const clicked = (evt: Event) => {
      if (href.value && router) {
        router.push(props.to)
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
        const result = navGroup && navGroup.nav({ event: evt })
        if (result) return false
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = (vnode as VNode<HTMLElement>).el || undefined
        if (navGroup) {
          unreg = navGroup.navRegister(
            reactive({
              disabled: (disabled as any) as Ref<boolean | undefined>, // FIXME cast should not be necessary
              elt,
              focused,
              navActive: navActive as Ref<boolean>, // FIXME cast should not be necessary
              navTo,
            })
          )
        }
      },
      onVnodeUnmounted() {
        elt.value = undefined
        if (unreg) unreg()
        unreg = undefined
      },
    }

    const content = () => {
      const result = [
        h('div', { class: 'of-list-item-content' }, ctx.slots.default!()),
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
          class: {
            'of-list-item': true,
            'of--active': active.value,
            'of--enabled': !disabled.value,
            'of--disabled': disabled.value,
            'of--link': !!hrefVal,
          },
          href: hrefVal,
          tabIndex: navActive.value ? 0 : -1,
          ref: 'elt',
          ...handlers,
        },
        h('div', { class: 'of-list-item-inner' }, content())
      )
    }
  },
})
</script>
