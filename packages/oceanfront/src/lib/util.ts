import { Ref, ToRefs, toRef, unref } from 'vue'
import { hasOwn } from '@vue/shared'

export {
  hasOwn,
  isArray,
  isFunction,
  isPromise,
  isObject,
  looseEqual,
} from '@vue/shared'

export const isDigit = (s: string): boolean => s >= '0' && s <= '9'

export const isPrimitive = (val: unknown): val is Primitive => {
  const tval = typeof val
  return (
    val === null ||
    tval === 'boolean' ||
    tval === 'number' ||
    tval === 'string' ||
    tval === 'bigint' ||
    tval === 'symbol'
  )
}

export type Primitive = boolean | null | number | string | bigint | symbol

type Head<T extends any[]> = T extends [infer X, ...any[]] ? X : never

type Tail<T extends any[]> = ((...x: T) => void) extends (
  x: any,
  ...xs: infer XS
) => void
  ? XS
  : never

type OverrideProps<B, U> = Pick<B, Exclude<keyof B, keyof U>> & U

// NB: no proper support for recursive conditional types yet
export type Override<B, U extends any[]> = {
  0: B
  1: OverrideProps<B, Override<Head<U>, Tail<U>>>
}[U extends [any, ...any[]] ? 1 : 0]

export function extendReactive<T extends object, U extends object>(
  base: T,
  ...updates: U[]
): Override<T, typeof updates> {
  updates.reverse()
  return new Proxy(base, {
    get(target: T, key: string, _receiver: object): any {
      for (const upd of updates) {
        if (Reflect.has(upd, key)) {
          return unref((upd as any)[key])
        }
      }
      return unref((target as any)[key])
    },
    getOwnPropertyDescriptor(target: T, key: string) {
      for (const upd of updates) {
        const desc = Reflect.getOwnPropertyDescriptor(upd, key)
        if (desc) return desc
      }
      return Reflect.getOwnPropertyDescriptor(target, key)
    },
    has(target: T, key: string): boolean {
      for (const upd of updates) {
        if (Reflect.has(upd, key)) return true
      }
      return Reflect.has(target, key)
    },
    ownKeys(target: T): (string | number | symbol)[] {
      const keys: Set<string | number | symbol> = new Set(
        Reflect.ownKeys(target)
      )
      for (const upd of updates) {
        Reflect.ownKeys(upd).forEach((k) => keys.add(k))
      }
      return [...keys]
    },
    set(target: T, key: string, value: any, _receiver: object): boolean {
      for (const upd of updates) {
        Reflect.set(upd, key, value)
        return true
      }
      Reflect.set(target, key, value)
      return true
    },
    deleteProperty(target: T, key: string): boolean {
      for (const upd of updates) {
        Reflect.deleteProperty(upd, key)
        return true
      }
      Reflect.deleteProperty(target, key)
      return true
    },
  })
}

export function extractRefs<T extends object, K extends keyof T>(
  props: T,
  names: K[]
): ToRefs<T[K]> {
  const ret: { [k in K]?: any } = {}
  if (names) {
    for (const k of names) {
      ret[k] = toRef(props, k)
    }
  }
  return (ret as unknown) as ToRefs<T[K]>
}

export function restrictProps<T extends object, K extends keyof T>(
  base: T,
  names: K[],
  ifDefined?: boolean
): { [k2 in K]: T[K] } {
  const props = new Set<any>(names)
  const limitProps = props.size > 0
  return new Proxy(base, {
    get(target: T, key: string, _receiver: object): any {
      if (!limitProps || props.has(key)) {
        return Reflect.get(target, key)
      }
    },
    getOwnPropertyDescriptor(target: T, key: string) {
      if (!limitProps || props.has(key)) {
        return Reflect.getOwnPropertyDescriptor(target, key)
      }
    },
    has(target: T, key: string): boolean {
      let result = props.has(key) && hasOwn(target, key)
      if (ifDefined && (target as any)[key] === undefined) result = false
      return result
    },
    ownKeys(target: T): (string | number | symbol)[] {
      let result = Reflect.ownKeys(target).filter(
        (k) => !limitProps || props.has(k)
      )
      if (ifDefined) {
        result = result.filter((k) => (target as any)[k] !== undefined)
      }
      return result
    },
    set(target: T, key: string, value: any, _receiver: object): boolean {
      if (!limitProps || props.has(key)) Reflect.set(target, key, value)
      return true
    },
    deleteProperty(target: T, key: string): boolean {
      if (!limitProps || props.has(key)) delete (target as any)[key]
      return true
    },
  })
}

export function definedProps<T extends object, K extends keyof T>(
  base: T
): { [k2 in K]: T[K] } {
  return new Proxy(base, {
    getOwnPropertyDescriptor(target: T, key: string) {
      let desc = Reflect.getOwnPropertyDescriptor(target, key)
      if (desc && (target as any)[key] === undefined) desc = undefined
      return desc
    },
    has(target: T, key: string): boolean {
      return hasOwn(target, key) && target[key] !== undefined
    },
    ownKeys(target: T): (string | number | symbol)[] {
      return Reflect.ownKeys(target).filter(
        (k) => (target as any)[k] !== undefined
      )
    },
  })
}

export function removeEmpty(obj: Record<string, any>): Record<string, any> {
  if (obj) {
    for (const k of Object.keys(obj)) {
      const val = obj[k]
      if (val == null) delete obj[k]
    }
  }
  return obj
}

const readonlyUnrefHandlers = {
  get(target: Ref, key: string, _receiver: object): any {
    const result = Reflect.get(target.value, key)
    return result
  },
  has(target: Ref, key: string | number | symbol): boolean {
    return Reflect.has(target.value, key)
  },
  ownKeys(target: Ref): (string | number | symbol)[] {
    return Reflect.ownKeys(target.value)
  },
  set(_target: Ref, _key: string, _value: any, _receiver: object): boolean {
    if (__DEV__) {
      console.warn('Cannot assign to readonly ref')
    }
    return true
  },
  deleteProperty(_target: Ref, _key: string): boolean {
    if (__DEV__) {
      console.warn('Cannot delete property of readonly ref')
    }
    return true
  },
}

export function readonlyUnref<T>(val: Ref<T>): T {
  return (new Proxy(val, readonlyUnrefHandlers) as any) as T
}

const readonlyUnrefsHandlers = {
  get(target: object, key: string, _receiver: object): any {
    return unref(Reflect.get(target, key))
  },
  set(_target: object, _key: string, _value: any, _receiver: object): boolean {
    if (__DEV__) {
      console.warn('Cannot assign to readonly ref')
    }
    return true
  },
  deleteProperty(_target: Ref, _key: string): boolean {
    if (__DEV__) {
      console.warn('Cannot delete property of readonly ref')
    }
    return true
  },
}

export function readonlyUnrefs<T extends object>(
  val: T
): { [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K] } {
  return new Proxy(val, readonlyUnrefsHandlers) as any
}

export interface CompatResizeObserver {
  disconnect(): void
}

type EltSize = { width: number; height: number }

const eltSize = (elt: Element): EltSize => {
  const sz = elt.getBoundingClientRect()
  return { width: sz.width, height: sz.height }
}

export const watchResize = (
  cb: (elts: { target: Element; size: EltSize }[]) => void,
  ...elts: (Element | null)[]
): CompatResizeObserver | undefined => {
  if (!elts.length) return

  const checkElts: { target: Element; size: EltSize }[] = []
  for (const target of elts) {
    if (!target) continue
    checkElts.push({ target, size: eltSize(target) })
  }
  cb(checkElts) // callback on initial state

  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver((entries) => {
      const result = []
      for (const entry of entries) {
        result.push({
          target: entry.target,
          size: {
            width: entry.contentRect.left + entry.contentRect.width,
            height: entry.contentRect.top + entry.contentRect.height,
          },
        })
      }
      cb(result)
    })

    for (const entry of checkElts) {
      resizeObserver.observe(entry.target, { box: 'border-box' })
    }
    return resizeObserver
  } else {
    const evalElts = () => {
      let changed = false
      for (let idx = 0; idx < checkElts.length; ) {
        const { target, size } = checkElts[idx]
        if (!document.body.contains(target)) {
          checkElts.splice(idx, 1)
          changed = true
          continue
        }
        const newSize = eltSize(target)
        checkElts[idx].size = newSize
        if (newSize.width != size.width || newSize.height != size.height) {
          changed = true
        }
        idx++
      }
      return changed
    }
    let timeout = 50 // first timeout is short to handle initial re-layout
    const runEval = () => {
      if (!checkElts.length) return
      if (evalElts()) cb(checkElts)
      setTimeout(runEval, timeout)
      timeout = 1500
    }
    runEval()
    return {
      disconnect() {
        checkElts.splice(0, checkElts.length)
      },
    }
  }
}
