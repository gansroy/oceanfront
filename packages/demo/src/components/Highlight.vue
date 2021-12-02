<template>
  <div class="of-code of--highlight" v-html="result"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import hljs_css from 'highlight.js/lib/languages/css'
import hljs_json from 'highlight.js/lib/languages/json'
import hljs_xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('css', hljs_css)
hljs.registerLanguage('json', hljs_json)
hljs.registerLanguage('xml', hljs_xml)

const formatLines = (text: string) => {
  if (text) {
    const lines = text.trim().split(/\r?\n/)
    const lines_indent = lines.map((line) => {
      const m = line.match(/^([ \t]*)(.*)$/)
      let [ws, code] = [m![1], m![2]]
      const wslen = ws.length
      return `<div style="padding-left: ${
        wslen + 2
      }ch; text-indent: -2ch">${code}</div>`
    })
    return lines_indent.join('\n')
  }
}

export default defineComponent({
  name: 'OfHighlight',
  props: {
    lang: String,
    value: String,
  },
  setup(props, _ctx) {
    const result = computed(() =>
      props.lang && props.value
        ? formatLines(hljs.highlight(props.value, {language: props.lang}).value)
        : undefined
    )
    return {
      result,
    }
  },
})
</script>
