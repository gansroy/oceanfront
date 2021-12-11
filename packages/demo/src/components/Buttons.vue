<template>
  <div class="container">
    <h1>Buttons</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <of-field
        v-model="params.density"
        label="Density"
        type="select"
        :items="densityOptions"
      />
    </div>
    <div class="demo-fields">
      <div class="row">
        <div class="column spaced">
          <of-button v-bind="params">Submit</of-button>
          <of-button v-bind="params" disabled>Disabled</of-button>
          <of-button v-bind="params" icon="gear">Gear</of-button>
          <of-button v-bind="params" rounded>Rounded</of-button>
          <of-button v-bind="params" split :items="testItems" @click="menuClick"
            >Split</of-button
          >
          <of-button v-bind="params" icon="gear" rounded :items="testItems"
            >Menu</of-button
          >
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>Button Sets</h4>
          <span class="of-buttonset">
            <of-button v-bind="params" icon="accept">Save</of-button>
            <of-button v-bind="params" icon="refresh" disabled
              >Refresh</of-button
            >
            <of-button v-bind="params" icon="gear" rounded :items="testItems"
              >Menu</of-button
            >
            <of-button v-bind="params" icon="cancel">Cancel</of-button>
          </span>
          <br />
          <span class="of-buttonset">
            <of-button v-bind="params" variant="outlined">1</of-button>
            <of-button v-bind="params" variant="outlined" active>2</of-button
            >
            <of-button v-bind="params" variant="outlined">3</of-button>
            <of-button v-bind="params" variant="outlined">4</of-button>
            <of-button v-bind="params" variant="outlined">5</of-button>
            <of-button
              v-bind="params"
              icon="page last"
              variant="outlined"
            ></of-button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="column md-2 sm-4">
          <h4>Solid</h4>
          <of-button rounded v-bind="params">Submit</of-button>
        </div>
        <div class="column md-2 sm-4">
          <h4>Outlined</h4>
          <of-button rounded v-bind="params" variant="outlined"
            >Submit</of-button
          >
        </div>
        <div class="column md-2 sm-4">
          <h4>Text</h4>
          <of-button rounded v-bind="params" variant="text">Submit</of-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.spaced {
  > * {
    margin-right: 1em;
    margin-bottom: 0.5em;
  }
}
</style>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-button>Submit</of-button>
<of-button variant="outlined">Submit</of-button>
<of-button variant="text">Submit</of-button>
<of-button disabled>Disabled</of-button>
<of-button icon="gear">With Icon</of-button>
<of-button rounded>Rounded</of-button>
<of-button split :items="testItems" @click="menuClick">Split</of-button>
<of-button icon="gear" rounded :items="testItems">Menu</of-button>
<!-- Set -->
<span class="of-buttonset">
  <of-button icon="accept">Save</of-button>
  <of-button icon="refresh" disabled>Refresh</of-button>
  <of-button icon="gear" rounded split :items="testItems">Split</of-button>
  <of-button icon="cancel">Cancel</of-button>
</span>`

    const selectMenu1 = () => {
      console.log('Menu item 1 selected')
    }
    const selectMenu2 = () => {
      console.log('Menu item 2 selected')
    }
    const menuClick = () => {
      console.log('Button click')
    }

    const testItems = [
      {
        text: 'Option 1',
        value: selectMenu1,
        attrs: { 'data-test': 'my-btn' },
      },
      { text: 'Option 2', value: selectMenu2 },
    ]

    const densityOptions = ['default', '0', '1', '2', '3']
    const params = reactive({
      density: 'default',
    })
    return {
      sampleCode,
      testItems,
      densityOptions,
      params,
      menuClick,
    }
  },
})
</script>
