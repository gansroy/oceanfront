<template>
  <transition>
    <div class="of-tabs" ref="tabs">
      <div
        :class="{
          'of-tabs-navigation-header': true,
          'of-tabs-navigation-header-show-next-navigation': ofTabsNavigationHeaderShowNextNavigation,
          'of-tabs-navigation-header-show-previous-navigation': ofTabsNavigationHeaderShowPreviousNavigation,
          'of-tabs-navigation-header-has-navigation': showNavigation,
        }"
      >
        <div
          v-if="showNavigation"
          class="of-tabs-navigation of-tabs-navigation-prev"
          @click="navigateHeader('prev')"
        >
          <of-icon
            :name="'nav-previous'"
            :title="'Previous tab'"
            size="input"
          />
        </div>
        <div class="of-tabs-header" ref="ofTabsHeader">
          <div
            :key="index"
            @click="selectTab(index)"
            v-for="(tab, index) in tabsList"
            :class="{
              'is-active': selectedTabIdx === index,
              'of-tab-header-item': true,
            }"
          >
            {{ tab.text }}
          </div>
          <div class="of-tabs-line" ref="tabLine"></div>
        </div>
        <div
          v-if="showNavigation"
          class="of-tabs-navigation of-tabs-navigation-next"
          @click="navigateHeader('next')"
        >
          <of-icon :name="'nav-next'" :title="'Next tab'" size="input" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  PropType,
  SetupContext,
  computed, watch,
} from 'vue'

import {ItemList, useItems} from '@/lib/items'

export default defineComponent({
  name: 'OfTabs',
  props: {
    items: ({ type: [Object, Array] } as any) as PropType<ItemList>,
    value: Number,
    scrolling: { type: Boolean, default: false },
  },
  setup(props, context: SetupContext) {
    let tabs: any = ref([])
    let ofTabsHeader: any = ref()

    let selectedTabIdx: any = ref(props.value)

    watch(
      () => props.value,
      (val) => {
        selectedTabIdx.value = val
      }
    )

    const ofTabsNavigationHeaderShowNextNavigation = computed(() => {
      return props.scrolling
    })

    const ofTabsNavigationHeaderShowPreviousNavigation = computed(() => {
      return props.scrolling
    })

    const showNavigation = computed(() => {
      return props.scrolling
    })

    const itemMgr = useItems()

    const items = computed(() => {
      const result = {
        disabledKey: 'disabled',
        iconKey: 'icon',
        textKey: 'text',
        items: [],
      }
      const list = itemMgr.getItemList(props.items)

      if (list) {
        Object.assign(result, list)
      }

      return result
    })

    let tabsList = computed(() => {
      const rows = []
      const resolved = items.value

      for (const item of resolved.items) {
        let text = '';

        if (typeof item === 'string' && item !== '') {
          rows.push({
            disabled: false,
            icon: null,
            text: item,
          })
        } else if (typeof item === 'object') {
          text = item[resolved.textKey]? item[resolved.textKey] : ''
          if (text !== '') {
            rows.push({
              disabled: item[resolved.disabledKey] ? item[resolved.disabledKey] : false,
              icon: item[resolved.iconKey] ? item[resolved.iconKey] : null,
              text: item[resolved.textKey],
            })
          }
        }
      }

      return rows
    })

    const selectedTab = computed(() => {
      let idx = 0
      for (const item of tabsList.value) {
        if (idx === selectedTabIdx.value)
          return item
        idx++
      }
    })

    onMounted(() => {
      setTimeout(() => {
        repositionLine()
      })
    })

    const navigateHeader = function (value: string) {

      if (value == 'next') {
        ofTabsHeader.value.scrollTo({
          left: ofTabsHeader.value.scrollLeft + 150,
          behavior: 'smooth',
        })
      } else if (value == 'prev') {
        ofTabsHeader.value.scrollTo({
          left: ofTabsHeader.value.scrollLeft - 150,
          behavior: 'smooth',
        })
      }
    }
    const repositionLine = function () {
      const currentTabHeaderItem = tabs.value.querySelector(
        '.of-tab-header-item.is-active'
      )

      let tabLine: HTMLDivElement = tabs.value.querySelector('.of-tabs-line')
      tabLine.style.width = currentTabHeaderItem?.clientWidth + 'px'
      tabLine.style.left = currentTabHeaderItem?.offsetLeft + 'px'
    }

    const selectTab = function (index: Number) {

      if (selectedTabIdx.value !== index) {

        context.emit('update:value', index)

        setTimeout(() => {
          setTimeout(() => {
            repositionLine()
          })
        })

      }
    }

    return {
      tabsList,
      selectedTab,
      selectedTabIdx,
      showNavigation,
      navigateHeader,
      repositionLine,
      selectTab,
      tabs,
      ofTabsHeader,
      ofTabsNavigationHeaderShowNextNavigation,
      ofTabsNavigationHeaderShowPreviousNavigation,
    }
  },
})
</script>
