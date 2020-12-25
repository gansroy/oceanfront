<template>
  <div class="container">
    <h1>Pagination Controller</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <of-pagination
      v-model:value="page"
      variant="standard"
      :per-page="perPage"
      :total-pages="total"    
      :start-record="startRecord"
      @select-page="selectPage" 
      @update-offset="updateOffset" 
      custom-offset-popup 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Paginator } from 'oceanfront/src/lib/paginator'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-pagination
  v-model:value="1"
  variant="standard"
  :total-pages="20"
  custom-offset-popup
/>
`
    const total = 20;
    const perPage = 20;
    const page = ref(1)
    const startRecord = ref(1)

    const selectPage = function(paginator: Paginator) {
      console.log("Page selected")
      console.log(paginator)    
      startRecord.value = ((paginator.perPage * paginator.page) - paginator.perPage) + 1
    }

    const updateOffset = function(paginator: Paginator) {
      console.log("Offset Params updated")
      console.log(paginator)
      startRecord.value = paginator.startRecord
      page.value = Math.floor(( (startRecord.value - 1) + paginator.perPage ) / paginator.perPage)
    }   

    return { 
      sampleCode,
      total,
      page,
      perPage,
      startRecord,
      selectPage,
      updateOffset
    }
  },
})
</script>
