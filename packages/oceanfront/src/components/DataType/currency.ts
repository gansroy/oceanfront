import { defineComponent, h } from "vue";
import dataProps from './props'
import { useFormats } from '../../lib/formats'

export default defineComponent({
  props: {
    ...dataProps.common,
    ...dataProps.currency
  },
  render() {
    const formatMgr = useFormats()
    const numberFormat = formatMgr.getTextFormatter('number')
    const result = numberFormat?.format(this.$props.value)
    if (result) {
      return h('span',
        { 
          innerHTML:  this.$props.data.symbol + ' ' + result.textValue
        },
      )
    }
    return ''
  },
})