import {
  inject,
  provide,
  reactive,
  readonly,
  InjectionKey,
  ComputedRef,
  computed,
  Ref
} from 'vue'

export type Config = ConfigState
export type ConfigFunction = () => void

export class ConfigState {
  _cb: ConfigFunction
  _cache: Record<any, any>

  constructor(cb: ConfigFunction) {
    this._cb = cb
    this._cache = {}
  }

  apply() {
    this._cb()
  }

  getCache<T>(key: InjectionKey<T>): T | undefined {
    return this._cache[key as any] as T
  }

  setCache(key: any, value: any) {
    this._cache[key] = value
  }
}

const defaultConfigs = reactive<Array<() => void>>([])
const defaultConfig = new ConfigState(() => {
  for (const cb of defaultConfigs) {
    cb()
  }
})

export const injectKey: InjectionKey<Config> = Symbol('ofcfg')

export function extendDefaultConfig(cb: () => void | Array<() => void>) {
  if (!cb) return
  if (Array.isArray(cb)) defaultConfigs.concat(cb)
  else defaultConfigs.push(cb)
}

export function useConfig(): Config {
  return inject(injectKey, defaultConfig)
}

export function extendConfig(cb: () => void) {
  const cfg = useConfig()
  const newfn = new ConfigState(() => {
    cfg.apply()
    cb()
  })
  provide(injectKey, newfn)
}

export class ConfigManager<T> {
  protected _activeManager?: T
  protected _ctor: { new (): T }
  protected _injectKey: InjectionKey<ComputedRef<T>>

  constructor(ident: string, ctor: { new (): T }) {
    this._ctor = ctor
    this._injectKey = Symbol(ident)
  }

  createManager(): T {
    return new this._ctor()
  }

  get activeManager(): T | undefined {
    if (!this._activeManager) {
      if (__DEV__) {
        console.warn('Cannot extend config: not inside provider')
      }
    }
    return this._activeManager
  }

  inject(config?: Config): ComputedRef<T> {
    let cfg = config || useConfig()
    let cache = cfg.getCache(this.injectKey)
    if (!cache) {
      cache = computed(() => {
        const am = this._activeManager
        const ret = (this._activeManager = this.createManager())
        cfg.apply() // execute config functions
        this._activeManager = am
        console.debug('inject', ret, cfg)
        return ret
      })
      cfg.setCache(this.injectKey, cache)
    }
    return cache
  }

  get injectKey() {
    return this._injectKey
  }
}

const readonlyUnwrapHandlers = {
  get(target: Ref, key: string, receiver: object): any {
    return Reflect.get(target.value, key)
  },
  has(target: Ref, key: string | number | symbol): boolean {
    return Reflect.has(target.value, key)
  },
  ownKeys(target: Ref): (string | number | symbol)[] {
    return Reflect.ownKeys(target.value)
  },
  set(target: Ref, key: string, value: any, receiver: object): boolean {
    if (__DEV__) {
      console.warn('Cannot assign to readonly ref')
    }
    return true
  },
  deleteProperty(target: Ref, key: string): boolean {
    if (__DEV__) {
      console.warn('Cannot delete property of readonly ref')
    }
    return true
  }
}

export function readonlyUnwrap<T>(val: Ref<T>) {
  return (new Proxy(val, readonlyUnwrapHandlers) as any) as T
}
