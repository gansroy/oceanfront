<template>
  <div class="container">
    <h1>Toggle Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <div class="column">
          <of-field type="toggle" :format="testCheckField" frame="none" />
        </div>
        <div class="column">
          <of-toggle-field v-bind="testSwitchField" frame="none" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-field
            type="toggle"
            :format="testCheckField"
            frame="none"
            variant="filled"
          />
        </div>
        <div class="column">
          <of-toggle-field
            v-bind="testSwitchField"
            frame="none"
            variant="filled"
          />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-toggle-field v-bind="testCheckField" />
        </div>
        <div class="column">
          <of-toggle-field v-bind="testSwitchField" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-toggle-field v-bind="testCheckField" variant="filled" />
        </div>
        <div class="column">
          <of-toggle-field v-bind="testSwitchField" variant="filled" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-toggle-field v-bind="testCheckField" frame="block" />
        </div>
        <div class="column">
          <of-toggle-field v-bind="testSwitchField" frame="block" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-toggle-field
            v-bind="testCheckField"
            frame="block"
            variant="filled"
          />
        </div>
        <div class="column">
          <of-toggle-field
            v-bind="testSwitchField"
            frame="block"
            variant="filled"
          />
        </div>
      </div>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const testCheckField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Checkbox Field',
  placeholder: 'placeholder',
  readonly: false,
  required: true,
  labelPosition: 'both',
  inputLabel: 'Input Label',
}

const testSwitchField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Switch field',
  placeholder: 'placeholder',
  readonly: false,
  required: true,
  labelPosition: 'both',
  inputLabel: 'Input Label',
  inputType: 'switch',
}

export default defineComponent({
  setup() {
    const sampleCode = `
<of-toggle-field
  label="Field Label"
  v-model:checked="fieldChecked"
  variant="filled"
/>`
    return { sampleCode, testCheckField, testSwitchField }
  },
})
</script>
