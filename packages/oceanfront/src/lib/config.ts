import {
  defineComponent,
  inject,
  provide,
  readonly,
  ref,
  Component,
  InjectionKey
} from 'vue'

let useRoute: any = null,
  useRouter: any = null
try {
  const { useRoute: _useRoute, useRouter: _useRouter } = require('vue-router')
  useRoute = _useRoute
  useRouter = _useRouter
} catch (er) {
  console.log('vue-router not found')
}

import { IconHandler } from '../components/Icon'

export interface Config {
  icons: {
    resolve(name?: string): Icon | null
  }
  l10n: {
    locale: string | undefined
    numberFormat: { groupSep: string; decimalSep: string }
  }
  routes: {
    activeRoute?: any
    router?: any
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
  inject(states: any[]): any
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
    return handler ? handler.inject(this.extract(key)) : null
  }

  reactiveState(): Readonly<Config> {
    const hs: Record<string, any> = {}
    for (const key in this._handlers) {
      hs[key] = this._handlers[key].inject(this.extract(key))
    }
    return readonly(hs as Config)
  }

  get state() {
    return this._state
  }
}

class LocalizationAccessor {
  protected _states: any[]
  constructor(states: any[]) {
    this._states = states
  }

  get locale(): string | undefined {
    let locale = navigator.language
    for (const s of this._states) {
      if (s.locale !== undefined) locale = s.locale
    }
    return locale
  }

  get numberFormat() {
    return ref({ groupSep: "'", decimalSep: ',' })
  }
}

class LocalizationHandler implements ConfigHandler {
  inject(states: any[]): any {
    return new LocalizationAccessor(states)
  }
  loadConfigState(state: any): any {
    return state
  }
}

class RouteAccessor {
  protected _states: any[]
  protected _router: any
  protected _route: any
  constructor(states: any[], router: any, route: any) {
    this._states = states
    this._router = router
    this._route = route
  }

  get activeRoute() {
    return this._route
  }

  get router() {
    return this._router
  }
}

class RouteHandler implements ConfigHandler {
  inject(states: any[]): any {
    const router = useRouter ? useRouter() : null
    const route = useRoute ? useRoute() : null
    return new RouteAccessor(states, router, route)
  }
  loadConfigState(state: any): any {
    return state
  }
}

const globalConfig = ref<ConfigImpl>(new ConfigImpl())

export function initConfig(
  handlers?: Record<string, ConfigHandler>,
  config?: ConfigUpdate
) {
  const defaultHandlers = {
    icons: new IconHandler(),
    l10n: new LocalizationHandler(),
    routes: new RouteHandler()
  }
  globalConfig.value = new ConfigImpl(
    { ...defaultHandlers, ...(handlers || {}) },
    undefined,
    config
  )
}

export function useConfig(): Config {
  const config = injectConfig()
  return config.reactiveState()
}

export function injectConfig(): ConfigImpl {
  return inject(configKey, globalConfig.value) as ConfigImpl
}

export function provideConfig(config: ConfigUpdate) {
  if (config) {
    const existConfig = injectConfig()
    provide(configKey, existConfig.extend(config))
  }
}

export const OfConfig = defineComponent({
  setup(props, ctx) {
    provideConfig(ctx.attrs)
    return () => ctx.slots.default!({ config: useConfig() })
  }
})
