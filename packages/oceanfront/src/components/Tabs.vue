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
            @click="selectTab(tab)"
            v-for="(tab, index) in tabsList"
            :class="{
              'is-active': tab.value === selectedTabName,
              'of-tab-header-item': true,
            }"
          >
            {{ tab.value }}
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
      <div class="of-tab-content" ref="tabsContent">
        <div v-if="selectedTab">
          <component :is="selectedTab"></component>
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
  computed,
} from 'vue'

import {ItemList, useItems} from '@/lib/items'

export default defineComponent({
  name: 'OfTabs',
  props: {
    items: ({ type: [Object, Array] } as any) as PropType<ItemList>,
  },
  setup(props, context: SetupContext) {
    let showNavigation = ref(false)
    let tabs: any = ref([])
    let tabsList: any = ref([])
    let selectedTab: any = ref()
    let selectedTabName: any = ref()
    let ofTabsHeader: any = ref()

    let ofTabsNavigationHeaderShowNextNavigation = ref(true)
    let ofTabsNavigationHeaderShowPreviousNavigation = ref(true)

    const itemMgr = useItems()

    const items = computed(() => {
      const result = {
        textKey: 'text',
        items: [],
      }
      const list = itemMgr.getItemList(props.items)
      if (list) {
        Object.assign(result, list)
      }

      return result
    })

    const handleOfTabsHeaderScrollIcons = () => {
      let maximumScrollLeft =
        ofTabsHeader.value.scrollWidth - ofTabsHeader.value.clientWidth

      if (ofTabsHeader.value.scrollLeft === 0) {
        ofTabsNavigationHeaderShowPreviousNavigation.value = false
      } else {
        ofTabsNavigationHeaderShowPreviousNavigation.value = true
      }
      if (ofTabsHeader.value.scrollLeft > 0) {
        if (maximumScrollLeft === ~~ofTabsHeader.value.scrollLeft) {
          ofTabsNavigationHeaderShowNextNavigation.value = false
        } else {
          ofTabsNavigationHeaderShowNextNavigation.value = true
        }
      }
    }

    onMounted(() => {
      const rows = []
      const resolved = items.value

      for (const item of resolved.items) {
        if (typeof item === 'string') {
          rows.push({
            value: item
          })
        } else if (typeof item === 'object') {
          rows.push({
            value: item[resolved.textKey]
          })
        }
      }

      tabsList.value = rows
      if (rows.length) {
        selectedTab.value = rows[0]
        selectedTabName.value = rows[0].value
      }

      setTimeout(() => {
        repositionLine()
        checkNavigation()
      })
      ofTabsHeader.value.onscroll = function () {
        handleOfTabsHeaderScrollIcons()
      }
      handleOfTabsHeaderScrollIcons()
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
      let currenTabHeaderItem: any = tabs.value.querySelector(
        '.of-tab-header-item.is-active'
      )
      let tabLine: HTMLDivElement = tabs.value.querySelector('.of-tabs-line')
      tabLine.style.width = currenTabHeaderItem?.clientWidth + 'px'
      tabLine.style.left = currenTabHeaderItem?.offsetLeft + 'px'
    }

    const selectTab = function (newTab: any) {
      if (selectedTab.value !== newTab.value) {
        selectedTab.value = null
        selectedTabName.value = null
        setTimeout(() => {
          selectedTabName.value = newTab.value
          selectedTab.value = newTab
          setTimeout(() => {
            repositionLine()
          })
        })
      }
      checkNavigation()
    }

    const checkNavigation = function () {
      showNavigation.value = ofTabsHeader.value.clientWidth < ofTabsHeader.value.scrollWidth;
    }

    return {
      tabsList,
      selectedTab,
      selectedTabName,
      showNavigation,
      navigateHeader,
      repositionLine,
      selectTab,
      checkNavigation,
      tabs,
      ofTabsHeader,
      ofTabsNavigationHeaderShowNextNavigation,
      ofTabsNavigationHeaderShowPreviousNavigation,
    }
  },
})
</script>
