<template>
  <div class="container">
    <h1>Color Picker Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />

    <of-demo-field>
      <template #default="props">
        <of-field
          type="color"
          label="Color Field"
          v-model="colorValue"
          v-bind="{
            ...props,
            format: {
              inputType: customProps.colorMode,
            },
          }"
        />
      </template>
      <template #options>
        <of-field
          type="select"
          label="Color Mode"
          :items="colorModeOptions"
          v-model="customProps.colorMode"
        />
      </template>
    </of-demo-field>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

const colorValue = ref('hsl(240, 33%, 72%)')
const colorModeOptions = ['hex', 'hsl', 'rgb']
const customProps = ref({ colorMode: 'hex' })

export default defineComponent({
  setup() {
    const sampleCode = `
<of-color-field
  label="Color"
  v-model="colorValue"
/>`

    return { sampleCode, colorModeOptions, colorValue, customProps }
  },
})
</script>
