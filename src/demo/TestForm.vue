<template>
  <div class="container theme-base">
    <div class="row">
      <div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <field :state="testField" class="field-basic" />
          </div>
          <br />
          <div class="form-cell">
            <field :state="testField2" class="field-outlined" />
          </div>
          <br />
          <div class="form-cell">
            <field :state="testField3" class="field-filled" />
          </div>
          <br />
          <button class="input-button" @click="change">Update</button>
        </div>
      </div>
      <div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <field :state="testField" type="textarea" class="field-basic" />
          </div>
          <br />
          <div class="form-cell">
            <field :state="testField2" type="textarea" class="field-outlined" />
          </div>
          <br />
          <div class="form-cell">
            <field :state="testField3" type="textarea" class="field-filled" />
          </div>
        </div>
      </div>
      <div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <field
              :state="testCheckField"
              type="checkbox"
              class="field-basic"
            />
          </div>
          <br />
          <div class="form-cell">
            <field
              :state="testCheckField2"
              type="checkbox"
              class="field-outlined"
            />
          </div>
          <br />
          <div class="form-cell">
            <field
              :state="testCheckField3"
              type="checkbox"
              class="field-filled"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onErrorCaptured,
  ref,
  defineComponent,
  SetupContext,
  reactive,
  computed
} from 'vue'
import Field from '../components/Field.vue'
import { fieldState } from '../lib/field'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const testField = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: '62.14'
})

const testField2 = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: '62.14'
})

const testField3 = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: '62.14'
})

const testCheckField = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: null,
  labelPosition: 'input'
})

const testCheckField2 = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: 1,
  labelPosition: 'input'
})

const testCheckField3 = fieldState({
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float',
  value: 0,
  labelPosition: 'input'
})

export default defineComponent({
  components: { Field },
  async setup() {
    const change = () => {
      testField.value = new Date().getTime().toString()
    }
    return {
      change,
      testField,
      testField2,
      testField3,
      testCheckField,
      testCheckField2,
      testCheckField3
    }
  }
})
</script>

<style scoped></style>
