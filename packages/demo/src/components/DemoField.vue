<template>
  <div class="of-demo-field">
    <div class="content">
      <div class="field" v-for="(opts, idx) in allParams" :key="idx">
        <slot v-bind="opts"></slot>
      </div>
    </div>
    <div class="options">
      <div class="options-fields">
        <of-field
          v-model="params.variant"
          label="Variant Type"
          type="select"
          :items="variantOptions"
        />
        <of-field
          v-model="params.labelPosition"
          label="Label Position"
          type="select"
          :items="labelPosOptions"
        />
        <of-field
          v-model="params.density"
          label="Density"
          type="select"
          :items="densityOptions"
        />
      </div>
      <hr />
      <div class="options-fields">
        <of-field
          v-model="params.mode"
          label="Mode"
          type="select"
          :items="modeOptions"
        />
        <slot name="options"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const params = reactive({
      density: 'default',
      labelPosition: 'default',
      mode: 'editable',
      variant: 'compare',
    })
    const densityOptions = ['default', '0', '1', '2', '3']
    const labelPosOptions = ['default', 'none', 'frame', 'left', 'right', 'top']
    const modeOptions = ['editable', 'locked', 'readonly', 'disabled', 'fixed']
    const variantOptions = ['default', 'outlined', 'filled', 'compare']
    const allParams = computed(() => {
      let p: any = { ...params };
      if (p.variant === 'default')
        delete p.variant;
      if (p.variant === 'compare') {
        return [{ ...p, variant: "outlined" }, { ...p, variant: "filled" }]
      } else {
        return [p]
      }
    })
    return {
      allParams,
      densityOptions,
      labelPosOptions,
      modeOptions,
      variantOptions,
      params,
    }
  },
})
</script>

<style lang="scss">
.of-demo-field {
  border: 2px solid var(--of-pal-primary-72);
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  margin: 1em 0;
  .content {
    background: var(--of-pal-primary-90);
    box-sizing: border-box;
    display: flex;
    flex: auto;
    flex-flow: column wrap;
    justify-content: center;
    overflow: hidden;
    padding: 0.25em 0.5em;
    .field {
      box-sizing: border-box;
      display: flex;
      flex: 0 1 auto;
      justify-content: center;
      padding: 0.75em;
      width: 100%;
    }
  }
  .options {
    background: var(--of-pal-primary-92);
    flex: 0 0 16em;
    padding: 1em;
    overflow: hidden;
  }
  .options-fields {
    display: flex;
    flex-flow: column nowrap;
    grid-gap: 0.5em;
  }
  hr {
    padding: 0;
    margin: 0.75em;
  }
}
</style>
