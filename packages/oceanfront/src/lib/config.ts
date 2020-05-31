import {
  inject,
  provide,
  reactive,
  InjectionKey,
  ComputedRef,
  computed,
  Ref
} from 'vue'

export type Config = ConfigState
export type ConfigFunction = (state: ConfigState) => void

let cfgId = 0

let buildingConfig: ConfigState

export class ConfigState {
  _cb: ConfigFunction
  _prev: ConfigState | undefined
  _cache: ComputedRef<Record<any, any>>
  _cacheVal: Record<any, any>
  _id: number

  constructor(cb: ConfigFunction, prev?: ConfigState) {
    this._cb = cb
    this._prev = prev
    this._cacheVal = {}
    this._cache = computed(() => {
      this._cacheVal = {}
      const pbuild = buildingConfig
      buildingConfig = this
      this.apply()
      buildingConfig = pbuild
      return this._cacheVal
    })
    this._id = cfgId++
  }

  apply() {
    // console.log('build', this._id)
    if (this._prev) this._prev.apply()
    this._cb(this)
  }

  getCache(): Record<any, any> {
    if (buildingConfig === this) return this._cacheVal
    return this._cache.value
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
  const prev = useConfig()
  const newcfg = new ConfigState(cb, prev)
  provide(injectKey, newcfg)
}

type ConfigHandlerCtor<T> = { new (config: Config): T }

export class ConfigManager<T> {
  protected _activeManager?: T
  protected _ctor: ConfigHandlerCtor<T>
  protected _injectKey: InjectionKey<ComputedRef<T>>

  constructor(ident: string, ctor: ConfigHandlerCtor<T>) {
    this._ctor = ctor
    this._injectKey = Symbol(ident)
  }

  createManager(config: Config): T {
    return new this._ctor(config)
  }

  getCached(config: ConfigState): T {
    let cache = config.getCache()
    let mgr = cache[this.injectKey as any]
    if (!mgr) {
      // console.log('config create', this.injectKey)
      mgr = this.createManager(config)
      cache[this.injectKey as any] = mgr
    }
    return mgr
  }

  get extendingManager(): T {
    if (!buildingConfig) {
      throw new Error('Cannot extend config manager: use extendConfig')
    }
    return this.getCached(buildingConfig)
  }

  inject(config?: Config): ComputedRef<T> {
    let cfg = config || useConfig()
    if (buildingConfig && buildingConfig !== cfg) {
      throw new Error(
        'Cannot inject config manager while building another config'
      )
    }
    return computed(() => this.getCached(cfg))
  }

  get injectKey() {
    return this._injectKey
  }
}

const readonlyUnwrapHandlers = {
  get(target: Ref, key: string, receiver: object): any {
    let result = Reflect.get(target.value, key)
    // if (typeof result === 'object') {
    //   result = readonly(result)
    // }
    return result
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
