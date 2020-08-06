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
              'is-active': tab.props.name === selectedTabName,
              'of-tab-header-item': true,
            }"
          >
            {{ tab.props.name }}
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
  SetupContext,
} from 'vue'

export default defineComponent({
  name: 'OfTabs',
  setup(props, context: SetupContext) {
    let showNavigation = ref(false)
    let tabs: any = ref()
    let tabsList: any = ref([])
    let selectedTab: any = ref()
    let selectedTabName: any = ref()
    let ofTabsHeader: any = ref()

    let ofTabsNavigationHeaderShowNextNavigation = ref(true)
    let ofTabsNavigationHeaderShowPreviousNavigation = ref(true)

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
      let tabsListDefault: any = context.slots.default
      tabsList.value = tabsListDefault()
      selectedTab.value = tabsList.value[0]
      selectedTabName.value = tabsList.value[0].props.name
      setTimeout(() => {
        repositionLine()
        checkNavigation()
      })
      ofTabsHeader.value.onscroll = function () {
        handleOfTabsHeaderScrollIcons()
      }
      handleOfTabsHeaderScrollIcons()
    })

    let navigateHeader = function (value: string) {
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
    let repositionLine = function () {
      let currenTabHeaderItem: any = tabs.value.querySelector(
        '.of-tab-header-item.is-active'
      )
      let tabLine: HTMLDivElement = tabs.value.querySelector('.of-tabs-line')
      tabLine.style.width = currenTabHeaderItem?.clientWidth + 'px'
      tabLine.style.left = currenTabHeaderItem?.offsetLeft + 'px'
    }

    let selectTab = function (newTab: any) {
      if (selectedTab.value !== newTab.props.name) {
        selectedTab.value = null
        selectedTabName.value = null
        setTimeout(() => {
          selectedTabName.value = newTab.props.name
          selectedTab.value = newTab
          setTimeout(() => {
            repositionLine()
          })
        })
      }
      checkNavigation()
    }

    let checkNavigation = function () {
      if (ofTabsHeader.value.clientWidth < ofTabsHeader.value.scrollWidth) {
        showNavigation.value = true
      } else {
        showNavigation.value = false
      }
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
