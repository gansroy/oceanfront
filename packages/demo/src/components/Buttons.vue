<template>
  <div class="container">
    <h1>Buttons</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row">
        <div class="column">
          <of-button>Submit</of-button>
          <of-button disabled>Disabled</of-button>
          <of-button icon="gear">With Icon</of-button>
          <of-button rounded>Rounded</of-button>
          <of-button split :items="testItems" :on-click-menu="menuClick">Split</of-button>
          <of-button icon="gear" rounded :items="testItems">Menu</of-button>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>Set</h4>
          <span class="of-buttonset">
            <of-button icon="accept">Save</of-button>
            <of-button icon="refresh" disabled>Refresh</of-button>
            <of-button icon="gear" rounded split :items="testItems">Split</of-button>
            <of-button icon="cancel">Cancel</of-button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="column sm-1">
          <h4>Solid</h4>
          <of-button>Submit</of-button>
        </div>
        <div class="column sm-1">
          <h4>Outlined</h4>
          <of-button variant="outlined">Submit</of-button>
        </div>
        <div class="column sm-1">
          <h4>Text</h4>
          <of-button variant="text">Submit</of-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-button>Submit</of-button>
<of-button disabled>Disabled</of-button>
<of-button icon="gear">With Icon</of-button>
<of-button rounded>Rounded</of-button>
<of-button split :items="testItems" :on-click-menu="menuClick">Split</of-button>
<of-button icon="gear" rounded :items="testItems">Menu</of-button>
<!-- Set -->
<span class="of-buttonset">
  <of-button icon="accept">Save</of-button>
  <of-button icon="refresh" disabled>Refresh</of-button>
  <of-button icon="gear" rounded split :items="testItems">Split</of-button>
  <of-button icon="cancel">Cancel</of-button>
</span>
<!-- Solid -->
<of-button>Submit</of-button>
<!-- Outlined -->
<of-button variant="outlined">Submit</of-button>
<!-- Text -->
<of-button variant="text">Submit</of-button>`

    const selectMenu1 = () => {
      console.log('Menu item 1 selected')
    }
    const selectMenu2 = () => {
      console.log('Menu item 2 selected')
    }
    const menuClick = () => {
      console.log('Menu click')
    }
    const testItems = [
      //{ special: 'header', text: 'Test select items1' },
      { text: 'Option 1', value: selectMenu1, attrs: { 'data-test': 'my-btn' } },
      //{ special: 'divider' },
      { text: 'Option 2', value: selectMenu2 },
    ]
    return { 
      sampleCode, 
      testItems, 
      menuClick
    }
  },
})
</script>
