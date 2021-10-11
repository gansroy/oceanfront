<template>
  <div class="container">
    <h1>Field States</h1>

    <div class="row">
      <of-toggle-field v-model="filled" label="Show filled inputs" />
    </div>
    <br />

    <div class="attrs">
      <div class="row">
        <div class="column state">Normal</div>
        <div class="column field">
          <of-field v-bind="fieldProps" v-model="fieldValue" />
        </div>
      </div>
      <div class="row">
        <div class="column state">Locked</div>
        <div class="column field">
          <of-field v-bind="fieldProps" v-model="fieldValue" locked />
        </div>
        <div class="column desc">
          Locked fields are not editable, but generally appear the same as an
          editable field. This state should be used when updates are being
          performed in the background and rapid changes to the visual style of
          the input are not desired.
        </div>
      </div>
      <div class="row">
        <div class="column state">Readonly</div>
        <div class="column field">
          <of-field v-bind="fieldProps" v-model="fieldValue" readonly />
        </div>
        <div class="column desc">
          Read-only fields are not editable, but do participate in the tab order
          and indicate the focus and hover states. There should be a visual
          indicator of the <tt>readonly</tt> state. This state supercedes
          <tt>locked</tt>.
        </div>
      </div>
      <div class="row">
        <div class="column state">Disabled</div>
        <div class="column field">
          <of-field
            v-bind="fieldProps"
            v-model="fieldValue"
            disabled
            message="This field is disabled"
          />
        </div>
        <div class="column desc">
          Disabled fields are not editable, and generally indicate that a
          precondition for editing the field has not been met. A message
          indicating the reason should be included for accessibility and
          clarity. The disabled state supercedes <tt>locked</tt> and
          <tt>readonly</tt>.
        </div>
      </div>
      <div class="row">
        <div class="column state">Fixed</div>
        <div class="column field">
          <of-field v-bind="fieldProps" v-model="fieldValue" fixed />
        </div>
        <div class="column desc">
          Fixed fields are not editable or interactive. This state supercedes
          <tt>locked</tt>, <tt>readonly</tt>, and <tt>disabled</tt>.
        </div>
      </div>
      <div class="row">
        <div class="column state">Invalid</div>
        <div class="column field">
          <of-field
            v-bind="fieldProps"
            v-model="fieldValue"
            invalid
            message="This field is invalid"
          />
        </div>
        <div class="column desc">
          The <tt>invalid</tt> state may be combined with any other states in
          order to indicate that the current value of the field cannot be
          accepted.
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.attrs {
  border: 2px solid rgb(77, 150, 128);
  border-radius: 4px;
  padding: 1em;
  display: grid;
  grid-template-columns: 20% 40% auto;
  grid-gap: 1em;
  > .row {
    display: contents;
    .column {
      align-self: center;
      &:first-child {
        grid-column-start: 1;
      }
    }
  }
  .desc {
    font-size: 80%;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-file-field
  label="File input"
  :model-value="{name: 'Previous filename', size: 100}"
/>`
    const filled = ref(false)
    const fieldProps = computed(() => ({
      label: 'Test input',
      variant: filled.value ? 'filled' : 'normal',
    }))
    const fieldValue = ref('Field value')

    return { filled, fieldProps, fieldValue, sampleCode }
  },
})
</script>
