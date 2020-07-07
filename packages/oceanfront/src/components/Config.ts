import { defineComponent, PropType } from 'vue'
import { extendConfig } from '@/lib/config'
import { registerIcons, setDefaultIconFont, IconMapping } from '@/lib/icons'
import { themeStyle, useLayout } from '@/lib/layout'
import { setLocale, useLocale } from '@/lib/locale'
import { FieldRecord, setCurrentRecord } from '@/lib/records'

export const OfConfig = defineComponent({
  name: 'OfConfig',
  inheritAttrs: false,
  props: {
    iconFont: String,
    icons: Object as PropType<IconMapping>,
    locale: String,
    record: Object as PropType<FieldRecord>,
    theme: [String, Object],
  },
  setup(props, ctx) {
    extendConfig(() => {
      if (props.iconFont) setDefaultIconFont(props.iconFont)
      if (props.icons) registerIcons(props.icons)
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
        cfgProps.themeStyle = themeStyle(props.theme)
      }
      return ctx.slots.default && ctx.slots.default(cfgProps)
    }
  },
})
