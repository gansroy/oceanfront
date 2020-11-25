<template>
  <transition>
    <div class="of-tabs" ref="tabs">
      <div :class="cls">
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
              :key="tab.key"
              @click="selectTab(tab.key)"
              v-for="tab in tabsList"
              :class="{
                'is-active': selectedTabKey === tab.key,
                'of-tab-header-item': true,
                'overflow-button': tab.overflowButton,
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

      <div
        role="menu"
        class="of-menu of-invisible-tabs"
        v-show="outsideTabsOpened"
      >
        <div class="of-list-outer">
          <div
            class="of-list-item of--enabled"
            :key="tab.key"
            v-for="tab in invisibleTabsList"
            @click="selectInvisibleTab(tab.key)"
          >
            <div class="of-list-item-inner">
              <div class="of-list-item-content">
                {{ tab.text }}
              </div>
            </div>
            <div class="of-list-divider"></div>
          </div>
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
  onBeforeMount,
  PropType,
  SetupContext,
  computed,
  watch,
  onBeforeUnmount,
} from 'vue'

import { ItemList, useItems } from '../lib/items'

const formatItems = (
  list: any,
  params: any,
  visible = true,
  addOverflowButton: Boolean = false
): any => {
  const rows = []

  for (const item of list) {
    let text = ''
    text = item[params.textKey] ? item[params.textKey] : ''

    if (text === '') continue

    if (visible && item.visible === false) {
      continue
    } else if (!visible && item.visible === true) {
      continue
    }

    rows.push({
      disabled: item[params.disabledKey] ? item[params.disabledKey] : false,
      icon: item[params.iconKey] ? item[params.iconKey] : null,
      overflowButton: false,
      text: item[params.textKey],
      key: parseInt(item['key']),
      visible: item.visible,
    })
  }

  if (visible && addOverflowButton) {
    rows.push({
      disabled: false,
      icon: null,
      overflowButton: true,
      text: '...',
      key: -1,
    })
  }

  return rows
}

export default defineComponent({
  name: 'OfTabs',
  props: {
    items: ({ type: [Object, Array] } as any) as PropType<ItemList>,
    value: Number,
    scrolling: { type: Boolean, default: false },
    overflowButton: { type: Boolean, default: false },
    variant: String,
    tabsList: Array,
  },
  emits: ['update:value'],
  setup(props, context: SetupContext) {
    let tabs: any = ref([])
    let ofTabsHeader: any = ref()
    let selectedTabKey: any = ref(props.value)
    let tabsWidth: any = ref([])

    watch(
      () => props.value,
      (val) => {
        selectedTabKey.value = val
      }
    )

    const variant = computed(() => props.variant || 'standard')
    const cls = 'of--variant-' + variant.value

    const overflowButton = computed(() => props.overflowButton || false)
    let showOverflowButton = ref(false)

    const ofTabsNavigationHeaderShowNextNavigation = computed(() => {
      return props.scrolling && variant.value !== 'osx' && !overflowButton.value
    })

    const ofTabsNavigationHeaderShowPreviousNavigation = computed(() => {
      return props.scrolling && variant.value !== 'osx' && !overflowButton.value
    })

    const showNavigation = computed(() => {
      return props.scrolling && variant.value !== 'osx' && !overflowButton.value
    })

    const itemMgr = useItems()

    const items: any = ref({})

    const fillItems = function () {
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

      for (const index in result.items) {
        let item: any = result.items[index]

        if (typeof item === 'string' && item !== '') {
          item = { text: item, key: parseInt(index), visible: true }
        } else if (typeof item === 'object') {
          item.key = parseInt(index)
          item.visible = true
        }

        result.items[index] = item as never
      }

      items.value = result
    }

    const tabsList = computed(() => {
      return formatItems(
        items.value.items,
        items.value,
        true,
        showOverflowButton.value
      )
    })

    const invisibleTabsList = computed(() => {
      return formatItems(items.value.items, items.value, false)
    })

    onBeforeMount(() => {
      fillItems()
    })

    onMounted(() => {
      window.addEventListener('resize', hideOutsideTabs)

      setTimeout(() => {
        setTabsWidth()
        hideOutsideTabs()
        repositionLine()
        repositionTabs()
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', hideOutsideTabs)
    })

    const navigateHeader = function (value: string, scrollNum = 150) {
      if (value == 'next') {
        ofTabsHeader.value.scrollTo({
          left: ofTabsHeader.value.scrollLeft + scrollNum,
          behavior: 'smooth',
        })
      } else if (value == 'prev') {
        ofTabsHeader.value.scrollTo({
          left: ofTabsHeader.value.scrollLeft - scrollNum,
          behavior: 'smooth',
        })
      }
    }

    const repositionLine = function () {
      if (variant.value !== 'osx') {
        const currentTabHeaderItem = tabs.value.querySelector(
          '.of-tab-header-item.is-active'
        )

        let tabLine: HTMLDivElement = tabs.value.querySelector('.of-tabs-line')
        tabLine.style.width = currentTabHeaderItem?.clientWidth + 'px'
        tabLine.style.left = currentTabHeaderItem?.offsetLeft + 'px'
      }
    }

    //If selected tab isn't visible make scrolling
    const repositionTabs = function () {
      if (showNavigation.value) {
        const currentTabHeaderItem = tabs.value.querySelector(
          '.of-tab-header-item.is-active'
        )

        const prevNavBounds = tabs.value
          .querySelector('.of-tabs-navigation.of-tabs-navigation-prev')
          .getBoundingClientRect()
        const nextNavBounds = tabs.value
          .querySelector('.of-tabs-navigation.of-tabs-navigation-next')
          .getBoundingClientRect()
        const currentItemBounds = currentTabHeaderItem.getBoundingClientRect()

        let scroll = 0

        //check right bound
        if (currentItemBounds.right > nextNavBounds.left) {
          scroll = Math.round(currentItemBounds.right - nextNavBounds.left) + 5
          navigateHeader('next', scroll)
          //check left bound
        } else if (currentItemBounds.left < prevNavBounds.right) {
          scroll = Math.round(prevNavBounds.right - currentItemBounds.left) + 5
          navigateHeader('prev', scroll)
        }
      }
    }

    const setTabsWidth = function () {
      if (overflowButton.value && !showNavigation.value) {
        for (let item of ofTabsHeader.value.childNodes) {
          if (!item.clientWidth) continue

          tabsWidth.value.push(item.clientWidth)
        }
      }
    }

    const hideOutsideTabs = function () {
      if (overflowButton.value && !showNavigation.value) {
        closeOverflowPopup()

        const outerWidth = ofTabsHeader.value.clientWidth
        let tabsWidthSum = 0
        let index = 0
        let hasInvisibleTabs = false

        for (const item of items.value.items) {
          let visible = true
          tabsWidthSum += tabsWidth.value[index]

          if (tabsWidthSum > outerWidth) {
            if (!hasInvisibleTabs) {
              //Add previous element to invisible list to free space for overflow button
              const prevItem = items.value.items[index - 1]
              prevItem['visible'] = false as never
              items.value.items[index - 1] = prevItem

              hasInvisibleTabs = true
            }

            visible = false
          }

          item['visible'] = visible as never
          items.value.items[index] = item

          index++
        }

        showOverflowButton.value = hasInvisibleTabs
        addSelectedTabToVisibleList()
      }
    }

    const addSelectedTabToVisibleList = function () {
      const selectedTab: any = getTab(selectedTabKey.value, true)

      if (selectedTab) {
        let index = 0
        let selectedIndex = -1
        let tabsIndexes = []

        //Make all tabs invisible exclude selected
        for (const item of items.value.items) {
          if (selectedTab['key'] === item['key']) {
            updateTabVisibility(index, true)
            selectedIndex = index
          } else if (item['visible'] && item['key'] !== -1) {
            updateTabVisibility(index, false)
          }

          if (index !== selectedIndex) tabsIndexes.push(index)

          index++
        }

        const outerWidth = ofTabsHeader.value.clientWidth
        let tabsWidth = 0

        //Make tabs visible until widths sum < main container's width
        for (const index of tabsIndexes) {
          updateTabVisibility(index, true)
          tabsWidth = calcVisibleTabsWidth()

          if (tabsWidth > outerWidth) {
            updateTabVisibility(index, false)
            break
          }
        }

        setTimeout(() => {
          repositionLine()
        })
      }
    }

    const calcVisibleTabsWidth = function (): number {
      let width = 0

      const overflowButton = tabs.value.querySelector(
        '.of-tab-header-item.overflow-button'
      )

      width += overflowButton?.clientWidth

      for (const item of tabsList.value) {
        if (item['visible']) width += tabsWidth.value[item['key']]
      }

      return width
    }

    const updateTabVisibility = function (index: number, visible: boolean) {
      const item = items.value.items[index]

      if (typeof item !== 'undefined') {
        item['visible'] = visible
        items.value.items[index] = item
      }
    }

    const getTab = function (
      key: Number,
      invisible = false
    ): Object | undefined {
      let list: any

      if (!invisible) {
        list = tabsList.value
      } else {
        list = invisibleTabsList.value
      }

      for (const tab of list) {
        if (tab.key === key) return tab
      }
    }

    const selectTab = function (key: number) {
      if (selectedTabKey.value !== key) {
        const selectedTab: any = getTab(key)

        if (selectedTab && selectedTab.overflowButton) {
          switchOverflowPopupVisibility()
        } else if (selectedTab) {
          context.emit('update:value', key)

          setTimeout(() => {
            closeOverflowPopup()
            repositionLine()
            repositionTabs()
          })
        }
      }
    }

    const selectInvisibleTab = function (key: number) {
      const selectedTab: any = getTab(key, true)

      if (selectedTab) {
        context.emit('update:value', key)

        setTimeout(() => {
          addSelectedTabToVisibleList()
        })
      }

      closeOverflowPopup()
    }

    const outsideTabsOpened = ref(false)

    const switchOverflowPopupVisibility = () => {
      outsideTabsOpened.value = !outsideTabsOpened.value
    }

    const closeOverflowPopup = () => {
      outsideTabsOpened.value = false
    }

    return {
      tabsList,
      selectedTabKey,

      showNavigation,
      navigateHeader,
      repositionLine,
      selectTab,

      tabs,
      cls,

      invisibleTabsList,
      outsideTabsOpened,
      closeOverflowPopup,
      selectInvisibleTab,

      ofTabsHeader,
      ofTabsNavigationHeaderShowNextNavigation,
      ofTabsNavigationHeaderShowPreviousNavigation,
    }
  },
})
</script>
