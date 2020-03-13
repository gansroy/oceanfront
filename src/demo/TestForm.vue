<template>
  <of-sidebar v-model="sidebarActive">
    <of-nav-group>
      <of-menu-item>Hello there</of-menu-item>
      <of-menu-item>Yes you</of-menu-item>
    </of-nav-group>
  </of-sidebar>
  <div class="container theme-base">
    <div class="row">
      <div class="column">
        <of-dialog overlay-class="theme-base" v-model="dialogActive" />
        <button @click="showDialog">show dialog</button>
        <button @click="showSidebar">show sidebar</button>
      </div>
      <div class="column">
        <of-nav-group>
          <template v-slot="{ focused }">
            <of-menu-item>Hello there</of-menu-item>
            <of-menu-item>Yes you</of-menu-item>
          </template>
        </of-nav-group>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <of-select
          label="Select input"
          value="Selected"
          variant="filled"
        ></of-select>
      </div>
    </div>
    <div class="row">
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <of-text-field
              :config="testField"
              variant="basic"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-text-field
              :config="testField"
              variant="outlined"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-text-field
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
            <of-textarea :config="testField" rows="3" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <of-textarea :config="testField" rows="3" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <of-textarea :config="testField" rows="3" variant="filled" />
          </div>
        </div>
      </div>
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <of-toggle :config="testCheckField" variant="basic" />
          </div>
          <br />
          <div class="form-cell">
            <of-toggle :config="testCheckField" variant="outlined" />
          </div>
          <br />
          <div class="form-cell">
            <of-toggle
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
import OfSelect from '../components/Select.vue'
import OfTextField from '../components/TextField.vue'
import OfTextarea from '../components/Textarea.vue'
import OfToggle from '../components/Toggle.vue'
import OfMenuItem from '../components/MenuItem.vue'
import OfNavGroup from '../components/NavGroup.vue'
import OfSidebar from '../components/Sidebar.vue'
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
    OfSelect,
    OfTextField,
    OfTextarea,
    OfToggle,
    OfMenuItem,
    OfNavGroup,
    OfSidebar
  },
  /*async */ setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    const dialogActive = ref(false)
    const sidebarActive = ref(false)
    const showDialog = () =>
      nextTick(() => (dialogActive.value = !dialogActive.value))
    const showSidebar = () =>
      nextTick(() => (sidebarActive.value = !sidebarActive.value))
    return {
      change,
      testField,
      testCheckField,
      textValue,
      dialogActive,
      showDialog,
      showSidebar,
      sidebarActive
    }
  }
})
</script>

<style scoped></style>
