<template>
  <div class="container">
    <h1>Input Groups</h1>
    <!-- of-highlight lang="html" :value="sampleCode" / -->

    <div class="demo-fields">
      <div class="row form-row">
        <div class="column filled">
          <div class="of-block">
            <of-field label="Simple input" />
          </div>
          <div class="of-block">
            <div class="of-field-group">
              <div class="of-field-row">
                <div class="of-field-cell">
                  <label class="of-field-label" for="pw">Password</label>
                  <of-field
                    id="pw"
                    input-type="password"
                    frame="none"
                    size="15"
                  />
                </div>
                <div class="of-field-cell">
                  <label class="of-field-label" for="cpw"
                    >Confirm Password</label
                  >
                  <of-field
                    id="cpw"
                    input-type="password"
                    frame="none"
                    size="15"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="of-block">
            <div class="of-field-group">
              <div class="of-group-label">Primary Address</div>
              <div class="of-field-row">
                <div class="of-field-cell">
                  <label class="of-field-label" for="street">Street</label>
                  <of-field
                    type="text"
                    frame="none"
                    model-value="99 Street Ave."
                    id="street"
                    variant="filled"
                  />
                </div>
              </div>
              <div class="of-field-row">
                <div class="of-field-cell">
                  <label class="of-field-label" for="city">City</label>
                  <of-field
                    type="text"
                    frame="none"
                    model-value="Vancouver"
                    variant="filled"
                    id="city"
                  />
                </div>
                <div class="of-field-cell">
                  <label class="of-field-label" for="state">State</label>
                  <of-field
                    type="text"
                    frame="none"
                    model-value="BC"
                    variant="filled"
                    id="state"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="of-block">
            <div class="of-field-group">
              <div class="of-group-label">Phone Numbers</div>
              <div class="of-field-row">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7777"
                  variant="filled"
                  id="ph1"
                />
                <label class="of-input-attach" for="ph1">work</label>
              </div>
              <div class="of-field-row">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7778"
                  variant="filled"
                  id="ph2"
                />
                <label class="of-input-attach" for="ph2">mobile</label>
              </div>
              <div class="of-field-row">
                <of-field
                  type="text"
                  frame="none"
                  model-value="999-888-7789"
                  variant="filled"
                  id="ph3"
                />
                <label class="of-input-attach" for="ph3">home</label>
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
