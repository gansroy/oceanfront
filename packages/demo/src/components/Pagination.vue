<template>
  <div class="container">
    <h1>Pagination Controller</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <of-pagination
      v-model:value="page"
      variant="standard"
      :total-pages="total"    
      @select-page="selectPage" 
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
    const page = ref(1)

    const selectPage = function(paginator: Paginator) {
      console.log(paginator)
    }    

    return { 
      sampleCode,
      total,
      page,
      selectPage
    }
  },
})
</script>
