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
    tint: String,
    keepTextColor: Boolean,
    menuTrigger: { type: String, default: 'click' },
  },
  emits: {
    click: null,
  },
  setup(props, ctx) {
    const variant = computed(() => props.variant || 'filled')
    const tint = computed(() => props.tint)
    const menuShown = ref(false)
    const focused = ref(false)
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
      h(OfIcon, { name: 'bullet down' })
    )
    const menuMouseEvts = {
      onMouseenter: () => {
        if (props.menuTrigger === 'hover') {
          menuShown.value = true
        }
        clearTimeout(menuTimerId)
      },
      onMouseleave: () => {
        if (!menuShown.value) return false
        menuTimerId = window.setTimeout(() => {
          closeMenu()
        }, 500)
      },
    }
    const focusEvts = {
      onFocus: () => {
        focused.value = true
      },
      onBlur: () => {
        focused.value = false
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
      const iconContent = ctx.slots.icon
        ? ctx.slots.icon()
        : props.icon
        ? h(
            'div',
            { class: 'of-button-icon' },
            h(OfIcon, { class: 'button-icon', name: props.icon })
          )
        : undefined
      const mainContent =
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
          : undefined

      const extraContent = ctx.slots.extra?.()
      const body = [
        iconContent,
        mainContent,
        extraContent,
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
              'of--tinted': !!tint.value,
              ['of--tint-' + tint.value]: !!tint.value,
              'of--keep-text-color': props.keepTextColor,
              'of--focused': focused.value,
              'of--active': props.active,
              'of-button--rounded': rounded,
              'of-button--icon': !!(
                iconContent && !(mainContent || items || split)
              ),
              'of--mode-disabled': disabled,
            },
          ],
          id,
        },
        [
          h('div', { class: 'of--layer of--layer-lining' }),
          h('div', { class: 'of--layer of--layer-bg' }),
          h('div', { class: 'of--layer of--layer-brd' }),
          h('div', { class: 'of--layer of--layer-outl of--elevated' }),
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
              ...focusEvts,
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
                  ...focusEvts,
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
                    class: 'of--elevated-1',
                    items,
                    onClick: onClickItem,
                    ...menuMouseEvts,
                  })
              )
            : undefined,
          h('div', { class: 'of--layer of--layer-state' }),
        ]
      )
    }
  },
})
