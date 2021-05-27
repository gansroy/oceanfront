<template>
  <div class="container">
    <h1>Pagination Controller</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <of-pagination
          v-model="page"
          variant="standard"
          :per-page="perPage"
          :total-pages="total"
          :start-record="startRecord"
          @select-page="selectPage"
          @update-offset="updateOffset"
          custom-offset-popup
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  Paginator,
  calcStartRecord,
  calcPageValue,
} from 'oceanfront/src/lib/paginator'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-pagination
  :model-value="1"
  variant="standard"
  :total-pages="20"
  custom-offset-popup
/>
`
    const total = 20
    const perPage = ref(20)
    const page = ref(1)
    const startRecord = ref(1)

    const selectPage = function (paginator: Paginator) {
      console.log('Page selected')
      console.log(paginator)
      startRecord.value = calcStartRecord(paginator.page, paginator.perPage)
    }

    const updateOffset = function (paginator: Paginator) {
      console.log('Offset Params updated')
      console.log(paginator)
      startRecord.value = paginator.startRecord
      page.value = calcPageValue(startRecord.value, paginator.perPage)
    }

    return {
      sampleCode,
      total,
      page,
      perPage,
      startRecord,
      selectPage,
      updateOffset,
    }
  },
})
</script>
