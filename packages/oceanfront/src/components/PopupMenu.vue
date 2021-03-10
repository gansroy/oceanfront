<template>
  <of-overlay
    :active="shown"
    :capture="false"
    :shade="false"
    :target="outer"
  >
    <div
      :key="item"
      v-for="item in items"
    >
      {{ item }}
    </div>
  </of-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OfPopoupMenu',  
  props: {
    shown: Boolean,
    outer: Object,
    items: { type: Array, default: () => [] },
  },
})
</script>