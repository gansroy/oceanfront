import { defineComponent } from 'vue'
import { extendConfig } from '../lib/config'
import { setDefaultIconFont } from '../lib/icons'
import { useLayout } from '../lib/layout'
import { setLocale, useLocale } from '../lib/locale'

export const OfConfig = defineComponent({
  name: 'of-config',
  inheritAttrs: false,
  props: {
    iconFont: String,
    locale: String,
    theme: String
  },
  setup(props, ctx) {
    extendConfig(() => {
      if (props.iconFont) setDefaultIconFont(props.iconFont)
      if (props.locale) setLocale(props.locale)
    })
    const layoutMgr = useLayout()
    const localeMgr = useLocale()
    return () =>
      ctx.slots.default!({
        locale: localeMgr.locale,
        isMobile: layoutMgr.isMobile
      })
  }
})
