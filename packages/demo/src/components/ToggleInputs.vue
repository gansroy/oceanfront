<template>
  <div class="container">
    <h1>Toggle Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <div class="column md-4">
        <of-toggle v-bind="testCheckField" variant="basic" />
        <of-field type="toggle" v-bind="testCheckField" variant="basic" />
        <br /><br />
        <of-toggle v-bind="testCheckField" variant="outlined" />
        <br /><br />
        <of-toggle v-bind="testCheckField" variant="filled" />
      </div>
      <div class="column md-4">
        <form>
          <of-toggle
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="basic"
            value="1"
          />
          <br /><br />
          <of-toggle
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="outlined"
            value="2"
          />
          <br /><br />
          <of-toggle
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="filled"
            value="3"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const testCheckField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  labelPosition: 'input',
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
  },
})
</script>
