<template>
  <div class="of-demo-field">
    <div class="content">
      <div class="field" v-for="(opts, idx) in allOptions" :key="idx">
        <slot v-bind="opts"></slot>
      </div>
    </div>
    <div class="options">
      <of-field
        v-model="options.frame"
        label="Frame Type"
        type="select"
        :items="frameOptions"
        :disabled="options.all"
      />
      <of-field
        v-model="options.variant"
        label="Variant Type"
        type="select"
        :items="variantOptions"
        :disabled="options.all"
      />
      <of-field v-model="options.all" label="Compare All" type="toggle" />
      <slot name="options"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const options = reactive({
      all: false,
      frame: 'normal',
      variant: 'normal',
    })
    const frameOptions = ['none', 'normal', 'block']
    const variantOptions = ['normal', 'filled']
    const allOptions = computed(() => {
      if (!options.all) {
        return [{ frame: options.frame, variant: options.variant }]
      } else {
        let ret = []
        for (const frame of frameOptions) {
          for (const variant of variantOptions) {
            ret.push({ frame, variant })
          }
        }
        return ret
      }
    })
    return {
      allOptions,
      frameOptions,
      variantOptions,
      options,
    }
  },
})
</script>

<style lang="scss">
.of-demo-field {
  border: 2px solid #888;
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  margin: 1em 0;
  .content {
    background: #e2f1fa;
    display: flex;
    flex: auto;
    flex-flow: column wrap;
    justify-content: center;
    overflow: hidden;
    padding: 0.5em 0;
    .field {
      display: flex;
      justify-content: center;
      padding: 0.5em;
      width: 100%;
    }
  }
  .options {
    background: #ccc;
    flex: 0 0 16em;
    padding: 1em;
    overflow: hidden;
  }
}
</style>
