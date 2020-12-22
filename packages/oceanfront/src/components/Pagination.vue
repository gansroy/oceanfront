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
            <of-icon
              :name="'nav-first'"
              :title="'Go to first'"
              size="sm"
            />
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
            <of-icon
              :name="'nav-last'"
              :title="'Go to last'"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed
} from 'vue'

export default defineComponent({
  name: 'OfPagination',
  props: {
    value: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalVisible: Number,
    variant: String,
  },
  emits: ['update:value', 'select-page'],
  setup(props, context: SetupContext) {
    let page: any = computed(() => props.value || 1)
    const totalVisible: any = computed(() => props.totalVisible || 5)

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
        if (end > props.totalPages) 
          end = props.totalPages
        return end
      }
    }

    const pages =  computed(() => {
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
      context.emit('select-page', page)
    }

    const goToFirst = function () {
      onSelectPage(1)
    }

    const goToLast = function () {
      onSelectPage(props.totalPages)
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
    }
  },
})
</script>
