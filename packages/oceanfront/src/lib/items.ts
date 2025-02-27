import { markRaw } from 'vue'
import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export interface ItemList {
  avatarKey?: string
  disabledKey?: string
  iconKey?: string
  specialKey?: string
  textKey?: string
  valueKey?: string
  count?: number
  // details?: (key: any) => VNode
  error?: string // maybe multiple messages, maybe hint as well
  // format?:  formatter for values
  filter?: (query: string) => any[] | ItemList
  items: any[]
  loading?: boolean | string // string for placeholder message
  lookup?: (key: any) => any
}

export function makeItemList(items?: any[] | ItemList): ItemList {
  if (Array.isArray(items)) {
    return {
      items,
    }
  } else if (typeof items !== 'object' || !Array.isArray(items.items)) {
    return {
      error: 'Error loading items',
      items: [],
    }
  }
  return markRaw(items)
}

export interface ItemsState {
  getItemList(items?: string | any[] | ItemList): ItemList | undefined
}

class ItemsManager implements ItemsState {
  readonly lists: Record<string, ItemList> = {}
  // constructor(_config: Config) {}

  getItemList(items?: string | any[] | ItemList): ItemList | undefined {
    // FIXME may also load from language manager
    if (typeof items === 'string') return this.lists[items]
    else return makeItemList(items)
  }
}

const configManager = new ConfigManager('ofitm', ItemsManager)

export function registerItemList(name: string, items: any[] | ItemList): void {
  configManager.extendingManager.lists[name] = makeItemList(items)
}

export function useItems(config?: Config): ItemsState {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
