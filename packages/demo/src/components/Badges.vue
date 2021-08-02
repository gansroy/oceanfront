<template>
    
  <div class="container">
    <h1>Badges</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>States</h2>
    <of-badge v-for="status in statusList" :status="status" :key="status">{{status}}</of-badge>
  </div>
</template>

<script lang="ts">
const statusList = [
    "success", "final", "info", "draft",
    "pending", "deferred", "special", 
    "error", "alert", "warning" ,
    "danger", "closed", "dead", "invert"
]

import { defineComponent } from 'vue'

    const sampleCode = `
<!-- State -->
<of-badge status="info">Info</of-badge>
`

export default defineComponent({
    setup() {
        return {
            statusList,
            sampleCode,
        }
    },
})
</script>
