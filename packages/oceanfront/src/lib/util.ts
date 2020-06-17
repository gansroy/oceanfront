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

export const isDigit = (s: string) => s >= '0' && s <= '9'

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

export function extendReactive(
  base: Record<any, any>,
  update: Record<any, any>,
  restrict?: string[],
  if_defined?: boolean
) {
  let checkRestrict: (k: any) => boolean
  if (restrict) {
    const restrictSet = new Set(restrict)
    checkRestrict = (k: any) => restrictSet.has(k)
  } else {
    checkRestrict = (k: any) => true
  }
  let checkDefined: (target: object, key: any) => boolean
  if (if_defined) {
    checkDefined = (target: object, key: any) =>
      (target as any)[key] !== undefined
  } else {
    checkDefined = hasOwn
  }
  return new Proxy(update, {
    get(target: object, key: string, receiver: object): any {
      if (checkRestrict(key) && hasOwn(target, key)) {
        let result = (target as any)[key]
        if (!if_defined || result !== undefined) {
          if (isRef(result)) return (result as any).value
          return result
        }
      }
      return base[key]
    },
    has(target: object, key: string): boolean {
      return (
        (checkRestrict(key) && checkDefined(target, key)) || hasOwn(base, key)
      )
    },
    ownKeys(target: object): (string | number | symbol)[] {
      const keys: Set<string | number | symbol> = new Set(Reflect.ownKeys(base))
      for (const k of Reflect.ownKeys(target)) {
        if (
          checkRestrict(k) &&
          (!if_defined || (target as any)[k] !== undefined)
        )
          keys.add(k)
      }
      return [...keys]
    },
    set(target: object, key: string, value: any, receiver: object): boolean {
      if (checkRestrict(key)) Reflect.set(target, key, value)
      return true
    },
    deleteProperty(target: object, key: string): boolean {
      if (checkRestrict(key)) delete (target as any)[key]
      return true
    }
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

export function removeEmpty(obj: Record<string, any>): Record<string, any> {
  if (obj) {
    for (const k of Object.keys(obj)) {
      const val = obj[k]
      if (val === null || val === undefined) delete obj[k]
    }
  }
  return obj
}
