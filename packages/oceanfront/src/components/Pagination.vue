<template>
  <transition>
    <div class="of-pagination" ref="pagination">
      <div :class="cls">
        <div class="of-pagination-header" ref="ofPaginationHeader">
          <div
            v-if="showGoToFirst"
            class="of-pagination-header-item"
            @click="goToFirst()"
          >
            <of-icon :name="'nav-first'" :title="'Go to first'" size="sm" />
          </div>
          <div
            :key="item"
            @click="onSelectPage(item)"
            v-for="item in pages"
            :class="{
              'is-active': page === item,
              'of-pagination-header-item': true,
            }"
          >
            {{ item }}
          </div>
          <div
            v-if="showGoToLast"
            class="of-pagination-header-item"
            @click="goToLast()"
          >
            <of-icon :name="'nav-last'" :title="'Go to last'" size="sm" />
          </div>
          <div
            id="offsetPopupOuter"
            v-if="showCustomOffsetPopup"
            class="of-pagination-header-item"
            @click="openOffsetPopup()"
          >
            <of-icon
              :name="'triangle-down'"
              :title="'Open settings'"
              size="sm"
            />
          </div>
        </div>
      </div>

      <of-overlay
        :active="offsetPopupOpened"
        :capture="false"
        :shade="false"
        :target="offsetPopupOuter"
        @blur="closeOffsetPopup()"
      >
        <slot name="custom-offset-popup" v-if="showCustomOffsetPopup">
          <form method="POST" action="#" @submit.prevent="updateOffsetParams()">
            <div class="container" style="background: #f0f0f0; width: 250px">
              <div class="row">
                <div class="column">
                  <of-text-field
                    v-bind="startAtField"
                    v-model:value.number="startAt"
                    input-type="number"
                    variant="basic"
                  />
                </div>
                <div class="column">
                  <of-text-field
                    v-bind="perPageField"
                    v-model:value.number="perPage"
                    input-type="number"
                    variant="basic"
                  />
                </div>
              </div>
              <div class="row">
                <div class="column">
                  <button type="button" @click="updateOffsetParams()">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </form>
        </slot>
      </of-overlay>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, ref, Ref, watchEffect } from 'vue'
import OfOverlay from './Overlay.vue'
import { Paginator } from '../lib/paginator'

export default defineComponent({
  name: 'OfPagination',
  components: { OfOverlay },
  props: {
    value: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalVisible: Number,
    variant: String,
    customOffsetPopup: Boolean,
    startRecord: Number,
    perPage: Number,
  },
  emits: ['update:value', 'select-page'],
  setup(props, context: SetupContext) {
    let page: Ref<number> = computed(() => props.value || 1)
    const totalVisible: Ref<number> = computed(() => props.totalVisible || 5)

    const variant = computed(() => props.variant || 'standard')
    const cls = 'of--variant-' + variant.value

    const getStartPageNum = function (): number {
      if (props.totalPages <= totalVisible.value) {
        return 1
      } else {
        let itemsBefore = 2
        if (totalVisible.value <= itemsBefore) {
          itemsBefore = 1
        }
        let startPage = page.value - itemsBefore
        return Math.max(1, startPage)
      }
    }

    const getEndPageNum = function (): number {
      if (props.totalPages <= totalVisible.value) {
        return props.totalPages
      } else {
        const start = getStartPageNum()
        let end = start + totalVisible.value - 1
        if (end > props.totalPages) end = props.totalPages
        return end
      }
    }

    const pages = computed(() => {
      const start = getStartPageNum()
      const end = getEndPageNum()
      let result = []

      for (let i = start; i <= end; i++) {
        result.push(i)
      }

      return result
    })

    const showGoToFirst = computed(() => {
      if (props.totalPages <= totalVisible.value) {
        return false
      } else {
        const start = getStartPageNum()
        return start > 1
      }
    })

    const showGoToLast = computed(() => {
      if (props.totalPages <= totalVisible.value) {
        return false
      } else {
        const end = getEndPageNum()
        return end < props.totalPages
      }
    })

    const onSelectPage = function (page: number) {
      context.emit('update:value', page)
      
      const paginator: Paginator = {
        page: page,
        startRecord: startAt.value,
        perPage: perPage.value,
      }
      context.emit('select-page', paginator)
    }

    const goToFirst = function () {
      onSelectPage(1)
    }

    const goToLast = function () {
      onSelectPage(props.totalPages)
    }

    //Custom Offset Popup
    const startAt: Ref<number> = ref(props.startRecord || 1)
    const perPage: Ref<number> = ref(props.perPage || 20)
    watchEffect(() => {
      if (startAt.value <= 0)
        startAt.value = 1
      if (perPage.value <= 0)
        perPage.value = 1
    })

    const showCustomOffsetPopup = computed(
      () => props.customOffsetPopup || false
    )
    const offsetPopupOpened = ref(false)
    const offsetPopupOuter = ref()

    const openOffsetPopup = () => {
      offsetPopupOuter.value = '#offsetPopupOuter'
      offsetPopupOpened.value = true
    }

    const closeOffsetPopup = () => {
      offsetPopupOpened.value = false
    }

    const startAtField = {
      hidden: false,
      label: 'Start At',
      readOnly: false,
      size: 10,
      class: 'of--small',
    }

    //TODO: replace number text input with select for per page selection
    const perPageField = {
      hidden: false,
      label: 'Per Page',
      readOnly: false,
      size: 10,
      class: 'of--small',
    }

    const pageItems = computed(() => {
      const pages = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
      let items = []

      for (const page of pages) {
        items.push({
          text: page,
          value: page,
          disabled: false,
        })
      }

      return items
    })

    const updateOffsetParams = function () {
      onSelectPage(1)
      closeOffsetPopup()
    }

    return {
      cls,
      page,
      pages,

      showGoToFirst,
      showGoToLast,

      onSelectPage,
      goToFirst,
      goToLast,

      showCustomOffsetPopup,
      offsetPopupOpened,
      offsetPopupOuter,
      openOffsetPopup,
      closeOffsetPopup,
      startAt,
      startAtField,
      perPage,
      perPageField,
      pageItems,
      updateOffsetParams,
    }
  },
})
</script>
