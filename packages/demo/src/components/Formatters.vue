<template>
  <div class="container">
    <h1>Value Formatters</h1>

    <div class="row">
      <div class="column sm-6">
        <h4>Number Input</h4>
        <of-config :locale="locale">
          <of-field
            style="width: 10em"
            format="number"
            v-model="values.number"
          />
          <br />
          Output: <of-format type="number" :value="values.number" />
        </of-config>
      </div>
      <div class="column sm-6">
        <h4>Select Locale</h4>
        <of-select-field :items="localeOpts" v-model="locale" />
        <br />
        <of-config :locale="locale">
          <template #default="{ loc }"> Effective locale: {{ loc }} </template>
        </of-config>
      </div>
    </div>
    <div class="row">
      <div class="column sm-6">
        <h4>Duration Input</h4>
        <of-config :locale="locale">
          <of-field
            style="width: 10em"
            format="duration"
            v-model="values.duration"
          />
          <br />
          Output:
          <of-format type="duration" :value="values.duration" />
        </of-config>
      </div>
    </div>
    <div class="row">
      <div class="column sm-6">
        <h4>URL Input</h4>
        <of-field style="width: 10em" format="url" v-model="values.url" />
      </div>
      <div class="column sm-4"></div>
    </div>
    <div class="row">
      <div class="column sm-6">
        <h4>Color Input</h4>
        <of-field
          style="width: 10em"
          type="text"
          format="color"
          v-model="values.color"
        />
      </div>
      <div class="column sm-4"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const values = reactive({
      number: 100125.99,
      duration: 100,
      url: 'https://example.com/',
      color: '#336699',
    })
    const localeOpts = [
      { text: '(browser default)', value: '' },
      { text: 'en-CA', value: 'en-CA' },
      { text: 'de-CH', value: 'de-CH' },
      { text: 'de-DE', value: 'de-DE' },
      { text: 'fr-FR', value: 'fr-FR' },
    ]
    const locale = ref('')
    return {
      locale,
      localeOpts,
      values,
    }
  },
})
</script>
