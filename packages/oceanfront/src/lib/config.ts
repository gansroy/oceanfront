import {
  defineComponent,
  inject,
  provide,
  ref,
  Component,
  InjectionKey
} from 'vue'

export interface Config {
  icons: {
    resolve(name?: string): Icon | null
  }
}

export interface Icon {
  class?: string
  component?: Component | string
  name?: string
  props?: object
  text?: string
}

export interface ConfigHandler {
  getPublic(states: any[]): any
  loadConfigState(config: any, prev?: any[]): any
}

type ConfigState = Record<string, any>
type ConfigUpdate = Record<string, any>

const configKey = ('of_config' as unknown) as InjectionKey<ConfigImpl>

class ConfigImpl {
  protected _handlers: Record<string, ConfigHandler>
  protected _state: ConfigState[]

  constructor(
    handlers?: Record<string, ConfigHandler>,
    state?: ConfigState[],
    config?: ConfigUpdate
  ) {
    this._handlers = handlers || {}
    this._state = state || []
    if (config) {
      const ext = this.loadUpdate(config)
      if (ext) {
        this._state.push(ext)
      }
    }
  }

  addHandler(key: string, handler: ConfigHandler) {
    this._handlers[key] = handler
  }

  has(key: string): boolean {
    return key in this._handlers
  }

  keys(): string[] {
    return Object.keys(this._handlers)
  }

  extend(update: ConfigUpdate): ConfigImpl {
    const ext = this.loadUpdate(update)
    return ext ? new ConfigImpl(this._handlers, [...this._state, ext]) : this
  }

  loadUpdate(update: ConfigUpdate): ConfigState | null {
    let ret: ConfigState | null = null
    for (const key in update) {
      if (key in this._handlers) {
        const prev = this.extract(key)
        const state = this._handlers[key].loadConfigState(update[key], prev)
        if (state) {
          if (!ret) ret = {}
          ret[key] = state
        }
      }
    }
    return ret
  }

  extract(key: string): any[] {
    return this._state.reduce((accum: any[], entry) => {
      if (key in entry) {
        accum.push(entry[key])
      }
      return accum
    }, [])
  }

  handler(key: string): any {
    const handler = this._handlers[key]
    return handler ? handler.getPublic(this.extract(key)) : null
  }

  get state() {
    return this._state
  }
}

const configProxy: ProxyHandler<any> = {
  get(target: ConfigImpl, key: string, receiver: object): any {
    return target.handler(key)
  },
  has(target: ConfigImpl, key: string): boolean {
    return target.has(key)
  },
  ownKeys(target: ConfigImpl): (string | number | symbol)[] {
    return target.keys()
  },
  set(target: ConfigImpl, key: string, value: any, receiver: object): boolean {
    if (__DEV__) {
      console.error('Cannot set property of Config')
    }
    return true
  },
  deleteProperty(target: ConfigImpl, key: string): boolean {
    if (__DEV__) {
      console.error('Cannot delete property of Config')
    }
    return true
  }
}

const globalConfig = ref<ConfigImpl>(new ConfigImpl())

export function initConfig(
  handlers: Record<string, ConfigHandler>,
  config?: ConfigUpdate
) {
  globalConfig.value = new ConfigImpl(handlers, undefined, config)
}

export function useConfig(): Config {
  const config = injectConfig()
  return new Proxy(config, configProxy)
}

export function injectConfig(): ConfigImpl {
  return inject(configKey, globalConfig.value) as ConfigImpl
}

export function provideConfig(config: ConfigUpdate) {
  if (config) {
    const config = injectConfig()
    provide(configKey, config.extend(config))
  }
}

export const OfConfig = defineComponent({
  setup(props, ctx) {
    provideConfig(ctx.attrs)
    return () => ctx.slots.default!({ config: useConfig() })
  }
})
