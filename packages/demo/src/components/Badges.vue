<template>
    
  <div class="container">
    <h1>Badges</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>States</h2>
    <of-badge v-for="status in statusList" :status="status" :key="status">{{status}}</of-badge>
    <h2>Size</h2>
    <of-badge size="small"  status="warning">small</of-badge>
    <of-badge size="normal" status="warning">normal</of-badge>
    <of-badge size="large" status="warning">large</of-badge>
    <h2>Compact</h2>
    <of-badge size="small"  status="warning"><of-icon name="print" />small</of-badge>
    <of-badge compact size="small"  status="warning"><of-icon name="print" />small compact</of-badge>
    <of-badge  size="normal" status="warning"><of-icon name="print" />normal</of-badge>
    <of-badge compact size="normal" status="warning"><of-icon name="print" />normal compact</of-badge>
    <of-badge size="large" status="warning"><of-icon name="print" />large</of-badge>
    <of-badge compact size="large" status="warning"><of-icon name="print" />large compact</of-badge>
    <h2>Icons</h2>
    <of-badge v-for="status in statusList" :status="status" :key="status"><of-icon name="print" />{{status}}</of-badge>
    <h2>Circular</h2>
    <of-badge v-for="status in statusList" circular :status="status" :key="status">{{status}}</of-badge>
    <br>
    <of-badge v-for="status in statusList" circular :status="status" :key="status"><of-icon name="print" />{{status}}</of-badge>
    <h2>Icon only</h2>
    <of-badge icon size="small"  status="warning"><of-icon name="print" /></of-badge>
    <of-badge icon size="normal" status="warning"><of-icon name="print" /></of-badge>
    <of-badge icon size="large" status="warning"><of-icon name="print" /></of-badge>
    <of-badge icon circular size="small"  status="warning"><of-icon name="print" /></of-badge>
    <of-badge icon circular size="normal" status="warning"><of-icon name="print" /></of-badge>
    <of-badge icon circular size="large" status="warning"><of-icon name="print" /></of-badge>
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
<of-badge status="info" size="small">Info</of-badge>
<of-badge status="info" size="large">Info</of-badge>
<of-badge status="info"><of-icon name="print" />Info</of-badge>
<of-badge circular status="info">Info</of-badge>
<of-badge compact circular status="info"><of-icon name="print" /></of-badge>
<of-badge icon status="info"><of-icon name="print" /></of-badge>
<of-badge icon circular status="info"><of-icon name="print" /></of-badge>
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
