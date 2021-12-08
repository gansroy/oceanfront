<template>
  <transition>
    <div class="of-pagination" ref="pagination">
      <div class="of-pagination-header" ref="ofPaginationHeader">
        <span class="of-buttonset">
          <of-button
            v-if="showGoToFirst"
            icon="page first"
            :variant="variant"
            :density="density"
            @click="goToFirst()"
          ></of-button>
          <of-button
            v-for="item in pages"
            :key="item"
            :class="{
              'is-active': page === item,
            }"
            :variant="variant"
            :density="density"
            @click="onSelectPage(item)"
          >
            {{ item }}
          </of-button>
          <of-button
            v-if="showGoToLast"
            icon="page last"
            :variant="variant"
            :density="density"
            @click="goToLast()"
          >
          </of-button>
          <of-button
            v-if="showCustomOffsetPopup"
            id="offsetPopupOuter"
            icon="bullet down"
            :variant="variant"
            :density="density"
            @click="openOffsetPopup"
          >
          </of-button>
        </span>
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
            <div class="container" style="background: #f0f0f0">
              <div class="row">
                <div class="column">
                  <of-text-field
                    v-bind="startAtField"
                    v-model.number="startAtValue"
                    input-type="number"
                    variant="basic"
                  />
                </div>
                <div class="column">
                  <of-text-field
                    v-bind="perPageField"
                    v-model.number="perPageValue"
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
import {
  defineComponent,
  SetupContext,
  computed,
  ref,
  Ref,
  watchEffect,
  watch,
} from 'vue'
import { OfOverlay } from './Overlay'
import { Paginator } from '../lib/paginator'

export default defineComponent({
  name: 'OfPagination',
  components: { OfOverlay },
  props: {
    modelValue: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalVisible: Number,
    variant: String,
    density: { type: [String, Number], default: null },
    customOffsetPopup: [Boolean, String],
    startRecord: Number,
    perPage: Number,
  },
  emits: ['update:modelValue', 'select-page', 'update-offset'],
  setup(props, context: SetupContext) {
    let page: Ref<number> = computed(() => props.modelValue || 1)
    const totalVisible: Ref<number> = computed(() => props.totalVisible || 5)

    const variant = computed(() => props.variant || 'solid')
    const density = computed(() => props.density || 'default')

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
      closeOffsetPopup()
      context.emit('update:modelValue', page)

      const paginator: Paginator = {
        page: page,
        startRecord: startAtValue.value,
        perPage: perPageValue.value,
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
    const startAtValue: Ref<number> = ref(props.startRecord || 1)

    watch(
      () => props.startRecord,
      (val) => {
        startAtValue.value = val as number
      }
    )

    const perPageValue: Ref<number> = ref(props.perPage || 20)

    watch(
      () => props.perPage,
      (val) => {
        perPageValue.value = val as number
      }
    )

    watchEffect(() => {
      if (startAtValue.value <= 0) startAtValue.value = 1
      if (perPageValue.value <= 0) perPageValue.value = 1
    })

    const showCustomOffsetPopup = computed(
      () => props.customOffsetPopup || false
    )
    const offsetPopupOpened = ref(false)
    const offsetPopupOuter: Ref<any> = ref(null)

    const openOffsetPopup = (e: Event) => {
      offsetPopupOuter.value = e.target
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
      closeOffsetPopup()
      const paginator: Paginator = {
        page: page.value,
        startRecord: startAtValue.value,
        perPage: perPageValue.value,
      }
      context.emit('update-offset', paginator)
    }

    return {
      variant,
      density,
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
      startAtValue,
      startAtField,
      perPageField,
      perPageValue,
      pageItems,
      updateOffsetParams,
    }
  },
})
</script>
