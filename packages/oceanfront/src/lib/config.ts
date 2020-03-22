import {
  inject,
  provide,
  reactive,
  ref,
  InjectionKey,
  FunctionalComponent,
  h,
  defineComponent
} from 'vue'
import { extendReactive, isObject } from './util'

type IConfig = Record<string, any>

const configKey = ('of_config' as unknown) as InjectionKey<IConfig>

const globalConfig = ref<IConfig>({})

export function setGlobalConfig(config: IConfig) {
  globalConfig.value = config
}

export function updateGlobalConfig(config: IConfig) {
  Object.assign(globalConfig.value, config)
}

export function injectConfig(name?: string) {
  const config = inject(configKey, globalConfig.value)
  if (name !== undefined) {
    return config[name]
  }
  return config
}

export function provideConfig(config: IConfig) {
  if (config) {
    const baseConfig = injectConfig()
    provide(configKey, extendReactive(baseConfig, config))
  }
}

export const OfConfig = defineComponent({
  setup(props, ctx) {
    provideConfig(ctx.attrs)
    return () => ctx.slots.default!()
  }
})
