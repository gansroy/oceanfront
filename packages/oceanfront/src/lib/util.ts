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
  update: Record<any, any>
) {
  return new Proxy(update, {
    get(target: object, key: string, receiver: object): any {
      if (hasOwn(target, key)) return target[key]
      return base[key]
    },
    has(target: object, key: string): boolean {
      return hasOwn(target, key) || hasOwn(base, key)
    },
    ownKeys(target: object): (string | number | symbol)[] {
      const keys: Set<string | number | symbol> = new Set(Reflect.ownKeys(base))
      for (const k of Reflect.ownKeys(base)) {
        keys.add(k)
      }
      return [...keys]
    },
    set(target: object, key: string, value: any, receiver: object): boolean {
      Reflect.set(target, key, value)
      return true
    },
    deleteProperty(target: object, key: string): boolean {
      delete (target as any)[key]
      return true
    }
  })
}
