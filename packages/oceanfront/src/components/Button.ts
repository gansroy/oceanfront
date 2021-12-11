import { defineComponent, computed, h, ref } from 'vue'
import { OfIcon } from './Icon'
import { OfOverlay } from './Overlay'
import OfOptionList from './OptionList.vue'

let sysMenuTargetIndex = 0

export const OfButton = defineComponent({
  name: 'OfButton',
  props: {
    active: Boolean,
    density: [String, Number],
    disabled: Boolean,
    icon: String,
    id: String,
    items: [String, Array, Object],
    label: String,
    name: String,
    rounded: Boolean,
    split: Boolean,
    type: String,
    variant: String,
  },
  emits: {
    click: null,
  },
  setup(props, ctx) {
    const variant = computed(() => props.variant || 'solid')
    const menuShown = ref(false)
    let menuTimerId: number | undefined

    const density = computed(() => {
      let d = props.density
      if (d === 'default') {
        d = undefined
      } else if (typeof d === 'string') {
        d = parseInt(d, 10)
        if (isNaN(d)) d = undefined
      }
      if (typeof d !== 'number') {
        d = 2
      }
      return Math.max(0, Math.min(3, d || 0))
    })

    const onClick = (evt?: MouseEvent) => {
      if (props.items && !props.split) {
        toggleMenu(evt)
      } else {
        ctx.emit('click', evt)
      }
    }
    const onClickItem = (val: any) => {
      if (typeof val === 'function') val.call(this)
      closeMenu()
    }
    const toggleMenu = (_evt?: MouseEvent) => {
      menuShown.value = !menuShown.value
    }
    const closeMenu = () => {
      menuShown.value = false
    }
    const expand = h(
      'div',
      { class: 'of-button-expand' },
      h(OfIcon, { name: 'expand down' })
    )
    const menuMouseEvts = {
      onMouseenter: () => {
        clearTimeout(menuTimerId)
      },
      onMouseleave: () => {
        if (!menuShown.value) return false
        menuTimerId = window.setTimeout(() => {
          closeMenu()
        }, 500)
      },
    }
    let autoId: string

    return () => {
      const { disabled, id, items, rounded, split } = props
      if (!id && !autoId) {
        const idx = ++sysMenuTargetIndex
        autoId = `of-button-${idx}`
      }
      const buttonId = (id || autoId) + '-button'
      const splitId = (id || autoId) + '-split'
      const body = [
        ctx.slots.icon
          ? ctx.slots.icon()
          : props.icon
          ? h(
              'div',
              { class: 'of-button-icon' },
              h(OfIcon, { class: 'button-icon', name: props.icon })
            )
          : undefined,
        ctx.slots.content || ctx.slots.default || props.label
          ? h(
              'div',
              { class: 'of-button-content' },
              ctx.slots.content
                ? ctx.slots.content()
                : h(
                    'label',
                    ctx.slots.default ? ctx.slots.default() : props.label
                  )
            )
          : undefined,
        items && !split ? expand : undefined,
      ]
      return h(
        'div',
        {
          class: [
            'of-button',
            'of--density-' + density.value,
            'of--variant-' + variant.value,
            {
              'of--active': props.active,
              'of-button--rounded': rounded,
              'of--mode-disabled': disabled,
            },
          ],
          id,
        },
        [
          h(
            'button',
            {
              class: 'of-button-main',
              disabled,
              id: buttonId,
              onClick,
              name: props.name,
              type: props.type ?? 'button',
              ...menuMouseEvts,
            },
            body
          ),
          split && items
            ? h(
                'button',
                {
                  class: 'of-button-split',
                  disabled,
                  id: splitId,
                  onClick: toggleMenu,
                  ...menuMouseEvts,
                },
                expand
              )
            : undefined,
          items
            ? h(
                OfOverlay,
                {
                  active: menuShown.value,
                  capture: false,
                  shade: false,
                  target: '#' + (split ? splitId : buttonId),
                  onBlur: () => {
                    menuShown.value = false
                  },
                },
                () =>
                  h(OfOptionList, {
                    items,
                    onClick: onClickItem,
                    ...menuMouseEvts,
                  })
              )
            : undefined,
        ]
      )
    }
  },
})
