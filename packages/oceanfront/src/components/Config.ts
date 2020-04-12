import { defineComponent } from 'vue'
import { extendConfig } from '../lib/config'
import { setLocale, useLocale } from '../lib/locale'

export default defineComponent({
  name: 'of-config',
  props: {
    locale: String,
    theme: String
  },
  setup(props, ctx) {
    extendConfig(() => {
      if (props.locale) setLocale(props.locale)
    })
    const localeMgr = useLocale()
    return () => ctx.slots.default!({ locale: localeMgr.locale })
  }
})
