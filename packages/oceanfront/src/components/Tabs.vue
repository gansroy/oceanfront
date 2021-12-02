<template>
  <transition>
    <div class="of-tabs" ref="tabs">
      <div :class="cls">
        <div
          :class="{
            'of-tabs-navigation-header': true,
            'of-tabs-navigation-header-show-next-navigation':
              ofTabsNavigationHeaderShowNextNavigation,
            'of-tabs-navigation-header-show-previous-navigation':
              ofTabsNavigationHeaderShowPreviousNavigation,
            'of-tabs-navigation-header-has-navigation': showNavigation,
          }"
        >
          <div
            v-if="showNavigation"
            class="of-tabs-navigation of-tabs-navigation-prev"
            @click="navigateHeader('prev')"
          >
            <of-icon
              name="page previous"
              :title="'Previous tab'"
              size="input"
            />
          </div>
          <div class="of-tabs-header" ref="ofTabsHeader">
            <div
              :key="tab.key"
              @click="selectTab(tab.key)"
              @mouseover="openSubMenu(tab.key, $event)"
              @mouseleave="subMenuLeave()"
              v-for="tab in tabsList"
              :class="{
                'is-active': selectedTabKey === tab.key,
                'of-tab-header-item': true,
                'overflow-button': tab.overflowButton,
              }"
            >
              <of-icon v-if="tab.icon" :name="tab.icon" size="input" />
              {{ tab.text }}
            </div>
            <div class="of-tabs-line" ref="tabLine"></div>
          </div>
          <div
            v-if="showNavigation"
            class="of-tabs-navigation of-tabs-navigation-next"
            @click="navigateHeader('next')"
          >
            <of-icon name="page next" :title="'Next tab'" size="input" />
          </div>
        </div>
        <of-overlay
          :active="subMenuOpened"
          :capture="false"
          :shade="false"
          :target="subMenuOuter"
        >
          <slot name="sub-menu" v-if="showSubMenu">
            <div
              role="menu"
              class="of-menu of-invisible-tabs"
              @mouseenter="subMenuClearTimeout()"
              @mouseleave="subMenuLeave()"
            >
              <div class="of-list-outer">
                <div
                  class="of-list-item of--enabled"
                  :key="subTab.key"
                  @click="selectSubMenuTab(subTab)"
                  v-for="subTab in subMenuTabsList"
                >
                  <div class="of-list-item-inner">
                    <of-icon
                      v-if="subTab.icon"
                      :name="subTab.icon"
                      size="input"
                    />
                    <div class="of-list-item-content">
                      {{ subTab.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </of-overlay>
      </div>

      <of-overlay
        :active="outsideTabsOpened"
        :shade="false"
        :capture="false"
        :target="overflowButtonEl"
        @blur="closeOverflowPopup"
      >
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
                <of-icon v-if="tab.icon" :name="tab.icon" size="input" />
                <div class="of-list-item-content">
                  {{ tab.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </of-overlay>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  Ref,
  defineComponent,
  onMounted,
  onBeforeMount,
  PropType,
  SetupContext,
  computed,
  nextTick,
  watch,
  onBeforeUnmount,
} from 'vue'

import { watchPosition } from '../lib/util'
import { ItemList, useItems } from '../lib/items'
import { OfOverlay } from './Overlay'
import { Tab } from '../lib/tab'

const formatItems = (
  list: any,
  params: any,
  visible = true,
  addOverflowButton: Boolean = false
): Array<Tab> => {
  const rows = []

  for (const item of list) {
    let text = ''
    let subMenu = undefined
    text = item[params.textKey] ? item[params.textKey] : ''

    if (text === '') continue

    if (visible && item.visible === false) {
      continue
    } else if (!visible && item.visible === true) {
      continue
    }

    if (item.subMenuItems)
      subMenu = formatItems(item.subMenuItems, params, true, false)

    rows.push({
      disabled: item[params.disabledKey] ? item[params.disabledKey] : false,
      icon: item[params.iconKey] ? item[params.iconKey] : '',
      overflowButton: false,
      text: item[params.textKey],
      key: parseInt(item['key']),
      parentKey: !isNaN(item['parentKey'])
        ? parseInt(item['parentKey'])
        : undefined,
      visible: item.visible,
      params: item.params ?? undefined,
      subMenuItems: subMenu,
    } as Tab)
  }

  if (visible && addOverflowButton) {
    rows.push({
      disabled: false,
      icon: '',
      overflowButton: true,
      text: '...',
      key: -1,
      parentKey: undefined,
    } as Tab)
  }

  return rows
}

export default defineComponent({
  name: 'OfTabs',
  components: { OfOverlay },
  props: {
    items: { type: [Object, Array] } as any as PropType<ItemList>,
    modelValue: Number,
    scrolling: { type: Boolean, default: false },
    overflowButton: { type: Boolean, default: false },
    variant: String,
    tabsList: Array,
    submenu: Boolean,
  },
  emits: ['update:modelValue', 'select-tab'],
  setup(props, context: SetupContext) {
    let tabs: any = ref([])
    let ofTabsHeader: any = ref()
    let selectedTabKey: any = ref(props.modelValue)
    let tabsWidth: any = ref([])

    watch(
      () => props.modelValue,
      (val) => {
        selectedTabKey.value = val
        nextTick(() => {
          repositionLine()
        })
      }
    )

    watch(
      () => props.items,
      () => {
        fillItems()
        init()
      }
    )

    const targetPos = computed(() => watchPosition())
    watch(targetPos.value.positions, () => repositionLine())

    const variant = computed(() => props.variant || 'standard')
    const cls = 'of--variant-' + variant.value

    const overflowButtonEnabled = computed(() => props.overflowButton || false)
    let showOverflowButton = ref(false)

    const ofTabsNavigationHeaderShowNextNavigation = computed(() => {
      return (
        props.scrolling &&
        variant.value !== 'osx' &&
        !overflowButtonEnabled.value
      )
    })

    const ofTabsNavigationHeaderShowPreviousNavigation = computed(() => {
      return (
        props.scrolling &&
        variant.value !== 'osx' &&
        !overflowButtonEnabled.value
      )
    })

    const showNavigation = computed(() => {
      return (
        props.scrolling &&
        variant.value !== 'osx' &&
        !overflowButtonEnabled.value
      )
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

          if (item.subMenuItems) {
            for (const subIndex in item.subMenuItems) {
              item.subMenuItems[subIndex].visible = true
              item.subMenuItems[subIndex].key = parseInt(subIndex)
              item.subMenuItems[subIndex].parentKey = item.key
            }
          }
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
      targetPos.value.observe(ofTabsHeader.value)
      init()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', hideOutsideTabs)
    })

    const init = function () {
      nextTick(() => {
        setTabsWidth()
        hideOutsideTabs()
        repositionLine()
        repositionTabs()
      })
    }

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
      if (variant.value !== 'osx' && tabs.value) {
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
      if (overflowButtonEnabled.value && !showNavigation.value) {
        tabsWidth.value = []

        for (let item of ofTabsHeader.value.childNodes) {
          if (!item.clientWidth) continue

          tabsWidth.value.push(item.clientWidth)
        }
      }
    }

    const hideOutsideTabs = function () {
      if (overflowButtonEnabled.value && !showNavigation.value) {
        closeOverflowPopup()

        const selectedTab: Tab | undefined = getTab(selectedTabKey.value)
        let index = 0
        let selectedIndex = -1
        let tabsIndexes: Array<number> = []
        showOverflowButton.value = true

        //Make all tabs invisible exclude selected
        for (const item of items.value.items) {
          if (selectedTab?.key === item['key']) {
            updateTabVisibility(index, true)
            selectedIndex = index
            //don't make sense to update overflow button (key == -1)
          } else if (item['key'] !== -1) {
            updateTabVisibility(index, false)
          }

          if (index !== selectedIndex && item['key'] !== -1) {
            tabsIndexes.push(index)
          }

          index++
        }

        nextTick(() => {
          adjustTabsVisibility(tabsIndexes)
        })
      }
    }

    const adjustTabsVisibility = function (tabsIndexes: Array<number>) {
      const outerWidth = ofTabsHeader.value.clientWidth
      let tabsWidth = 0
      let hasInvisibleTabs = false

      //Make tabs visible until widths sum < main container's width
      for (const index of tabsIndexes) {
        updateTabVisibility(index, true)
        tabsWidth = calcVisibleTabsWidth()

        if (tabsWidth > outerWidth) {
          hasInvisibleTabs = true
          updateTabVisibility(index, false)
          break
        }
      }

      showOverflowButton.value = hasInvisibleTabs

      nextTick(() => {
        repositionLine()
      })
    }

    const calcVisibleTabsWidth = function (): number {
      let width = 0

      const overflowButton = tabs.value.querySelector(
        '.of-tab-header-item.overflow-button'
      )

      width += overflowButton?.clientWidth ?? 0

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

    const getTab = function (key: Number): Tab | undefined {
      for (const tab of tabsList.value) {
        if (tab.key === key) return tab
      }

      for (const tab of invisibleTabsList.value) {
        if (tab.key === key) return tab
      }

      return undefined
    }

    const selectTab = function (key: number, emitSelectEvent = true) {
      const selectedTab: Tab | undefined = getTab(key)

      if (selectedTab && selectedTab.overflowButton) {
        closeSubMenu()
        switchOverflowPopupVisibility()
      } else if (selectedTab) {
        context.emit('update:modelValue', key)
        if (emitSelectEvent) context.emit('select-tab', selectedTab)

        nextTick(() => {
          closeSubMenu()
          closeOverflowPopup()
          repositionLine()
          repositionTabs()
        })
      }
    }

    const selectInvisibleTab = function (key: number) {
      const selectedTab: Tab | undefined = getTab(key)

      if (selectedTab) {
        context.emit('update:modelValue', key)
        context.emit('select-tab', selectedTab)

        nextTick(() => {
          hideOutsideTabs()
        })
      }

      closeOverflowPopup()
    }

    const outsideTabsOpened = ref(false)

    const overflowButtonEl = ref()
    const switchOverflowPopupVisibility = () => {
      overflowButtonEl.value = tabs.value?.querySelector(
        '.of-tab-header-item.overflow-button'
      )
      outsideTabsOpened.value = !outsideTabsOpened.value
    }

    const closeOverflowPopup = () => {
      outsideTabsOpened.value = false
    }

    //SubMenu
    const showSubMenu = computed(() => {
      return props.submenu
    })

    const subMenuOpened = ref(false)
    const subMenuOuter = ref()
    const subMenuTabsList: Ref<Tab[]> = ref([])
    const subMenuTimerId = ref()

    const openSubMenu = (key: number, _evt?: MouseEvent) => {
      if (!showSubMenu.value) return false

      if (key !== -1 && variant.value !== 'osx') {
        closeOverflowPopup()
        subMenuClearTimeout()
        const tab: Tab | undefined = getTab(key)

        if (tab && tab.subMenuItems) {
          subMenuTimerId.value = window.setTimeout(
            () => {
              subMenuTabsList.value = tab.subMenuItems ?? []
              subMenuOuter.value = _evt?.target
              subMenuOpened.value = true
            },
            subMenuOpened.value ? 0 : 500
          )
        } else {
          closeSubMenu()
        }
      } else {
        closeSubMenu()
      }

      return false
    }

    const closeSubMenu = () => {
      subMenuOpened.value = false
    }

    const subMenuLeave = () => {
      if (!showSubMenu.value) return false

      subMenuClearTimeout()
      subMenuTimerId.value = window.setTimeout(() => {
        closeSubMenu()
      }, 500)
    }

    const subMenuClearTimeout = () => {
      clearTimeout(subMenuTimerId.value)
    }

    const selectSubMenuTab = function (tab: Tab) {
      if (typeof tab.parentKey !== 'undefined') {
        selectTab(tab.parentKey, false)
        context.emit('select-tab', tab)
      }
    }

    return {
      tabsList,
      selectedTabKey,
      overflowButtonEl,

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

      showSubMenu,
      subMenuTabsList,
      subMenuOpened,
      subMenuOuter,
      openSubMenu,
      closeSubMenu,
      selectSubMenuTab,
      subMenuLeave,
      subMenuClearTimeout,
    }
  },
})
</script>
