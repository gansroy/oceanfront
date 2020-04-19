import { Config, ConfigManager, readonlyUnwrap } from './config'

export interface ItemList {
  avatarKey?: string
  disabledKey?: string
  iconKey?: string
  specialKey?: string
  textKey?: string
  valueKey?: string
  loading?: boolean
  filter?: (query: string) => any[]
  items: any[]
  error?: string
}

export function makeItemList(items: any[] | ItemList): ItemList {
  if (Array.isArray(items)) {
    return {
      items
    }
  } else if (typeof items !== 'object' || !Array.isArray(items.items)) {
    return {
      error: 'Error loading items',
      items: []
    }
  }
  return items
}

export interface ItemsState {
  getItemList(name: string): ItemList | undefined
}

class ItemsManager implements ItemsState {
  readonly lists: Record<string, ItemList> = {}
  constructor(_config: Config) {}

  getItemList(items: string | any[] | ItemList): ItemList | undefined {
    // FIXME may also load from language manager
    if (typeof items === 'string') return this.lists[items]
    else return makeItemList(items)
  }
}

const configManager = new ConfigManager('ofitm', ItemsManager)

export function defineItemList(name: string, items: any[] | ItemList) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.lists[name] = makeItemList(items)
}

export function useItems(config?: Config): ItemsState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
