<template>
  <div class="container">
    <h1>Grouped Inputs</h1>
    <!-- of-highlight lang="html" :value="sampleCode" / -->

    <div class="demo-fields">
      <div class="row form-row">
        <div class="column filled">
          <div class="of-block">
            <of-field label="Simple input" />
          </div>
          <div class="of-block">
            <div class="of-group">
              <div class="of-group-row">
                <of-field id="pw" input-type="password" label="Password" />
                <of-field
                  id="cpw"
                  input-type="password"
                  label="Confirm Password"
                />
              </div>
            </div>
          </div>
          <div class="of-block">
            <div class="of-group">
              <div class="of-group-label">Primary Address</div>
              <div class="of-group-row">
                <of-field
                  type="text"
                  label="Street"
                  model-value="99 Street Ave."
                  id="street"
                  variant="filled"
                  size="50"
                />
              </div>
              <div class="of-group-row">
                <of-field
                  type="text"
                  label="City"
                  model-value="Vancouver"
                  variant="filled"
                  id="city"
                />
                <of-field
                  type="text"
                  label="State"
                  model-value="BC"
                  variant="filled"
                  id="state"
                />
              </div>
            </div>
          </div>
          <div class="of-block">
            <div class="of-group">
              <div class="of-group-label">Phone Numbers</div>
              <div class="of-group-row pad">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7777"
                  variant="filled"
                  id="ph1"
                />
                <label class="of-group-label" for="ph1">work</label>
              </div>
              <div class="of-group-row pad">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7778"
                  variant="filled"
                  id="ph2"
                />
                <label class="of-group-label" for="ph2">mobile</label>
              </div>
              <div class="of-group-row pad">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7789"
                  variant="filled"
                  id="ph3"
                />
                <label class="of-group-label" for="ph3">home</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { makeRecord } from 'oceanfront'

export default defineComponent({
  setup() {
    const record = makeRecord({
      first: 'Bob',
      last: 'Terwilliger',
      salutation: 'Mr',
    })
    const sampleCode = ``
    return {
      record,
      sampleCode,
    }
  },
})
</script>

<style lang="scss" scoped>
.of-block {
  border-radius: 5px;
  padding: 10px;
  max-width: 26em;
  overflow: hidden;
}
.of-block + .of-block {
  margin-top: 0.5em;
}
</style>
