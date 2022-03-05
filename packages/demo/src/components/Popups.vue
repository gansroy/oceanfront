<template>
  <div class="container">
    <h1>Popups and Dialogs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <hr />
    <of-button @click="toggleDialog">Show dialog</of-button>
    <of-dialog v-model="dialogActive">
      <div class="container">
        <h4>Test Dialog</h4>
        <of-select-field :items="['one', 'two']" label="Test select" />
        <p>
          <of-button @click="toggleNestedDialog">Show nested dialog</of-button>
        </p>
      </div>
      <of-dialog v-model="nestedDialogActive">
        <div class="container">
          <h4>Nested Dialog</h4>
          <of-select-field :items="['one', 'two']" label="Test select" />
        </div>
      </of-dialog>
    </of-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-dialog
  v-model="dialogActive"
/>
`
    const dialogActive = ref(false)
    const nestedDialogActive = ref(false)

    return {
      dialogActive,
      nestedDialogActive,
      sampleCode,
      toggleDialog: () => {
        dialogActive.value = !dialogActive.value
      },
      toggleNestedDialog: () => {
        nestedDialogActive.value = !nestedDialogActive.value
      },
    }
  },
})
</script>
