<template>
  <div class="of-badge" :class="badgeClass"><slot></slot></div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type Status =
  | 'success'
  | 'final'
  | 'info'
  | 'draft'
  | 'pending'
  | 'deferred'
  | 'special'
  | 'error'
  | 'alert'
  | 'warning'
  | 'danger'
  | 'closed'
  | 'dead'
  | 'invert'

type Size = 'normal' | 'small' | 'large'

const sizeClass = (size: Size | undefined) => {
  switch (size) {
    case 'small':
      return { 'of--small': true }
    case 'large':
      return { 'of--large': true }
    default:
      return {}
  }
}

export default defineComponent({
  name: 'OfBadge',
  props: {
    status: String as PropType<Status>,
    size: String as PropType<Size>,
    circular: Boolean,
    icon: Boolean,
    compact: Boolean,
  },
  setup(props) {
    const badgeClass = computed(() => {
      return {
        ['state-' + props.status]: !!props.status,
        'of--circular': props.circular,
        'of--icon': props.icon,
        'of--compact': props.compact,
        ...sizeClass(props.size),
      }
    })
    return {
      badgeClass,
    }
  },
})
</script>
