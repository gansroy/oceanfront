import { computed, defineComponent, h, VNode, VNodeProps } from 'vue'
import { useIcons } from '../lib/icons'

const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24px',
  height: '24px',
  role: 'img',
  'aria-hidden': true,
  viewBox: '0 0 24 24',
}

const renderSvg = (paths: string[]): VNode => {
  return h(
    'svg',
    svgAttrs,
    paths.map((path, idx) => {
      const alt = idx == paths.length - 2
      const pri = idx == paths.length - 1
      const attrs = {
        d: path, // FIXME? 'd' is not allowed by VNodeProps
        class: { pri, alt },
      } as any as VNodeProps
      if (alt) (attrs as any)['opacity'] = '0.3'
      return h('path', attrs)
    })
  )
}

export const OfIcon = defineComponent({
  name: 'OfIcon',
  props: {
    class: String,
    name: String,
    size: [Number, String],
    type: String,
  },
  setup(props, ctx) {
    const mgr = useIcons()
    const icon = computed(() => mgr.resolve(props.name, props.type))
    const size = computed(() => {
      let sz = props.size
      if (sz) {
        if (
          typeof sz === 'number' ||
          (typeof sz === 'string' && sz.match(/^[0-9]+$/))
        ) {
          sz = '' + sz + 'px'
        }
      }
      return sz || undefined
    })

    return () => {
      const iconVal = icon.value
      const sz = size.value
      const numSz = !isNaN(parseInt(sz as string))
      if (!iconVal) return
      return h(
        'i',
        {
          'aria-hidden': 'true',
          class: [
            {
              'of-icon': true,
              'of-icon--svg': !!iconVal.svg,
            },
            props.size && !numSz ? 'of--icon-size-' + props.size : undefined,
            props.class,
            iconVal.class,
          ],
          'data-name': props.name,
          style: numSz ? { '--icon-size': sz } : undefined,
          ...ctx.attrs,
        },
        ctx.slots.default
          ? ctx.slots.default()
          : iconVal.svg
          ? renderSvg(iconVal.svg.paths)
          : iconVal.text
      )
    }
  },
})
