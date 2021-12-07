<template>
  <div class="container">
    <h1>Pagination Controller</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <of-field
        v-model="params.density"
        label="Density"
        type="select"
        :items="densityOptions"
      />
    </div>
    <div class="demo-fields">
      <div class="row form-row">
        <of-pagination
          v-model="page"
          variant="outlined"
          :density="params.density"
          :per-page="perPage"
          :total-pages="total"
          :start-record="startRecord"
          @select-page="selectPage"
          @update-offset="updateOffset"
          custom-offset-popup
        />
      </div>
      <div class="row form-row">
        <of-pagination
          v-model="page"
          variant="solid"
          :density="params.density"
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
import { defineComponent, ref, reactive } from 'vue'
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
  variant="outlined"
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

    const densityOptions = ['default', '0', '1', '2', '3']
    const params = reactive({
      density: 'default',
    })
    return {
      sampleCode,
      total,
      page,
      perPage,
      startRecord,
      densityOptions,
      params,
      selectPage,
      updateOffset,
    }
  },
})
</script>
