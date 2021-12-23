<template>
  <div role="menu" class="of-menu" :class="menuClass" :style="menuStyle">
    <of-nav-group>
      <div v-if="isEmpty" style="padding: 0 0.5em">No items</div>
      <template v-if="!isEmpty">
        <div class="of-list-outer">
          <template v-for="(item, idx) of theItems" :key="idx">
            <div class="of-list-header" v-if="item.special === 'header'">
              {{ item.text }}
            </div>
            <div class="of-list-divider" v-if="item.special === 'divider'" />
            <of-list-item
              v-if="!item.special"
              :active="item.selected"
              :disabled="item.disabled"
              @click="() => item.disabled || onClick(item.value, item)"
              :attrs="item.attrs"
            >
              <of-icon v-if="item.icon" :name="item.icon" size="input" />
              {{ item.text }}
            </of-list-item>
          </template>
        </div>
      </template>
    </of-nav-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { OfNavGroup } from '../components/NavGroup'
import { OfListItem } from '../components/ListItem'
const OfOptionList = defineComponent({
  name: 'OfOptionList',
  components: {
    OfListItem,
    OfNavGroup,
  },
  props: {
    class: [Object, String],
    style: [Object, String],
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    onClick: { type: Function, required: true },
  },
  setup(props) {
    const isEmpty = computed(() => !props.items || !props.items.length)
    const theItems = computed(() => props.items as any[])
    const menuClass = computed(() => props.class)
    const menuStyle = computed(() => props.style)
    return { isEmpty, theItems, menuClass, menuStyle }
  },
})

export default OfOptionList
</script>
