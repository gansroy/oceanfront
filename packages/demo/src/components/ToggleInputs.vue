<template>
  <div class="container">
    <h1>Toggle Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <div class="column md-8">
        <of-field type="toggle" :format="testCheckField" variant="basic" />
        <of-toggle-field
          v-bind="testCheckField"
          label-position="field"
          variant="basic"
          input-type="switch"
        />
        <of-toggle-field
          v-bind="testCheckField"
          label-position="input"
          variant="basic"
        />

        <br /><br />
        <of-toggle-field v-bind="testCheckField" variant="outlined" />
        <br /><br />
        <of-toggle-field v-bind="testCheckField" variant="filled" />
      </div>
      <!-- div class="column md-4">
        <form>
          <of-toggle-field
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="basic"
            value="1"
          />
          <br /><br />
          <of-toggle-field
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="outlined"
            value="2"
          />
          <br /><br />
          <of-toggle-field
            v-bind="testCheckField"
            name="testr"
            type="radio"
            variant="filled"
            value="3"
          />
        </form>
      </div -->
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
  readonly: false,
  required: true,
  labelPosition: 'both',
  inputLabel: 'Input Label',
}

export default defineComponent({
  setup() {
    const sampleCode = `
<of-toggle-field
  label="Field Label"
  v-model:checked="fieldChecked"
  variant="filled"
/>`
    return { sampleCode, testCheckField }
  },
})
</script>
