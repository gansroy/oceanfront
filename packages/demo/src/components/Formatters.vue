<template>
  <div class="container">
    <h1>Value Formatters</h1>

    <div class="row">
      <div class="column sm-4">
        <h4>Number Input</h4>
        <of-config :locale="locale">
          <template v-slot="{ locale }">
            <of-field
              style="width: 10em"
              format="number"
              v-model:value="inputValue"
            />
            <br />
            Effective locale: {{ locale }}
            <br />
            test format:
            <of-format type="number" :value="inputValue" />
          </template>
        </of-config>
      </div>
      <div class="column sm-4">
        <h4>Select Locale</h4>
        <template v-for="opt of localeOpts">
          <of-toggle
            :label="opt.text"
            labelPosition="none"
            type="radio"
            variant="basic"
            v-model="locale"
            :value="opt.value"
          />
          <br />
        </template>
      </div>
    </div>
    <div class="row">
      <div class="column sm-4">
        <h4>Duration Input</h4>
        <of-config :locale="locale">
          <template v-slot="{ locale }">
            <of-field
              style="width: 10em"
              format="duration"
              v-model:value="inputDurationValue"
            />
            <br />
            Effective locale: {{ locale }}
            <br />
            test format:
            <of-format type="duration" :value="inputDurationValue" />
          </template>
        </of-config>
      </div>
      <div class="column sm-4">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const inputValue = ref(100125.99)
    const inputDurationValue = ref(100)
    const sampleCode = `
<of-text-field
  label="Field Label"
  v-model:value="fieldValue"
  variant="filled"
/>`
    const localeOpts = [
      { text: '(browser default)' },
      { text: 'en-CA', value: 'en-CA' },
      { text: 'de-CH', value: 'de-CH' },
      { text: 'de-DE', value: 'de-DE' },
      { text: 'fr-FR', value: 'fr-FR' }
    ]
    const locale = ref<string | undefined>()
    return {
      locale,
      localeOpts,
      sampleCode,
      inputValue,
      inputDurationValue
    }
  }
})
</script>
