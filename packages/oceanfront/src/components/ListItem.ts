import {
  computed,
  defineComponent,
  h,
  PropType,
  reactive,
  ref,
  SetupContext,
  watch,
} from 'vue'
import { useNavGroup } from '../lib/nav'
import { Link, LinkTo, OfLink } from './Link'
import { OfIcon } from './Icon'

export const OfListItem = defineComponent({
  name: 'OfListItem',
  props: {
    active: { type: [Boolean, String], default: null },
    disabled: { type: [Boolean, String], default: null },
    expand: { type: [Boolean, String], default: null },
    href: { type: String, default: null },
    to: [String, Object] as PropType<LinkTo>,
    attrs: { type: Object },
  },
  emits: {
    click: null,
  },
  setup(props, ctx: SetupContext) {
    const navGroup = useNavGroup()
    const elt = ref<HTMLElement>()
    const expand = computed(() => props.expand)
    const isCurrent = ref(!!props.active)
    const isFocused = ref(false)
    if (navGroup) {
      navGroup.register(
        reactive({
          isCurrent,
          isDisabled: computed(() => !!props.disabled),
          elt,
          isFocused,
          focus: () => {
            elt.value?.focus?.()
          },
        })
      )
    }
    const handlers = {
      onFocus() {
        isFocused.value = true
      },
      onBlur() {
        isFocused.value = false
      },
    }
    watch(
      () => props.active,
      (active) => {
        isCurrent.value = !!active
      }
    )

    const content = () => {
      const result = [
        h('div', { class: 'of-list-item-content' }, ctx.slots.default?.()),
      ]
      if (expand.value !== null) {
        result.push(
          h(OfIcon, {
            name: expand.value ? 'expand up' : 'expand down',
          })
        )
      }
      return result
    }

    return () => {
      const disabled = props.disabled
      return h(
        OfLink as any,
        {
          href: disabled ? null : props.href,
          to: disabled ? null : props.to,
        },
        {
          custom: (link: Link) => {
            const active =
              props.active ??
              (link.href ? link.isExactActive : navGroup && isCurrent.value)
            const href = link.href
            const activate = (evt: Event) => {
              ctx.emit('click', evt)
              if (link.href) {
                link.navigate(evt)
              }
              return evt.defaultPrevented
            }
            return h(
              href ? 'a' : 'div',
              {
                class: {
                  'of-list-item': true,
                  'of--active': active,
                  'of--disabled': props.disabled,
                  'of--expandable': expand.value !== null,
                  'of--expanded': expand.value,
                  'of--focused': isFocused.value,
                  'of--link': !!href,
                },
                href: link.href,
                ref: elt,
                tabIndex: active ? 0 : -1,
                onClick(evt: MouseEvent) {
                  if (evt.button != null && evt.button !== 0) return
                  activate(evt)
                  return false
                },
                onKeydown(evt: KeyboardEvent) {
                  if ((evt.key === ' ' || evt.key === 'Enter') && activate(evt))
                    return
                  navGroup?.navigate(evt)
                },
                ...handlers,
                ...props.attrs,
              },
              h('div', { class: 'of-list-item-inner' }, content())
            )
          },
        }
      )
    }
  },
})
