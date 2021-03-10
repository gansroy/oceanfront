<template>
  <div class="container">
    <h1>Buttons</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
    <div class="row">
        <div class="column">
          <h4>Solid</h4>
          <of-button />
          <of-button disabled>Disabled</of-button>
          <of-button icon="gear">With Icon</of-button>
          <of-button rounded>Rounded</of-button>
          <of-button :items="['Home', 'About']" />
          <of-button icon="gear" rounded :items="['Home', 'About']" />
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>Outlined</h4>
          <of-button variant="outlined" />
          <of-button variant="outlined" disabled>Disabled</of-button>
          <of-button variant="outlined" icon="gear">With Icon</of-button>
          <of-button variant="outlined" rounded>Rounded</of-button>
          <of-button variant="outlined" :items="['Home', 'About']" />
          <of-button variant="outlined" icon="gear" rounded :items="['Home', 'About']" />
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>Text</h4>
          <of-button variant="text" />
          <of-button variant="text" disabled>Disabled</of-button>
          <of-button variant="text" icon="gear">With Icon</of-button>
          <of-button variant="text" rounded>Rounded</of-button>
          <of-button variant="text" :items="['Home', 'About']" />
          <of-button variant="text" icon="gear" rounded :items="['Home', 'About']" />
        </div>
      </div>
      <div class="row">
        <div class="column">
          <h4>Set</h4>
          <span class="of-buttonset">
            <of-button icon="accept">Save</of-button>
            <of-button icon="refresh" disabled>Refresh</of-button>
            <of-button icon="gear" rounded :items="['Home', 'About']" />
            <of-button icon="cancel">Cancel</of-button>
          </span>
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
<!-- Solid -->
<of-button />
<of-button disabled>Disabled</of-button>
<of-button icon="gear">With Icon</of-button>
<of-button rounded>Rounded</of-button>
<of-button :items="['Home', 'About']" />
<of-button icon="gear" rounded :items="['Home', 'About']" />
<!-- Outlined -->
<of-button variant="outlined" />
<of-button variant="outlined" disabled>Disabled</of-button>
<of-button variant="outlined" icon="gear">With Icon</of-button>
<of-button variant="outlined" rounded>Rounded</of-button>
<of-button variant="outlined" :items="['Home', 'About']" />
<of-button variant="outlined" icon="gear" rounded :items="['Home', 'About']" />
<!-- Text -->
<of-button variant="text" />
<of-button variant="text" disabled>Disabled</of-button>
<of-button variant="text" icon="gear">With Icon</of-button>
<of-button variant="text" rounded>Rounded</of-button>
<of-button variant="text" :items="['Home', 'About']" />
<of-button variant="text" icon="gear" rounded :items="['Home', 'About']" />
<!-- Set -->
<span class="of-buttonset">
  <of-button icon="accept">Save</of-button>
  <of-button icon="refresh" disabled>Refresh</of-button>
  <of-button icon="gear" rounded :items="['Home', 'About']" />
  <of-button icon="cancel">Cancel</of-button>
</span>`
    return { sampleCode }
  },
})
</script>