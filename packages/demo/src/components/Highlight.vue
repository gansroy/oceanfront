<template>
  <div class="of-code of--highlight" v-html="result"></div>
</template>

<script lang="ts">
import { defineComponent, onUpdated, ref, onMounted } from 'vue'
const hljs = require('highlight.js/lib/core')
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))

const formatLines = (text: string) => {
  if (text) {
    const lines = text.trim().split(/\r?\n/)
    const lines_indent = lines.map(line => {
      const m = line.match(/^([ \t]*)(.*)$/)
      let [ws, code] = [m![1], m![2]]
      const wslen = ws.length
      return `<div style="padding-left: ${wslen +
        2}ch; text-indent: -2ch">${code}</div>`
    })
    return lines_indent.join('\n')
  }
}

export default defineComponent({
  name: 'of-highlight',
  props: {
    lang: String,
    value: String
  },
  setup(props, ctx) {
    const result = ref<string>()
    onMounted(() => {
      result.value =
        props.lang && props.value
          ? formatLines(hljs.highlight(props.lang, props.value).value)
          : undefined
    })
    return {
      result
    }
  }
})
</script>
