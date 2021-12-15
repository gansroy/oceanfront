import { defineComponent, PropType } from 'vue'
import { extendConfig } from '../lib/config'
import { registerIconSet, IconSet } from '../lib/icons'
import { themeStyle, useLayout, ThemeConfig } from '../lib/layout'
import { setLocale, useLocale } from '../lib/locale'
import { FormRecord, setCurrentRecord } from '../lib/records'

export const OfConfig = defineComponent({
  name: 'OfConfig',
  inheritAttrs: false,
  props: {
    icons: Object as PropType<IconSet>,
    locale: String,
    record: Object as PropType<FormRecord>,
    theme: [String, Object],
  },
  setup(props, ctx) {
    extendConfig(() => {
      if (props.icons) registerIconSet(props.icons)
      if (props.locale) setLocale(props.locale)
      if (props.record !== undefined) {
        setCurrentRecord(props.record)
      }
    })
    const layoutMgr = useLayout()
    const localeMgr = useLocale()
    return () => {
      const cfgProps: Record<string, any> = {
        locale: localeMgr.locale,
        isMobile: layoutMgr.isMobile,
      }
      if (props.theme) {
        cfgProps.themeStyle = themeStyle(props.theme as ThemeConfig)
      }
      return ctx.slots.default && ctx.slots.default(cfgProps)
    }
  },
})
