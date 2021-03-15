import { defineComponent, h, VNode } from 'vue'
import { OfNavGroup } from '../components/NavGroup'
import { OfListItem } from '../components/ListItem'

export const OfOptionList = defineComponent({
  name: 'OfOptionList',
  props: {
    items: null,
    onClick: { type: Function, required: true },
  },
  setup(props) {
    let rowsOuter: VNode | undefined
    if (!props.items || !props.items.length) {
      rowsOuter = h('div', { style: 'padding: 0 0.5em' }, 'No items')
    } else {
      const rows = []
      for (const item of props.items) {
        if (item.special === 'header') {
          rows.push(h('div', { class: 'of-list-header' }, item.text))
        } else if (item.special === 'divider') {
          rows.push(h('div', { class: 'of-list-divider' }))
        } else {
          rows.push(
            h(
              OfListItem,
              {
                active: item.selected,
                disabled: item.disabled,
                onClick: () => {
                  props.onClick(item.value)
                },
              },
              () => item.text
            )
          )
        }
      }
      rowsOuter = h('div', { class: 'of-list-outer' }, rows)
    }
    return () => {
      return h('div', { role: 'menu', class: 'of-menu' }, [
        h(OfNavGroup, () => rowsOuter),
      ])
    }
  },
})