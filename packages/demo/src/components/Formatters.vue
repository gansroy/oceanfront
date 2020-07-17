<template>
  <div class="container">
    <h1>Value Formatters</h1>

    <div class="row">
      <div class="column sm-4">
        <h4>Number Input</h4>
        <of-config :locale="locale">
          <template #default="{ locale }">
            <of-field
              style="width: 10em;"
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
        <of-select-field :items="localeOpts" v-model:value="locale" />
      </div>
    </div>
    <div class="row">
      <div class="column sm-4">
        <h4>Duration Input</h4>
        <of-config :locale="locale">
          <template #default="{ locale }">
            <of-field
              style="width: 10em;"
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
        <h4>URL Input</h4>
        <of-field
          style="width: 10em;"
          format="url"
          v-model:value="inputUrlValue"
        />
        <br />
        Original URL:
        <br />
        {{ inputUrlValue }}
      </div>
      <div class="column sm-4"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const inputValue = ref(100125.99)
    const inputDurationValue = ref(100)
    const inputUrlValue = 'https://example.com/'
    const localeOpts = [
      { text: '(browser default)', value: '' },
      { text: 'en-CA', value: 'en-CA' },
      { text: 'de-CH', value: 'de-CH' },
      { text: 'de-DE', value: 'de-DE' },
      { text: 'fr-FR', value: 'fr-FR' },
    ]
    const locale = ref<string | undefined>('')
    return {
      locale,
      localeOpts,
      inputValue,
      inputDurationValue,
      inputUrlValue,
    }
  },
})
</script>
