<template>
  <div class="container">
    <h1>Text Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <div class="column">
          <of-text-field
            v-bind="textField"
            v-model:value="textValue"
            variant="basic"
          />
        </div>
        <div class="column">
          <of-text-field
            multiline
            v-bind="textAreaField"
            rows="3"
            variant="basic"
          />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-text-field
            v-bind="textField"
            v-model:value="textValue"
            variant="outlined"
          />
        </div>
        <div class="column">
          <of-text-field
            multiline
            v-bind="textAreaField"
            rows="3"
            variant="outlined"
          />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-text-field
            v-bind="textField"
            v-model:value="textValue"
            variant="filled"
          />
        </div>
        <div class="column">
          <of-text-field
            multiline
            v-bind="textAreaField"
            rows="3"
            variant="filled"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row demo-row">
      <div class="demo-inline">
        <of-text-field
          class="of--small"
          value="Small text input"
          style="width: 10em"
        />
      </div>
      <div class="demo-inline">
        <of-text-field value="Normal text input" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field
          class="of--large"
          value="Large text input"
          style="width: 10em"
        />
      </div>
      <div class="demo-inline">
        <of-text-field readonly value="Read-only text" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field disabled value="Disabled text" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field placeholder="Placeholder" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field
          class="of--density-0"
          style="width: 10em"
          value="Compact"
        />
      </div>
      <div class="demo-inline">
        <of-text-field
          placeholder="Password"
          input-type="password"
          variant="basic"
        />
      </div>
    </div>
    <div class="row demo-row">
      <div class="demo-inline">
        <of-text-field
          multiline
          class="of--small"
          style="width: 10em"
          value="Small text area"
        />
      </div>
      <div class="demo-inline">
        <of-text-field multiline style="width: 10em" value="Normal text area" />
      </div>
      <div class="demo-inline">
        <of-text-field
          multiline
          class="of--large"
          style="width: 10em"
          value="Large text area"
        />
      </div>
      <div class="demo-inline">
        <of-text-field
          multiline
          readonly
          style="width: 10em"
          value="Read-only text area"
        />
      </div>
      <div class="demo-inline">
        <of-text-field
          multiline
          disabled
          style="width: 10em"
          value="Disabled text area"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

const textField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Text Input',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
}

const textAreaField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Textarea Input',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
}

export default defineComponent({
  /*async */ setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    const sampleCode = `
<of-text-field
  label="Field Label"
  v-model:value="fieldValue"
  variant="filled"
/>`
    return {
      change,
      sampleCode,
      textField,
      textAreaField,
      textValue,
    }
  },
})
</script>
