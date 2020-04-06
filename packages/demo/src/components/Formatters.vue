<template>
  <div class="container">
    <h1>Value Formatters</h1>

    <div class="row">
      <div class="column sm-4">
        <h4>Number Input</h4>
        <of-config v-bind="config">
          <of-text-field
            style="width: 10em"
            format="number"
            v-model="inputValue"
          />
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
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue'

export default defineComponent({
  setup() {
    const inputValue = ref(100125.99)
    const sampleCode = `
<of-text-field
  label="Field Label"
  v-model="fieldValue"
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
      config: { l10n: { locale } },
      locale,
      localeOpts,
      sampleCode,
      inputValue
    }
  }
})
</script>
