<template>
  <div class="container theme-base">
    <div class="row">
      <div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <input-text :config="testField" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <input-text :config="testField" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <input-text :config="testField" variant="filled" />
          </div>
          <br />
          <button class="input-button" @click="change">Update</button>
        </div>
      </div>
      <!-- div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <field :config="testField" type="textarea" class="field-basic" />
          </div>
          <br />
          <div class="form-cell">
            <field :config="testField" type="textarea" class="field-outlined" />
          </div>
          <br />
          <div class="form-cell">
            <field :config="testField" type="textarea" class="field-filled" />
          </div>
        </div>
      </div>
      <div class="column md-3">
        <div class="form-outer">
          <div class="form-cell">
            <field
              :config="testCheckField"
              type="checkbox"
              class="field-basic"
            />
          </div>
          <br />
          <div class="form-cell">
            <field
              :config="testCheckField"
              type="checkbox"
              class="field-outlined"
            />
          </div>
          <br />
          <div class="form-cell">
            <field
              :config="testCheckField"
              type="checkbox"
              class="field-filled"
            />
          </div>
        </div>
      </div -->
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
import InputText from '../components/InputText.vue'
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

export default defineComponent({
  components: { InputText },
  async setup() {
    const change = () => {
      testField.value = new Date().getTime().toString()
    }
    return {
      change,
      testField,
      testCheckField
    }
  }
})
</script>

<style scoped></style>
