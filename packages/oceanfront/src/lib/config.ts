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

export class ConfigState {
  _cb: ConfigFunction
  _cache: Record<any, any>
  _id: number

  constructor(cb: ConfigFunction) {
    this._cb = cb
    this._cache = {}
    this._id = cfgId++
  }

  apply() {
    if (buildingConfig === this) {
      console.log('skip self', this._id)
      return
    }
    let cfg = buildingConfig
    if (!buildingConfig) buildingConfig = this
    console.log('build', this._id, buildingConfig._id)
    this._cb(this)
    buildingConfig = cfg
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

let buildingConfig: ConfigState | undefined = undefined

export function extendConfig(cb: () => void) {
  const cfg = useConfig()
  const newcfg = new ConfigState(() => {
    cfg.apply()
    cb()
  })
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

  get activeManager(): T | undefined {
    if (!this._activeManager) {
      if (buildingConfig) return this.inject(buildingConfig).value
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
        const mgr = this.createManager(cfg)
        console.trace()
        console.log(this._injectKey)
        cfg.apply() // execute config functions
        return mgr
      })
      /*const am = this._activeManager
        const ret = (this._activeManager = this.createManager(cfg))
        // cfg.apply() // execute config functions
        this._activeManager = am
        console.debug('inject', ret, cfg)
        return ret
      })*/
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
