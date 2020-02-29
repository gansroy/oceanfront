import { ref, Ref } from 'vue'
import { isPromise } from './util'

export interface EventCallback<T = any> {
  (evt: T): PromiseLike<any> | void
}

export interface EventListenerSet<T = any> {
  // use WeakSet internally
  add(handler: EventCallback<T>): void
  remove(handler: EventCallback<T>): void
}

export interface StoreLock {
  readonly reason?: string
}

export interface StoreRef<T = any> {
  // default as defined by schema
  readonly defaultValue?: T
  readonly errors?: ValidationError[]
  readonly locked?: StoreLock
  readonly modified?: boolean
  // current commit, if any
  readonly pendingUpdate?: StoreUpdate<T>
  // stored value, defines whether 'modified' is set
  readonly storedValue?: T
  // get/set store value. setter creates a new update
  value?: T
  // cancel pendingUpdate, if any
  cancelUpdate(): void
  // set value = storedValue, clear storedValue
  revert(params?: StoreUpdateParams): StoreUpdate<T>
  // manually manage the commit
  update(value: T, params?: StoreUpdateParams): StoreUpdate<T>
  // intercept updates before they are committed
  //    readonly beforeUpdate: EventListenerSet<StoreUpdate<T>>
  // after an update is finalized (accepted or rejected)
  // if the update is rejected, refocus field
  // caller can suppress errors. must be called after value has updated
  // editor must decide to do something with the error message?
  //    readonly afterUpdate: EventListenerSet<StoreUpdate<T>>
}

function callHandlers<T>(
  init_handlers: EventCallback<T>[],
  target: any,
  evt: T
): PromiseLike<T> | void {
  if (!init_handlers.length) return
  let handlers = [...init_handlers]
  while (handlers.length) {
    const h = handlers.pop()
    const result = h!.call(target, evt)
    if (isPromise(result) && handlers.length) {
      return result.then(_ => callHandlers(handlers, target, evt) as any)
    }
  }
}

export interface StoreUpdate<T = any> extends PromiseLike<T> {
  readonly newValue?: T
  readonly complete: boolean
  readonly errors?: ValidationError[]
  readonly rejected?: boolean // defined by errors w/level error or undefined
  cancel(): void
  then(
    onfulfilled?: ((value: T) => any) | undefined | null,
    onrejected?: ((reason: any) => any) | undefined | null
  ): PromiseLike<any>
  // onComplete: EventListenerSet<this>
}

export interface StoreUpdateParams {}

export interface ValidationError {
  error?: Error
  level?: string
  message?: string
}

class BasicEventListenerSet<T> implements EventListenerSet<T> {
  public handlers: Set<EventCallback<T>> = new Set()

  constructor(handlers?: EventCallback<T>[]) {
    if (handlers) {
      for (const h of handlers) {
        this.handlers.add(h)
      }
    }
  }

  add(handler: EventCallback<T>) {
    this.handlers.add(handler)
  }

  remove(handler: EventCallback<T>) {
    this.handlers.delete(handler)
  }

  call(target: any, evt: T): PromiseLike<any> | void {
    return callHandlers(this.handlers as any, target, evt)
  }

  clear() {
    this.handlers = new Set()
  }
}

class BasicStoreRef<T> implements StoreRef<T> {
  // readonly beforeUpdate: EventListenerSet<StoreUpdate<T>> // maybe global beforeStore(val), afterStore(val)
  // readonly afterUpdate: EventListenerSet<StoreUpdate<T>>
  private _locked: Ref<StoreLock>
  private _pendingUpdate: Ref<StoreUpdate<T>>
  private _storedValue: Ref<T>
  private _value: Ref<T>

  constructor(value: T, store?: any) {
    console.log('ctor here')
    this._locked = ref()
    this._pendingUpdate = ref()
    this._storedValue = ref(value)
    this._value = ref(value) // get a ref from the store, same ref as everybody else
    // this.beforeUpdate = new BasicEventListenerSet()
    // this.afterUpdate = new BasicEventListenerSet()
  }

  cancelUpdate() {}

  get locked(): StoreLock | undefined {
    console.log(this)
    return this._locked.value
  }

  get modified(): boolean {
    return this._storedValue.value !== this._value.value
  }

  get pendingUpdate(): StoreUpdate<T> | undefined {
    return this._pendingUpdate.value as any
  }

  revert(params?: StoreUpdateParams): StoreUpdate<T> {
    const stored = this._storedValue.value as any
    if (stored !== undefined) {
      return this.update(stored)
    }
    return new BasicStoreUpdate()
  }

  get storedValue(): T | undefined {
    return this._storedValue.value as any
  }

  update(value?: T, params?: StoreUpdateParams): StoreUpdate<T> {
    // FIXME what if there's an existing pending update? depends on params, may reject immediately
    // params may also contain a promise - would send result to store before resolving
    // FIXME call beforeUpdate
    const promise = new Promise<T>((resolve, _reject) => {
      setTimeout(() => {
        resolve(value)
      }, 500)
    })
    const update = new BasicStoreUpdate(value, promise)
    this._pendingUpdate.value = update as any
    update.then(
      (val: T) => {
        if (this._pendingUpdate.value === update)
          delete this._pendingUpdate.value
        this._value.value = val as any
        // FIXME call afterUpdate
        // update storedValue (?)
        // update value
      },
      errs => {
        if (this._pendingUpdate.value === update)
          delete this._pendingUpdate.value
        // FIXME call afterUpdate
      }
    )
    return update
  }

  get value(): T | undefined {
    return this._value.value as any
  }

  set value(val: T | undefined) {
    this.update(val)
  }
}

class BasicStoreUpdate<T> implements StoreUpdate<T> {
  readonly errors?: ValidationError[]
  // onComplete: EventListenerSet<this>
  private _complete: Ref<boolean>
  private _newValue: Ref<T | undefined>
  private _promise: PromiseLike<T>
  private _rejected: Ref<boolean>

  constructor(
    newValue?: T,
    promise?: PromiseLike<T> /* onfulfilled, onrejected */
  ) {
    this._complete = ref(!promise)
    this._rejected = ref(!promise)
    this._newValue = ref(newValue) // new value may or may not be known before promise resolves
    this._promise = promise || (Promise.resolve(newValue) as PromiseLike<T>)
    if (promise) {
      promise.then(
        val => {
          this._newValue.value = val as any
          this._complete.value = true
        },
        errs => {
          // FIXME capture errors
          this._complete.value = true
          this._rejected.value = true
        }
      )
    }
    // this.onComplete = new BasicEventListenerSet()
  }

  cancel() {}

  get complete(): boolean {
    return this._complete.value
  }

  get newValue(): T | undefined {
    return this._newValue.value as any
  }

  get rejected(): boolean {
    // defined by errors w/level error or undefined
    return false
  }

  then(
    onfulfilled?: ((value: T) => any) | null,
    onrejected?: ((reason: any) => any) | null
  ): PromiseLike<any> {
    return this._promise.then(onfulfilled, onrejected)
  }
}

export function storeRef<T>(value: T): StoreRef<T> {
  return new BasicStoreRef(value)
}
