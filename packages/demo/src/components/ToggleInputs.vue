<template>
  <div class="container">
    <h1>Toggle Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <of-toggle v-bind="testCheckField" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <of-toggle v-bind="testCheckField" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <of-toggle v-bind="testCheckField" variant="filled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

const testCheckField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  labelPosition: 'input'
}

export default defineComponent({
  setup() {
    const sampleCode = `
<of-toggle
  label="Field Label"
  v-model="fieldValue"
  variant="filled"
/>`
    return { sampleCode, testCheckField }
  }
})
</script>
