<template>
  <div class="container theme-base">
    <div class="row">
      <div>
        <of-dialog overlay-class="theme-base" v-model="dialogActive" />
        <button @click="showDialog">show dialog</button>
      </div>
      <nav-group>
        <template v-slot="{ focused }">
          <menu-item>Hello there</menu-item>
          <menu-item>Yes you</menu-item>
        </template>
      </nav-group>
    </div>
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
            <input-textarea :config="testField" rows="3" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <input-textarea :config="testField" rows="3" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <input-textarea :config="testField" rows="3" variant="filled" />
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
  computed,
  nextTick
} from 'vue'
import OfDialog from '../components/Dialog.vue'
import InputTextarea from '../components/InputTextarea.vue'
import InputText from '../components/InputText.vue'
import InputToggle from '../components/InputToggle.vue'
import MenuItem from '../components/MenuItem.vue'
import NavGroup from '../components/NavGroup.vue'
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
  components: {
    OfDialog,
    InputText,
    InputTextarea,
    InputToggle,
    MenuItem,
    NavGroup
  },
  /*async */ setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    const dialogActive = ref(false)
    const showDialog = () =>
      nextTick(() => (dialogActive.value = !dialogActive.value))
    return {
      change,
      testField,
      testCheckField,
      textValue,
      dialogActive,
      showDialog
    }
  }
})
</script>

<style scoped></style>
