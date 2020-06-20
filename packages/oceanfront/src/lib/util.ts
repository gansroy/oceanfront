import { Ref, toRef, isRef } from 'vue'

export const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isArray = Array.isArray

export const isFunction = (val: unknown): val is (...args: any[]) => any =>
  typeof val === 'function'

export function isPromise<T = any>(val: unknown): val is PromiseLike<T> {
  return isObject(val) && isFunction(val.then)
}

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
      let result
      for (const upd of updates) {
        if (Reflect.has(upd, key)) {
          result = (upd as any)[key]
          if (isRef(result)) result = result.value
          return result
        }
      }
      result = (target as any)[key]
      if (isRef(result)) result = result.value
      return result
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
): {
  [K in keyof T]?: Ref<T[K]>
} {
  const ret: {
    [K in keyof T]?: Ref<T[K]>
  } = {}
  if (names) {
    for (const k of names) {
      ret[k] = toRef(props, k)
    }
  }
  return ret
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

// export function definedProps<T extends object, K extends keyof T>(
//   base: T
// ): { [k2 in K]: T[K] } {
//   return new Proxy(base, {
//     has(target: T, key: string): boolean {
//       return hasOwn(base, key) && target[key] !== undefined
//     },
//     ownKeys(target: T): (string | number | symbol)[] {
//       return Reflect.ownKeys(target).filter(
//         (k) => (target as any)[k] !== undefined
//       )
//     },
//   })
// }

export function removeEmpty(obj: Record<string, any>): Record<string, any> {
  if (obj) {
    for (const k of Object.keys(obj)) {
      const val = obj[k]
      if (val == null) delete obj[k]
    }
  }
  return obj
}
