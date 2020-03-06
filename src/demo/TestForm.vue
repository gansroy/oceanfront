<template>
  <div class="container theme-base">
    <div class="row">
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <input-text
              :config="testField"
              variant="basic"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <input-text
              :config="testField"
              variant="outlined"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <input-text
              :config="testField"
              variant="filled"
              v-model="textValue"
            />
          </div>
          <br />
          <button class="input-button" @click="change">Update</button>
        </div>
      </div>
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <input-textarea :config="testField" rows="2" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <input-textarea :config="testField" rows="2" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <input-textarea :config="testField" rows="2" variant="filled" />
          </div>
        </div>
      </div>
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <input-toggle :config="testCheckField" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <input-toggle :config="testCheckField" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <input-toggle
              :config="testCheckField"
              type="checkbox"
              variant="filled"
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
import InputTextarea from '../components/InputTextarea.vue'
import InputText from '../components/InputText.vue'
import InputToggle from '../components/InputToggle.vue'
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
  type: 'float'
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
  labelPosition: 'input'
})

export default defineComponent({
  components: { InputText, InputTextarea, InputToggle },
  /*async */ setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    return {
      change,
      testField,
      testCheckField,
      textValue
    }
  }
})
</script>

<style scoped></style>
