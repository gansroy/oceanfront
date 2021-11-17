import {
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  resolveComponent,
  ComponentInternalInstance,
  PropType,
  SetupContext,
} from 'vue'

export type Link = {
  isActive: boolean
  isExactActive: boolean
  href: string | null
  navigate(evt?: Event): Promise<void | any>
}

export type LinkTo = string | Record<string, any>

function defaultLink(href: string | null) {
  return {
    isActive: false,
    isExactActive: false,
    href,
    navigate(evt?: Event): Promise<void | any> {
      if (href && (!evt || evt.type != 'click')) {
        // allow default behaviour on click. could be triggered
        // manually, in which case we navigate manually
        document.location.assign(href)
        evt?.preventDefault?.()
      }
      return Promise.resolve()
    },
  }
}

function renderLink(link: Link, comp: ComponentInternalInstance) {
  return h(
    'a',
    {
      'aria-current': link.isExactActive ? comp.props.ariaCurrentValue : null,
      class: {
        'of-link': true,
        'of--active': link.isExactActive,
        'of--disabled': !link.href,
        'of--link': !!link.href,
      },
      href: link.href,
      onClick: link.navigate,
      ...comp.attrs,
    },
    comp.slots.default?.(link)
  )
}

function findChildElement(comp: ComponentInternalInstance): HTMLElement | null {
  if (comp) {
    if (comp.subTree.el instanceof HTMLElement) return comp.subTree.el
    if (comp.subTree.component) {
      return findChildElement(comp.subTree.component)
    } else {
      const first =
        Array.isArray(comp.subTree.children) && comp.subTree.children[0]
      if (isVNode(first) && first.el instanceof HTMLElement) return first.el
    }
  }
  return null
}

export const OfLink = defineComponent({
  name: 'OfLink',
  inheritAttrs: false,
  props: {
    ariaCurrentValue: {
      type: String as PropType<
        'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'
      >,
      default: 'page',
    },
    href: { type: String, default: null },
    to: [String, Object] as PropType<LinkTo>,
    beforeNavigate: { type: Array as PropType<Function[]>, default: null },
  },
  setup(props, ctx: SetupContext) {
    const inst = getCurrentInstance() as ComponentInternalInstance
    const focus = () => {
      const elt = findChildElement(inst)
      elt?.focus?.()
    }

    const RouterLink = resolveComponent('RouterLink')
    return {
      focus,
      doRender() {
        const customSlot = ctx.slots.custom
        if (RouterLink && (props.to || !props.href)) {
          return h(
            RouterLink,
            {
              custom: true,
              to: props.to ?? '',
              beforeNavigate: props.beforeNavigate,
            },
            (customSlot || ((link: Link) => renderLink(link, inst))) as any
          )
        } else {
          const link = defaultLink(props.href)
          return customSlot ? customSlot(link) : renderLink(link, inst)
        }
      },
    }
  },
  render() {
    return this.doRender()
  },
})
